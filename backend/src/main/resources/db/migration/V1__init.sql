CREATE TABLE IF NOT EXISTS cut (
    cut_order INTEGER NOT NULL,
    random_order INTEGER NOT NULL,
    created_at DATETIME(6) NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT,
    modified_at DATETIME(6) NOT NULL,
    party_id BIGINT NOT NULL,
    word_id BIGINT NOT NULL,
    content VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS keyword (
    id BIGINT NOT NULL AUTO_INCREMENT,
    keyword VARCHAR(255) NOT NULL,
    type ENUM ('GENRE','MOOD','THEME') NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS member (
    created_at DATETIME(6) NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    manager_id BIGINT,
    modified_at DATETIME(6) NOT NULL,
    email VARCHAR(255),
    image_url VARCHAR(255),
    login_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM ('CHILD','MANAGER') NOT NULL,
    status ENUM ('ACTIVE','DELETED','INACTIVE') NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS my_word (
    fail_count INTEGER NOT NULL,
    is_deleted TINYINT(1) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    modified_at DATETIME(6) NOT NULL,
    word_id BIGINT NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS party (
    episode_count INTEGER NOT NULL,
    is_public TINYINT(1) NOT NULL,
    level INTEGER NOT NULL,
    progress_count INTEGER NOT NULL,
    created_at DATETIME(6) NOT NULL,
    end_date DATETIME(6),
    id BIGINT NOT NULL AUTO_INCREMENT,
    modified_at DATETIME(6) NOT NULL,
    start_date DATETIME(6) NOT NULL,
    book_cover VARCHAR(255) NOT NULL,
    book_title VARCHAR(255) NOT NULL,
    introduction VARCHAR(255) NOT NULL,
    pin_number VARCHAR(255) NOT NULL,
    status ENUM ('BEFORE','DONE','ONGOING') NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS party_keyword (
    id BIGINT NOT NULL AUTO_INCREMENT,
    keyword_id BIGINT NOT NULL,
    party_id BIGINT NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS party_member (
    created_at DATETIME(6) NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    modified_at DATETIME(6) NOT NULL,
    party_id BIGINT NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS schedule (
    episode_number INTEGER NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    party_id BIGINT NOT NULL,
    session_time DATETIME(6) NOT NULL,
    day_week ENUM ('FRIDAY','MONDAY','SATURDAY','SUNDAY','THURSDAY','TUESDAY','WEDNESDAY') NOT NULL,
    status ENUM ('BEFORE','DONE','ONGOING') NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS word (
    level INTEGER NOT NULL,
    id BIGINT NOT NULL AUTO_INCREMENT,
    meaning VARCHAR(255) NOT NULL,
    word VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;

CREATE TABLE IF NOT EXISTS word_example (
    id BIGINT NOT NULL AUTO_INCREMENT,
    word_id BIGINT NOT NULL,
    example VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) engine=InnoDB;