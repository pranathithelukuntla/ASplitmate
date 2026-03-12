package com.splitmate.repository;

import com.splitmate.entity.Expense;
import com.splitmate.entity.ExpenseSplit;
import com.splitmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {

    List<ExpenseSplit> findByExpense(Expense expense);

    List<ExpenseSplit> findByUser(User user);
}
