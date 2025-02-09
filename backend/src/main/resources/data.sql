-- KEYWORD 테이블에 더미 데이터 추가
INSERT INTO `KEYWORD` (`keyword`, `option`) VALUES
    ('행복', 'MOOD'),
    ('슬픔', 'MOOD'),
    ('로맨틱', 'GENRE'),
    ('액션', 'GENRE'),
    ('모험', 'THEME'),
    ('코미디', 'GENRE'),
    ('공포', 'GENRE');

-- MEMBER 테이블에 더미 데이터 추가
INSERT INTO MEMBER ( manager_id, role, name, login_id, nickname, password, status, created_at, modified_at) VALUES
(null, 'MANAGER', '존 도우', 'johndoe', 'johnny', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'CHILD', '제인 스미스', 'janesmith', 'jane', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
( 1, 'CHILD', '마이크 존슨', 'mikej', 'mike', 'password123', 'INACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(null, 'MANAGER', '앨리스 쿠퍼', 'alicecooper', 'alice', 'password123', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- PARTY 테이블에 더미 데이터 추가
INSERT INTO PARTY (introduction, pin_number, book_cover, book_title, level, episode_count, progress_count, status, start_date, is_public, end_date, created_at, modified_at) VALUES
('이것은 샘플 파티입니다', '1234', 'cover_url_1.jpg', '책 1', 1, 10, 1, 'BEFORE', '2025-02-01', 1, '2025-03-15', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('또 다른 흥미진진한 파티', '5678', 'cover_url_2.jpg', '책 2', 2, 15, 1, 'BEFORE', '2025-03-01', 1, '2025-04-10', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('최종 파티', '9012', 'cover_url_3.jpg', '책 3', 3, 20, 1, 'BEFORE', '2025-04-01', 0, '2025-04-30', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- PARTY_KEYWORD 테이블에 더미 데이터 추가
INSERT INTO PARTY_KEYWORD (party_id, keyword_id) VALUES
(1, 1), -- '행복' 키워드를 파티 1에
(2, 2), -- '슬픔' 키워드를 파티 2에
(3, 3); -- '로맨틱' 키워드를 파티 3에

-- WORD 테이블에 더미 데이터 추가
INSERT INTO WORD (level, word, meaning) VALUES
(1, '그림', '선이나 색채를 써서 사물의 형상이나 이미지를 평면 위에 나타낸 것.\n아름다운 경치를 비유적으로 이르는 말.'),
(1, '그만', '그 정도까지.\n그대로 곧.\n자신도 모르는 사이에.'),
(1, '글씨', '쓴 글자의 모양.'),
(1, '글자', '말을 적는 일정한 체계의 부호.'),
(2, '그림22', '선이나 색채를 써서 사물의 형상이나 이미지를 평면 위에 나타낸 것.\n아름다운 경치를 비유적으로 이르는 말.22'),
(2, '그만22', '그 정도까지.\n그대로 곧.\n자신도 모르는 사이에.22'),
(2, '글씨22', '쓴 글자의 모양.22'),
(2, '글자22', '말을 적는 일정한 체계의 부호.22');

-- WORD_EXAMPLE 테이블에 더미 데이터 추가
INSERT INTO WORD_EXAMPLE (example, word_id) VALUES
('나는 색연필로 *그림*을 그렸다.', 1),
('벽에 예쁜 *그림*이 걸려 있어.', 1),
('이제 *그만* 싸우자!', 2),
('장난은 *그만*하세요.', 2),
('*글씨*를 또박또박 쓰세요.', 3),
('내 이름을 *글씨*로 써 보세요.', 3),
('한글은 소중한 *글자*예요.', 4),
('*글자*를 바르게 배워야 해.', 4),
('나는 색연필로 *그림*을 그렸다.22', 5),
('벽에 예쁜 *그림*이 걸려 있어.22', 5),
('이제 *그만* 싸우자!22', 6),
('장난은 *그만*하세요.22', 6),
('*글씨*를 또박또박 쓰세요.22', 7),
('내 이름을 *글씨*로 써 보세요.22', 7),
('한글은 소중한 *글자*예요.22', 8),
('*글자*를 바르게 배워야 해.22', 8);

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
(2, '2025-02-09 12:00:00', 'MONDAY', 1, 'ONGOING'),
(2, '2025-03-05 12:00:00', 'WEDNESDAY', 2, 'BEFORE'),
(2, '2025-03-10 12:00:00', 'MONDAY', 3, 'BEFORE'),
(2, '2025-03-12 12:00:00', 'WEDNESDAY', 4, 'BEFORE'),
(2, '2025-03-17 12:00:00', 'MONDAY', 5, 'BEFORE');

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
