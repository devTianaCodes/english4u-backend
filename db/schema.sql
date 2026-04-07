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
