-----------------------------------------------------------
-- 1. KEYWORD 테이블 (키워드)
-----------------------------------------------------------
INSERT INTO `KEYWORD` (`keyword`, `option`) VALUES
('신비로운', 'MOOD'),
('따뜻한', 'MOOD'),
('평화로운', 'MOOD'),
('호기심', 'MOOD'),
('모험적인', 'MOOD'),
('놀라운', 'MOOD'),
('유쾌한', 'MOOD'),
('시끌벅적', 'MOOD'),
('공주/왕자', 'THEME'),
('공룡', 'THEME'),
('동물', 'THEME'),
('마법', 'THEME'),
('요정', 'THEME'),
('우주', 'THEME'),
('바다', 'THEME'),
('사막', 'THEME'),
('하늘', 'THEME'),
('용기', 'THEME'),
('민속', 'THEME'),
('중세', 'THEME'),
('요리', 'THEME'),
('역할극', 'THEME'),
('영웅', 'THEME'),
('로봇', 'THEME'),
('자동차', 'THEME'),
('모험', 'GENRE'),
('판타지', 'GENRE'),
('로맨스', 'GENRE'),
('신화', 'GENRE'),
('역사', 'GENRE'),
('일상', 'GENRE'),
('코믹', 'GENRE'),
('액션', 'GENRE'),
('드라마', 'GENRE'),
('스포츠', 'GENRE');

-----------------------------------------------------------
-- 2. MEMBER 테이블 (회원: 부모 2명(id:1-2), 자녀 10명(id: 3-10))
-- update member set manager_id=1 where id=13
-----------------------------------------------------------
-- 부모 (MANAGER)
INSERT INTO MEMBER (manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(NULL, 'MANAGER', '황미정', 'hwangmj', '미정', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, 'MANAGER', '김아빠', 'kimdad', '아빠', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- 황미정의 자녀 (CHILD)
INSERT INTO MEMBER (manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(1, 'CHILD', '배현수', 'baehs', '현수', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'CHILD', '배현지', 'baehj1', '현지', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'CHILD', '배현우', 'baehw', '현우', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'CHILD', '배현아', 'baehya', '현아', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'CHILD', '배익명', 'unknown', '익멍멍', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- -- 김아빠의 자녀 (CHILD)
INSERT INTO MEMBER (manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(2, 'CHILD', '김일일', 'kim11', '일일', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'CHILD', '김이이', 'kim22', '이이', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'CHILD', '김삼삼', 'kim33', '삼삼', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'CHILD', '김넷넷', 'kim44', '넷넷', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'CHILD', '김오오', 'kim55', '오오', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-----------------------------------------------------------
-- 3. PARTY 테이블 (총 7개 파티, 레벨은 모두 1, 에피소드는 2개)
-----------------------------------------------------------
INSERT INTO PARTY (introduction, pin_number, book_cover, book_title, level, episode_count, progress_count, status, start_date, is_public, end_date, created_at, modified_at) VALUES
-- [BEFORE] 아직 시작 전 파티 (파티 1 ~ 3 / 모두 레벨 1/ 모두 에피소드 수 2개 / 3번만 비공개방 / 매주 목 : 2/13일에 시작 '2025-02-13 08:00:00' ~ '2025-02-20 08:00:00' )
('미래 모험의 시작, 용감한 기사 이야기', '1001', 'cover.jpg', '용감한 기사', 1, 2, 0, 'BEFORE', '2025-02-13 08:00:00', 1, '2025-02-20 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('마법사들의 비밀과 예언', '1002', 'cover.jpg', '마법사들의 예언', 1, 2, 0, 'BEFORE', '2025-02-13 08:00:00', 1, '2025-02-20 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('전설의 바다 괴물과 해적', '1003', 'cover.jpg', '바다의 전설', 1, 2, 0, 'BEFORE', '2025-02-13 08:00:00', 0, '2025-02-20 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- [ING] 진행 중인 파티 (파티 4 ~ 5 / 2개 에피소드 중 1개 진행 / 매주 목 '2025-02-06 08:00:00' ~ '2025-02-13 08:00:00')
('현재 진행 중! 공주의 용감한 모험', '2001', 'cover.jpg', '용감한 공주', 1, 2, 1, 'ONGOING', '2025-02-06 08:00:00', 1, '2025-02-13 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('요정의 숲을 지키는 전설', '2002', 'cover.jpg', '요정의 숲', 1, 2, 1, 'ONGOING', '2025-02-06 08:00:00', 1, '2025-02-13 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- [DONE] 종료된 파티 (파티 6 ~ 7 / 매주 목요일 '2025-01-30 08:00:00' ~ '2025-02-06 08:00:00')
('완료! 전설의 마법서 찾기', '3001', 'cover.jpg', '전설의 마법서', 1, 2, 2, 'DONE', '2025-01-30 08:00:00', 1, '2025-02-06 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('완료! 중세 왕국의 모험', '3002', 'cover.jpg', '중세 왕국', 1, 2, 2, 'DONE', '2025-01-30 08:00:00', 1, '2025-02-06 08:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-----------------------------------------------------------
-- 4. PARTY_KEYWORD 테이블 (파티당 3개의 키워드 할당)
-----------------------------------------------------------
INSERT INTO PARTY_KEYWORD (party_id, keyword_id) VALUES
(1, 1), (1, 11), (1, 32),
(2, 1), (2, 11), (2, 32),
(3, 1), (3, 11), (3, 32),

(4, 1), (4, 11), (4, 32),
(5, 1), (5, 11), (5, 32),

(6, 1), (6, 11), (6, 32),
(7, 1), (7, 11), (7, 32);

-----------------------------------------------------------
-- 5. WORD 테이블 (모두 2개의 에피소드 -> 최소 8개의 단어 필요)
-----------------------------------------------------------
INSERT INTO WORD (level, word, meaning) VALUES
(1, '그림', '선이나 색채를 써서 사물의 형상이나 이미지를 평면 위에 나타낸 것.\n아름다운 경치를 비유적으로 이르는 말.'),
(1, '그만', '그 정도까지.\n그대로 곧.\n자신도 모르는 사이에.'),
(1, '글씨', '쓴 글자의 모양.'),
(1, '글자', '말을 적는 일정한 체계의 부호.'),
(1, '금요일', '월요일을 기준으로 한 주의 다섯째 날.'),
(1, '기다리다', '어떤 사람이나 때가 오기를 바라다.'),
(1, '기린', '린과의 포유류. 키는 6미터 정도로 포유류 가운데 가장 크며, 목과 다리가 특히 길다.\n초원에서 먹이를 찾는다.'),
(1, '기차', '여객차나 화차를 끌고 다니는 철도 차량.\n기차역에서 출발하여 여러 역을 거치는 이동 수단.'),
(2, '금요일2', '월요일을 기준으로 한 주의 다섯째 날.'),
(2, '기다리다2', '어떤 사람이나 때가 오기를 바라다.'),
(2, '기린2', '린과의 포유류. 키는 6미터 정도로 포유류 가운데 가장 크며, 목과 다리가 특히 길다.\n초원에서 먹이를 찾는다.'),
(2, '기차2', '여객차나 화차를 끌고 다니는 철도 차량.\n기차역에서 출발하여 여러 역을 거치는 이동 수단.');

-----------------------------------------------------------
-- 6. WORD_EXAMPLE 테이블 (예문)
-----------------------------------------------------------
INSERT INTO WORD_EXAMPLE (example, word_id) VALUES
-- 레벨 1 예문 / 단어 8개에 대한 예문 2
('나는 색연필로 *그림*을 그렸다.', 1),
('벽에 예쁜 *그림*이 걸려 있어.', 1),

('이제 *그만* 싸우자!', 2),
('장난은 *그만*하세요.', 2),

('*글씨*를 또박또박 쓰세요.', 3),
('내 이름을 *글씨*로 써 보세요.', 3),

('한글은 소중한 *글자*예요.', 4),
('*글자*를 바르게 배워야 해.', 4),

('*금요일*에는 학교에서 특별한 활동이 있어요.', 5),
('*금요일*에는 아빠와 놀러가요.', 5),

('*기다리다* 지쳐서 집에 갔어요.', 6),
('왕자는 공주를 *기다렸어요*.', 6),

('동물원에서 *기린*을 봤어요.', 7),
('*기린*은 목이 길어요.', 7),

('어린이들은 *기차*를 좋아해요.', 8),
('*기차*가 지나가요.', 8);


-----------------------------------------------------------
-- 7. MY_WORD 테이블 (사용자별 학습 단어)
-----------------------------------------------------------
INSERT INTO MY_WORD (member_id, word_id, is_deleted, fail_count, created_at, modified_at) VALUES
(3, 1, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 2, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 3, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-----------------------------------------------------------
-- 8. PARTY_MEMBER 테이블 (파티 참여 회원)
-- INSERT INTO PARTY_MEMBER (member_id, party_id, created_at, modified_at) VALUES (1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-----------------------------------------------------------
-- [BEFORE] 파티 (파티 1 ~ 3: 2명씩)
INSERT INTO PARTY_MEMBER (member_id, party_id, created_at, modified_at) VALUES

(3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- [ING] 파티 (파티 4(학생 : 3,4,5,6) ~ 5(학생 : 7,8,9,10): 각 4명)
INSERT INTO PARTY_MEMBER (member_id, party_id, created_at, modified_at) VALUES
(3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- [DONE] 파티 (파티6(학생 : 3,4,5,6) ~ 7(학생 : 7,8,9,10): 각 4명)
INSERT INTO PARTY_MEMBER (member_id, party_id, created_at, modified_at) VALUES
(3, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-----------------------------------------------------------
-- 9. SCHEDULE 테이블
-----------------------------------------------------------
-- [BEFORE] 파티 1-3: 에피소드 수 10개
INSERT INTO SCHEDULE (party_id, session_time, day_week, episode_number, status) VALUES
(1, '2025-02-12 08:00:00', 'THURSDAY', 1, 'BEFORE'),
(1, '2025-02-20 08:00:00', 'THURSDAY', 2, 'BEFORE'),
(2, '2025-02-13 08:00:00', 'THURSDAY', 1, 'BEFORE'),
(2, '2025-02-20 08:00:00', 'THURSDAY', 2, 'BEFORE'),
(3, '2025-02-13 08:00:00', 'THURSDAY', 1, 'BEFORE'),
(3, '2025-02-20 08:00:00', 'THURSDAY', 2, 'BEFORE');


-- [ING] 파티 4-5: 에피소드 1만 DONE / 2는 BEFORE
INSERT INTO SCHEDULE (party_id, session_time, day_week, episode_number, status) VALUES
(4, '2025-02-06 08:00:00', 'THURSDAY', 1, 'DONE'),
(4, '2025-02-13 08:00:00', 'THURSDAY', 2, 'BEFORE'),
(5, '2025-02-06 08:00:00', 'THURSDAY', 1, 'DONE'),
(5, '2025-02-13 08:00:00', 'THURSDAY', 2, 'BEFORE');

-- [DONE] 파티 6-7 : 두개의 에피소드 모두 완료.
INSERT INTO SCHEDULE (party_id, session_time, day_week, episode_number, status) VALUES
(6, '2025-01-30 08:00:00', 'THURSDAY', 1, 'DONE'),
(6, '2025-02-06 08:00:00', 'THURSDAY', 2, 'DONE'),
(7, '2025-01-30 08:00:00', 'THURSDAY', 1, 'DONE'),
(7, '2025-02-06 08:00:00', 'THURSDAY', 2, 'DONE');

-----------------------------------------------------------
-- 10. CUT 테이블 (예시: ING 파티 6에 대해 10개의 컷)
-----------------------------------------------------------
-- (BEFORE) 파티 1-3 : 담당자=NULL / image_url = NULL
INSERT INTO CUT (member_id, image_url, content, cut_order, word_id, party_id, random_order, created_at, modified_at) VALUES
(NULL, NULL,  '파티1/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.  ',   4, 4, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티1/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',   8, 8, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(NULL, NULL,  '파티2/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.',   4, 4, 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 2, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티2/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',   8, 8, 2, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(NULL, NULL,  '파티3/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.',   4, 4, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 3, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 3, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(NULL, NULL,  '파티3/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',   8, 8, 3, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- (ING) 파티 4(3,4,5,6 학생)-5(7,8,9,10) : 담당자=NULL / image_url = NULL
INSERT INTO CUT (member_id, image_url, content, cut_order, word_id, party_id, random_order, created_at, modified_at) VALUES
-- 피티 4 : 진행 완료
(3, '그림완성.jpg',  '파티4/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '그림완성.jpg',  '파티4/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '그림완성.jpg',  '파티4/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, '그림완성.jpg',  '파티4/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.',   4, 4, 4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 진행 전
(3, NULL,  '파티4/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 4, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, NULL,  '파티4/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 4, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, NULL,  '파티4/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 4, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, NULL,  '파티4/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',  8, 8, 4, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 파티 5 : 진행 완료
(7, '그림완성.jpg',  '파티5/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, '그림완성.jpg',  '파티5/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, '그림완성.jpg',  '파티5/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, '그림완성.jpg',  '파티5/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.',   4, 4, 5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
-- 진행 전
(7, NULL,  '파티5/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 5, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, NULL,  '파티5/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 5, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, NULL,  '파티5/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 5, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, NULL,  '파티5/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',   8, 8, 5, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--   (DONE) 파티 6-7
INSERT INTO CUT (member_id, image_url, content, cut_order, word_id, party_id, random_order, created_at, modified_at) VALUES
-- 진행 완료
(3, '그림완성.jpg',  '파티6/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '그림완성.jpg',  '파티6/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '그림완성.jpg',  '파티6/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 6, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, '그림완성.jpg',  '파티6/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.',   4, 4, 6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '그림완성.jpg',  '파티6/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 6, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '그림완성.jpg',  '파티6/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 6, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '그림완성.jpg',  '파티6/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 6, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, '그림완성.jpg',  '파티6/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',   8, 8, 6, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, '그림완성.jpg',  '파티7/ep1 : 옛날 어느 조용한 마을에, 하늘과 숲, 동물들을 담은 멋진 **그림**을 그리는 소녀가 살고 있었어요.',   1, 1, 7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, '그림완성.jpg',  '파티7/ep1 : 하지만 소녀는 너무 몰입한 나머지, 어머니가 “**그만**” 하라고 부르자도 손을 멈추지 못했답니다.',   2, 2, 7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, '그림완성.jpg',  '파티7/ep1 : 한참을 **글씨**에 빠져 있던 소녀는 잠시 쉬며, 오래된 동화책 속에 적힌 아름다운 **글씨**에 눈길을 돌렸어요.',   3, 3, 7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, '그림완성.jpg',  '파티7/ep1 : 그 책의 한 페이지에서 반짝이는 한 **글자**가 마치 살아 있는 듯 소녀에게 비밀을 속삭이는 것 같았어요.',   4, 4, 7, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, '그림완성.jpg',  '파티7/ep2 : 그날은 특별히 **금요일**이어서, 마을에서는 축제 준비로 분주했고 소녀의 마음에도 모험의 설렘이 넘쳤어요.',   5, 5, 7, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, '그림완성.jpg',  '파티7/ep2 : 소녀는 모험의 시작을 알리는 약속 장소에서 오랫동안 **기다리다** 보니, 두근거리는 마음을 감출 수 없었어요.',   6, 6, 7, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, '그림완성.jpg',  '파티7/ep2 : 그러던 중, 숲 가장자리에서 우아하게 걸어오는 한 **기린**이 나타나 소녀의 눈을 반짝이게 했답니다.',   7, 7, 7, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, '그림완성.jpg',  '파티7/ep2 : 마침내, 소녀는 신비로운 여행을 마치고 반짝이는 **기차**에 올라타며 집으로 돌아가는 새로운 꿈을 꾸기 시작했어요.',   8, 8, 7, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
