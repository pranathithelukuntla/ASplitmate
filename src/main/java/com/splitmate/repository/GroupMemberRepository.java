package com.splitmate.repository;

import com.splitmate.entity.Group;
import com.splitmate.entity.GroupMember;
import com.splitmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    List<GroupMember> findByGroup(Group group);

    List<GroupMember> findByUser(User user);

    Optional<GroupMember> findByUserAndGroup(User user, Group group);

    boolean existsByUserAndGroup(User user, Group group);

    void deleteByUserAndGroup(User user, Group group);
}
