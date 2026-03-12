package com.splitmate.controller;

import com.splitmate.dto.BalanceResponse;
import com.splitmate.dto.SettlementRequest;
import com.splitmate.dto.SettlementResponse;
import com.splitmate.security.UserPrincipal;
import com.splitmate.service.SettlementService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/settlements")
public class SettlementController {

    private final SettlementService settlementService;

    public SettlementController(SettlementService settlementService) {
        this.settlementService = settlementService;
    }

    @PostMapping
    public ResponseEntity<SettlementResponse> record(@Valid @RequestBody SettlementRequest request,
                                                     @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(settlementService.record(request, principal.getId()));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<SettlementResponse>> getByGroup(@PathVariable Long groupId,
                                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(settlementService.getByGroup(groupId, principal.getId()));
    }

    @GetMapping("/group/{groupId}/balances")
    public ResponseEntity<List<BalanceResponse>> getBalances(@PathVariable Long groupId,
                                                              @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(settlementService.getBalances(groupId, principal.getId()));
    }
    @GetMapping("/group/{groupId}/suggestions")
    public ResponseEntity<List<SettlementService.SettlementSuggestion>> getSettlementSuggestions(@PathVariable Long groupId,
                                                                                                 @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(settlementService.getSettlementSuggestions(groupId, principal.getId()));
    }
    @GetMapping("/group/{groupId}/member-summary")
    public ResponseEntity<List<SettlementService.MemberSettlementSummary>> getMemberSettlementSummary(
            @PathVariable Long groupId,
            @AuthenticationPrincipal UserPrincipal principal) {
        try {
            return ResponseEntity.ok(settlementService.getMemberSettlementSummaries(groupId, principal.getId()));
        } catch (com.splitmate.exception.ResourceNotFoundException e) {
            System.err.println("[ERROR] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        } catch (com.splitmate.exception.BadRequestException e) {
            System.err.println("[ERROR] " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Collections.emptyList());
        } catch (Exception e) {
            System.err.println("[ERROR] Exception in member-summary endpoint: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
}
