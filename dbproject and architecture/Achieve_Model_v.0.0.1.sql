-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2015-08-07 07:21:28.293




-- tables
-- Table achievements
CREATE TABLE achievements (
    id int    NOT NULL  AUTO_INCREMENT,
    achv_types_id int    NOT NULL ,
    categories_id int    NOT NULL ,
    tasks_id int    NOT NULL ,
    alias varchar(64)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    color varchar(7)    NULL ,
    bg_color varchar(7)    NULL ,
    image varchar(256)    NULL ,
    user_defined bool    NOT NULL ,
    users_id int    NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT achievements_pk PRIMARY KEY (id)
);

-- Table achievements_lang
CREATE TABLE achievements_lang (
    id int    NOT NULL  AUTO_INCREMENT,
    achievements_id int    NOT NULL ,
    locale varchar(5)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT achievements_lang_pk PRIMARY KEY (id)
);

-- Table achv_levels
CREATE TABLE achv_levels (
    id int    NOT NULL  AUTO_INCREMENT,
    achievements_id int    NOT NULL ,
    repetition int    NOT NULL ,
    timeframe int    NOT NULL ,
    alias varchar(64)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    image varchar(256)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT achv_levels_pk PRIMARY KEY (id)
);

-- Table achv_levels_lang
CREATE TABLE achv_levels_lang (
    id int    NOT NULL  AUTO_INCREMENT,
    achv_levels_id int    NOT NULL ,
    locale varchar(5)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT achv_levels_lang_pk PRIMARY KEY (id)
);

-- Table achv_types
CREATE TABLE achv_types (
    id int    NOT NULL  AUTO_INCREMENT,
    alias varchar(64)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT achv_types_pk PRIMARY KEY (id)
);

-- Table achv_types_lang
CREATE TABLE achv_types_lang (
    id int    NOT NULL  AUTO_INCREMENT,
    achv_types_id int    NOT NULL ,
    locale varchar(5)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT achv_types_lang_pk PRIMARY KEY (id)
);

-- Table categories
CREATE TABLE categories (
    id int    NOT NULL  AUTO_INCREMENT,
    parent_id int    NULL ,
    alias varchar(64)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    color varchar(7)    NOT NULL ,
    bg_color varchar(7)    NOT NULL ,
    image varchar(256)    NOT NULL ,
    user_defined bool    NOT NULL ,
    users_id int    NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT categories_pk PRIMARY KEY (id)
);

-- Table categories_lang
CREATE TABLE categories_lang (
    id int    NOT NULL  AUTO_INCREMENT,
    categories_id int    NOT NULL ,
    locale varchar(5)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT categories_lang_pk PRIMARY KEY (id)
);

-- Table favourites
CREATE TABLE favourites (
    id int    NOT NULL  AUTO_INCREMENT,
    users_id int    NOT NULL ,
    achievements_id int    NULL ,
    tasks_id int    NULL ,
    CONSTRAINT favourites_pk PRIMARY KEY (id)
);

-- Table history
CREATE TABLE history (
    id int    NOT NULL  AUTO_INCREMENT,
    users_id int    NOT NULL ,
    tasks_id int    NOT NULL ,
    date timestamp    NOT NULL  ON UPDATE CURRENT_TIMESTAMP ,
    CONSTRAINT history_pk PRIMARY KEY (id)
);

-- Table route_access
CREATE TABLE route_access (
    id int    NOT NULL  AUTO_INCREMENT,
    route varchar(128)    NOT NULL ,
    user_groups_id int    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT route_access_pk PRIMARY KEY (id)
);

-- Table tasks
CREATE TABLE tasks (
    id int    NOT NULL  AUTO_INCREMENT,
    categories_id int    NOT NULL ,
    alias varchar(64)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    color varchar(7)    NOT NULL ,
    bg_color varchar(7)    NOT NULL ,
    image varchar(256)    NOT NULL ,
    user_defined bool    NOT NULL ,
    users_id int    NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT tasks_pk PRIMARY KEY (id)
);

-- Table tasks_lang
CREATE TABLE tasks_lang (
    id int    NOT NULL  AUTO_INCREMENT,
    tasks_id int    NOT NULL ,
    locale varchar(5)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT tasks_lang_pk PRIMARY KEY (id)
);

-- Table user_achievements
CREATE TABLE user_achievements (
    id int    NOT NULL  AUTO_INCREMENT,
    users_id int    NOT NULL ,
    achievements_id int    NOT NULL ,
    achv_levels_id int    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT user_achievements_pk PRIMARY KEY (id)
);

-- Table user_groups
CREATE TABLE user_groups (
    id int    NOT NULL  AUTO_INCREMENT,
    alias varchar(64)    NOT NULL ,
    title varchar(128)    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT user_groups_pk PRIMARY KEY (id)
);

-- Table users
CREATE TABLE users (
    id int    NOT NULL  AUTO_INCREMENT,
    email varchar(128)    NOT NULL ,
    name varchar(128)    NOT NULL ,
    password varchar(256)    NOT NULL ,
    last_login timestamp    NOT NULL ,
    last_login_from varchar(15)    NOT NULL ,
    user_groups_id int    NOT NULL ,
    created_at timestamp    NOT NULL ,
    updated_at timestamp    NOT NULL ,
    CONSTRAINT users_pk PRIMARY KEY (id)
);





-- foreign keys
-- Reference:  achievements_achv_types (table: achievements)


ALTER TABLE achievements ADD CONSTRAINT achievements_achv_types FOREIGN KEY achievements_achv_types (achv_types_id)
    REFERENCES achv_types (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achievements_categories (table: achievements)


ALTER TABLE achievements ADD CONSTRAINT achievements_categories FOREIGN KEY achievements_categories (categories_id)
    REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achievements_lang_achievements (table: achievements_lang)


ALTER TABLE achievements_lang ADD CONSTRAINT achievements_lang_achievements FOREIGN KEY achievements_lang_achievements (achievements_id)
    REFERENCES achievements (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achievements_tasks (table: achievements)


ALTER TABLE achievements ADD CONSTRAINT achievements_tasks FOREIGN KEY achievements_tasks (tasks_id)
    REFERENCES tasks (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achievements_users (table: achievements)


ALTER TABLE achievements ADD CONSTRAINT achievements_users FOREIGN KEY achievements_users (users_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achv_levels_achievements (table: achv_levels)


ALTER TABLE achv_levels ADD CONSTRAINT achv_levels_achievements FOREIGN KEY achv_levels_achievements (achievements_id)
    REFERENCES achievements (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achv_levels_lang_achv_levels (table: achv_levels_lang)


ALTER TABLE achv_levels_lang ADD CONSTRAINT achv_levels_lang_achv_levels FOREIGN KEY achv_levels_lang_achv_levels (achv_levels_id)
    REFERENCES achv_levels (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  achv_types_lang_achv_types (table: achv_types_lang)


ALTER TABLE achv_types_lang ADD CONSTRAINT achv_types_lang_achv_types FOREIGN KEY achv_types_lang_achv_types (achv_types_id)
    REFERENCES achv_types (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  categories_categories (table: categories)


ALTER TABLE categories ADD CONSTRAINT categories_categories FOREIGN KEY categories_categories (parent_id)
    REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  categories_lang_categories (table: categories_lang)


ALTER TABLE categories_lang ADD CONSTRAINT categories_lang_categories FOREIGN KEY categories_lang_categories (categories_id)
    REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  categories_users (table: categories)


ALTER TABLE categories ADD CONSTRAINT categories_users FOREIGN KEY categories_users (users_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  favourites_achievements (table: favourites)


ALTER TABLE favourites ADD CONSTRAINT favourites_achievements FOREIGN KEY favourites_achievements (achievements_id)
    REFERENCES achievements (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  favourites_tasks (table: favourites)


ALTER TABLE favourites ADD CONSTRAINT favourites_tasks FOREIGN KEY favourites_tasks (tasks_id)
    REFERENCES tasks (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  favourites_users (table: favourites)


ALTER TABLE favourites ADD CONSTRAINT favourites_users FOREIGN KEY favourites_users (users_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  history_tasks (table: history)


ALTER TABLE history ADD CONSTRAINT history_tasks FOREIGN KEY history_tasks (tasks_id)
    REFERENCES tasks (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  history_users (table: history)


ALTER TABLE history ADD CONSTRAINT history_users FOREIGN KEY history_users (users_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  route_access_user_groups (table: route_access)


ALTER TABLE route_access ADD CONSTRAINT route_access_user_groups FOREIGN KEY route_access_user_groups (user_groups_id)
    REFERENCES user_groups (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  tasks_categories (table: tasks)


ALTER TABLE tasks ADD CONSTRAINT tasks_categories FOREIGN KEY tasks_categories (categories_id)
    REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  tasks_lang_tasks (table: tasks_lang)


ALTER TABLE tasks_lang ADD CONSTRAINT tasks_lang_tasks FOREIGN KEY tasks_lang_tasks (tasks_id)
    REFERENCES tasks (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  tasks_users (table: tasks)


ALTER TABLE tasks ADD CONSTRAINT tasks_users FOREIGN KEY tasks_users (users_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  user_achievements_achievements (table: user_achievements)


ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_achievements FOREIGN KEY user_achievements_achievements (achievements_id)
    REFERENCES achievements (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  user_achievements_achv_levels (table: user_achievements)


ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_achv_levels FOREIGN KEY user_achievements_achv_levels (achv_levels_id)
    REFERENCES achv_levels (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  user_achievements_users (table: user_achievements)


ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_users FOREIGN KEY user_achievements_users (users_id)
    REFERENCES users (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
-- Reference:  users_user_groups (table: users)


ALTER TABLE users ADD CONSTRAINT users_user_groups FOREIGN KEY users_user_groups (user_groups_id)
    REFERENCES user_groups (id)
    ON DELETE RESTRICT
    ON UPDATE RESTRICT;



-- End of file.

