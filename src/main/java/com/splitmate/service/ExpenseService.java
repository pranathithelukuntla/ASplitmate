package com.splitmate.service;

import com.splitmate.dto.ExpenseRequest;
import com.splitmate.dto.ExpenseResponse;
import com.splitmate.entity.*;
import com.splitmate.exception.BadRequestException;
import com.splitmate.exception.ResourceNotFoundException;
import com.splitmate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ActivityLogService activityLogService;

    public ExpenseService(ExpenseRepository expenseRepository, ExpenseSplitRepository expenseSplitRepository,
                          GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
                          UserRepository userRepository, CategoryRepository categoryRepository,
                          ActivityLogService activityLogService) {
        this.expenseRepository = expenseRepository;
        this.expenseSplitRepository = expenseSplitRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public ExpenseResponse create(ExpenseRequest request, Long currentUserId) {
        User paidBy = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", currentUserId));
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group", request.getGroupId()));
        validateMember(currentUserId, group);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        Expense expense = new Expense(
                request.getTitle(),
                request.getTotalAmount(),
                category,
                paidBy,
                group,
                request.getExpenseDate()
        );
        expense = expenseRepository.save(expense);

        if (request.getSplits() != null && !request.getSplits().isEmpty()) {
            BigDecimal sum = request.getSplits().stream()
                    .map(ExpenseRequest.SplitItem::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            if (sum.compareTo(request.getTotalAmount()) != 0) {
                throw new BadRequestException("Sum of splits must equal total amount");
            }
            for (ExpenseRequest.SplitItem item : request.getSplits()) {
                User user = userRepository.findById(item.getUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("User", item.getUserId()));
                if (!groupMemberRepository.existsByUserAndGroup(user, group)) {
                    throw new BadRequestException("User " + user.getId() + " is not a group member");
                }
                ExpenseSplit split = new ExpenseSplit(expense, user, item.getAmount());
                expenseSplitRepository.save(split);
            }
        }

        activityLogService.log(group, paidBy.getName() + " added expense: " + request.getTitle() + " - " + request.getTotalAmount());
        return toResponse(expenseRepository.findById(expense.getId()).orElseThrow());
    }

    public ExpenseResponse getById(Long expenseId, Long currentUserId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", expenseId));
        validateMember(currentUserId, expense.getGroup());
        return toResponse(expense);
    }

    public List<ExpenseResponse> getByGroup(Long groupId, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
        validateMember(currentUserId, group);
        return expenseRepository.findByGroupOrderByExpenseDateDesc(group).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void validateMember(Long userId, Group group) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (!groupMemberRepository.existsByUserAndGroup(user, group)) {
            throw new BadRequestException("You are not a member of this group");
        }
    }

    private ExpenseResponse toResponse(Expense expense) {
        ExpenseResponse response = new ExpenseResponse();
        response.setId(expense.getId());
        response.setTitle(expense.getTitle());
        response.setTotalAmount(expense.getTotalAmount());
        response.setCategoryId(expense.getCategory().getId());
        response.setCategoryName(expense.getCategory().getName());
        response.setPaidById(expense.getPaidBy().getId());
        response.setPaidByName(expense.getPaidBy().getName());
        response.setGroupId(expense.getGroup().getId());
        response.setExpenseDate(expense.getExpenseDate());
        response.setSplits(expense.getSplits().stream()
                .map(s -> new ExpenseResponse.SplitSummary(
                        s.getUser().getId(),
                        s.getUser().getName(),
                        s.getAmount()))
                .collect(Collectors.toList()));
        return response;
    }
}
