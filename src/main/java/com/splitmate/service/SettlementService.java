package com.splitmate.service;

import com.splitmate.dto.BalanceResponse;
import com.splitmate.dto.SettlementRequest;
import com.splitmate.dto.SettlementResponse;
import com.splitmate.entity.*;
import com.splitmate.exception.BadRequestException;
import com.splitmate.exception.ResourceNotFoundException;
import com.splitmate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SettlementService {
    /**
     * Returns a full debt matrix and per-person paid/received summary for a group.
     */
    public List<MemberSettlementSummary> getMemberSettlementSummaries(Long groupId, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElse(null);
        if (group == null) {
            System.err.println("[ERROR] Group not found: " + groupId);
            return Collections.emptyList();
        }
        try {
            validateMember(currentUserId, group);
        } catch (Exception e) {
            System.err.println("[ERROR] User " + currentUserId + " is not a member of group " + groupId);
            return Collections.emptyList();
        }

        // Prepare members
        List<GroupMember> members = group.getMembers();
        if (members == null || members.isEmpty()) {
            System.err.println("[ERROR] Group " + groupId + " has no members.");
            return Collections.emptyList();
        }
        Map<Long, String> userNames = new HashMap<>();
        for (GroupMember gm : members) {
            userNames.put(gm.getUser().getId(), gm.getUser().getName());
        }

        // Calculate total paid by each member
        Map<Long, BigDecimal> totalPaid = new HashMap<>();
        for (GroupMember gm : members) {
            totalPaid.put(gm.getUser().getId(), BigDecimal.ZERO);
        }
        for (Expense expense : expenseRepository.findByGroupOrderByExpenseDateDesc(group)) {
            Long paidById = expense.getPaidBy().getId();
            totalPaid.merge(paidById, expense.getTotalAmount(), BigDecimal::add);
        }

        // Calculate total received by each member (settlements)
        Map<Long, BigDecimal> totalReceived = new HashMap<>();
        for (GroupMember gm : members) {
            totalReceived.put(gm.getUser().getId(), BigDecimal.ZERO);
        }
        for (Settlement s : settlementRepository.findByGroupOrderBySettlementDateDesc(group)) {
            Long payerId = s.getPayer().getId();
            Long receiverId = s.getReceiver().getId();
            System.out.println("[DEBUG Settlement] Payer: " + payerId + ", Receiver: " + receiverId + ", Amount: " + s.getAmount());
            totalReceived.merge(receiverId, s.getAmount(), BigDecimal::add);
        }

        // Debt matrix: who owes whom
        Map<Long, Map<Long, BigDecimal>> debtMatrix = new HashMap<>();
        for (GroupMember gm : members) {
            debtMatrix.put(gm.getUser().getId(), new HashMap<>());
        }

        // Calculate net balances
        Map<Long, BigDecimal> netBalance = new HashMap<>();
        for (GroupMember gm : members) {
            netBalance.put(gm.getUser().getId(), BigDecimal.ZERO);
        }
        for (Expense expense : expenseRepository.findByGroupOrderByExpenseDateDesc(group)) {
            Long paidById = expense.getPaidBy().getId();
            netBalance.merge(paidById, expense.getTotalAmount(), BigDecimal::add);
            for (ExpenseSplit split : expense.getSplits()) {
                Long userId = split.getUser().getId();
                netBalance.merge(userId, split.getAmount().negate(), BigDecimal::add);
            }
        }
for (Settlement s : settlementRepository.findByGroupOrderBySettlementDateDesc(group)) {
            Long payerId = s.getPayer().getId();
            Long receiverId = s.getReceiver().getId();
            // Payer is clearing their debt: their balance moves toward 0 (increases)
            // Receiver is being paid back: their credit reduces (decreases)
            netBalance.merge(payerId, s.getAmount(), BigDecimal::add);
            netBalance.merge(receiverId, s.getAmount().negate(), BigDecimal::add);
        }

        // Separate creditors and debtors
        List<Long> creditors = netBalance.entrySet().stream()
                .filter(e -> e.getValue().compareTo(BigDecimal.ZERO) > 0)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        List<Long> debtors = netBalance.entrySet().stream()
                .filter(e -> e.getValue().compareTo(BigDecimal.ZERO) < 0)
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());

        Map<Long, BigDecimal> creditorBalances = new HashMap<>();
        Map<Long, BigDecimal> debtorBalances = new HashMap<>();
        for (Long id : creditors) {
            creditorBalances.put(id, netBalance.get(id));
        }
        for (Long id : debtors) {
            debtorBalances.put(id, netBalance.get(id).abs());
        }

        // Greedy settlement: each debtor pays creditors
        for (Long debtorId : debtors) {
            BigDecimal debtLeft = debtorBalances.get(debtorId);
            for (Long creditorId : creditors) {
                BigDecimal creditLeft = creditorBalances.get(creditorId);
                if (debtLeft.compareTo(BigDecimal.ZERO) == 0) break;
                if (creditLeft.compareTo(BigDecimal.ZERO) == 0) continue;
                BigDecimal amount = debtLeft.min(creditLeft);
                if (amount.compareTo(BigDecimal.ZERO) > 0) {
                    debtMatrix.get(debtorId).put(creditorId, amount);
                    debtLeft = debtLeft.subtract(amount);
                    creditorBalances.put(creditorId, creditLeft.subtract(amount));
                }
            }
        }

        // Build summary for each member
        List<MemberSettlementSummary> summaries = new ArrayList<>();
        for (GroupMember gm : members) {
            Long userId = gm.getUser().getId();
            Map<Long, BigDecimal> owes = debtMatrix.get(userId);
            List<OwesInfo> owesList = new ArrayList<>();
            for (Map.Entry<Long, BigDecimal> entry : owes.entrySet()) {
                if (entry.getValue().compareTo(BigDecimal.ZERO) > 0) {
                    owesList.add(new OwesInfo(userNames.get(entry.getKey()), entry.getValue()));
                }
            }
            summaries.add(new MemberSettlementSummary(
                    userNames.get(userId),
                    totalPaid.get(userId),
                    totalReceived.get(userId),
                    owesList
            ));
        }
        return summaries;
    }

    public static class MemberSettlementSummary {
        public String name;
        public BigDecimal totalPaid;
        public BigDecimal totalReceived;
        public List<OwesInfo> owes;
        public MemberSettlementSummary(String name, BigDecimal totalPaid, BigDecimal totalReceived, List<OwesInfo> owes) {
            this.name = name;
            this.totalPaid = totalPaid;
            this.totalReceived = totalReceived;
            this.owes = owes;
        }
    }

    public static class OwesInfo {
        public String toName;
        public BigDecimal amount;
        public OwesInfo(String toName, BigDecimal amount) {
            this.toName = toName;
            this.amount = amount;
        }
    }

    private final SettlementRepository settlementRepository;
    private final ExpenseRepository expenseRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public SettlementService(SettlementRepository settlementRepository, ExpenseRepository expenseRepository,
            GroupRepository groupRepository, GroupMemberRepository groupMemberRepository,
            UserRepository userRepository, ActivityLogService activityLogService) {
        this.settlementRepository = settlementRepository;
        this.expenseRepository = expenseRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    /**
     * Suggest optimal settlements: who should pay whom and how much to settle all balances.
     * Returns a list of {fromUser, toUser, amount}.
     */
    public List<SettlementSuggestion> getSettlementSuggestions(Long groupId, Long currentUserId) {
        List<BalanceResponse> balances = getBalances(groupId, currentUserId);
        // Separate creditors and debtors
        List<BalanceResponse> creditors = balances.stream().filter(b -> b.getBalance().compareTo(BigDecimal.ZERO) > 0).collect(Collectors.toList());
        List<BalanceResponse> debtors = balances.stream().filter(b -> b.getBalance().compareTo(BigDecimal.ZERO) < 0).collect(Collectors.toList());
        List<SettlementSuggestion> suggestions = new ArrayList<>();
        int i = 0, j = 0;
        while (i < debtors.size() && j < creditors.size()) {
            BalanceResponse debtor = debtors.get(i);
            BalanceResponse creditor = creditors.get(j);
            BigDecimal debt = debtor.getBalance().abs();
            BigDecimal credit = creditor.getBalance();
            BigDecimal amount = debt.min(credit);
            if (amount.compareTo(BigDecimal.ZERO) > 0) {
                suggestions.add(new SettlementSuggestion(
                        debtor.getUserId(), debtor.getUserName(),
                        creditor.getUserId(), creditor.getUserName(),
                        amount
                ));
                debtor.setBalance(debtor.getBalance().add(amount));
                creditor.setBalance(creditor.getBalance().subtract(amount));
            }
            if (debtor.getBalance().compareTo(BigDecimal.ZERO) == 0) i++;
            if (creditor.getBalance().compareTo(BigDecimal.ZERO) == 0) j++;
        }
        return suggestions;
    }

    public static class SettlementSuggestion {
        private Long fromUserId;
        private String fromUserName;
        private Long toUserId;
        private String toUserName;
        private BigDecimal amount;

        public SettlementSuggestion(Long fromUserId, String fromUserName, Long toUserId, String toUserName, BigDecimal amount) {
            this.fromUserId = fromUserId;
            this.fromUserName = fromUserName;
            this.toUserId = toUserId;
            this.toUserName = toUserName;
            this.amount = amount;
        }

        public Long getFromUserId() { return fromUserId; }
        public String getFromUserName() { return fromUserName; }
        public Long getToUserId() { return toUserId; }
        public String getToUserName() { return toUserName; }
        public BigDecimal getAmount() { return amount; }
    }
    // ...existing code...

    @Transactional
    public SettlementResponse record(SettlementRequest request, Long currentUserId) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new ResourceNotFoundException("Group", request.getGroupId()));
        validateMember(currentUserId, group);
        User payer = userRepository.findById(request.getPayerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getPayerId()));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getReceiverId()));
        if (!groupMemberRepository.existsByUserAndGroup(payer, group) || !groupMemberRepository.existsByUserAndGroup(receiver, group)) {
            throw new BadRequestException("Payer and receiver must be group members");
        }
        if (payer.getId().equals(receiver.getId())) {
            throw new BadRequestException("Payer and receiver cannot be the same");
        }

        Settlement settlement = new Settlement(payer, receiver, request.getAmount(), group, request.getSettlementDate());
        settlement = settlementRepository.save(settlement);
        activityLogService.log(group, payer.getName() + " settled " + request.getAmount() + " to " + receiver.getName());
        return toResponse(settlement);
    }

    public List<SettlementResponse> getByGroup(Long groupId, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
        validateMember(currentUserId, group);
        return settlementRepository.findByGroupOrderBySettlementDateDesc(group).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BalanceResponse> getBalances(Long groupId, Long currentUserId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group", groupId));
        validateMember(currentUserId, group);

        Map<Long, BigDecimal> netBalance = new HashMap<>();
        for (GroupMember gm : group.getMembers()) {
            netBalance.put(gm.getUser().getId(), BigDecimal.ZERO);
        }

        for (Expense expense : expenseRepository.findByGroupOrderByExpenseDateDesc(group)) {
            Long paidById = expense.getPaidBy().getId();
            netBalance.merge(paidById, expense.getTotalAmount(), BigDecimal::add);
            for (ExpenseSplit split : expense.getSplits()) {
                Long userId = split.getUser().getId();
                netBalance.merge(userId, split.getAmount().negate(), BigDecimal::add);
            }
        }

for (Settlement s : settlementRepository.findByGroupOrderBySettlementDateDesc(group)) {
            Long payerId = s.getPayer().getId();
            Long receiverId = s.getReceiver().getId();
            // Payer settles their debt → balance increases (toward 0)
            // Receiver gets paid back → their credit decreases
            netBalance.merge(payerId, s.getAmount(), BigDecimal::add);
            netBalance.merge(receiverId, s.getAmount().negate(), BigDecimal::add);
        }

        return netBalance.entrySet().stream()
                .map(e -> {
                    User u = userRepository.findById(e.getKey()).orElseThrow();
                    return new BalanceResponse(e.getKey(), u.getName(), e.getValue());
                })
                .collect(Collectors.toList());
    }

    private void validateMember(Long userId, Group group) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User", userId));
        if (!groupMemberRepository.existsByUserAndGroup(user, group)) {
            throw new BadRequestException("You are not a member of this group");
        }
    }

    private SettlementResponse toResponse(Settlement s) {
        SettlementResponse response = new SettlementResponse();
        response.setId(s.getId());
        response.setPayerId(s.getPayer().getId());
        response.setPayerName(s.getPayer().getName());
        response.setReceiverId(s.getReceiver().getId());
        response.setReceiverName(s.getReceiver().getName());
        response.setAmount(s.getAmount());
        response.setGroupId(s.getGroup().getId());
        response.setSettlementDate(s.getSettlementDate());
        return response;
    }
}
