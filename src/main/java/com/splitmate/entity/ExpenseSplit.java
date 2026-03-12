package com.splitmate.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
@Table(name = "expense_splits", uniqueConstraints = @UniqueConstraint(columnNames = {"expense_id", "user_id"}))
public class ExpenseSplit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @DecimalMin(value = "0.00", inclusive = true)
    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(name = "share_amount", precision = 19, scale = 2)
    private BigDecimal shareAmount;

    public ExpenseSplit() {
    }

    public ExpenseSplit(Expense expense, User user, BigDecimal amount) {
        this.expense = expense;
        this.user = user;
        this.amount = amount;
        this.shareAmount = amount; // Sync the deprecated column
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Expense getExpense() {
        return expense;
    }

    public void setExpense(Expense expense) {
        this.expense = expense;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
