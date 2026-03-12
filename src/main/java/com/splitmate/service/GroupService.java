package com.splitmate.service;

import com.splitmate.dto.AddMemberRequest;
import com.splitmate.dto.GroupRequest;
import com.splitmate.dto.GroupResponse;
import com.splitmate.entity.Group;
import com.splitmate.entity.GroupMember;
import com.splitmate.entity.User;
import com.splitmate.exception.BadRequestException;
import com.splitmate.exception.ResourceNotFoundException;
import com.splitmate.repository.GroupMemberRepository;
import com.splitmate.repository.GroupRepository;
import com.splitmate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public GroupService(GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
                        UserRepository userRepository, ActivityLogService activityLogService) {
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public GroupResponse create(GroupRequest request, Long currentUserId) {
        try {
            User creator = userRepository.findById(currentUserId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", currentUserId));
            Group group = new Group(request.getName(), creator);
            group = groupRepository.save(group);

            // Always add creator as first member
            GroupMember creatorMember = new GroupMember(creator, group);
            groupMemberRepository.save(creatorMember);

            // Debug logging
            System.out.println("[DEBUG] Created group: " + group.getId() + ", member: " + creator.getId());

            activityLogService.log(group, "Group created by " + creator.getName());

            // Reload group to ensure all relationships are loaded
            Long savedGroupId = group.getId();
            group = groupRepository.findById(savedGroupId)
                    .orElseThrow(() -> new ResourceNotFoundException("Group", savedGroupId));
            return toResponse(group);
        } catch (ResourceNotFoundException | BadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create group: " + e.getMessage(), e);
        }
    }

    public GroupResponse getById(Long groupId, Long currentUserId) {
        Group group = findGroupAndValidateMember(groupId, currentUserId);
        return toResponse(group);
    }

    public List<GroupResponse> getMyGroups(Long currentUserId) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", currentUserId));
        List<Group> groups = groupRepository.findGroupsByMember(user);
        return groups.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public GroupResponse update(Long groupId, GroupRequest request, Long currentUserId) {
        Group group = findGroupAndValidateMember(groupId, currentUserId);
        group.setName(request.getName());
        group = groupRepository.save(group);
        return toResponse(group);
    }

    @Transactional
    public void delete(Long groupId, Long currentUserId) {
        Group group = findGroupAndValidateMember(groupId, currentUserId);
        if (!group.getCreatedBy().getId().equals(currentUserId)) {
            throw new BadRequestException("Only group creator can delete the group");
        }
        groupRepository.delete(group);
    }

    @Transactional
    public GroupResponse addMember(Long groupId, AddMemberRequest request, Long currentUserId) {
        Group group = findGroupAndValidateMember(groupId, currentUserId);
        User newMember = null;
        // Try finding by email first if provided
        if (request.getUserEmail() != null && !request.getUserEmail().trim().isEmpty()) {
            String userEmail = request.getUserEmail().trim().toLowerCase();
            newMember = userRepository.findByEmail(userEmail).orElse(null);
        }
        // If not found by email, try finding by name
        if (newMember == null && request.getUserName() != null && !request.getUserName().trim().isEmpty()) {
            String userName = request.getUserName().trim();
            newMember = userRepository.findByName(userName)
                    .orElseThrow(() -> new ResourceNotFoundException("User with name: " + userName));
        }
        // If both are empty or not found, throw error
        if (newMember == null) {
            throw new BadRequestException("Either email or name must be provided and user must exist");
        }
        if (groupMemberRepository.existsByUserAndGroup(newMember, group)) {
            throw new BadRequestException("User is already a member");
        }
        GroupMember member = new GroupMember(newMember, group);
        groupMemberRepository.save(member);
        activityLogService.log(group, newMember.getName() + " was added to the group");
        return toResponse(groupRepository.findById(groupId).orElseThrow());
    }

    @Transactional
    public GroupResponse removeMember(Long groupId, Long userId, Long currentUserId) {
        Group group = findGroupAndValidateMember(groupId, currentUserId);
        User memberToRemove = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (!groupMemberRepository.existsByUserAndGroup(memberToRemove, group)) {
            throw new BadRequestException("User is not a member of this group");
        }
        if (group.getCreatedBy().getId().equals(memberToRemove.getId())) {
            throw new BadRequestException("Cannot remove group creator");
        }
        groupMemberRepository.deleteByUserAndGroup(memberToRemove, group);
        activityLogService.log(group, memberToRemove.getName() + " was removed from the group");
        return toResponse(groupRepository.findById(groupId).orElseThrow());
    }

    private Group findGroupAndValidateMember(Long groupId, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", currentUserId));
        if (!groupMemberRepository.existsByUserAndGroup(currentUser, group)) {
            throw new BadRequestException("You are not a member of this group");
        }
        return group;
    }

    public Group getGroupEntity(Long groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
    }

    private GroupResponse toResponse(Group group) {
        GroupResponse response = new GroupResponse();
        response.setId(group.getId());
        response.setName(group.getName());
        response.setCreatedById(group.getCreatedBy().getId());
        response.setCreatedByName(group.getCreatedBy().getName());
        response.setCreatedAt(group.getCreatedAt());
        response.setMembers(groupMemberRepository.findByGroup(group).stream()
                .map(gm -> new GroupResponse.MemberSummary(
                        gm.getUser().getId(),
                        gm.getUser().getName(),
                        gm.getUser().getEmail()))
                .collect(Collectors.toList()));
        return response;
    }
    // ...existing code...
}
