package com.splitmate.controller;

import com.splitmate.dto.AnalyticsResponse;
import com.splitmate.security.UserPrincipal;
import com.splitmate.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<AnalyticsResponse> getGroupAnalytics(@PathVariable Long groupId,
                                                               @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getGroupAnalytics(groupId, principal.getId()));
    }

    @GetMapping("/group/{groupId}/period")
    public ResponseEntity<AnalyticsResponse> getGroupAnalyticsForPeriod(
            @PathVariable Long groupId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(analyticsService.getGroupAnalyticsForPeriod(groupId, start, end, principal.getId()));
    }
}
