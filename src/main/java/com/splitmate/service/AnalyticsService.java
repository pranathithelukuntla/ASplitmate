package com.splitmate.service;

import com.splitmate.dto.AnalyticsResponse;
import com.splitmate.entity.Expense;
import com.splitmate.entity.Group;
import com.splitmate.exception.BadRequestException;
import com.splitmate.exception.ResourceNotFoundException;
import com.splitmate.repository.ExpenseRepository;
import com.splitmate.repository.GroupMemberRepository;
import com.splitmate.repository.GroupRepository;
import com.splitmate.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final ExpenseRepository expenseRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    public AnalyticsService(ExpenseRepository expenseRepository, GroupRepository groupRepository,
                            GroupMemberRepository groupMemberRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }

    public AnalyticsResponse getGroupAnalytics(Long groupId, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
        validateMember(currentUserId, group);

        List<Expense> expenses = expenseRepository.findByGroupOrderByExpenseDateDesc(group);
        BigDecimal total = expenses.stream().map(Expense::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, BigDecimal> categoryWise = new LinkedHashMap<>();
        for (Expense e : expenses) {
            String name = e.getCategory().getName();
            categoryWise.merge(name, e.getTotalAmount(), BigDecimal::add);
        }

        Map<String, BigDecimal> byMonth = new TreeMap<>(Comparator.reverseOrder());
        for (Expense e : expenses) {
            String ym = e.getExpenseDate().getYear() + "-" + String.format("%02d", e.getExpenseDate().getMonthValue());
            byMonth.merge(ym, e.getTotalAmount(), BigDecimal::add);
        }
        List<AnalyticsResponse.MonthlyTrend> monthlyTrends = byMonth.entrySet().stream()
                .limit(12)
                .map(e -> new AnalyticsResponse.MonthlyTrend(e.getKey(), e.getValue()))
                .collect(Collectors.toList());

        return new AnalyticsResponse(total, categoryWise, monthlyTrends);
    }

    public AnalyticsResponse getGroupAnalyticsForPeriod(Long groupId, LocalDate start, LocalDate end, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
        validateMember(currentUserId, group);
        if (start.isAfter(end)) {
            throw new BadRequestException("Start date must be before or equal to end date");
        }

        List<Expense> expenses = expenseRepository.findByGroupAndDateBetween(group, start, end);
        BigDecimal total = expenses.stream().map(Expense::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        Map<String, BigDecimal> categoryWise = new LinkedHashMap<>();
        for (Expense e : expenses) {
            categoryWise.merge(e.getCategory().getName(), e.getTotalAmount(), BigDecimal::add);
        }
        Map<String, BigDecimal> byMonth = new TreeMap<>(Comparator.reverseOrder());
        for (Expense e : expenses) {
            String ym = e.getExpenseDate().getYear() + "-" + String.format("%02d", e.getExpenseDate().getMonthValue());
            byMonth.merge(ym, e.getTotalAmount(), BigDecimal::add);
        }
        List<AnalyticsResponse.MonthlyTrend> monthlyTrends = byMonth.entrySet().stream()
                .map(e -> new AnalyticsResponse.MonthlyTrend(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
        return new AnalyticsResponse(total, categoryWise, monthlyTrends);
    }

    private void validateMember(Long userId, Group group) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (!groupMemberRepository.existsByUserAndGroup(user, group)) {
            throw new BadRequestException("You are not a member of this group");
        }
    }
}
