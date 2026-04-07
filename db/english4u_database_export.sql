-- English4U database export
-- Import this file in MySQL Workbench to create the schema and sample data.
--
-- Sample login accounts created by this file:
--   admin@english4u.local   / Admin123!
--   student@english4u.local / Student123!

DROP DATABASE IF EXISTS english4u;
CREATE DATABASE english4u CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE english4u;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(32) NOT NULL UNIQUE
);

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  published TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  code VARCHAR(12) NOT NULL,
  title VARCHAR(120) NOT NULL,
  position INT NOT NULL,
  CONSTRAINT fk_levels_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  summary TEXT,
  position INT NOT NULL,
  CONSTRAINT fk_units_level FOREIGN KEY (level_id) REFERENCES levels(id)
);

CREATE TABLE lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unit_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  lesson_type VARCHAR(32) NOT NULL,
  content_json JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  position INT NOT NULL,
  CONSTRAINT fk_lessons_unit FOREIGN KEY (unit_id) REFERENCES units(id)
);

CREATE TABLE quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  CONSTRAINT fk_quizzes_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quiz_id INT NOT NULL,
  prompt TEXT NOT NULL,
  question_type VARCHAR(32) NOT NULL,
  position INT NOT NULL,
  CONSTRAINT fk_questions_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE question_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  option_text TEXT NOT NULL,
  is_correct TINYINT(1) NOT NULL DEFAULT 0,
  CONSTRAINT fk_question_options_question FOREIGN KEY (question_id) REFERENCES questions(id)
);

CREATE TABLE placement_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  recommended_level VARCHAR(12) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_placement_attempts_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE lesson_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed_at TIMESTAMP NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  UNIQUE KEY uniq_lesson_progress (user_id, lesson_id),
  CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_lesson_progress_lesson FOREIGN KEY (lesson_id) REFERENCES lessons(id)
);

CREATE TABLE quiz_attempts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  quiz_id INT NOT NULL,
  score INT NOT NULL,
  answers_json JSON NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_quiz_attempts_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

CREATE TABLE user_streaks (
  user_id INT PRIMARY KEY,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP NULL,
  CONSTRAINT fk_user_streaks_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE study_plans (
  user_id INT PRIMARY KEY,
  sessions_per_week INT NOT NULL DEFAULT 4,
  minutes_per_session INT NOT NULL DEFAULT 20,
  focus VARCHAR(120) NOT NULL DEFAULT 'Speaking confidence',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_study_plans_user FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO roles (id, name) VALUES
  (1, 'admin'),
  (2, 'student');

INSERT INTO users (id, first_name, last_name, email, password_hash, created_at) VALUES
  (1, 'Admin', 'English4U', 'admin@english4u.local', '$2a$10$8mbz7.k1hh3KZAWh/9GasOyWXyu07QBSNRYkkrzT8KvijRQJTXGT.', '2026-03-24 10:00:00'),
  (2, 'Alex', 'Morgan', 'student@english4u.local', '$2a$10$usb4lUcLx5tKk8hLctA0UuNyWYrH5t5qDDSTUzBin1mi711zMZKAK', '2026-03-24 10:05:00');

INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 1),
  (2, 2);

INSERT INTO courses (id, slug, title, description, published) VALUES
  (1, 'a1-foundations', 'A1 Foundations', 'Start with personal details, daily objects, and short high-frequency sentence patterns.', 1),
  (2, 'a2-confidence', 'A2 Confidence', 'Build practical fluency for routines, work, travel, and everyday social conversations.', 1);

INSERT INTO levels (id, course_id, code, title, position) VALUES
  (1, 1, 'A1', 'A1 Foundations', 1),
  (2, 2, 'A2', 'A2 Confidence', 1);

INSERT INTO units (id, level_id, title, summary, position) VALUES
  (1, 1, 'Introductions and basics', 'Introduce yourself, exchange simple details, and understand core classroom language.', 1),
  (2, 1, 'Daily routines', 'Describe your day with simple verbs, times, and common routine phrases.', 2),
  (3, 2, 'Everyday habits', 'Talk about frequent actions, weekly plans, and activities with more confidence.', 1),
  (4, 2, 'Talking about routines', 'Use present simple patterns, sequencing, and time phrases to sound more natural.', 2);

INSERT INTO lessons (id, unit_id, title, lesson_type, content_json, status, position) VALUES
  (1, 4, 'Talking about daily routines', 'mixed', '{"summary":"Use present simple confidently to describe regular daily routines in fuller sentences.","duration":"15 min","focus":"Grammar and reading","blocks":[{"type":"reading","title":"Regular day","content":"Carlos gets up early, takes the bus to work, and usually cooks dinner when he gets home.","accent":"Notice the verb endings with he."},{"type":"grammar","title":"Third-person simple present","content":"Add -s or -es with he, she, and it in regular routines.","accent":"Example: She watches videos after class."},{"type":"vocabulary","title":"Routine verbs","content":"take the bus, cook dinner, get home, start early, finish work","accent":"Choose verbs that fit your own schedule."},{"type":"practice","title":"Describe one person","content":"Write four sentences about another person''s routine.","accent":"Use he or she in every sentence."}]}', 'published', 1),
  (2, 1, 'Saying your name and country', 'mixed', '{"summary":"Learn how to introduce yourself, say where you are from, and ask simple personal questions.","duration":"12 min","focus":"Speaking basics","blocks":[{"type":"reading","title":"Meet Sofia","content":"Hi, I am Sofia. I am from Spain and I live in Madrid. I am a student.","accent":"Read it twice and notice the order: name, country, city, role."},{"type":"grammar","title":"I am / You are","content":"Use I am for your own information and you are when you ask or answer about another person.","accent":"Example: I am from Italy. You are from Brazil."},{"type":"vocabulary","title":"Core personal words","content":"name, country, city, student, teacher, live, from","accent":"Use these words to build a short self-introduction."},{"type":"practice","title":"Three-sentence intro","content":"Write or say three sentences about yourself using your name, country, and city.","accent":"Keep it short and accurate before adding more details."}]}', 'published', 1),
  (3, 1, 'Talking about age and work', 'mixed', '{"summary":"Describe age and work with basic be-verbs and simple job vocabulary.","duration":"14 min","focus":"Present simple","blocks":[{"type":"reading","title":"Meet Omar","content":"Omar is 24 years old. He is a chef. He works in a small restaurant.","accent":"Notice how age and job appear in separate short sentences."},{"type":"grammar","title":"He is / She is","content":"Use he is and she is to talk about another person. Use years old after a number for age.","accent":"Example: She is 30 years old. He is a doctor."},{"type":"vocabulary","title":"Jobs and age","content":"chef, doctor, driver, engineer, years old, work, office","accent":"Try to match each job with one person you know."},{"type":"practice","title":"Ask and answer","content":"Write two questions and two answers about age and work.","accent":"Example: How old are you? I am 19 years old."}]}', 'published', 2),
  (4, 1, 'Introducing a classmate', 'mixed', '{"summary":"Introduce another person using short listening-style recall and simple third-person sentences.","duration":"10 min","focus":"Listening and recall","blocks":[{"type":"reading","title":"Classmate profile","content":"This is Anna. She is from Poland. She is a designer and she lives in Krakow.","accent":"Read once for meaning, then once for details."},{"type":"grammar","title":"Talking about another person","content":"Use she is or he is when you introduce a classmate or friend.","accent":"Keep each sentence clear and short."},{"type":"vocabulary","title":"Profile details","content":"friend, classmate, designer, from, live, in, work","accent":"These words help you describe another learner."},{"type":"practice","title":"Introduce a partner","content":"Write four short sentences about a classmate or an imaginary partner.","accent":"Use name, country, city, and job."}]}', 'published', 3),
  (5, 2, 'Morning routine essentials', 'mixed', '{"summary":"Build the vocabulary for a simple morning routine using high-frequency actions.","duration":"11 min","focus":"Vocabulary","blocks":[{"type":"reading","title":"Tom''s morning","content":"Tom wakes up at 7:00, takes a shower, eats breakfast, and goes to work at 8:15.","accent":"Follow the actions in time order."},{"type":"vocabulary","title":"Morning routine verbs","content":"wake up, get dressed, eat breakfast, go to work, drink coffee","accent":"Say each verb with a time expression."},{"type":"grammar","title":"Action order","content":"Use and to connect actions in a routine: I wake up and drink coffee.","accent":"This helps your routine sound natural."},{"type":"practice","title":"Put it in order","content":"Write four morning actions in the correct sequence.","accent":"Start with wake up and end with work or class."}]}', 'published', 1),
  (6, 2, 'Using every day and usually', 'mixed', '{"summary":"Use every day and usually to describe repeated habits in simple present.","duration":"13 min","focus":"Grammar patterns","blocks":[{"type":"reading","title":"Nina''s week","content":"Nina usually studies in the library. She goes there every day after lunch.","accent":"Notice where usually and every day appear."},{"type":"grammar","title":"Frequency words","content":"Use usually before the main verb and every day at the end of the sentence.","accent":"Example: I usually walk home. I study English every day."},{"type":"vocabulary","title":"Habit markers","content":"always, usually, sometimes, every day, after lunch","accent":"These words make your routine more specific."},{"type":"practice","title":"Habit sentences","content":"Write three sentences about habits using usually or every day.","accent":"Keep the subject and verb in the simple present."}]}', 'published', 2),
  (7, 2, 'Describe your weekday', 'mixed', '{"summary":"Describe a weekday from morning to evening with clear simple present sentences.","duration":"15 min","focus":"Sentence building","blocks":[{"type":"reading","title":"My weekday","content":"I leave home at 8:00, study until 1:00, have lunch with friends, and do homework in the evening.","accent":"Use the text as a model for your own weekday."},{"type":"grammar","title":"Simple present sequence","content":"Use simple present verbs to describe your routine from start to finish.","accent":"Add time phrases to make the order easy to follow."},{"type":"vocabulary","title":"Weekday actions","content":"leave home, study, have lunch, go home, do homework, relax","accent":"Choose the actions that match your own day."},{"type":"practice","title":"Your weekday paragraph","content":"Write five sentences about your weekday in time order.","accent":"Start with the morning and finish with the evening."}]}', 'published', 3),
  (8, 3, 'Describing your weekly routine', 'mixed', '{"summary":"Describe a full weekly routine with clearer sequencing and more natural time expressions.","duration":"14 min","focus":"Routine fluency","blocks":[{"type":"reading","title":"A busy week","content":"On weekdays, Laura starts work at 9:00, visits clients in the afternoon, and goes to the gym on Tuesday and Thursday.","accent":"Notice the mix of weekday routine and weekly variation."},{"type":"grammar","title":"Weekly routine patterns","content":"Use on + days and in the afternoon to describe repeated weekly actions.","accent":"Example: On Monday, I work from home."},{"type":"vocabulary","title":"Weekly schedule language","content":"weekdays, client, afternoon, twice a week, gym, meeting","accent":"These terms help you describe a more detailed routine."},{"type":"practice","title":"Your weekly pattern","content":"Write four sentences about what you do during the week.","accent":"Include at least one day name and one time phrase."}]}', 'published', 1),
  (9, 3, 'Time expressions for habits', 'mixed', '{"summary":"Use common time expressions to talk about habits more naturally and precisely.","duration":"12 min","focus":"Vocabulary","blocks":[{"type":"reading","title":"Habit timing","content":"I normally check email before breakfast, and I often review my tasks after lunch.","accent":"Watch how the speaker places time expressions around the verb."},{"type":"grammar","title":"Before / after / during","content":"Use before and after to connect two routine actions. Use during for an action inside a time period.","accent":"Example: I study after dinner."},{"type":"vocabulary","title":"Timing connectors","content":"before, after, during, early, late, around","accent":"These words add precision without making sentences long."},{"type":"practice","title":"Daily timing drill","content":"Write three sentences using before, after, or during.","accent":"Keep the same subject and build clear action pairs."}]}', 'published', 2),
  (10, 3, 'Work and study schedules', 'mixed', '{"summary":"Read and describe simple work and study schedules using practical timetable language.","duration":"16 min","focus":"Reading and comprehension","blocks":[{"type":"reading","title":"Two schedules","content":"Mina studies from 9:00 to 12:00 and works from 2:00 to 6:00. Daniel teaches in the morning and prepares lessons in the evening.","accent":"Compare both schedules and notice the repeated patterns."},{"type":"grammar","title":"From ... to ...","content":"Use from ... to ... to explain the start and end of a time block.","accent":"Example: I work from 10:00 to 4:00."},{"type":"vocabulary","title":"Schedule words","content":"schedule, shift, class, prepare, break, evening","accent":"Use these words to compare two people''s timetables."},{"type":"practice","title":"Compare two people","content":"Write three sentences comparing two schedules.","accent":"Use both, but, or and."}]}', 'published', 3),
  (11, 4, 'After work and evening plans', 'mixed', '{"summary":"Talk about evening plans and after-work habits with more flexible conversation prompts.","duration":"13 min","focus":"Conversation prompts","blocks":[{"type":"reading","title":"After work","content":"After work, Ben sometimes meets friends, but he often stays home and watches a series with his sister.","accent":"Notice how the sentence contrasts two common evening choices."},{"type":"grammar","title":"But and often","content":"Use but to contrast two routine ideas and often to show common frequency.","accent":"Example: I want to go out, but I usually stay home."},{"type":"vocabulary","title":"Evening activities","content":"meet friends, stay home, watch a series, cook, rest, go out","accent":"These phrases help you speak about life after work."},{"type":"practice","title":"Two evening options","content":"Write two sentences about what you do after work or class.","accent":"Use but in one of them."}]}', 'published', 2),
  (12, 4, 'Weekend routine comparison', 'mixed', '{"summary":"Compare weekend routines and speak with more confidence about different habits and preferences.","duration":"16 min","focus":"Speaking confidence","blocks":[{"type":"reading","title":"Two weekends","content":"On Saturdays, Kim wakes up late and visits her parents. On Sundays, she stays home, cleans the apartment, and plans the new week.","accent":"Compare what changes from one day to another."},{"type":"grammar","title":"Weekend comparison","content":"Use on Saturdays / on Sundays to compare repeated weekend habits.","accent":"You can combine actions with and to build fuller ideas."},{"type":"vocabulary","title":"Weekend actions","content":"visit parents, clean the apartment, plan the week, wake up late, relax","accent":"Weekend language often mixes chores and free time."},{"type":"practice","title":"Compare your weekend","content":"Write four sentences about Saturday and Sunday.","accent":"Show one difference between the two days."}]}', 'published', 3);

INSERT INTO quizzes (id, lesson_id, title) VALUES
  (1, 1, 'Daily routine grammar checkpoint'),
  (2, 2, 'Introduce yourself checkpoint'),
  (3, 3, 'Age and work checkpoint'),
  (4, 4, 'Classmate introduction checkpoint'),
  (5, 5, 'Morning routine checkpoint'),
  (6, 6, 'Frequency checkpoint'),
  (7, 7, 'Weekday description checkpoint'),
  (8, 8, 'Weekly routine checkpoint'),
  (9, 9, 'Time expressions checkpoint'),
  (10, 10, 'Schedule reading checkpoint'),
  (11, 11, 'Evening plans checkpoint'),
  (12, 12, 'Weekend comparison checkpoint');

INSERT INTO questions (id, quiz_id, prompt, question_type, position) VALUES
  (1, 1, 'Choose the correct sentence.', 'single_choice', 1),
  (2, 1, 'Which sentence is about a habit?', 'single_choice', 2),
  (3, 1, 'Complete the sentence: Maria ___ home at 6:00.', 'single_choice', 3),
  (4, 2, 'Choose the best introduction.', 'single_choice', 1),
  (5, 2, 'Which question asks about country?', 'single_choice', 2),
  (6, 2, 'Complete the sentence: I ___ from France.', 'single_choice', 3),
  (7, 3, 'Choose the correct sentence.', 'single_choice', 1),
  (8, 3, 'What question asks about work?', 'single_choice', 2),
  (9, 3, 'Complete the sentence: He is 28 ___ old.', 'single_choice', 3),
  (10, 4, 'Choose the correct sentence.', 'single_choice', 1),
  (11, 4, 'Which word shows another person?', 'single_choice', 2),
  (12, 4, 'Best order for a short profile?', 'single_choice', 3),
  (13, 5, 'Which action usually comes first?', 'single_choice', 1),
  (14, 5, 'Choose the best sentence.', 'single_choice', 2),
  (15, 5, 'Which phrase is part of a morning routine?', 'single_choice', 3),
  (16, 6, 'Choose the best sentence.', 'single_choice', 1),
  (17, 6, 'Which expression shows repetition?', 'single_choice', 2),
  (18, 6, 'Complete the sentence: I go to class ___ lunch.', 'single_choice', 3),
  (19, 7, 'Choose the correct sentence.', 'single_choice', 1),
  (20, 7, 'Which phrase shows time order?', 'single_choice', 2),
  (21, 7, 'Best activity after study?', 'single_choice', 3),
  (22, 8, 'Choose the best sentence.', 'single_choice', 1),
  (23, 8, 'Which phrase names a part of the day?', 'single_choice', 2),
  (24, 8, 'Complete the sentence: ___ Friday, I work from home.', 'single_choice', 3),
  (25, 9, 'Choose the correct sentence.', 'single_choice', 1),
  (26, 9, 'Which word connects two actions?', 'single_choice', 2),
  (27, 9, 'Complete the sentence: I stretch ___ work.', 'single_choice', 3),
  (28, 10, 'Choose the correct sentence.', 'single_choice', 1),
  (29, 10, 'Which word means a short stop in the day?', 'single_choice', 2),
  (30, 10, 'What do you use to show start and finish times?', 'single_choice', 3),
  (31, 11, 'Choose the best sentence.', 'single_choice', 1),
  (32, 11, 'Which word shows contrast?', 'single_choice', 2),
  (33, 11, 'Which phrase is an evening activity?', 'single_choice', 3),
  (34, 12, 'Choose the correct sentence.', 'single_choice', 1),
  (35, 12, 'Which phrase shows a weekend habit?', 'single_choice', 2),
  (36, 12, 'What is a good contrast pair?', 'single_choice', 3);

INSERT INTO question_options (id, question_id, option_text, is_correct) VALUES
  (1, 1, 'He takes the bus to work.', 1),
  (2, 1, 'He take the bus to work.', 0),
  (3, 1, 'He taking the bus to work.', 0),
  (4, 2, 'She cooks dinner every night.', 1),
  (5, 2, 'She is cooking dinner now.', 0),
  (6, 2, 'She cooked dinner yesterday.', 0),
  (7, 3, 'gets', 1),
  (8, 3, 'get', 0),
  (9, 3, 'getting', 0),
  (10, 4, 'Hi, I am Leo. I am from Italy.', 1),
  (11, 4, 'Hi, Leo from Italy am.', 0),
  (12, 4, 'I from Italy Leo.', 0),
  (13, 5, 'Where are you from?', 1),
  (14, 5, 'What is your job?', 0),
  (15, 5, 'How old are you?', 0),
  (16, 6, 'am', 1),
  (17, 6, 'is', 0),
  (18, 6, 'are', 0),
  (19, 7, 'She is a doctor.', 1),
  (20, 7, 'She are a doctor.', 0),
  (21, 7, 'She doctor is.', 0),
  (22, 8, 'What do you do?', 1),
  (23, 8, 'Where do you live?', 0),
  (24, 8, 'What time is it?', 0),
  (25, 9, 'years', 1),
  (26, 9, 'year', 0),
  (27, 9, 'age', 0),
  (28, 10, 'He lives in Rome.', 1),
  (29, 10, 'He live in Rome.', 0),
  (30, 10, 'He living in Rome.', 0),
  (31, 11, 'she', 1),
  (32, 11, 'I', 0),
  (33, 11, 'my', 0),
  (34, 12, 'Name, country, city, job', 1),
  (35, 12, 'Job, city, where, country', 0),
  (36, 12, 'Country, question, age, hello', 0),
  (37, 13, 'Wake up', 1),
  (38, 13, 'Go to bed', 0),
  (39, 13, 'Eat dinner', 0),
  (40, 14, 'I eat breakfast at 7:30.', 1),
  (41, 14, 'I breakfast eat at 7:30.', 0),
  (42, 14, 'I am eat breakfast.', 0),
  (43, 15, 'get dressed', 1),
  (44, 15, 'watch stars', 0),
  (45, 15, 'sleep late at night', 0),
  (46, 16, 'She usually studies at night.', 1),
  (47, 16, 'She studies usually at night usually.', 0),
  (48, 16, 'She usually study at night.', 0),
  (49, 17, 'every day', 1),
  (50, 17, 'right now', 0),
  (51, 17, 'at the moment', 0),
  (52, 18, 'after', 1),
  (53, 18, 'under', 0),
  (54, 18, 'between', 0),
  (55, 19, 'I do homework in the evening.', 1),
  (56, 19, 'I does homework in the evening.', 0),
  (57, 19, 'I doing homework in the evening.', 0),
  (58, 20, 'in the evening', 1),
  (59, 20, 'beautiful', 0),
  (60, 20, 'because', 0),
  (61, 21, 'have lunch', 1),
  (62, 21, 'wake up', 0),
  (63, 21, 'go to sleep at midnight', 0),
  (64, 22, 'I go to the gym twice a week.', 1),
  (65, 22, 'I go twice gym a week.', 0),
  (66, 22, 'I goes to the gym twice a week.', 0),
  (67, 23, 'in the afternoon', 1),
  (68, 23, 'twice a week', 0),
  (69, 23, 'on Monday', 0),
  (70, 24, 'On', 1),
  (71, 24, 'At', 0),
  (72, 24, 'In', 0),
  (73, 25, 'I read after dinner.', 1),
  (74, 25, 'I after dinner read.', 0),
  (75, 25, 'I read dinner after.', 0),
  (76, 26, 'before', 1),
  (77, 26, 'usually', 0),
  (78, 26, 'office', 0),
  (79, 27, 'before', 1),
  (80, 27, 'under', 0),
  (81, 27, 'between', 0),
  (82, 28, 'She works from 2:00 to 6:00.', 1),
  (83, 28, 'She works to 2:00 from 6:00.', 0),
  (84, 28, 'She work from 2:00 to 6:00.', 0),
  (85, 29, 'break', 1),
  (86, 29, 'class', 0),
  (87, 29, 'shift', 0),
  (88, 30, 'from ... to ...', 1),
  (89, 30, 'usually', 0),
  (90, 30, 'every day', 0),
  (91, 31, 'I often stay home after class.', 1),
  (92, 31, 'I stay often home after class.', 0),
  (93, 31, 'I often stays home after class.', 0),
  (94, 32, 'but', 1),
  (95, 32, 'and', 0),
  (96, 32, 'because', 0),
  (97, 33, 'watch a series', 1),
  (98, 33, 'take a morning shower', 0),
  (99, 33, 'arrive yesterday', 0),
  (100, 34, 'On Sundays, she plans the new week.', 1),
  (101, 34, 'On Sundays, she plan the new week.', 0),
  (102, 34, 'On Sundays, she planning the new week.', 0),
  (103, 35, 'wake up late', 1),
  (104, 35, 'right now', 0),
  (105, 35, 'last month', 0),
  (106, 36, 'Saturday and Sunday', 1),
  (107, 36, 'morning and because', 0),
  (108, 36, 'week and slowly', 0);

INSERT INTO placement_attempts (id, user_id, score, recommended_level, created_at) VALUES
  (1, 2, 40, 'A2', '2026-03-24 10:15:00');

INSERT INTO lesson_progress (id, user_id, lesson_id, completed_at, status) VALUES
  (1, 2, 1, '2026-03-24 10:30:00', 'completed');

INSERT INTO quiz_attempts (id, user_id, quiz_id, score, answers_json, submitted_at) VALUES
  (1, 2, 1, 100, '[{"questionId":"a2-confidence-unit-2-lesson-1-quiz-q1","optionId":"a2-confidence-unit-2-lesson-1-quiz-q1-o1"},{"questionId":"a2-confidence-unit-2-lesson-1-quiz-q2","optionId":"a2-confidence-unit-2-lesson-1-quiz-q2-o1"},{"questionId":"a2-confidence-unit-2-lesson-1-quiz-q3","optionId":"a2-confidence-unit-2-lesson-1-quiz-q3-o1"}]', '2026-03-24 10:35:00');

INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_at) VALUES
  (2, 12, 18, '2026-03-24 10:35:00');

INSERT INTO study_plans (user_id, sessions_per_week, minutes_per_session, focus, updated_at) VALUES
  (2, 4, 20, 'Speaking confidence', '2026-03-24 10:40:00');

SET FOREIGN_KEY_CHECKS = 1;
