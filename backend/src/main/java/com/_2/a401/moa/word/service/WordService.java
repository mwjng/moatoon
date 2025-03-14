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
import com._2.a401.moa.word.dto.request.AddWordsRequest;
import com._2.a401.moa.word.dto.response.LearningWordsResponse;
import com._2.a401.moa.word.dto.response.MyWordsResponse;
import com._2.a401.moa.word.dto.response.QuizResponse;
import com._2.a401.moa.word.dto.response.RandomWordsResponse;
import com._2.a401.moa.word.repository.MyWordRepository;
import com._2.a401.moa.word.repository.WordExampleRepository;
import com._2.a401.moa.word.repository.WordRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class WordService {
    private final PartyRepository partyRepository;
    private final WordExampleRepository wordExampleRepository;
    private final WordRepository wordRepository;
    private final MyWordRepository myWordRepository;
    private final MemberRepository memberRepository;

    public MyWordsResponse getMyWords(Long memberId, Integer page, String keyword) {
        log.info("WordService.getMyWords - memberId: {}, page: {}, keyword: {}", memberId, page, keyword);
        Long totalCount = myWordRepository.countAll(memberId, keyword);
        int totalPage = (int) (totalCount % 2) == 0 ? (int) (totalCount / 2) : (int) (totalCount / 2) + 1;
        int searchPage;

        if (page == null || page < 1 || totalPage == 0) {
            searchPage = 1;
        } else if (page > totalPage) {
            searchPage = totalPage;
        } else {
            searchPage = page;
        }
        log.info("totalCount: {}, totalPage: {}, searchPage: {}", totalCount, totalPage, searchPage);

        List<MyWordExample> myWordExamples = myWordRepository.findWithWordIdAndPage(memberId, searchPage - 1, keyword);
        for (MyWordExample myWordExample: myWordExamples) {
            log.info("myWordExample: {}", myWordExample);
        }

        List<MyWordWithExamples> myWordWithExamples = new ArrayList<>();
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
        for (MyWordWithExamples myWordWithExamples1 : myWordWithExamples) {
            log.info("myWordWithExamples: {}", myWordWithExamples1);
        }

        return MyWordsResponse.builder()
                .myWordWithExamples(myWordWithExamples)
                .totalPage(totalPage)
                .build();
    }

    @Transactional
    public void removeWord(long memberId, WordIdRequest wordIdRequest) {
        long myWordId = wordIdRequest.getWordId();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("No member found for id"));

        MyWord myWord = myWordRepository.findById(myWordId)
                .orElseThrow(() -> new MoaException(ExceptionCode.WORD_NOT_FOUND));

        myWord.delete();
    }

    @Transactional
    public void addMyWords(Long memberId, AddWordsRequest addWordsRequest) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("No member found for id"));

        List<Long> wordIds = addWordsRequest.getWordIds();

        for (long wordId : wordIds) {
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
        log.info("WordService.generateQuiz - partyId: {}", partyId);
        EpisodeNumberAndLevel episodeNumberAndLevel = partyRepository.findEpisodeNumberAndLevelByPartyIdAndToday(partyId)
                .orElseThrow(() -> new EntityNotFoundException("No episode found for today's schedule"));

        int episodeNumber = episodeNumberAndLevel.episodeNumber();
        int level = episodeNumberAndLevel.level();

        log.info("episodeNumber: {}, level: {}", episodeNumber, level);

        // party_id에 해당하는 예문 목록 가져오기
        List<WordExample> wordExamples = wordExampleRepository.findExamplesByPartyIdAndEpisodeNumber(partyId);
        log.info("all word Exmaples: ");
        for (WordExample wordExample : wordExamples) {
            log.info("{}", wordExample);
        }

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
        log.info("selected Exmaples: ");
        for (WordExample wordExample : wordExamples) {
            log.info("{}", wordExample);
        }

        // level + 1에 해당하는 단어 4개 무작위 선택
        List<Word> randomWords = wordRepository.findRandomWordsByLevel(level == 6 ? level - 1 : level + 1, 4);
        for (Word word : randomWords) {
            log.info("random word: {}", word);
        }

        // 예문을 퀴즈 형태로 분할 및 리스트 생성
        // 단어 선택지 리스트 생성
        List<QuizSentence> quizSentences = new ArrayList<>();
        List<QuizWord> quizWords = new ArrayList<>();
        log.info("split examples: ");
        for (WordExample example : selectExamples) {
            log.info("example: {}", example);
            String[] split = example.getExample().split("\\*");
            if (split.length == 2) {
                quizSentences.add(QuizSentence
                        .builder()
                        .front(split[0])
                        .back("")
                        .wordId(example.getWord().getId())
                        .word(example.getWord().getWord())
                        .answer(split[1])
                        .build());
            } else {
                quizSentences.add(QuizSentence
                        .builder()
                        .front(split[0])
                        .back(split[2])
                        .wordId(example.getWord().getId())
                        .word(example.getWord().getWord())
                        .answer(split[1])
                        .build());
            }

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
        Collections.shuffle(quizWords);

        return QuizResponse
                .builder()
                .quizWords(quizWords)
                .sentences(quizSentences)
                .build();
    }

    public LearningWordsResponse getLearningWords(Long partyId) {
        log.info("getLearningWords = {}", partyId);
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
                    .meaning(wordExamples.get(i).getWord().getMeaning())
                    .word(wordExamples.get(i).getWord().getWord())
                    .examples(examples)
                    .build());
        }

        return LearningWordsResponse
                .builder()
                .words(wordWithExamples)
                .build();
    }
}
