package com._2.a401.moa.word.service;

import com._2.a401.moa.party.repository.PartyRepository;
import com._2.a401.moa.word.domain.Word;
import com._2.a401.moa.word.domain.WordExample;
import com._2.a401.moa.word.dto.quizResponse;
import com._2.a401.moa.word.repository.WordExampleRepository;
import com._2.a401.moa.word.repository.WordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WordService {
    private final PartyRepository partyRepository;
    private final WordExampleRepository wordExampleRepository;
    private final WordRepository wordRepository;

    public quizResponse generateQuiz(Long partyId) {
        // 현재 날짜에 해당하는 episode_number 조회
        Object[] episodeNumberAndLevel = partyRepository.findEpisodeNumberAndLevelByPartyIdAndToday(partyId)
                .orElseThrow(() -> new EntityNotFoundException("No episode found for today's schedule"));

        Integer episodeNumber = (Integer) episodeNumberAndLevel[0];
        Integer level = (Integer) episodeNumberAndLevel[1];

        // party_id에 해당하는 예문 목록 가져오기
        List<WordExample> wordExamples = wordExampleRepository.findExamplesByPartyIdAndEpisodeNumber(partyId);
        
        // 예문 목록에서 2개의 값마다 홀수번/짝수번 선택해서 리스트 만들기
        List<WordExample> selectExamples = new ArrayList<>();

        for (int i = 0; i < wordExamples.size(); i+=2) {
            WordExample firstExample = wordExamples.get(i);
            WordExample secondExample = wordExamples.get(i + 1);

            // 50% 확률로 첫 번째 예문 또는 두 번째 예문을 선택
            if (Math.random() < 0.5) {
                selectExamples.add(firstExample);
            } else {
                selectExamples.add(secondExample);
            }
        }

        // level + 1에 해당하는 단어 4개 무작위 선택
        List<Word> randomWords = wordRepository.findRandomWordsByLevel(level == 6 ? level - 1 : level);
        
        return new quizResponse(selectExamples, randomWords);
    }

    private List<Long> getNthGroup(List<Long> wordIds, int n) {
        int startIndex = (n - 1) * 4;
        int endIndex = Math.min(startIndex + 4, wordIds.size());
        return wordIds.subList(startIndex, endIndex);
    }
}
