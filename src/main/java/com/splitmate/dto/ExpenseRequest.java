package com.splitmate.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ExpenseRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    private BigDecimal totalAmount;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Group ID is required")
    private Long groupId;

    private LocalDate expenseDate = LocalDate.now();

    @Valid
    private List<SplitItem> splits;

    public ExpenseRequest() {
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
        this.expenseDate = expenseDate != null ? expenseDate : LocalDate.now();
    }

    public List<SplitItem> getSplits() {
        return splits;
    }

    public void setSplits(List<SplitItem> splits) {
        this.splits = splits;
    }

    public static class SplitItem {
        @NotNull(message = "User ID is required")
        private Long userId;

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.00", message = "Amount cannot be negative")
        private BigDecimal amount;

        public SplitItem() {
        }

        public SplitItem(Long userId, BigDecimal amount) {
            this.userId = userId;
            this.amount = amount;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public BigDecimal getAmount() {
            return amount;
        }

        public void setAmount(BigDecimal amount) {
            this.amount = amount;
        }
    }
}
