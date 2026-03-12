package com.splitmate.dto;

public class AddMemberRequest {


    private String userEmail;
    private String userName;


    public AddMemberRequest() {
    }

    public AddMemberRequest(String userEmail, String userName) {
        this.userEmail = userEmail;
        this.userName = userName;
    }


    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
