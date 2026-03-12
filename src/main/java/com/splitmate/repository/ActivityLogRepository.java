package com.splitmate.repository;

import com.splitmate.entity.ActivityLog;
import com.splitmate.entity.Group;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByGroupOrderByTimestampDesc(Group group, Pageable pageable);
}
