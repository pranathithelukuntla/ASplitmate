package com.splitmate.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "`users`", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank
    @Email
    @Size(max = 255)
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank
    @Size(min = 6)
    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMember> groupMemberships = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private List<Group> createdGroups = new ArrayList<>();

    @OneToMany(mappedBy = "paidBy", cascade = CascadeType.ALL)
    private List<Expense> expensesPaid = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExpenseSplit> expenseSplits = new ArrayList<>();

    @OneToMany(mappedBy = "payer", cascade = CascadeType.ALL)
    private List<Settlement> settlementsAsPayer = new ArrayList<>();

    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL)
    private List<Settlement> settlementsAsReceiver = new ArrayList<>();

    public enum Role {
        USER, ADMIN
    }

    public User() {
    }

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role != null ? role : Role.USER;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public List<GroupMember> getGroupMemberships() {
        return groupMemberships;
    }

    public void setGroupMemberships(List<GroupMember> groupMemberships) {
        this.groupMemberships = groupMemberships;
    }

    public List<Group> getCreatedGroups() {
        return createdGroups;
    }

    public void setCreatedGroups(List<Group> createdGroups) {
        this.createdGroups = createdGroups;
    }

    public List<Expense> getExpensesPaid() {
        return expensesPaid;
    }

    public void setExpensesPaid(List<Expense> expensesPaid) {
        this.expensesPaid = expensesPaid;
    }

    public List<ExpenseSplit> getExpenseSplits() {
        return expenseSplits;
    }

    public void setExpenseSplits(List<ExpenseSplit> expenseSplits) {
        this.expenseSplits = expenseSplits;
    }

    public List<Settlement> getSettlementsAsPayer() {
        return settlementsAsPayer;
    }

    public void setSettlementsAsPayer(List<Settlement> settlementsAsPayer) {
        this.settlementsAsPayer = settlementsAsPayer;
    }

    public List<Settlement> getSettlementsAsReceiver() {
        return settlementsAsReceiver;
    }

    public void setSettlementsAsReceiver(List<Settlement> settlementsAsReceiver) {
        this.settlementsAsReceiver = settlementsAsReceiver;
    }
}
