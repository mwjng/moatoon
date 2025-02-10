package com._2.a401.moa.party.service;

import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.cut.service.CutService;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.domain.*;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.repository.*;
import com._2.a401.moa.schedule.domain.Day;
import com._2.a401.moa.schedule.service.InitialScheduleService;
import com._2.a401.moa.schedule.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartyService {
    private final PartyRepository partyRepository;
    private final PartyKeywordRepository partyKeywordRepository;
    private final KeywordRepository keywordRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final MemberRepository memberRepository; // ✅ 변수명 수정
    private final CutService cutService;
    private final InitialScheduleService initialScheduleService;
    private final S3Service s3Service;

    @Transactional
    public Party createParty(CreatePartyRequest request,  String bookCoverUrl) {
//        String bookCoverUrl = request.getCoverImage();
//        String bookCoverUrl = s3Service.uploadFromUrl(imageUrl);



        String pinNumber = generateUniquePin();

        // 날짜 조정 (가장 가까운 선택 요일로 변경)
        LocalDateTime startDate = adjustStartDate(
                LocalDateTime.parse(request.getStartDate() + "T" + request.getTime()),
                request.getDayWeek()
        );
        // 종료 날짜 계산 (startDate, episodeLength, 요일 고려)
        LocalDateTime endDate = initialScheduleService.calculateEndDate(startDate, request.getDayWeek(), request.getEpisodeLength());

        //  Party 엔티티 생성 및 저장
        Party party = partyRepository.save(Party.builder()
                .bookCover(bookCoverUrl)
                .bookTitle(request.getStory().getTitle())
                .introduction(request.getStory().getOverview())
                .pinNumber(pinNumber)
                .level(request.getLevel())
                .episodeCount(request.getEpisodeLength())
                .startDate(startDate)
                .endDate(endDate)
                .status(PartyState.BEFORE)
                .isPublic(request.isPublicStatus())  // boolean 타입으로 저장
                .build());

        //  PartyKeyword 저장
        savePartyKeywords(party, request.getGenre(), request.getMood(), request.getTheme());

        //  PartyMember 저장
        savePartyMembers(party, request.getParticipatingChildren());

        //  Cut 저장 (story 기반으로 Cut 테이블에 삽입)
        cutService.createCuts(party, request);

        //  Schedule 저장
        initialScheduleService.createSchedules(party, request.getDayWeek(), request.getEpisodeLength());

        return party;
    }

    /**
     *  startDate를 선택된 요일 중 가장 가까운 요일로 조정
     */
    private LocalDateTime adjustStartDate(LocalDateTime startDate, List<Day> dayWeek) {
        DayOfWeek currentDay = startDate.getDayOfWeek();

        List<DayOfWeek> selectedDays = dayWeek.stream()
                .map(day -> DayOfWeek.valueOf(day.name()))
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());

        //  현재 요일이 포함되어 있으면 그대로 유지
        if (selectedDays.contains(currentDay)) {
            return startDate;
        }

        //  현재 요일보다 이후에 있는 선택 요일 찾기
        for (DayOfWeek nextDay : selectedDays) {
            if (nextDay.getValue() > currentDay.getValue()) {
                return startDate.with(nextDay);
            }
        }

        //  현재보다 이후 요일이 없다면, 다음 주 첫 번째 선택 요일로 이동
        return startDate.plusWeeks(1).with(selectedDays.get(0));
    }

    /**
     *  PartyKeyword 저장 (장르, 분위기, 테마)
     */
    private void savePartyKeywords(Party party, int genreId, int moodId, int themeId) {
        List<Integer> keywordIds = List.of(genreId, moodId, themeId);

        for (int keywordId : keywordIds) {
            Keyword keyword = keywordRepository.findById((long) keywordId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Keyword ID: " + keywordId));

            PartyKeyword partyKeyword = PartyKeyword.builder()
                    .party(party)
                    .keyword(keyword)
                    .build();

            partyKeywordRepository.save(partyKeyword);
        }
    }

    /**
     * ✅ PartyMember 저장 (참여 아동 등록)
     */
    private void savePartyMembers(Party party, List<CreatePartyRequest.ParticipatingChild> children) {
        List<Long> memberIds = children.stream()
                .map(CreatePartyRequest.ParticipatingChild::getId)
                .collect(Collectors.toList());

        // ✅ 한 번의 쿼리로 모든 Member 가져오기
        List<Member> members = memberRepository.findAllById(memberIds);

        if (members.size() != memberIds.size()) {
            throw new IllegalArgumentException("일부 Member ID가 존재하지 않습니다.");
        }

        List<PartyMember> partyMembers = members.stream()
                .map(member -> PartyMember.builder()
                        .party(party)
                        .member(member)
                        .build())
                .collect(Collectors.toList());

        partyMemberRepository.saveAll(partyMembers);
    }

    /**
     * ✅ 고유한 핀번호 생성 (UUID 기반)
     */
    private String generateUniquePin() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}
