-- ============================================================
-- Campus Compass AI - Database Schema
-- Reference: Saranathan College of Engineering (saranathan.ac.in)
-- Last Updated: Phase 1 Implementation
-- ============================================================

CREATE DATABASE IF NOT EXISTS campus_compass_ai;
USE campus_compass_ai;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)  NOT NULL,
    email        VARCHAR(254)  NOT NULL UNIQUE,
    password     VARCHAR(255)  NOT NULL,
    role         VARCHAR(30)   DEFAULT 'student',  -- 'student' | 'faculty' | 'master_admin' | 'data_admin' | 'club_admin' | 'cafe_owner'
    department   VARCHAR(20)   DEFAULT NULL,       -- 'CSE' | 'IT' | 'ECE' | 'EEE' | 'AIDS' | 'AIML' | 'MECH' | 'MBA' | ...
    year         INT           DEFAULT NULL,       -- 1 to 4
    interests    VARCHAR(500)  DEFAULT NULL,       -- comma-separated: 'AI,Robotics,Web Dev'
    phone        VARCHAR(20)   DEFAULT NULL,
    fcm_token    VARCHAR(500)  DEFAULT NULL,       -- Firebase Cloud Messaging token
    created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- Safe migration: add new columns to users if they don't exist
SET @cu1 = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='interests');
SET @sq1 = IF(@cu1=0,'ALTER TABLE users ADD COLUMN interests VARCHAR(500) DEFAULT NULL','SELECT 1');
PREPARE s FROM @sq1; EXECUTE s; DEALLOCATE PREPARE s;

SET @cu2 = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='phone');
SET @sq2 = IF(@cu2=0,'ALTER TABLE users ADD COLUMN phone VARCHAR(20) DEFAULT NULL','SELECT 1');
PREPARE s FROM @sq2; EXECUTE s; DEALLOCATE PREPARE s;

SET @cu3 = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='users' AND column_name='fcm_token');
SET @sq3 = IF(@cu3=0,'ALTER TABLE users ADD COLUMN fcm_token VARCHAR(500) DEFAULT NULL','SELECT 1');
PREPARE s FROM @sq3; EXECUTE s; DEALLOCATE PREPARE s;

-- ============================================================
-- 2. EVENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255)  NOT NULL,
    description  TEXT,
    venue        VARCHAR(255),
    date         VARCHAR(100),
    department   VARCHAR(20)   DEFAULT NULL,
    event_type   VARCHAR(50)   DEFAULT 'general',
    created_by   INT           DEFAULT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Add new columns to events if they don't exist (safe migration)
SET @col_check_dept = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'department');
SET @sql_dept = IF(@col_check_dept = 0, 'ALTER TABLE events ADD COLUMN department VARCHAR(20) DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql_dept; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_check_type = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'event_type');
SET @sql_type = IF(@col_check_type = 0, "ALTER TABLE events ADD COLUMN event_type VARCHAR(50) DEFAULT 'general'", 'SELECT 1');
PREPARE stmt FROM @sql_type; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_check_cb = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'events' AND column_name = 'created_by');
SET @sql_cb = IF(@col_check_cb = 0, 'ALTER TABLE events ADD COLUMN created_by INT DEFAULT NULL', 'SELECT 1');
PREPARE stmt FROM @sql_cb; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ============================================================
-- 3. CLUBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS clubs (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    faculty_coordinator VARCHAR(255),
    meeting_day         VARCHAR(50),
    contact_email       VARCHAR(254),
    admin_id            INT DEFAULT NULL, -- Reference to the club_admin user
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Safe migration for clubs
SET @cu_club_admin = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='clubs' AND column_name='admin_id');
SET @sq_club_admin = IF(@cu_club_admin=0,'ALTER TABLE clubs ADD COLUMN admin_id INT DEFAULT NULL, ADD FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL','SELECT 1');
PREPARE s_club FROM @sq_club_admin; EXECUTE s_club; DEALLOCATE PREPARE s_club;

-- ============================================================
-- 4. EVENT REGISTRATIONS (RSVP)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_registrations (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    event_id       INT NOT NULL,
    registered_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_event_unique (user_id, event_id),
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. FACULTY TABLE (replaces hardcoded Faculty.jsx)
-- Source: saranathan.ac.in (no photos)
-- ============================================================
CREATE TABLE IF NOT EXISTS faculty (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(100)  NOT NULL,
    qualification    VARCHAR(150),
    designation      VARCHAR(100),  -- 'Professor & Head' | 'Professor' | 'Associate Professor' | 'Assistant Professor'
    department       VARCHAR(20)   NOT NULL,  -- dept code: 'CSE','IT','ECE','EEE','AIDS','AIML','MECH','MBA','CE','ICE'
    email             VARCHAR(254),
    office_hours      VARCHAR(150)  DEFAULT NULL,
    subjects_handled  VARCHAR(400)  DEFAULT NULL,
    is_hod            BOOLEAN       DEFAULT FALSE,
    gender            VARCHAR(20)   DEFAULT NULL,
    education_history TEXT          DEFAULT NULL,
    experience        VARCHAR(150)  DEFAULT NULL,
    area_of_expertise VARCHAR(255)  DEFAULT NULL,
    projects          TEXT          DEFAULT NULL
);

-- ============================================================
-- 6. ANNOUNCEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(255) NOT NULL,
    body       TEXT,
    created_by INT          DEFAULT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 7. TIMETABLE TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS timetable (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    department   VARCHAR(20)  NOT NULL,
    year         INT          NOT NULL,   -- 1 | 2 | 3 | 4
    day          VARCHAR(15)  NOT NULL,   -- 'Monday' ... 'Friday'
    time_slot    VARCHAR(50)  NOT NULL,   -- '09:00-10:00'
    subject      VARCHAR(120) NOT NULL,
    faculty_name VARCHAR(100) DEFAULT NULL,
    room         VARCHAR(50)  DEFAULT NULL
);

-- ============================================================
-- 8. CLUB MEMBERSHIPS
-- ============================================================
CREATE TABLE IF NOT EXISTS club_memberships (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id   INT NOT NULL,
    club_id   INT NOT NULL,
    status    VARCHAR(20) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY user_club_unique (user_id, club_id),
    FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(id)  ON DELETE CASCADE
);

-- Safe migration for club_memberships
SET @cu_club_stat = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema=DATABASE() AND table_name='club_memberships' AND column_name='status');
SET @sq_club_stat = IF(@cu_club_stat=0,"ALTER TABLE club_memberships ADD COLUMN status VARCHAR(20) DEFAULT 'pending'",'SELECT 1');
PREPARE s_club_stat FROM @sq_club_stat; EXECUTE s_club_stat; DEALLOCATE PREPARE s_club_stat;

-- ============================================================
-- 8B. CAFE / CANTEEN MENU
-- ============================================================
CREATE TABLE IF NOT EXISTS canteen_menu (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    item_name     VARCHAR(150) NOT NULL,
    item_type     VARCHAR(50)  NOT NULL, -- 'breakfast' | 'lunch' | 'snacks' | 'beverage'
    price         DECIMAL(10,2) NOT NULL,
    is_available  BOOLEAN DEFAULT TRUE,
    image_url     VARCHAR(500) DEFAULT NULL,
    updated_by    INT DEFAULT NULL,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 9. AI QUERY LOGS (for Admin Analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_query_logs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT  DEFAULT NULL,
    query      TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


-- ============================================================
-- SEED DATA
-- ============================================================

-- ------------------------------------------------------------
-- Events (sample)
-- ------------------------------------------------------------
INSERT INTO events (title, description, venue, date, event_type) VALUES
('Tech Symposium 2026',   'National-level tech fest: coding, robotics, paper presentations.', 'Main Auditorium',      'October 15, 2026 at 10:00 AM', 'general'),
('Sports Meet 2026',      'Inter-department athletic games and track events.',               'College Grounds',       'November 10, 2026 at 9:00 AM',  'sports'),
('AI Workshop',           'Hands-on session using Gemini API and large language models.',    'IT Lab 3',              'December 05, 2026 at 2:00 PM',  'workshop'),
('Smart India Hackathon', 'Internal round of SIH 2026. Register your teams now.',           'CSE Seminar Hall',      'August 20, 2026 at 9:00 AM',    'hackathon'),
('Cultural Night',        'Annual cultural programme: music, dance, drama and more.',       'Open Air Theatre',      'September 30, 2026 at 6:00 PM', 'cultural')
ON DUPLICATE KEY UPDATE title = title;

-- ------------------------------------------------------------
-- Clubs (sample)
-- ------------------------------------------------------------
INSERT INTO clubs (name, description, faculty_coordinator, meeting_day, contact_email) VALUES
('Coding Club',        'Competitive coding, web dev, and open-source projects.',       'Dr. V Punitha',        'Wednesday', 'coding@saranathan.ac.in'),
('AI & Robotics Club', 'Deep learning, computer vision, and robotics projects.',       'Dr. R Thillaikarasi',  'Friday',    'ai_robotics@saranathan.ac.in'),
('Literary Society',   'Debates, public speaking, poetry readings, writing workshops.','Dr. S Mohana',         'Monday',    'literary@saranathan.ac.in'),
('IEEE Student Branch', 'Technical paper presentations, workshops, and IEEE events.',  'Dr. K.S Chandrasekaran','Thursday', 'ieee@saranathan.ac.in'),
('NSS Unit',           'National Service Scheme — community service and social work.', 'Dr. R Senthamil Selvi','Saturday',  'nss@saranathan.ac.in')
ON DUPLICATE KEY UPDATE name = name;

-- ------------------------------------------------------------
-- Faculty — CSE Department (19 members, scraped from saranathan.ac.in)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. V Punitha',                  'M.E., Ph.D',    'Professor & Head',      'CSE', 'punitha-it@saranathan.ac.in',           TRUE),
('Dr. R Senthamil Selvi',          'M.E., Ph.D',    'Professor',             'CSE', 'senthamilselvi-cse@saranathan.ac.in',   FALSE),
('Dr. S Mohana',                   'M.E., Ph.D',    'Professor',             'CSE', 'mohana-cse@saranathan.ac.in',           FALSE),
('Dr. K.S Chandrasekaran',         'M.E., Ph.D',    'Associate Professor',   'CSE', 'chandrasekaran-cse@saranathan.ac.in',   FALSE),
('Dr. S Rajalakshmi',              'M.E, Ph.D',     'Assistant Professor',   'CSE', 'rajalakshmi7103@saranathan.ac.in',      FALSE),
('Mr. D Boobala Muralitharan',     'M.E.',          'Assistant Professor',   'CSE', 'boobala-cse@saranathan.ac.in',          FALSE),
('Ms. R Sugantha Lakshmi',         'M.E',           'Assistant Professor',   'CSE', 'suganthalakshmi7127@saranathan.ac.in',  FALSE),
('Ms. T Nagalakshmi',              'M.E',           'Assistant Professor',   'CSE', 'nagalakshmi7160@saranathan.ac.in',      FALSE),
('Mr. R Karthik',                  'M.E.',          'Assistant Professor',   'CSE', 'karthik-cse@saranathan.ac.in',          FALSE),
('Ms. K Mohanappriya',             'M.E.',          'Assistant Professor',   'CSE', 'mohanapriya-cse@saranathan.ac.in',      FALSE),
('Ms. J Sathiaparkavi',            'M.E.',          'Assistant Professor',   'CSE', 'parkavi-cse@saranathan.ac.in',          FALSE),
('Ms. E Shapna Rani',              'M.E',           'Assistant Professor',   'CSE', 'shapnarani-cse@saranathan.ac.in',       FALSE),
('Ms. P Rohini',                   'M.E',           'Assistant Professor',   'CSE', 'rohini7133@saranathan.ac.in',           FALSE),
('Ms. C Maria Rhythm',             'M.E.',          'Assistant Professor',   'CSE', 'mariarhythm7182@saranathan.ac.in',      FALSE),
('Ms. A Rachel Roselin',           'M.E',           'Assistant Professor',   'CSE', 'rachelroselin7158@saranathan.ac.in',    FALSE),
('Ms. N Ramya',                    'M.E',           'Assistant Professor',   'CSE', 'ramya-cse@saranathan.ac.in',            FALSE),
('Mr. L Parthipan',                'M.E',           'Assistant Professor',   'CSE', 'parthipan7129@saranathan.ac.in',        FALSE),
('Ms. G Sathya',                   'M.E',           'Assistant Professor',   'CSE', 'sathya7144@saranathan.ac.in',           FALSE),
('Ms. G Roshini',                  'M.Tech.',       'Assistant Professor',   'CSE', 'roshini7146@saranathan.ac.in',          FALSE);

-- ------------------------------------------------------------
-- Faculty — IT Department (10 members, scraped from saranathan.ac.in)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. R Thillaikarasi',               'M.Tech., Ph.D', 'Professor & Head',    'IT', 'thillai-cse@saranathan.ac.in',       TRUE),
('Dr. R Rengaraj alias Muralidharan', 'M.E, Ph.D',     'Assistant Professor', 'IT', 'rengaraj-it@saranathan.ac.in',       FALSE),
('Ms. J Sangeethapriya',              'M.Tech.',        'Assistant Professor', 'IT', 'jspriya-it@saranathan.ac.in',        FALSE),
('Mr. V Senthil Balaji',              'M.E.',           'Assistant Professor', 'IT', 'senthilbalaji-it@saranathan.ac.in',  FALSE),
('Ms. A Sheelavathi',                 'M.E.',           'Assistant Professor', 'IT', 'sheelavathi-it@saranathan.ac.in',    FALSE),
('Mr. D Raghu Raman',                 'M.E.',           'Assistant Professor', 'IT', 'raghuraman7188@saranathan.ac.in',    FALSE),
('Ms. K Muthukarupaee',               'M.E.',           'Assistant Professor', 'IT', 'muthukarupaee-it@saranathan.ac.in',  FALSE),
('Ms. M Jebarani',                    'M.E',            'Assistant Professor', 'IT', 'jebarani7104@saranathan.ac.in',      FALSE),
('Ms. G Sathiya',                     'M.E',            'Assistant Professor', 'IT', 'sathiya-cse@saranathan.ac.in',       FALSE),
('Ms. S Angel Sweety Sheeba',         'M.E.',           'Assistant Professor', 'IT', 'angel-it@saranathan.ac.in',          FALSE);

-- ------------------------------------------------------------
-- Faculty — ECE Department (representative, update via admin panel)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. S Rajkumar',          'M.E., Ph.D',    'Professor & Head',    'ECE', 'rajkumar-ece@saranathan.ac.in',    TRUE),
('Dr. N Krishnaveni',       'M.E., Ph.D',    'Professor',           'ECE', 'krishnaveni-ece@saranathan.ac.in', FALSE),
('Mr. P Aravind',           'M.E.',          'Assistant Professor', 'ECE', 'aravind-ece@saranathan.ac.in',     FALSE),
('Ms. R Priya',             'M.E.',          'Assistant Professor', 'ECE', 'priya-ece@saranathan.ac.in',       FALSE),
('Mr. S Vignesh',           'M.E.',          'Assistant Professor', 'ECE', 'vignesh-ece@saranathan.ac.in',     FALSE);

-- ------------------------------------------------------------
-- Faculty — EEE Department (representative)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. T Mahalakshmi',       'M.E., Ph.D',    'Professor & Head',    'EEE', 'mahalakshmi-eee@saranathan.ac.in', TRUE),
('Mr. K Suresh',            'M.E.',          'Assistant Professor', 'EEE', 'suresh-eee@saranathan.ac.in',      FALSE),
('Ms. B Kavitha',           'M.E.',          'Assistant Professor', 'EEE', 'kavitha-eee@saranathan.ac.in',     FALSE),
('Mr. R Dinesh',            'M.E.',          'Assistant Professor', 'EEE', 'dinesh-eee@saranathan.ac.in',      FALSE);

-- ------------------------------------------------------------
-- Faculty — AIDS Department (representative)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Ms. P Deepika',           'M.E.',          'Assistant Professor', 'AIDS', 'deepika-aids@saranathan.ac.in',   FALSE),
('Mr. S Harish',            'M.E.',          'Assistant Professor', 'AIDS', 'harish-aids@saranathan.ac.in',    FALSE),
('Ms. T Santhiya',          'M.Tech.',       'Assistant Professor', 'AIDS', 'santhiya-aids@saranathan.ac.in',  FALSE);

-- ------------------------------------------------------------
-- Faculty — AIML Department (representative)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. R Vijayalakshmi',     'M.E., Ph.D',    'Professor & Head',    'AIML', 'vijaya-aiml@saranathan.ac.in',   TRUE),
('Mr. A Prasanth',          'M.E.',          'Assistant Professor', 'AIML', 'prasanth-aiml@saranathan.ac.in', FALSE),
('Ms. K Nithya',            'M.Tech.',       'Assistant Professor', 'AIML', 'nithya-aiml@saranathan.ac.in',   FALSE);

-- ------------------------------------------------------------
-- Faculty — MECH Department (representative)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. V Murugan',           'M.E., Ph.D',    'Professor & Head',    'MECH', 'murugan-mech@saranathan.ac.in',  TRUE),
('Mr. S Balasubramanian',   'M.E.',          'Associate Professor', 'MECH', 'bala-mech@saranathan.ac.in',     FALSE),
('Mr. T Karthikeyan',       'M.E.',          'Assistant Professor', 'MECH', 'karthikeyan-mech@saranathan.ac.in', FALSE),
('Ms. R Uma',               'M.E.',          'Assistant Professor', 'MECH', 'uma-mech@saranathan.ac.in',      FALSE);

-- ------------------------------------------------------------
-- Faculty — MBA Department (representative)
-- ------------------------------------------------------------
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. A Jayanthi',          'MBA, Ph.D',     'Professor & Head',    'MBA', 'jayanthi-mba@saranathan.ac.in',   TRUE),
('Mr. S Senthilkumar',      'MBA',           'Assistant Professor', 'MBA', 'senthil-mba@saranathan.ac.in',    FALSE),
('Ms. P Lavanya',           'MBA',           'Assistant Professor', 'MBA', 'lavanya-mba@saranathan.ac.in',    FALSE);


-- ------------------------------------------------------------
-- Timetable — CSE Year 1 (Anna University regulation syllabus)
-- ------------------------------------------------------------
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
-- Monday
('CSE', 1, 'Monday', '09:00-10:00', 'Mathematics I',                 'Ms. G Sathya',        'CSE-101'),
('CSE', 1, 'Monday', '10:00-11:00', 'Engineering Physics',           'Dr. Physics HOD',     'CSE-101'),
('CSE', 1, 'Monday', '11:15-12:15', 'Problem Solving & Python',      'Mr. R Karthik',       'CSE-101'),
('CSE', 1, 'Monday', '12:15-13:15', 'Engineering Graphics',          'Mr. D Boobala Muralitharan', 'CSE-101'),
('CSE', 1, 'Monday', '14:00-15:00', 'English for Engineers',         'Dr. English HOD',     'CSE-101'),
('CSE', 1, 'Monday', '15:00-16:00', 'Python Lab',                    'Mr. L Parthipan',     'CSE Lab 1'),
-- Tuesday
('CSE', 1, 'Tuesday','09:00-10:00', 'Mathematics I',                 'Ms. G Sathya',        'CSE-101'),
('CSE', 1, 'Tuesday','10:00-11:00', 'Problem Solving & Python',      'Mr. R Karthik',       'CSE-101'),
('CSE', 1, 'Tuesday','11:15-12:15', 'Engineering Chemistry',         'Dr. Chemistry HOD',   'CSE-101'),
('CSE', 1, 'Tuesday','12:15-13:15', 'Engineering Graphics',          'Mr. D Boobala Muralitharan','CSE-101'),
('CSE', 1, 'Tuesday','14:00-16:00', 'Engineering Graphics Lab',      'Mr. D Boobala Muralitharan','Drawing Hall'),
-- Wednesday
('CSE', 1, 'Wednesday','09:00-10:00','Engineering Physics',          'Dr. Physics HOD',     'CSE-101'),
('CSE', 1, 'Wednesday','10:00-11:00','Engineering Chemistry',        'Dr. Chemistry HOD',   'CSE-101'),
('CSE', 1, 'Wednesday','11:15-12:15','Mathematics I',                'Ms. G Sathya',        'CSE-101'),
('CSE', 1, 'Wednesday','12:15-13:15','English for Engineers',        'Dr. English HOD',     'CSE-101'),
('CSE', 1, 'Wednesday','14:00-16:00','Physics Lab',                  'Dr. Physics HOD',     'Physics Lab'),
-- Thursday
('CSE', 1, 'Thursday','09:00-10:00', 'Problem Solving & Python',     'Mr. R Karthik',       'CSE-101'),
('CSE', 1, 'Thursday','10:00-11:00', 'Engineering Physics',          'Dr. Physics HOD',     'CSE-101'),
('CSE', 1, 'Thursday','11:15-12:15', 'Mathematics I',                'Ms. G Sathya',        'CSE-101'),
('CSE', 1, 'Thursday','12:15-13:15', 'Engineering Chemistry',        'Dr. Chemistry HOD',   'CSE-101'),
('CSE', 1, 'Thursday','14:00-15:00', 'English for Engineers',        'Dr. English HOD',     'CSE-101'),
('CSE', 1, 'Thursday','15:00-16:00', 'Problem Solving & Python',     'Mr. L Parthipan',     'CSE-101'),
-- Friday
('CSE', 1, 'Friday',  '09:00-10:00', 'Engineering Chemistry',        'Dr. Chemistry HOD',   'CSE-101'),
('CSE', 1, 'Friday',  '10:00-11:00', 'English for Engineers',        'Dr. English HOD',     'CSE-101'),
('CSE', 1, 'Friday',  '11:15-12:15', 'Engineering Graphics',         'Mr. D Boobala Muralitharan','CSE-101'),
('CSE', 1, 'Friday',  '12:15-13:15', 'Problem Solving & Python',     'Mr. R Karthik',       'CSE-101'),
('CSE', 1, 'Friday',  '14:00-16:00', 'Chemistry Lab',                'Dr. Chemistry HOD',   'Chemistry Lab');

-- CSE Year 2 (Anna University regulation)
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 2, 'Monday',    '09:00-10:00', 'Data Structures',            'Dr. S Rajalakshmi',   'CSE-201'),
('CSE', 2, 'Monday',    '10:00-11:00', 'Computer Organization',      'Mr. R Karthik',       'CSE-201'),
('CSE', 2, 'Monday',    '11:15-12:15', 'Discrete Mathematics',       'Ms. G Sathya',        'CSE-201'),
('CSE', 2, 'Monday',    '12:15-13:15', 'Object Oriented Programming','Ms. T Nagalakshmi',   'CSE-201'),
('CSE', 2, 'Monday',    '14:00-16:00', 'Data Structures Lab',        'Dr. S Rajalakshmi',   'CSE Lab 2'),
('CSE', 2, 'Tuesday',   '09:00-10:00', 'Mathematics III',            'Ms. G Sathya',        'CSE-201'),
('CSE', 2, 'Tuesday',   '10:00-11:00', 'Data Structures',            'Dr. S Rajalakshmi',   'CSE-201'),
('CSE', 2, 'Tuesday',   '11:15-12:15', 'Object Oriented Programming','Ms. T Nagalakshmi',   'CSE-201'),
('CSE', 2, 'Tuesday',   '12:15-13:15', 'Computer Organization',      'Mr. R Karthik',       'CSE-201'),
('CSE', 2, 'Tuesday',   '14:00-16:00', 'OOP Lab',                    'Ms. T Nagalakshmi',   'CSE Lab 2'),
('CSE', 2, 'Wednesday', '09:00-10:00', 'Discrete Mathematics',       'Ms. G Sathya',        'CSE-201'),
('CSE', 2, 'Wednesday', '10:00-11:00', 'Operating Systems',          'Ms. K Mohanappriya',  'CSE-201'),
('CSE', 2, 'Wednesday', '11:15-12:15', 'Data Structures',            'Dr. S Rajalakshmi',   'CSE-201'),
('CSE', 2, 'Wednesday', '12:15-13:15', 'Mathematics III',            'Ms. G Sathya',        'CSE-201'),
('CSE', 2, 'Wednesday', '14:00-16:00', 'Computer Networks Lab',      'Mr. L Parthipan',     'Networks Lab'),
('CSE', 2, 'Thursday',  '09:00-10:00', 'Computer Networks',          'Mr. L Parthipan',     'CSE-201'),
('CSE', 2, 'Thursday',  '10:00-11:00', 'Object Oriented Programming','Ms. T Nagalakshmi',   'CSE-201'),
('CSE', 2, 'Thursday',  '11:15-12:15', 'Operating Systems',          'Ms. K Mohanappriya',  'CSE-201'),
('CSE', 2, 'Thursday',  '12:15-13:15', 'Computer Organization',      'Mr. R Karthik',       'CSE-201'),
('CSE', 2, 'Thursday',  '14:00-15:00', 'Discrete Mathematics',       'Ms. G Sathya',        'CSE-201'),
('CSE', 2, 'Friday',    '09:00-10:00', 'Operating Systems',          'Ms. K Mohanappriya',  'CSE-201'),
('CSE', 2, 'Friday',    '10:00-11:00', 'Computer Networks',          'Mr. L Parthipan',     'CSE-201'),
('CSE', 2, 'Friday',    '11:15-12:15', 'Mathematics III',            'Ms. G Sathya',        'CSE-201'),
('CSE', 2, 'Friday',    '12:15-13:15', 'Data Structures',            'Dr. S Rajalakshmi',   'CSE-201'),
('CSE', 2, 'Friday',    '14:00-16:00', 'OS Lab',                     'Ms. K Mohanappriya',  'CSE Lab 1');

-- CSE Year 3
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 3, 'Monday',    '09:00-10:00', 'Database Management Systems','Dr. K.S Chandrasekaran','CSE-301'),
('CSE', 3, 'Monday',    '10:00-11:00', 'Software Engineering',       'Dr. S Mohana',          'CSE-301'),
('CSE', 3, 'Monday',    '11:15-12:15', 'Theory of Computation',      'Ms. J Sathiaparkavi',   'CSE-301'),
('CSE', 3, 'Monday',    '12:15-13:15', 'Computer Networks II',       'Ms. P Rohini',          'CSE-301'),
('CSE', 3, 'Monday',    '14:00-16:00', 'DBMS Lab',                   'Dr. K.S Chandrasekaran','CSE Lab 3'),
('CSE', 3, 'Tuesday',   '09:00-10:00', 'Algorithm Design',           'Dr. S Rajalakshmi',     'CSE-301'),
('CSE', 3, 'Tuesday',   '10:00-11:00', 'Database Management Systems','Dr. K.S Chandrasekaran','CSE-301'),
('CSE', 3, 'Tuesday',   '11:15-12:15', 'Software Engineering',       'Dr. S Mohana',          'CSE-301'),
('CSE', 3, 'Tuesday',   '12:15-13:15', 'Theory of Computation',      'Ms. J Sathiaparkavi',   'CSE-301'),
('CSE', 3, 'Tuesday',   '14:00-16:00', 'Networks Lab',               'Ms. P Rohini',          'Networks Lab'),
('CSE', 3, 'Wednesday', '09:00-10:00', 'Computer Networks II',        'Ms. P Rohini',          'CSE-301'),
('CSE', 3, 'Wednesday', '10:00-11:00', 'Algorithm Design',            'Dr. S Rajalakshmi',    'CSE-301'),
('CSE', 3, 'Wednesday', '11:15-12:15', 'Database Management Systems', 'Dr. K.S Chandrasekaran','CSE-301'),
('CSE', 3, 'Wednesday', '12:15-13:15', 'Elective I',                  'Ms. E Shapna Rani',    'CSE-301'),
('CSE', 3, 'Wednesday', '14:00-16:00', 'Algorithm Lab',               'Dr. S Rajalakshmi',    'CSE Lab 3'),
('CSE', 3, 'Thursday',  '09:00-10:00', 'Software Engineering',        'Dr. S Mohana',         'CSE-301'),
('CSE', 3, 'Thursday',  '10:00-11:00', 'Elective I',                  'Ms. E Shapna Rani',    'CSE-301'),
('CSE', 3, 'Thursday',  '11:15-12:15', 'Theory of Computation',       'Ms. J Sathiaparkavi',  'CSE-301'),
('CSE', 3, 'Thursday',  '12:15-13:15', 'Algorithm Design',            'Dr. S Rajalakshmi',    'CSE-301'),
('CSE', 3, 'Thursday',  '14:00-16:00', 'Project Review I',            'Dr. V Punitha',        'Seminar Hall'),
('CSE', 3, 'Friday',    '09:00-10:00', 'Elective I',                  'Ms. E Shapna Rani',    'CSE-301'),
('CSE', 3, 'Friday',    '10:00-11:00', 'Computer Networks II',         'Ms. P Rohini',         'CSE-301'),
('CSE', 3, 'Friday',    '11:15-12:15', 'Software Engineering',         'Dr. S Mohana',         'CSE-301'),
('CSE', 3, 'Friday',    '12:15-13:15', 'Database Management Systems',  'Dr. K.S Chandrasekaran','CSE-301');

-- CSE Year 4
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 4, 'Monday',    '09:00-10:00', 'Machine Learning',            'Dr. R Senthamil Selvi','CSE-401'),
('CSE', 4, 'Monday',    '10:00-11:00', 'Cloud Computing',             'Ms. N Ramya',           'CSE-401'),
('CSE', 4, 'Monday',    '11:15-12:15', 'Elective III',                'Ms. C Maria Rhythm',    'CSE-401'),
('CSE', 4, 'Monday',    '12:15-13:15', 'Project Work',                'Dr. V Punitha',         'Project Lab'),
('CSE', 4, 'Tuesday',   '09:00-10:00', 'Machine Learning',            'Dr. R Senthamil Selvi', 'CSE-401'),
('CSE', 4, 'Tuesday',   '10:00-11:00', 'Elective II',                 'Ms. A Rachel Roselin',  'CSE-401'),
('CSE', 4, 'Tuesday',   '11:15-12:15', 'Cloud Computing',             'Ms. N Ramya',           'CSE-401'),
('CSE', 4, 'Tuesday',   '14:00-16:00', 'Project Work',                'Dr. V Punitha',         'Project Lab'),
('CSE', 4, 'Wednesday', '09:00-10:00', 'Elective II',                 'Ms. A Rachel Roselin',  'CSE-401'),
('CSE', 4, 'Wednesday', '10:00-11:00', 'Machine Learning Lab',        'Dr. R Senthamil Selvi', 'AI Lab'),
('CSE', 4, 'Wednesday', '14:00-16:00', 'Project Work',                'Dr. S Mohana',          'Project Lab'),
('CSE', 4, 'Thursday',  '09:00-10:00', 'Cloud Computing',             'Ms. N Ramya',           'CSE-401'),
('CSE', 4, 'Thursday',  '10:00-11:00', 'Elective III',                'Ms. C Maria Rhythm',    'CSE-401'),
('CSE', 4, 'Thursday',  '14:00-16:00', 'Project Review',              'Dr. V Punitha',         'Seminar Hall'),
('CSE', 4, 'Friday',    '09:00-10:00', 'Elective II',                 'Ms. A Rachel Roselin',  'CSE-401'),
('CSE', 4, 'Friday',    '10:00-11:00', 'Elective III',                'Ms. C Maria Rhythm',    'CSE-401'),
('CSE', 4, 'Friday',    '11:15-12:15', 'Machine Learning',            'Dr. R Senthamil Selvi', 'CSE-401');

-- IT Year 1 (sample, similar to CSE Year 1)
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 1, 'Monday',    '09:00-10:00', 'Mathematics I',                'Ms. A Sheelavathi',     'IT-101'),
('IT', 1, 'Monday',    '10:00-11:00', 'Engineering Physics',          'Dr. Physics HOD',       'IT-101'),
('IT', 1, 'Monday',    '11:15-12:15', 'Problem Solving & Python',     'Mr. V Senthil Balaji',  'IT-101'),
('IT', 1, 'Monday',    '12:15-13:15', 'Engineering Graphics',         'Mr. D Raghu Raman',     'IT-101'),
('IT', 1, 'Monday',    '14:00-16:00', 'Python Lab',                   'Ms. J Sangeethapriya',  'IT Lab 1'),
('IT', 1, 'Tuesday',   '09:00-10:00', 'Mathematics I',                'Ms. A Sheelavathi',     'IT-101'),
('IT', 1, 'Tuesday',   '10:00-11:00', 'Problem Solving & Python',     'Mr. V Senthil Balaji',  'IT-101'),
('IT', 1, 'Tuesday',   '11:15-12:15', 'Engineering Chemistry',        'Dr. Chemistry HOD',     'IT-101'),
('IT', 1, 'Tuesday',   '12:15-13:15', 'Engineering Graphics',         'Mr. D Raghu Raman',     'IT-101'),
('IT', 1, 'Tuesday',   '14:00-16:00', 'Engineering Graphics Lab',     'Mr. D Raghu Raman',     'Drawing Hall'),
('IT', 1, 'Wednesday', '09:00-10:00', 'Engineering Physics',          'Dr. Physics HOD',       'IT-101'),
('IT', 1, 'Wednesday', '10:00-11:00', 'Engineering Chemistry',        'Dr. Chemistry HOD',     'IT-101'),
('IT', 1, 'Wednesday', '11:15-12:15', 'Mathematics I',                'Ms. A Sheelavathi',     'IT-101'),
('IT', 1, 'Wednesday', '12:15-13:15', 'English for Engineers',        'Dr. English HOD',       'IT-101'),
('IT', 1, 'Wednesday', '14:00-16:00', 'Physics Lab',                  'Dr. Physics HOD',       'Physics Lab'),
('IT', 1, 'Thursday',  '09:00-10:00', 'Problem Solving & Python',     'Mr. V Senthil Balaji',  'IT-101'),
('IT', 1, 'Thursday',  '10:00-11:00', 'Engineering Physics',          'Dr. Physics HOD',       'IT-101'),
('IT', 1, 'Thursday',  '11:15-12:15', 'Mathematics I',                'Ms. A Sheelavathi',     'IT-101'),
('IT', 1, 'Thursday',  '12:15-13:15', 'Engineering Chemistry',        'Dr. Chemistry HOD',     'IT-101'),
('IT', 1, 'Thursday',  '14:00-15:00', 'English for Engineers',        'Dr. English HOD',       'IT-101'),
('IT', 1, 'Friday',    '09:00-10:00', 'English for Engineers',        'Dr. English HOD',       'IT-101'),
('IT', 1, 'Friday',    '10:00-11:00', 'Engineering Graphics',         'Mr. D Raghu Raman',     'IT-101'),
('IT', 1, 'Friday',    '11:15-12:15', 'Problem Solving & Python',     'Mr. V Senthil Balaji',  'IT-101'),
('IT', 1, 'Friday',    '14:00-16:00', 'Chemistry Lab',                'Dr. Chemistry HOD',     'Chemistry Lab');

-- IT Year 2
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 2, 'Monday',    '09:00-10:00', 'Data Structures',              'Dr. R Rengaraj alias Muralidharan','IT-201'),
('IT', 2, 'Monday',    '10:00-11:00', 'Computer Architecture',        'Mr. V Senthil Balaji', 'IT-201'),
('IT', 2, 'Monday',    '11:15-12:15', 'Discrete Mathematics',         'Ms. A Sheelavathi',    'IT-201'),
('IT', 2, 'Monday',    '12:15-13:15', 'Object Oriented Programming',  'Ms. J Sangeethapriya', 'IT-201'),
('IT', 2, 'Monday',    '14:00-16:00', 'Data Structures Lab',          'Dr. R Rengaraj alias Muralidharan','IT Lab 2'),
('IT', 2, 'Tuesday',   '09:00-10:00', 'Mathematics III',              'Ms. A Sheelavathi',    'IT-201'),
('IT', 2, 'Tuesday',   '10:00-11:00', 'Data Structures',              'Dr. R Rengaraj alias Muralidharan','IT-201'),
('IT', 2, 'Tuesday',   '11:15-12:15', 'Operating Systems',            'Mr. D Raghu Raman',    'IT-201'),
('IT', 2, 'Tuesday',   '12:15-13:15', 'Computer Architecture',        'Mr. V Senthil Balaji', 'IT-201'),
('IT', 2, 'Tuesday',   '14:00-16:00', 'OOP Lab',                      'Ms. J Sangeethapriya', 'IT Lab 2'),
('IT', 2, 'Wednesday', '09:00-10:00', 'Discrete Mathematics',         'Ms. A Sheelavathi',    'IT-201'),
('IT', 2, 'Wednesday', '10:00-11:00', 'Object Oriented Programming',  'Ms. J Sangeethapriya', 'IT-201'),
('IT', 2, 'Wednesday', '11:15-12:15', 'Mathematics III',              'Ms. A Sheelavathi',    'IT-201'),
('IT', 2, 'Wednesday', '14:00-16:00', 'Networks Lab',                 'Ms. K Muthukarupaee',  'Networks Lab'),
('IT', 2, 'Thursday',  '09:00-10:00', 'Computer Networks',            'Ms. K Muthukarupaee',  'IT-201'),
('IT', 2, 'Thursday',  '10:00-11:00', 'Data Structures',              'Dr. R Rengaraj alias Muralidharan','IT-201'),
('IT', 2, 'Thursday',  '11:15-12:15', 'Operating Systems',            'Mr. D Raghu Raman',    'IT-201'),
('IT', 2, 'Thursday',  '12:15-13:15', 'Mathematics III',              'Ms. A Sheelavathi',    'IT-201'),
('IT', 2, 'Thursday',  '14:00-16:00', 'OS Lab',                       'Mr. D Raghu Raman',    'IT Lab 1'),
('IT', 2, 'Friday',    '09:00-10:00', 'Operating Systems',            'Mr. D Raghu Raman',    'IT-201'),
('IT', 2, 'Friday',    '10:00-11:00', 'Computer Networks',            'Ms. K Muthukarupaee',  'IT-201'),
('IT', 2, 'Friday',    '11:15-12:15', 'Object Oriented Programming',  'Ms. J Sangeethapriya', 'IT-201'),
('IT', 2, 'Friday',    '12:15-13:15', 'Discrete Mathematics',         'Ms. A Sheelavathi',    'IT-201');

-- IT Year 3
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 3, 'Monday',    '09:00-10:00', 'Database Management Systems',  'Dr. R Thillaikarasi',  'IT-301'),
('IT', 3, 'Monday',    '10:00-11:00', 'Software Engineering',         'Ms. M Jebarani',        'IT-301'),
('IT', 3, 'Monday',    '11:15-12:15', 'Internet Technologies',        'Ms. G Sathiya',         'IT-301'),
('IT', 3, 'Monday',    '14:00-16:00', 'DBMS Lab',                     'Dr. R Thillaikarasi',   'IT Lab 2'),
('IT', 3, 'Tuesday',   '09:00-10:00', 'Web Technologies',             'Ms. S Angel Sweety Sheeba','IT-301'),
('IT', 3, 'Tuesday',   '10:00-11:00', 'Database Management Systems',  'Dr. R Thillaikarasi',  'IT-301'),
('IT', 3, 'Tuesday',   '11:15-12:15', 'Software Engineering',         'Ms. M Jebarani',        'IT-301'),
('IT', 3, 'Tuesday',   '14:00-16:00', 'Web Technologies Lab',         'Ms. S Angel Sweety Sheeba','IT Lab 1'),
('IT', 3, 'Wednesday', '09:00-10:00', 'Internet Technologies',        'Ms. G Sathiya',         'IT-301'),
('IT', 3, 'Wednesday', '10:00-11:00', 'Web Technologies',             'Ms. S Angel Sweety Sheeba','IT-301'),
('IT', 3, 'Wednesday', '14:00-16:00', 'Software Engineering Lab',     'Ms. M Jebarani',        'IT Lab 2'),
('IT', 3, 'Thursday',  '09:00-10:00', 'Database Management Systems',  'Dr. R Thillaikarasi',  'IT-301'),
('IT', 3, 'Thursday',  '10:00-11:00', 'Elective I',                   'Ms. K Muthukarupaee',  'IT-301'),
('IT', 3, 'Thursday',  '11:15-12:15', 'Internet Technologies',        'Ms. G Sathiya',         'IT-301'),
('IT', 3, 'Thursday',  '14:00-16:00', 'Project Review I',             'Dr. R Thillaikarasi',  'Seminar Hall'),
('IT', 3, 'Friday',    '09:00-10:00', 'Software Engineering',         'Ms. M Jebarani',        'IT-301'),
('IT', 3, 'Friday',    '10:00-11:00', 'Elective I',                   'Ms. K Muthukarupaee',  'IT-301'),
('IT', 3, 'Friday',    '11:15-12:15', 'Web Technologies',             'Ms. S Angel Sweety Sheeba','IT-301');

-- IT Year 4
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 4, 'Monday',    '09:00-10:00', 'Cloud Computing',              'Mr. V Senthil Balaji',  'IT-401'),
('IT', 4, 'Monday',    '10:00-11:00', 'Machine Learning',             'Dr. R Thillaikarasi',   'IT-401'),
('IT', 4, 'Monday',    '11:15-12:15', 'Elective III',                 'Ms. G Sathiya',         'IT-401'),
('IT', 4, 'Monday',    '14:00-16:00', 'Project Work',                 'Dr. R Thillaikarasi',   'Project Lab'),
('IT', 4, 'Tuesday',   '09:00-10:00', 'Cloud Computing',              'Mr. V Senthil Balaji',  'IT-401'),
('IT', 4, 'Tuesday',   '10:00-11:00', 'Elective II',                  'Ms. M Jebarani',        'IT-401'),
('IT', 4, 'Tuesday',   '14:00-16:00', 'Project Work',                 'Dr. R Thillaikarasi',   'Project Lab'),
('IT', 4, 'Wednesday', '09:00-10:00', 'Machine Learning',             'Dr. R Thillaikarasi',   'IT-401'),
('IT', 4, 'Wednesday', '14:00-16:00', 'Project Work',                 'Ms. M Jebarani',        'Project Lab'),
('IT', 4, 'Thursday',  '09:00-10:00', 'Elective III',                 'Ms. G Sathiya',         'IT-401'),
('IT', 4, 'Thursday',  '10:00-11:00', 'Cloud Computing',              'Mr. V Senthil Balaji',  'IT-401'),
('IT', 4, 'Thursday',  '14:00-16:00', 'Project Review',               'Dr. R Thillaikarasi',   'Seminar Hall'),
('IT', 4, 'Friday',    '09:00-10:00', 'Machine Learning',             'Dr. R Thillaikarasi',   'IT-401'),
('IT', 4, 'Friday',    '10:00-11:00', 'Elective II',                  'Ms. M Jebarani',        'IT-401'),
('IT', 4, 'Friday',    '11:15-12:15', 'Elective III',                 'Ms. G Sathiya',         'IT-401');


-- Admin note: For ECE, EEE, AIDS, AIML, MECH, MBA timetables,
-- use the Admin Panel → Timetable Management to add slots after login.
-- To promote a user to Admin: UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
