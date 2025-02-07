package com._2.a401.moa.word.service;

import com._2.a401.moa.common.exception.ExceptionCode;
import com._2.a401.moa.common.exception.MoaException;
import com._2.a401.moa.member.domain.Member;
import com._2.a401.moa.member.repository.MemberRepository;
import com._2.a401.moa.party.repository.PartyRepository;
import com._2.a401.moa.word.domain.MyWord;
import com._2.a401.moa.word.domain.Word;
import com._2.a401.moa.word.domain.WordExample;
import com._2.a401.moa.word.dto.*;
import com._2.a401.moa.word.dto.request.WordIdRequest;
import com._2.a401.moa.word.dto.response.LearningWordsResponse;
import com._2.a401.moa.word.dto.response.MyWordsResponse;
import com._2.a401.moa.word.dto.response.QuizResponse;
import com._2.a401.moa.word.dto.response.RandomWordsResponse;
import com._2.a401.moa.word.repository.MyWordRepository;
import com._2.a401.moa.word.repository.WordExampleRepository;
import com._2.a401.moa.word.repository.WordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordService {
    private final PartyRepository partyRepository;
    private final WordExampleRepository wordExampleRepository;
    private final WordRepository wordRepository;
    private final MyWordRepository myWordRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void removeWord(long memberId, WordIdRequest wordIdRequest) {
        long wordId = wordIdRequest.getWordId();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("No member found for id"));

        MyWord myWord = myWordRepository.findByIdAndMemberId(memberId, wordId)
                .orElseThrow(() -> new MoaException(ExceptionCode.WORD_NOT_FOUND));

        myWord.delete();
    }

    @Transactional
    public void addMyWords(Long memberId, Long wordId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("No member found for id"));

        Optional<MyWord> myWord = myWordRepository.findByIdAndMemberId(memberId, wordId);

        if (myWord.isPresent()) {
            myWord.get().countFail();
        } else {
            Word word = wordRepository.findById(wordId)
                    .orElseThrow(() -> new MoaException(ExceptionCode.WORD_NOT_FOUND));

            MyWord newMyWord = new MyWord(1, false, word, member);

            myWordRepository.save(newMyWord);
        }
    }

    public RandomWordsResponse getRandomWords(int level, int episodeCount) {
        // level에 해당하는 단어 (episodeCount * 4)개 무작위 선택
        List<Word> randomWords = wordRepository.findRandomWordsByLevel(level, episodeCount * 4);

        List<QuizWord> quizWords = new ArrayList<>();
        for (Word word : randomWords) {
            quizWords.add(QuizWord
                    .builder()
                    .wordId(word.getId())
                    .word(word.getWord())
                    .build());
        }

        return RandomWordsResponse.builder()
                .words(quizWords)
                .build();
    }

    public QuizResponse generateQuiz(Long partyId) {
        // 현재 날짜에 해당하는 episode_number 조회
        EpisodeNumberAndLevel episodeNumberAndLevel = partyRepository.findEpisodeNumberAndLevelByPartyIdAndToday(partyId)
                .orElseThrow(() -> new EntityNotFoundException("No episode found for today's schedule"));

        int episodeNumber = episodeNumberAndLevel.episodeNumber();
        int level = episodeNumberAndLevel.level();

        // party_id에 해당하는 예문 목록 가져오기
        List<WordExample> wordExamples = wordExampleRepository.findExamplesByPartyIdAndEpisodeNumber(partyId);

        // 예문 목록에서 2개의 값마다 홀수번/짝수번 선택해서 리스트 만들기
        List<WordExample> selectExamples = new ArrayList<>();

        for (int i = (episodeNumber - 1) * 8; i < episodeNumber * 8; i += 2) {
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
        List<Word> randomWords = wordRepository.findRandomWordsByLevel(level == 6 ? level - 1 : level + 1, 4);

        // 예문을 퀴즈 형태로 분할 및 리스트 생성
        // 단어 선택지 리스트 생성
        List<QuizSentence> quizSentences = new ArrayList<>();
        List<QuizWord> quizWords = new ArrayList<>();
        for (WordExample example : selectExamples) {
            String[] split = example.getExample().split("\\*");
            quizSentences.add(QuizSentence
                    .builder()
                    .front(split[0])
                    .back(split[2])
                    .wordId(example.getWord().getId())
                    .word(example.getWord().getWord())
                    .build());
            quizWords.add(QuizWord
                    .builder()
                    .wordId(example.getWord().getId())
                    .word(example.getWord().getWord())
                    .build());
        }
        for (Word word : randomWords) {
            quizWords.add(QuizWord
                    .builder()
                    .wordId(word.getId())
                    .word(word.getWord())
                    .build());
        }

        return QuizResponse
                .builder()
                .quizWords(quizWords)
                .sentences(quizSentences)
                .build();
    }

    public LearningWordsResponse getLearningWords(Long partyId) {
        // 현재 날짜에 해당하는 episode_number 조회
        EpisodeNumberAndLevel episodeNumberAndLevel = partyRepository.findEpisodeNumberAndLevelByPartyIdAndToday(partyId)
                .orElseThrow(() -> new EntityNotFoundException("No episode found for today's schedule"));

        int episodeNumber = episodeNumberAndLevel.episodeNumber();

        // party_id에 해당하는 예문 목록 가져오기
        List<WordExample> wordExamples = wordExampleRepository.findExamplesByPartyIdAndEpisodeNumber(partyId);

        List<WordWithExamples> wordWithExamples = new ArrayList<>();
        for (int i = (episodeNumber - 1) * 8; i < episodeNumber * 8; i += 2) {
            List<String> examples = new ArrayList<>();
            examples.add(wordExamples.get(i).getExample());
            examples.add(wordExamples.get(i + 1).getExample());
            wordWithExamples.add(WordWithExamples
                    .builder()
                    .wordId(wordExamples.get(i).getId())
                    .word(wordExamples.get(i).getWord().getWord())
                    .examples(examples)
                    .build());
        }

        return LearningWordsResponse
                .builder()
                .words(wordWithExamples)
                .build();
    }

    public MyWordsResponse getMyWords(Long memberId, int page) {
        List<MyWordExample> myWordExamples = myWordRepository.findAllWithId(memberId, page - 1);

        List<MyWordWithExamples> myWordWithExamples = new ArrayList<>();
        if (myWordExamples.isEmpty()) {
            return MyWordsResponse.builder()
                    .myWordWithExamples(myWordWithExamples)
                    .build();
        }

        for (int i = 0; i < myWordExamples.size(); i += 2) {
            List<String> examples = new ArrayList<>();
            examples.add(myWordExamples.get(i).getExample());
            examples.add(myWordExamples.get(i + 1).getExample());
            myWordWithExamples.add(MyWordWithExamples
                    .builder()
                    .id(myWordExamples.get(i).getId())
                    .word(myWordExamples.get(i).getWord())
                    .meaning(myWordExamples.get(i).getMeaning())
                    .failCount(myWordExamples.get(i).getFailCount())
                    .examples(examples)
                    .build());
        }

        return MyWordsResponse.builder()
                .myWordWithExamples(myWordWithExamples)
                .build();
    }
}
