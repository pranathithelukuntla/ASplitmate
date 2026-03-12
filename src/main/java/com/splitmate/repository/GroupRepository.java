package com.splitmate.repository;

import com.splitmate.entity.Group;
import com.splitmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {

    List<Group> findByCreatedBy(User createdBy);

    @Query("SELECT g FROM Group g JOIN GroupMember gm ON gm.group = g WHERE gm.user = :user")
    List<Group> findGroupsByMember(@Param("user") User user);
}
