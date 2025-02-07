-- KEYWORD 테이블에 데이터 입력 완료
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


-- MEMBER 테이블에 더미 데이터 추가
-- 부모 (MANAGER) 데이터 추가
INSERT INTO MEMBER (id, manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(1, NULL, 'MANAGER', '황미정', 'hwangmj', '미정', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, NULL, 'MANAGER', '김아빠', 'kimdad', '아빠', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 황미정의 자녀 (CHILD) 데이터 추가
INSERT INTO MEMBER (id, manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(3, 1, 'CHILD', '배현수', 'baehs', '현수', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'CHILD', '배현지', 'baehj1', '현지', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 1, 'CHILD', '배현우', 'baehw', '현우', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 1, 'CHILD', '배현아', 'baehya', '현아', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 1, 'CHILD', '배익명', 'unknown', '익멍멍', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 김아빠의 자녀 (CHILD) 데이터 추가
INSERT INTO MEMBER (id, manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(8, 2, 'CHILD', '김일일', 'kim11', '일일', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 2, 'CHILD', '김이이', 'kim22', '이이', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 2, 'CHILD', '김삼삼', 'kim33', '삼삼', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 2, 'CHILD', '김넷넷', 'kim44', '넷넷', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 2, 'CHILD', '김오오', 'kim55', '오오', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);



-- PARTY 테이블에 더미 데이터 추가
INSERT INTO PARTY (introduction, pin_number, book_cover, book_title, level, episode_count, progress_count, status, start_date, is_public, end_date, created_at, modified_at) VALUES

-- 📌 시작일이 미래인 파티 (현재 기준으로 아직 시작 전)
('미래 모험의 시작, 용감한 기사 이야기', '1001', 'https://s3.example.com/covers/knight_adventure.jpg', '용감한 기사', 1, 12, 0, 'BEFORE', '2025-12-01 08:00:00', 1, '2026-01-15 23:59:59', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('마법사들의 비밀과 예언', '1002', 'https://s3.example.com/covers/wizard_secret.jpg', '마법사들의 예언', 2, 15, 0, 'BEFORE', '2025-12-10 14:30:00', 1, '2026-01-30 18:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('전설의 바다 괴물과 해적', '1003', 'https://s3.example.com/covers/sea_monster.jpg', '바다의 전설', 3, 18, 0, 'BEFORE', '2026-01-01 09:00:00', 0, '2026-02-10 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('우주 탐험대의 신비한 여정', '1004', 'https://s3.example.com/covers/space_exploration.jpg', '우주 탐험대', 4, 20, 0, 'BEFORE', '2026-02-01 10:30:00', 1, '2026-03-05 22:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('고대 왕국의 잃어버린 보물', '1005', 'https://s3.example.com/covers/ancient_kingdom.jpg', '고대 왕국의 보물', 5, 16, 0, 'BEFORE', '2026-03-01 07:45:00', 1, '2026-04-10 21:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 📌 현재 진행 중인 파티 (시작일이 현재보다 과거, 종료일이 미래)
('현재 진행 중! 공주의 용감한 모험', '2001', 'https://s3.example.com/covers/brave_princess.jpg', '용감한 공주', 1, 10, 5, 'ING', '2024-12-01 08:00:00', 1, '2025-12-30 23:59:59', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('요정의 숲을 지키는 전설', '2002', 'https://s3.example.com/covers/fairy_forest.jpg', '요정의 숲', 2, 14, 7, 'ING', '2025-01-10 14:30:00', 1, '2025-12-25 18:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('전사와 드래곤의 대결', '2003', 'https://s3.example.com/covers/warrior_dragon.jpg', '전사와 드래곤', 3, 16, 6, 'ING', '2024-10-01 09:00:00', 0, '2025-10-20 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('로봇들의 미래 전쟁', '2004', 'https://s3.example.com/covers/robot_war.jpg', '로봇 전쟁', 4, 22, 9, 'ING', '2024-11-01 10:30:00', 1, '2025-11-15 22:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('비밀 요원의 모험', '2005', 'https://s3.example.com/covers/secret_agent.jpg', '비밀 요원', 5, 18, 8, 'ING', '2024-09-01 07:45:00', 1, '2025-09-30 21:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 📌 종료된 파티 (종료일이 현재보다 과거)
('완료! 전설의 마법서 찾기', '3001', 'https://s3.example.com/covers/legendary_spellbook.jpg', '전설의 마법서', 1, 12, 12, 'DONE', '2023-01-01 08:00:00', 1, '2023-12-30 23:59:59', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('완료! 중세 왕국의 모험', '3002', 'https://s3.example.com/covers/medieval_kingdom.jpg', '중세 왕국', 2, 14, 14, 'DONE', '2023-03-10 14:30:00', 1, '2023-11-25 18:45:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('완료! 공룡 시대를 탐험하다', '3003', 'https://s3.example.com/covers/dinosaur_exploration.jpg', '공룡 탐험', 3, 16, 16, 'DONE', '2022-10-01 09:00:00', 0, '2023-07-20 20:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('완료! 신화 속 신들의 전쟁', '3004', 'https://s3.example.com/covers/god_war.jpg', '신들의 전쟁', 4, 22, 22, 'DONE', '2021-11-01 10:30:00', 1, '2022-10-15 22:30:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('완료! 영웅의 대서사시', '3005', 'https://s3.example.com/covers/hero_epic.jpg', '영웅의 대서사', 5, 18, 18, 'DONE', '2020-09-01 07:45:00', 1, '2021-09-30 21:15:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- PARTY_KEYWORD 테이블에 더미 데이터 추가
-- 위 파티 1개 당 키워드 3개(분위기, 장르, 테마)의 키워드_ID 할당
INSERT INTO PARTY_KEYWORD (party_id, keyword) VALUES
-- 시작일이 미래인 파티 (BEFORE)
(1, '신비로운'), (1, '모험'), (1, '용기'),
(2, '호기심'), (2, '판타지'), (2, '마법'),
(3, '놀라운'), (3, '모험'), (3, '바다'),
(4, '유쾌한'), (4, '신화'), (4, '우주'),
(5, '평화로운'), (5, '역사'), (5, '중세'),

-- 현재 진행 중인 파티 (ING)
(6, '모험적인'), (6, '모험'), (6, '공주/왕자'),
(7, '따뜻한'), (7, '판타지'), (7, '요정'),
(8, '시끌벅적'), (8, '액션'), (8, '용기'),
(9, '신비로운'), (9, '로맨스'), (9, '로봇'),
(10, '호기심'), (10, '드라마'), (10, '역할극'),

-- 종료된 파티 (DONE)
(11, '놀라운'), (11, '신화'), (11, '마법'),
(12, '유쾌한'), (12, '역사'), (12, '중세'),
(13, '모험적인'), (13, '모험'), (13, '공룡'),
(14, '따뜻한'), (14, '판타지'), (14, '하늘'),
(15, '평화로운'), (15, '일상'), (15, '동물');

-- WORD 테이블에 더미 데이터 추가
INSERT INTO WORD (id, level, word, meaning) VALUES
(1, 1, '그림', '선이나 색채를 써서 사물의 형상이나 이미지를 평면 위에 나타낸 것.\n아름다운 경치를 비유적으로 이르는 말.'),
(2, 1, '그만', '그 정도까지.\n그대로 곧.\n자신도 모르는 사이에.'),
(3, 1, '글씨', '쓴 글자의 모양.'),
(4, 1, '글자', '말을 적는 일정한 체계의 부호.'),
(5, 2, '그림22', '선이나 색채를 써서 사물의 형상이나 이미지를 평면 위에 나타낸 것.\n아름다운 경치를 비유적으로 이르는 말.22'),
(6, 2, '그만22', '그 정도까지.\n그대로 곧.\n자신도 모르는 사이에.22'),
(7, 2, '글씨22', '쓴 글자의 모양.22'),
(8, 2, '글자22', '말을 적는 일정한 체계의 부호.22');

-- WORD_EXAMPLE 테이블에 더미 데이터 추가
INSERT INTO WORD_EXAMPLE (id, example, word_id) VALUES
(1, '나는 색연필로 *그림*을 그렸다.', 1),
(2, '벽에 예쁜 *그림*이 걸려 있어.', 1),
(3, '이제 *그만* 싸우자!', 2),
(4, '장난은 *그만*하세요.', 2),
(5, '*글씨*를 또박또박 쓰세요.', 3),
(6, '내 이름을 *글씨*로 써 보세요.', 3),
(7, '한글은 소중한 *글자*예요.', 4),
(8, '*글자*를 바르게 배워야 해.', 4),
(9, '나는 색연필로 *그림*을 그렸다.22', 5),
(10, '벽에 예쁜 *그림*이 걸려 있어.22', 5),
(11, '이제 *그만* 싸우자!22', 6),
(12, '장난은 *그만*하세요.22', 6),
(13, '*글씨*를 또박또박 쓰세요.22', 7),
(14, '내 이름을 *글씨*로 써 보세요.22', 7),
(15, '한글은 소중한 *글자*예요.22', 8),
(16, '*글자*를 바르게 배워야 해.22', 8);

-- MY_WORD 테이블에 더미 데이터 추가
INSERT INTO MY_WORD (member_id, word_id, is_deleted, fail_count, created_at, modified_at) VALUES
(2, 1, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, false, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- PARTY_MEMBER 테이블에 더미 데이터 추가
INSERT INTO PARTY_MEMBER (member_id, party_id, created_at, modified_at) VALUES
(2, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- SCHEDULE 테이블에 더미 데이터 추가
INSERT INTO SCHEDULE (party_id, session_time, day_week, episode_number, status) VALUES
(1, '2025-02-01 12:00:00', 'MONDAY', 1, 'DONE'),
(1, '2025-02-03 12:00:00', 'WEDNESDAY', 2, 'DONE'),
(1, '2025-02-05 12:00:00', 'MONDAY', 3, 'DONE'),
(1, '2025-02-07 12:00:00', 'WEDNESDAY', 4, 'DONE'),
(1, '2025-02-09 12:00:00', 'MONDAY', 5, 'DONE'),
(1, '2025-02-11 12:00:00', 'WEDNESDAY', 6, 'DONE'),
(1, '2025-02-13 12:00:00', 'MONDAY', 7, 'DONE'),
(1, '2025-02-15 12:00:00', 'WEDNESDAY', 8, 'DONE'),
(1, '2025-02-17 12:00:00', 'MONDAY', 9, 'DONE'),
(1, '2025-02-19 12:00:00', 'WEDNESDAY', 10, 'DONE'),
(1, '2025-02-21 12:00:00', 'MONDAY', 11, 'DONE'),
(1, '2025-02-23 12:00:00', 'WEDNESDAY', 12, 'DONE'),
(1, '2025-02-25 12:00:00', 'MONDAY', 13, 'DONE'),
(1, '2025-02-27 12:00:00', 'WEDNESDAY', 14, 'DONE'),
(1, '2025-03-01 12:00:00', 'MONDAY', 15, 'DONE'),
(1, '2025-03-03 12:00:00', 'WEDNESDAY', 16, 'DONE'),
(1, '2025-03-05 12:00:00', 'MONDAY', 17, 'DONE'),
(1, '2025-03-07 12:00:00', 'WEDNESDAY', 18, 'DONE'),
(1, '2025-03-09 12:00:00', 'MONDAY', 19, 'DONE'),
(1, '2025-03-11 12:00:00', 'WEDNESDAY', 20, 'DONE'),
(1, '2025-03-13 12:00:00', 'MONDAY', 21, 'DONE'),
(1, '2025-03-15 12:00:00', 'WEDNESDAY', 22, 'DONE'),
(1, '2025-03-17 12:00:00', 'MONDAY', 23, 'DONE'),
(1, '2025-03-19 12:00:00', 'WEDNESDAY', 24, 'DONE'),
(1, '2025-03-21 12:00:00', 'MONDAY', 25, 'DONE'),
(1, '2025-03-23 12:00:00', 'WEDNESDAY', 26, 'DONE'),
(1, '2025-03-25 12:00:00', 'MONDAY', 27, 'DONE'),
(1, '2025-03-27 12:00:00', 'WEDNESDAY', 28, 'DONE'),
(1, '2025-03-29 12:00:00', 'MONDAY', 29, 'DONE'),
(1, '2025-03-31 12:00:00', 'WEDNESDAY', 30, 'DONE'),
(1, '2025-04-02 12:00:00', 'MONDAY', 31, 'DONE'),
(1, '2025-04-04 12:00:00', 'WEDNESDAY', 32, 'DONE'),
(1, '2025-04-06 12:00:00', 'MONDAY', 33, 'DONE'),
(1, '2025-04-08 12:00:00', 'WEDNESDAY', 34, 'DONE'),
(1, '2025-04-10 12:00:00', 'MONDAY', 35, 'DONE'),
(1, '2025-04-12 12:00:00', 'WEDNESDAY', 36, 'DONE'),
(1, '2025-04-14 12:00:00', 'MONDAY', 37, 'DONE'),
(1, '2025-04-16 12:00:00', 'WEDNESDAY', 38, 'DONE'),
(1, '2025-04-18 12:00:00', 'MONDAY', 39, 'DONE'),
(1, '2025-04-20 12:00:00', 'WEDNESDAY', 40, 'DONE'),
(1, '2025-04-22 12:00:00', 'MONDAY', 41, 'DONE'),
(1, '2025-04-24 12:00:00', 'WEDNESDAY', 42, 'DONE'),
(1, '2025-04-26 12:00:00', 'MONDAY', 43, 'DONE'),
(1, '2025-04-28 12:00:00', 'WEDNESDAY', 44, 'DONE'),
(1, '2025-04-30 12:00:00', 'MONDAY', 45, 'DONE'),
(1, '2025-05-02 12:00:00', 'WEDNESDAY', 46, 'DONE'),
(1, '2025-05-04 12:00:00', 'MONDAY', 47, 'DONE'),
(1, '2025-05-06 12:00:00', 'WEDNESDAY', 48, 'DONE'),
(1, '2025-05-08 12:00:00', 'MONDAY', 49, 'DONE'),
(1, '2025-05-10 12:00:00', 'WEDNESDAY', 50, 'DONE'),
(1, '2025-05-12 12:00:00', 'MONDAY', 51, 'DONE'),
(1, '2025-05-14 12:00:00', 'WEDNESDAY', 52, 'DONE'),
(1, '2025-05-16 12:00:00', 'MONDAY', 53, 'DONE'),
(1, '2025-05-18 12:00:00', 'WEDNESDAY', 54, 'DONE'),
(1, '2025-05-20 12:00:00', 'MONDAY', 55, 'DONE'),
(1, '2025-05-22 12:00:00', 'WEDNESDAY', 56, 'DONE'),
(1, '2025-05-24 12:00:00', 'MONDAY', 57, 'DONE'),
(1, '2025-05-26 12:00:00', 'WEDNESDAY', 58, 'DONE'),
(1, '2025-05-28 12:00:00', 'MONDAY', 59, 'DONE'),
(1, '2025-05-30 12:00:00', 'WEDNESDAY', 60, 'DONE'),
(1, '2025-06-01 12:00:00', 'MONDAY', 61, 'DONE'),
(1, '2025-06-03 12:00:00', 'WEDNESDAY', 62, 'DONE'),
(1, '2025-06-05 12:00:00', 'MONDAY', 63, 'DONE'),
(1, '2025-06-07 12:00:00', 'WEDNESDAY', 64, 'DONE'),
(1, '2025-06-09 12:00:00', 'MONDAY', 65, 'DONE'),
(1, '2025-06-11 12:00:00', 'WEDNESDAY', 66, 'DONE'),
(1, '2025-06-13 12:00:00', 'MONDAY', 67, 'DONE'),
(1, '2025-06-15 12:00:00', 'WEDNESDAY', 68, 'DONE'),
(1, '2025-06-17 12:00:00', 'MONDAY', 69, 'DONE'),
(1, '2025-06-19 12:00:00', 'WEDNESDAY', 70, 'DONE'),
(1, '2025-06-21 12:00:00', 'MONDAY', 71, 'DONE'),
(1, '2025-06-23 12:00:00', 'WEDNESDAY', 72, 'DONE'),
(1, '2025-06-25 12:00:00', 'MONDAY', 73, 'DONE'),
(1, '2025-06-27 12:00:00', 'WEDNESDAY', 74, 'DONE'),
(1, '2025-06-29 12:00:00', 'MONDAY', 75, 'DONE'),
(1, '2025-07-01 12:00:00', 'WEDNESDAY', 76, 'DONE'),
(1, '2025-07-03 12:00:00', 'MONDAY', 77, 'DONE'),
(1, '2025-07-05 12:00:00', 'WEDNESDAY', 78, 'DONE');

-- CUT 테이블에 더미 데이터 추가 (created_at, modified_at 포함)
INSERT INTO CUT (member_id, image_url, content, cut_order, word_id, party_id, random_order, created_at, modified_at) VALUES
(1,'cut1.jpg', '첫 번째 컷 내용입니다.', 1, 1, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2,'cut2.jpg', '두 번째 컷 내용입니다.', 2, 2, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3,'cut3.jpg', '세 번째 컷 내용입니다.', 3, 3, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4,'cut3.jpg', '네 번째 컷 내용입니다.', 4, 4, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1,'cut1.jpg', '첫 번째 컷 내용입니다.2', 5, 2, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3,'cut2.jpg', '두 번째 컷 내용입니다.2', 6, 3, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2,'cut3.jpg', '세 번째 컷 내용입니다.2', 7, 4, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4,'cut3.jpg', '네 번째 컷 내용입니다.2', 8, 1, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2,'cut1.jpg', '첫 번째 컷 내용입니다.3', 9, 3, 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1,'cut2.jpg', '두 번째 컷 내용입니다.3', 10, 4, 1, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3,'cut3.jpg', '세 번째 컷 내용입니다.3', 11, 1, 1, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4,'cut3.jpg', '네 번째 컷 내용입니다.3', 12, 2, 1, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
