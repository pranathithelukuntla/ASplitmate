package com.splitmate.repository;

import com.splitmate.entity.Group;
import com.splitmate.entity.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, Long> {

    List<Settlement> findByGroupOrderBySettlementDateDesc(Group group);
}
