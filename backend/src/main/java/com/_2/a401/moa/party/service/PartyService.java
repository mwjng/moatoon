package com._2.a401.moa.party.service;

import com._2.a401.moa.common.s3.S3Service;
import com._2.a401.moa.cut.service.CutService;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.domain.*;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;
import com._2.a401.moa.party.repository.*;
import com._2.a401.moa.schedule.service.ScheduleService;
import com._2.a401.moa.word.domain.Word;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PartyService {
    private final PartyRepository partyRepository;
    private final PartyKeywordRepository partyKeywordRepository;
    private final KeywordRepository keywordRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final MemberRepository MemberRepository;
    private final S3Service s3Service;
    private final CutService cutService;
    private final ScheduleService scheduleService;

    @Transactional
    public Party createParty(CreatePartyRequest request) {
        // 1. OpenAI에서 받은 이미지 URL을 S3에 업로드하여 최종 URL 저장
        String bookCoverUrl = s3Service.uploadFromUrl(request.getCoverImage());

        // 2. 중복되지 않는 핀번호 생성
        String pinNumber = generateUniquePin();

        // 3. 날짜 계산 (startDate, episodeLength, 요일 고려)
        // startDate 보정 (가장 가까운 선택 요일로 변경)
        LocalDateTime startDate = adjustStartDate(
                LocalDateTime.parse(request.getStartDate() + "T" + request.getTime()),
                request.getDayOfWeek()
        );
        // 종료 날짜 계산 (startDate, episodeLength, 요일 고려)
        LocalDateTime endDate = scheduleService.calculateEndDate(startDate, request.getDayOfWeek(), request.getEpisodeLength());

        // 4. Party 엔티티 생성 및 저장
        Party party = Party.builder()
                .bookCover(bookCoverUrl)
                .bookTitle(request.getStory().getTitle())
                .introduction(request.getStory().getOverview())
                .pinNumber(pinNumber)
                .level(request.getLevel())
                .episodeCount(request.getEpisodeLength())
                .startDate(startDate)
                .endDate(endDate)
                .isPublic(request.isPublicStatus())  // boolean 타입으로 저장
                .build();

        party = partyRepository.save(party);

        // 5. PartyKeyword 저장
        savePartyKeywords(party, request.getGenre(), request.getMood(), request.getTheme());

        // 6. PartyMember 저장
        savePartyMembers(party, request.getParticipatingChildren());

        // 7. Cut 저장 (story 기반으로 Cut 테이블에 삽입)
        cutService.createCuts(party, request);

        // 8. Schedule 저장
        scheduleService.createSchedules(party, request.getDayOfWeek(), request.getEpisodeLength());

        return party;
    }

    private LocalDateTime adjustStartDate(LocalDateTime startDate, List<String> dayOfWeek) {
        DayOfWeek currentDay = startDate.getDayOfWeek();

        // 선택된 요일을 DayOfWeek Enum으로 변환 후 정렬 (월→일 순)
        List<DayOfWeek> selectedDays = dayOfWeek.stream()
                .map(DayOfWeek::valueOf)
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());

        // 현재 요일보다 이후에 있는 선택 요일 찾기
        for (DayOfWeek nextDay : selectedDays) {
            if (nextDay.getValue() > currentDay.getValue()) {
                return startDate.with(nextDay);
            }
        }

        // 현재보다 이후 요일이 없다면, 다음 주 첫 번째 선택 요일로 이동
        return startDate.plusWeeks(1).with(selectedDays.get(0));
    }

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

    private void savePartyMembers(Party party, List<CreatePartyRequest.ParticipatingChild> children) {
        List<PartyMember> partyMembers = children.stream()
                .map(child -> {
                    Member member = MemberRepository.findById(child.getId())
                            .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Member ID: " + child.getId()));

                    return PartyMember.builder()
                            .party(party)
                            .member(member) // ✅ Member 객체를 설정
                            .build();
                })
                .collect(Collectors.toList());

        partyMemberRepository.saveAll(partyMembers);
    }


    private String generateUniquePin() {
        Random random = new Random();
        return String.format("%08d", random.nextInt(100000000)); // 8자리 랜덤 숫자
    }
}
