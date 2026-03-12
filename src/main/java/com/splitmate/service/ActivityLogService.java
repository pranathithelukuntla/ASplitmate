package com.splitmate.service;

import com.splitmate.entity.ActivityLog;
import com.splitmate.entity.Group;
import com.splitmate.repository.ActivityLogRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void log(Group group, String message) {
        ActivityLog log = new ActivityLog(group, message);
        activityLogRepository.save(log);
    }

    public List<com.splitmate.dto.ActivityLogResponse> getByGroup(Long groupId, int limit) {
        Group group = new Group();
        group.setId(groupId);
        return activityLogRepository.findByGroupOrderByTimestampDesc(group, PageRequest.of(0, limit))
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private com.splitmate.dto.ActivityLogResponse toResponse(ActivityLog log) {
        return new com.splitmate.dto.ActivityLogResponse(
                log.getId(),
                log.getGroup().getId(),
                log.getMessage(),
                log.getTimestamp()
        );
    }
}
