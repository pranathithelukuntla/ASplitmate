package com.splitmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class GroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(max = 150)
    private String name;

    public GroupRequest() {
    }

    public GroupRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
