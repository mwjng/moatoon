package com._2.a401.moa.party.repository;

import com._2.a401.moa.cut.domain.QCut;
import com._2.a401.moa.member.domain.QMember;
import com._2.a401.moa.party.domain.PartyState;
import com._2.a401.moa.party.domain.QParty;
import com._2.a401.moa.party.domain.QPartyMember;
import com._2.a401.moa.party.dto.response.BookInfoResponse;
import com._2.a401.moa.party.dto.response.CutResponse;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
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
    public List<BookInfoResponse> findAllByMemberAndStatus(Long memberId, PartyState status) {
        QParty party=QParty.party;
        QPartyMember partyMember=QPartyMember.partyMember;

        return queryFactory
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
                        party.status.eq(status)
                )
                .fetch();
    }
}
