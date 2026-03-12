package com.splitmate.dto;

import java.time.Instant;
import java.util.List;

public class GroupResponse {

    private Long id;
    private String name;
    private Long createdById;
    private String createdByName;
    private Instant createdAt;
    private List<MemberSummary> members;

    public GroupResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<MemberSummary> getMembers() {
        return members;
    }

    public void setMembers(List<MemberSummary> members) {
        this.members = members;
    }

    public static class MemberSummary {
        private Long userId;
        private String userName;
        private String userEmail;

        public MemberSummary() {
        }

        public MemberSummary(Long userId, String userName, String userEmail) {
            this.userId = userId;
            this.userName = userName;
            this.userEmail = userEmail;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getUserEmail() {
            return userEmail;
        }

        public void setUserEmail(String userEmail) {
            this.userEmail = userEmail;
        }
    }
}
