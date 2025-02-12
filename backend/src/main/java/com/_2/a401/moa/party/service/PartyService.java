package com._2.a401.moa.party.service;
import java.time.LocalDateTime;


import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.cut.service.CutService;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.domain.*;
import com._2.a401.moa.party.dto.request.CreatePartyRequest;

import com._2.a401.moa.party.dto.request.PartySearchRequest;
import com._2.a401.moa.party.dto.response.*;

import com._2.a401.moa.party.repository.*;
import com._2.a401.moa.schedule.domain.Day;
import com._2.a401.moa.schedule.domain.Schedule;
import com._2.a401.moa.schedule.repository.ScheduleRepository;
import com._2.a401.moa.schedule.service.InitialScheduleService;
import com.querydsl.core.Tuple;
import com._2.a401.moa.party.dto.response.ApiResponse;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

import static com._2.a401.moa.common.exception.ExceptionCode.*;

@Service
@RequiredArgsConstructor
public class PartyService {
    private final PartyRepository partyRepository;
    private final PartyKeywordRepository partyKeywordRepository;
    private final KeywordRepository keywordRepository;
    private final PartyMemberRepository partyMemberRepository;
    private final MemberRepository memberRepository;
    private final CutService cutService;
    private final InitialScheduleService initialScheduleService;
    private final ScheduleRepository scheduleRepository;
    private final PartyRepositoryCustom partyRepositoryCustom;



    @Transactional
    public Party createParty(CreatePartyRequest request,  String bookCoverUrl) {
        String pinNumber = generateUniquePin();

        LocalDateTime startDate = adjustStartDate(
                LocalDateTime.parse(request.getStartDate() + "T" + request.getTime()),
                request.getDayWeek()
        );

        LocalDateTime endDate = initialScheduleService.calculateEndDate(startDate, request.getDayWeek(), request.getEpisodeLength());


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
                .isPublic(request.isPublicStatus())
                .build());

        savePartyKeywords(party, request.getGenre(), request.getMood(), request.getTheme());

        savePartyMembers(party, request.getParticipatingChildren());

        cutService.createCuts(party, request);

        initialScheduleService.createSchedules(party, request.getDayWeek(), request.getEpisodeLength());

        return party;
    }

    private LocalDateTime adjustStartDate(LocalDateTime startDate, List<Day> dayWeek) {
        DayOfWeek currentDay = startDate.getDayOfWeek();

        List<DayOfWeek> selectedDays = dayWeek.stream()
                .map(day -> DayOfWeek.valueOf(day.name()))
                .sorted(Comparator.comparingInt(DayOfWeek::getValue))
                .collect(Collectors.toList());

        if (selectedDays.contains(currentDay)) {
            return startDate;
        }

        for (DayOfWeek nextDay : selectedDays) {
            if (nextDay.getValue() > currentDay.getValue()) {
                return startDate.with(nextDay);
            }
        }

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
        List<Long> memberIds = children.stream()
                .map(CreatePartyRequest.ParticipatingChild::getId)
                .collect(Collectors.toList());

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

    private String generateUniquePin() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    @Transactional(readOnly = true)
    public PartyDetailResponse getPartyDetail(Long partyId) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new IllegalArgumentException("해당 Party가 존재하지 않습니다: " + partyId));


        List<PartyMemberResponse> members = party.getPartyMembers().stream()
                .map(pm -> PartyMemberResponse.builder()
                        .memberId(pm.getMember().getId())
                        .name(pm.getMember().getName())
                        .imgUrl(pm.getMember().getImageUrl())
                        .nickname(pm.getMember().getNickname())
                        .managerId(pm.getMember().getManager() != null ? pm.getMember().getManager().getId() : null)
                        .build())
                .collect(Collectors.toList());


        List<Schedule> schedules = scheduleRepository.findByPartyIdOrderBySessionTimeAsc(partyId);

        List<Day> dayWeeks = schedules.stream()
                .map(Schedule::getDayWeek)
                .distinct()
                .toList();

        List<KeywordResponse> keywords = partyKeywordRepository.findByParty(partyId).stream()
                .map(partyKeyword -> KeywordResponse.fromEntity(partyKeyword.getKeyword()))
                .toList();

        return PartyDetailResponse.builder()
                .pinNumber(party.getPinNumber())
                .title(party.getBookTitle())
                .startDate(party.getStartDate())
                .dayWeeks(dayWeeks)
                .level(party.getLevel())
                .progressCount(party.getProgressCount())
                .episodeCount(party.getEpisodeCount())
                .introduction(party.getIntroduction())
                .bookCover(party.getBookCover())
                .keywords(keywords)
                .members(members)
                .build();
    }


    public List<PartySearchResponse> searchParties(PartySearchRequest request) {
        List<Tuple> results = partyRepositoryCustom.searchParties(request);

        return results.stream()
                .map(tuple -> PartySearchResponse.builder()
                        .partyId(tuple.get(0, Party.class).getId()) // 첫 번째 값은 Party 객체
                        .bookTitle(tuple.get(0, Party.class).getBookTitle())
                        .bookCover(tuple.get(0, Party.class).getBookCover())
                        .level(tuple.get(0, Party.class).getLevel())
                        .participantCount(tuple.get(1, Long.class).intValue()) // 두 번째 값은 참여 인원 수
                        .build())
                .collect(Collectors.toList());
    }

    public PartyDetailResponse getPartyFindByPin(String pinNumber) {
        Party party = partyRepository.findByPinNumberAndStatus(pinNumber, PartyState.BEFORE).orElseThrow(()-> new ResponseStatusException(HttpStatus.NO_CONTENT, "해당 핀번호로 조회된 입장 가능한 파티가 없습니다."));

        List<PartyMemberResponse> members = party.getPartyMembers().stream()
                .map(pm -> PartyMemberResponse.builder()
                        .memberId(pm.getMember().getId())
                        .name(pm.getMember().getName())
                        .nickname(pm.getMember().getNickname())
                        .managerId(pm.getMember().getManager() != null ? pm.getMember().getManager().getId() : null)
                        .build())
                .collect(Collectors.toList());


        List<Schedule> schedules = scheduleRepository.findByPartyIdOrderBySessionTimeAsc(party.getId());

        List<Day> dayWeeks = schedules.stream()
                .map(Schedule::getDayWeek)
                .distinct()
                .toList();

        List<KeywordResponse> keywords = partyKeywordRepository.findByParty(party.getId()).stream()
                .map(partyKeyword -> KeywordResponse.fromEntity(partyKeyword.getKeyword()))
                .toList();

        return PartyDetailResponse.builder()
                .pinNumber(party.getPinNumber())
                .title(party.getBookTitle())
                .startDate(party.getStartDate())
                .dayWeeks(dayWeeks)
                .level(party.getLevel())
                .progressCount(party.getProgressCount())
                .episodeCount(party.getEpisodeCount())
                .introduction(party.getIntroduction())
                .bookCover(party.getBookCover())
                .keywords(keywords)
                .members(members)
                .build();
    }

    @Transactional
    public void addChildrenToParty(Long partyId, List<Long> childIds) {
        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new MoaException(INVALID_PARTY));

        // 1시간 이상 남은 모임만 수정 가능
        LocalDateTime now = LocalDateTime.now();
        if (party.getStartDate().minusHours(1).isBefore(now)) {
            throw new MoaException(SCHEDULE_NOT_ACTIVE);
        }

        int currentMemberCount = partyMemberRepository.countByParty(party);
        int newTotalCount = currentMemberCount + childIds.size();

        if (newTotalCount > 4) {
            throw new MoaException(PARTY_FULL);
        }

        List<PartyMember> newMembers = new ArrayList<>();

        for (Long childId : childIds) {
            Member child = memberRepository.findById(childId)
                    .orElseThrow(() -> new MoaException(INVALID_CHILD));

            boolean isAlreadyMember = partyMemberRepository.existsByPartyAndMember(party, child);
            if (isAlreadyMember) {
                throw new MoaException(DUPLICATED_CHILD);
            }
            PartyMember newPartyMember = PartyMember.builder()
                    .party(party)
                    .member(child)
                    .build();
            newMembers.add(newPartyMember);
        }
        partyMemberRepository.saveAll(newMembers);
    }

    @Transactional
    public void removeChildFromParty(Long partyId, Long childId) {

        Party party = partyRepository.findById(partyId)
                .orElseThrow(() -> new MoaException(INVALID_PARTY));

        Member child = memberRepository.findById(childId)
                .orElseThrow(() -> new MoaException(INVALID_MEMBER));

        LocalDateTime now = LocalDateTime.now();
        if (party.getStartDate().minusHours(1).isBefore(now)) {
            throw new MoaException(SCHEDULE_NOT_ACTIVE);
        }

        PartyMember partyMember = partyMemberRepository.findByPartyAndMember(party, child)
                .orElseThrow(() -> new MoaException(DUPLICATED_CHILD));

        partyMemberRepository.delete(partyMember);
    }

}
