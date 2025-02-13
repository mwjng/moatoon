package com._2.a401.moa.party.repository;

import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.domain.QParty;
import com._2.a401.moa.party.domain.QPartyMember;
import com._2.a401.moa.schedule.domain.QSchedule;
import com._2.a401.moa.party.dto.request.PartySearchRequest;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class PartyRepositoryCustom implements PartyRepositoryCustomImpl {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Tuple> searchParties(PartySearchRequest request) {
        QParty party = QParty.party;
        QSchedule schedule = QSchedule.schedule;
        QPartyMember partyMember = QPartyMember.partyMember;

        BooleanBuilder builder = new BooleanBuilder();

        LocalDateTime nowPlusOneHour = LocalDateTime.now().plusHours(1);

        builder.and(party.startDate.after(nowPlusOneHour))
                .and(party.isPublic.isTrue());

        if (request.getStartDate() != null && request.getEndDate() != null) {
            LocalDate startDate = LocalDate.parse(request.getStartDate()); // "2024-02-22"
            LocalDate endDate = LocalDate.parse(request.getEndDate());     // "2024-03-03"

            LocalDateTime startDateTime = startDate.atStartOfDay();         // 2024-02-22T00:00:00
            LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);      // 2024-03-03T23:59:59

            builder.and(party.startDate.between(startDateTime, endDateTime));
        }

        // 특정 시간 필터링
        if (request.getTime() != null) {
            builder.and(schedule.sessionTime.hour().stringValue().concat(":")
                    .concat(schedule.sessionTime.minute().stringValue()).eq(request.getTime()));
        }

        // 요일 필터링
        if (request.getDayWeek() != null && !request.getDayWeek().isEmpty()) {
            builder.and(schedule.dayWeek.in(request.getDayWeek()));
        }

        // 에피소드 길이 필터링
        if (request.getEpisodeLength() != null) {
            builder.and(party.episodeCount.eq(request.getEpisodeLength()));
        }

        // 레벨 필터링
        if (request.getLevel() != null) {
            builder.and(party.level.eq(request.getLevel()));
        }

        List<Tuple> results = queryFactory
                .select(
                        party,
                        partyMember.countDistinct()
                )
                .from(party)
                .leftJoin(party.partyMembers, partyMember)
                .leftJoin(party.schedules, schedule)
                .where(builder)
                .groupBy(party.id)
                .fetch();

        if (request.isCanJoin()) {
            results = results.stream()
                    .filter(tuple -> Optional.ofNullable(tuple.get(partyMember.countDistinct())).orElse(0L) < 4)
                    .collect(Collectors.toList());
        }

        return results;
    }
}

