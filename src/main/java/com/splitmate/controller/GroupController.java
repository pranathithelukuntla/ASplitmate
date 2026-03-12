package com.splitmate.controller;

import com.splitmate.dto.AddMemberRequest;
import com.splitmate.dto.GroupRequest;
import com.splitmate.dto.GroupResponse;
import com.splitmate.security.UserPrincipal;
import com.splitmate.service.GroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<GroupResponse> create(@Valid @RequestBody GroupRequest request,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(groupService.create(request, principal.getId()));
    }

    @GetMapping
    public ResponseEntity<List<GroupResponse>> getMyGroups(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.getMyGroups(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupResponse> getById(@PathVariable Long id,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.getById(id, principal.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GroupResponse> update(@PathVariable Long id,
                                                 @Valid @RequestBody GroupRequest request,
                                                 @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.update(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserPrincipal principal) {
        groupService.delete(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<GroupResponse> addMember(@PathVariable Long id,
                                                   @Valid @RequestBody AddMemberRequest request,
                                                   @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.addMember(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<GroupResponse> removeMember(@PathVariable Long id, @PathVariable Long userId,
                                                       @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(groupService.removeMember(id, userId, principal.getId()));
    }
}
