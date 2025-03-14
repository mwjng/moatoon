package com._2.a401.moa.party.repository;

import com._2.a401.moa.cut.domain.QCut;
import com._2.a401.moa.member.domain.QMember;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.domain.QParty;
import com._2.a401.moa.party.domain.QPartyMember;
import com._2.a401.moa.party.dto.response.BookInfoResponse;
import com._2.a401.moa.party.dto.response.CutResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
@Slf4j
public class CustomPartyRepositoryImpl implements CustomPartyRepository {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<CutResponse> getAllCuts(Long partyId) {
        QCut cut = QCut.cut;
        QParty party = QParty.party;
        QMember member = QMember.member;

        return queryFactory
                .select(Projections.constructor(CutResponse.class,
                        cut.id,
                        cut.imageUrl,
                        cut.content,
                        cut.cutOrder,
                        member.name,
                        cut.modifiedAt))
                .from(cut)
                .join(cut.party, party)
                .join(cut.member, member)
                .where(
                        cut.cutOrder.loe(party.progressCount.multiply(4)),
                        cut.party.id.eq(partyId)
                )
                .orderBy(cut.cutOrder.asc())
                .fetch();
    }

    @Override
    public Page<BookInfoResponse> findAllByMemberAndProgressStatus(Long memberId, boolean isCompleted, Pageable pageable) {
        QParty party = QParty.party;
        QPartyMember partyMember = QPartyMember.partyMember;

        BooleanExpression statusCondition = isCompleted
                ? party.status.eq(PartyState.DONE)
                : party.status.in(PartyState.BEFORE, PartyState.ONGOING);

        List<BookInfoResponse> books = queryFactory
                .select(Projections.constructor(BookInfoResponse.class,
                        party.id,
                        party.bookCover,
                        party.bookTitle,
                        party.status,
                        party.startDate,
                        party.endDate))
                .from(party)
                .join(partyMember).on(party.id.eq(partyMember.party.id))
                .where(
                        partyMember.member.id.eq(memberId),
                        statusCondition
                )
                .orderBy(party.startDate.asc()) // startDate 기준 오름차순 정렬
                .offset(pageable.getOffset()) //페이지 번호 * 페이지 크기
                .limit(pageable.getPageSize()) //페이지 크기
                .fetch();

        for (BookInfoResponse bookInfoResponse : books) {
            log.info("books: {}", bookInfoResponse);
        }

        //전체 데이터 개수
        long totalBooks = queryFactory
                .select(party.count())
                .from(party)
                .join(partyMember).on(party.id.eq(partyMember.party.id))
                .where(
                        partyMember.member.id.eq(memberId),
                        statusCondition
                )
                .fetchOne();

        return new PageImpl<>(books, pageable, totalBooks);
    }
}
