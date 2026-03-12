package com.splitmate.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ExpenseResponse {

    private Long id;
    private String title;
    private BigDecimal totalAmount;
    private Long categoryId;
    private String categoryName;
    private Long paidById;
    private String paidByName;
    private Long groupId;
    private LocalDate expenseDate;
    private List<SplitSummary> splits;

    public ExpenseResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getPaidById() {
        return paidById;
    }

    public void setPaidById(Long paidById) {
        this.paidById = paidById;
    }

    public String getPaidByName() {
        return paidByName;
    }

    public void setPaidByName(String paidByName) {
        this.paidByName = paidByName;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public List<SplitSummary> getSplits() {
        return splits;
    }

    public void setSplits(List<SplitSummary> splits) {
        this.splits = splits;
    }

    public static class SplitSummary {
        private Long userId;
        private String userName;
        private BigDecimal amount;

        public SplitSummary() {
        }

        public SplitSummary(Long userId, String userName, BigDecimal amount) {
            this.userId = userId;
            this.userName = userName;
            this.amount = amount;
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

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}
