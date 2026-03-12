package com.splitmate.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private BigDecimal totalExpense;
    private Map<String, BigDecimal> categoryWise;
    private List<MonthlyTrend> monthlyTrends;

    public AnalyticsResponse() {
    }

    public AnalyticsResponse(BigDecimal totalExpense, Map<String, BigDecimal> categoryWise, List<MonthlyTrend> monthlyTrends) {
        this.totalExpense = totalExpense;
        this.categoryWise = categoryWise;
        this.monthlyTrends = monthlyTrends;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public Map<String, BigDecimal> getCategoryWise() {
        return categoryWise;
    }

    public void setCategoryWise(Map<String, BigDecimal> categoryWise) {
        this.categoryWise = categoryWise;
    }

    public List<MonthlyTrend> getMonthlyTrends() {
        return monthlyTrends;
    }

    public void setMonthlyTrends(List<MonthlyTrend> monthlyTrends) {
        this.monthlyTrends = monthlyTrends;
    }

    public static class MonthlyTrend {
        private String yearMonth;
        private BigDecimal total;

        public MonthlyTrend() {
        }

        public MonthlyTrend(String yearMonth, BigDecimal total) {
            this.yearMonth = yearMonth;
            this.total = total;
        }

        public String getYearMonth() {
            return yearMonth;
        }

        public void setYearMonth(String yearMonth) {
            this.yearMonth = yearMonth;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public void setTotal(BigDecimal total) {
            this.total = total;
        }
    }
}
