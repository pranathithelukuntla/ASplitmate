package com.splitmate.controller;

import com.splitmate.dto.ExpenseRequest;
import com.splitmate.dto.ExpenseResponse;
import com.splitmate.security.UserPrincipal;
import com.splitmate.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> create(@Valid @RequestBody ExpenseRequest request,
                                                  @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.create(request, principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getById(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(expenseService.getById(id, principal.getId()));
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<ExpenseResponse>> getByGroup(@PathVariable Long groupId,
                                                            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(expenseService.getByGroup(groupId, principal.getId()));
    }
}
