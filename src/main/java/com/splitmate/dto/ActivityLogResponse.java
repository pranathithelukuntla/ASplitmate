package com.splitmate.dto;

import java.time.Instant;

public class ActivityLogResponse {

    private Long id;
    private Long groupId;
    private String message;
    private Instant timestamp;

    public ActivityLogResponse() {
    }

    public ActivityLogResponse(Long id, Long groupId, String message, Instant timestamp) {
        this.id = id;
        this.groupId = groupId;
        this.message = message;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
