-- Events, Clubs and Timetable seed data
USE campus_compass_ai;

-- Events (insert only if not already present)
INSERT IGNORE INTO events (title, description, venue, date, event_type) VALUES
('Tech Symposium 2026',   'National-level tech fest: coding, robotics, paper presentations.', 'Main Auditorium',      'October 15, 2026 at 10:00 AM', 'general'),
('Sports Meet 2026',      'Inter-department athletic games and track events.',               'College Grounds',       'November 10, 2026 at 9:00 AM',  'sports'),
('AI Workshop',           'Hands-on session using Gemini API and large language models.',    'IT Lab 3',              'December 05, 2026 at 2:00 PM',  'workshop'),
('Smart India Hackathon', 'Internal round of SIH 2026. Register your teams now.',           'CSE Seminar Hall',      'August 20, 2026 at 9:00 AM',    'hackathon'),
('Cultural Night',        'Annual cultural programme: music, dance, drama and more.',       'Open Air Theatre',      'September 30, 2026 at 6:00 PM', 'cultural');

-- Clubs (insert only if not already present)
INSERT IGNORE INTO clubs (name, description, faculty_coordinator, meeting_day, contact_email) VALUES
('Coding Club',        'Competitive coding, web dev, and open-source projects.',       'Dr. V Punitha',        'Wednesday', 'coding@saranathan.ac.in'),
('AI & Robotics Club', 'Deep learning, computer vision, and robotics projects.',       'Dr. R Thillaikarasi',  'Friday',    'ai_robotics@saranathan.ac.in'),
('Literary Society',   'Debates, public speaking, poetry readings, writing workshops.','Dr. S Mohana',         'Monday',    'literary@saranathan.ac.in'),
('IEEE Student Branch', 'Technical paper presentations, workshops, and IEEE events.',  'Dr. K.S Chandrasekaran','Thursday', 'ieee@saranathan.ac.in'),
('NSS Unit',           'National Service Scheme — community service and social work.', 'Dr. R Senthamil Selvi','Saturday',  'nss@saranathan.ac.in');

-- CSE Timetable (clear and re-seed)
DELETE FROM timetable WHERE department IN ('CSE','IT');

-- CSE Year 1
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 1, 'Monday',    '09:00-10:00', 'Mathematics I',                 'Ms. G Sathya',              'CSE-101'),
('CSE', 1, 'Monday',    '10:00-11:00', 'Engineering Physics',           'Physics HOD',               'CSE-101'),
('CSE', 1, 'Monday',    '11:15-12:15', 'Problem Solving & Python',      'Mr. R Karthik',             'CSE-101'),
('CSE', 1, 'Monday',    '12:15-13:15', 'Engineering Graphics',          'Mr. D Boobala Muralitharan','CSE-101'),
('CSE', 1, 'Monday',    '14:00-15:00', 'English for Engineers',         'English HOD',               'CSE-101'),
('CSE', 1, 'Monday',    '15:00-16:00', 'Python Lab',                    'Mr. L Parthipan',           'CSE Lab 1'),
('CSE', 1, 'Tuesday',   '09:00-10:00', 'Mathematics I',                 'Ms. G Sathya',              'CSE-101'),
('CSE', 1, 'Tuesday',   '10:00-11:00', 'Problem Solving & Python',      'Mr. R Karthik',             'CSE-101'),
('CSE', 1, 'Tuesday',   '11:15-12:15', 'Engineering Chemistry',         'Chemistry HOD',             'CSE-101'),
('CSE', 1, 'Tuesday',   '12:15-13:15', 'Engineering Graphics',          'Mr. D Boobala Muralitharan','CSE-101'),
('CSE', 1, 'Tuesday',   '14:00-16:00', 'Engineering Graphics Lab',      'Mr. D Boobala Muralitharan','Drawing Hall'),
('CSE', 1, 'Wednesday', '09:00-10:00', 'Engineering Physics',           'Physics HOD',               'CSE-101'),
('CSE', 1, 'Wednesday', '10:00-11:00', 'Engineering Chemistry',         'Chemistry HOD',             'CSE-101'),
('CSE', 1, 'Wednesday', '11:15-12:15', 'Mathematics I',                 'Ms. G Sathya',              'CSE-101'),
('CSE', 1, 'Wednesday', '12:15-13:15', 'English for Engineers',         'English HOD',               'CSE-101'),
('CSE', 1, 'Wednesday', '14:00-16:00', 'Physics Lab',                   'Physics HOD',               'Physics Lab'),
('CSE', 1, 'Thursday',  '09:00-10:00', 'Problem Solving & Python',      'Mr. R Karthik',             'CSE-101'),
('CSE', 1, 'Thursday',  '10:00-11:00', 'Engineering Physics',           'Physics HOD',               'CSE-101'),
('CSE', 1, 'Thursday',  '11:15-12:15', 'Mathematics I',                 'Ms. G Sathya',              'CSE-101'),
('CSE', 1, 'Thursday',  '12:15-13:15', 'Engineering Chemistry',         'Chemistry HOD',             'CSE-101'),
('CSE', 1, 'Thursday',  '14:00-15:00', 'English for Engineers',         'English HOD',               'CSE-101'),
('CSE', 1, 'Thursday',  '15:00-16:00', 'Problem Solving & Python',      'Mr. L Parthipan',           'CSE-101'),
('CSE', 1, 'Friday',    '09:00-10:00', 'Engineering Chemistry',         'Chemistry HOD',             'CSE-101'),
('CSE', 1, 'Friday',    '10:00-11:00', 'English for Engineers',         'English HOD',               'CSE-101'),
('CSE', 1, 'Friday',    '11:15-12:15', 'Engineering Graphics',          'Mr. D Boobala Muralitharan','CSE-101'),
('CSE', 1, 'Friday',    '12:15-13:15', 'Problem Solving & Python',      'Mr. R Karthik',             'CSE-101'),
('CSE', 1, 'Friday',    '14:00-16:00', 'Chemistry Lab',                 'Chemistry HOD',             'Chemistry Lab');

-- CSE Year 2
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 2, 'Monday',    '09:00-10:00', 'Data Structures',               'Dr. S Rajalakshmi',         'CSE-201'),
('CSE', 2, 'Monday',    '10:00-11:00', 'Computer Organization',         'Mr. R Karthik',             'CSE-201'),
('CSE', 2, 'Monday',    '11:15-12:15', 'Discrete Mathematics',          'Ms. G Sathya',              'CSE-201'),
('CSE', 2, 'Monday',    '12:15-13:15', 'Object Oriented Programming',   'Ms. T Nagalakshmi',         'CSE-201'),
('CSE', 2, 'Monday',    '14:00-16:00', 'Data Structures Lab',           'Dr. S Rajalakshmi',         'CSE Lab 2'),
('CSE', 2, 'Tuesday',   '09:00-10:00', 'Mathematics III',               'Ms. G Sathya',              'CSE-201'),
('CSE', 2, 'Tuesday',   '10:00-11:00', 'Data Structures',               'Dr. S Rajalakshmi',         'CSE-201'),
('CSE', 2, 'Tuesday',   '11:15-12:15', 'Object Oriented Programming',   'Ms. T Nagalakshmi',         'CSE-201'),
('CSE', 2, 'Tuesday',   '12:15-13:15', 'Computer Organization',         'Mr. R Karthik',             'CSE-201'),
('CSE', 2, 'Tuesday',   '14:00-16:00', 'OOP Lab',                       'Ms. T Nagalakshmi',         'CSE Lab 2'),
('CSE', 2, 'Wednesday', '09:00-10:00', 'Discrete Mathematics',          'Ms. G Sathya',              'CSE-201'),
('CSE', 2, 'Wednesday', '10:00-11:00', 'Operating Systems',             'Ms. K Mohanappriya',        'CSE-201'),
('CSE', 2, 'Wednesday', '11:15-12:15', 'Data Structures',               'Dr. S Rajalakshmi',         'CSE-201'),
('CSE', 2, 'Wednesday', '12:15-13:15', 'Mathematics III',               'Ms. G Sathya',              'CSE-201'),
('CSE', 2, 'Wednesday', '14:00-16:00', 'Computer Networks Lab',         'Mr. L Parthipan',           'Networks Lab'),
('CSE', 2, 'Thursday',  '09:00-10:00', 'Computer Networks',             'Mr. L Parthipan',           'CSE-201'),
('CSE', 2, 'Thursday',  '10:00-11:00', 'Object Oriented Programming',   'Ms. T Nagalakshmi',         'CSE-201'),
('CSE', 2, 'Thursday',  '11:15-12:15', 'Operating Systems',             'Ms. K Mohanappriya',        'CSE-201'),
('CSE', 2, 'Thursday',  '12:15-13:15', 'Computer Organization',         'Mr. R Karthik',             'CSE-201'),
('CSE', 2, 'Thursday',  '14:00-15:00', 'Discrete Mathematics',          'Ms. G Sathya',              'CSE-201'),
('CSE', 2, 'Friday',    '09:00-10:00', 'Operating Systems',             'Ms. K Mohanappriya',        'CSE-201'),
('CSE', 2, 'Friday',    '10:00-11:00', 'Computer Networks',             'Mr. L Parthipan',           'CSE-201'),
('CSE', 2, 'Friday',    '11:15-12:15', 'Mathematics III',               'Ms. G Sathya',              'CSE-201'),
('CSE', 2, 'Friday',    '12:15-13:15', 'Data Structures',               'Dr. S Rajalakshmi',         'CSE-201'),
('CSE', 2, 'Friday',    '14:00-16:00', 'OS Lab',                        'Ms. K Mohanappriya',        'CSE Lab 1');

-- CSE Year 3
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 3, 'Monday',    '09:00-10:00', 'Database Management Systems',   'Dr. K.S Chandrasekaran',    'CSE-301'),
('CSE', 3, 'Monday',    '10:00-11:00', 'Software Engineering',          'Dr. S Mohana',              'CSE-301'),
('CSE', 3, 'Monday',    '11:15-12:15', 'Theory of Computation',         'Ms. J Sathiaparkavi',       'CSE-301'),
('CSE', 3, 'Monday',    '12:15-13:15', 'Computer Networks II',          'Ms. P Rohini',              'CSE-301'),
('CSE', 3, 'Monday',    '14:00-16:00', 'DBMS Lab',                      'Dr. K.S Chandrasekaran',    'CSE Lab 3'),
('CSE', 3, 'Tuesday',   '09:00-10:00', 'Algorithm Design',              'Dr. S Rajalakshmi',         'CSE-301'),
('CSE', 3, 'Tuesday',   '10:00-11:00', 'Database Management Systems',   'Dr. K.S Chandrasekaran',    'CSE-301'),
('CSE', 3, 'Tuesday',   '11:15-12:15', 'Software Engineering',          'Dr. S Mohana',              'CSE-301'),
('CSE', 3, 'Tuesday',   '12:15-13:15', 'Theory of Computation',         'Ms. J Sathiaparkavi',       'CSE-301'),
('CSE', 3, 'Tuesday',   '14:00-16:00', 'Networks Lab',                  'Ms. P Rohini',              'Networks Lab'),
('CSE', 3, 'Wednesday', '09:00-10:00', 'Computer Networks II',          'Ms. P Rohini',              'CSE-301'),
('CSE', 3, 'Wednesday', '10:00-11:00', 'Algorithm Design',              'Dr. S Rajalakshmi',         'CSE-301'),
('CSE', 3, 'Wednesday', '11:15-12:15', 'Database Management Systems',   'Dr. K.S Chandrasekaran',    'CSE-301'),
('CSE', 3, 'Wednesday', '12:15-13:15', 'Elective I',                    'Ms. E Shapna Rani',         'CSE-301'),
('CSE', 3, 'Wednesday', '14:00-16:00', 'Algorithm Lab',                 'Dr. S Rajalakshmi',         'CSE Lab 3'),
('CSE', 3, 'Thursday',  '09:00-10:00', 'Software Engineering',          'Dr. S Mohana',              'CSE-301'),
('CSE', 3, 'Thursday',  '10:00-11:00', 'Elective I',                    'Ms. E Shapna Rani',         'CSE-301'),
('CSE', 3, 'Thursday',  '11:15-12:15', 'Theory of Computation',         'Ms. J Sathiaparkavi',       'CSE-301'),
('CSE', 3, 'Thursday',  '12:15-13:15', 'Algorithm Design',              'Dr. S Rajalakshmi',         'CSE-301'),
('CSE', 3, 'Thursday',  '14:00-16:00', 'Project Review I',              'Dr. V Punitha',             'Seminar Hall'),
('CSE', 3, 'Friday',    '09:00-10:00', 'Elective I',                    'Ms. E Shapna Rani',         'CSE-301'),
('CSE', 3, 'Friday',    '10:00-11:00', 'Computer Networks II',          'Ms. P Rohini',              'CSE-301'),
('CSE', 3, 'Friday',    '11:15-12:15', 'Software Engineering',          'Dr. S Mohana',              'CSE-301'),
('CSE', 3, 'Friday',    '12:15-13:15', 'Database Management Systems',   'Dr. K.S Chandrasekaran',    'CSE-301');

-- CSE Year 4
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('CSE', 4, 'Monday',    '09:00-10:00', 'Machine Learning',              'Dr. R Senthamil Selvi',     'CSE-401'),
('CSE', 4, 'Monday',    '10:00-11:00', 'Cloud Computing',               'Ms. N Ramya',               'CSE-401'),
('CSE', 4, 'Monday',    '11:15-12:15', 'Elective III',                  'Ms. C Maria Rhythm',        'CSE-401'),
('CSE', 4, 'Monday',    '14:00-16:00', 'Project Work',                  'Dr. V Punitha',             'Project Lab'),
('CSE', 4, 'Tuesday',   '09:00-10:00', 'Machine Learning',              'Dr. R Senthamil Selvi',     'CSE-401'),
('CSE', 4, 'Tuesday',   '10:00-11:00', 'Elective II',                   'Ms. A Rachel Roselin',      'CSE-401'),
('CSE', 4, 'Tuesday',   '11:15-12:15', 'Cloud Computing',               'Ms. N Ramya',               'CSE-401'),
('CSE', 4, 'Tuesday',   '14:00-16:00', 'Project Work',                  'Dr. V Punitha',             'Project Lab'),
('CSE', 4, 'Wednesday', '09:00-10:00', 'Elective II',                   'Ms. A Rachel Roselin',      'CSE-401'),
('CSE', 4, 'Wednesday', '10:00-12:00', 'Machine Learning Lab',          'Dr. R Senthamil Selvi',     'AI Lab'),
('CSE', 4, 'Wednesday', '14:00-16:00', 'Project Work',                  'Dr. S Mohana',              'Project Lab'),
('CSE', 4, 'Thursday',  '09:00-10:00', 'Cloud Computing',               'Ms. N Ramya',               'CSE-401'),
('CSE', 4, 'Thursday',  '10:00-11:00', 'Elective III',                  'Ms. C Maria Rhythm',        'CSE-401'),
('CSE', 4, 'Thursday',  '14:00-16:00', 'Project Review',                'Dr. V Punitha',             'Seminar Hall'),
('CSE', 4, 'Friday',    '09:00-10:00', 'Elective II',                   'Ms. A Rachel Roselin',      'CSE-401'),
('CSE', 4, 'Friday',    '10:00-11:00', 'Elective III',                  'Ms. C Maria Rhythm',        'CSE-401'),
('CSE', 4, 'Friday',    '11:15-12:15', 'Machine Learning',              'Dr. R Senthamil Selvi',     'CSE-401');

-- IT Year 1
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 1, 'Monday',    '09:00-10:00', 'Mathematics I',                  'Ms. A Sheelavathi',         'IT-101'),
('IT', 1, 'Monday',    '10:00-11:00', 'Engineering Physics',            'Physics HOD',               'IT-101'),
('IT', 1, 'Monday',    '11:15-12:15', 'Problem Solving & Python',       'Mr. V Senthil Balaji',      'IT-101'),
('IT', 1, 'Monday',    '12:15-13:15', 'Engineering Graphics',           'Mr. D Raghu Raman',         'IT-101'),
('IT', 1, 'Monday',    '14:00-16:00', 'Python Lab',                     'Ms. J Sangeethapriya',      'IT Lab 1'),
('IT', 1, 'Tuesday',   '09:00-10:00', 'Mathematics I',                  'Ms. A Sheelavathi',         'IT-101'),
('IT', 1, 'Tuesday',   '10:00-11:00', 'Problem Solving & Python',       'Mr. V Senthil Balaji',      'IT-101'),
('IT', 1, 'Tuesday',   '11:15-12:15', 'Engineering Chemistry',          'Chemistry HOD',             'IT-101'),
('IT', 1, 'Tuesday',   '12:15-13:15', 'Engineering Graphics',           'Mr. D Raghu Raman',         'IT-101'),
('IT', 1, 'Tuesday',   '14:00-16:00', 'Engineering Graphics Lab',       'Mr. D Raghu Raman',         'Drawing Hall'),
('IT', 1, 'Wednesday', '09:00-10:00', 'Engineering Physics',            'Physics HOD',               'IT-101'),
('IT', 1, 'Wednesday', '10:00-11:00', 'Engineering Chemistry',          'Chemistry HOD',             'IT-101'),
('IT', 1, 'Wednesday', '11:15-12:15', 'Mathematics I',                  'Ms. A Sheelavathi',         'IT-101'),
('IT', 1, 'Wednesday', '12:15-13:15', 'English for Engineers',          'English HOD',               'IT-101'),
('IT', 1, 'Wednesday', '14:00-16:00', 'Physics Lab',                    'Physics HOD',               'Physics Lab'),
('IT', 1, 'Thursday',  '09:00-10:00', 'Problem Solving & Python',       'Mr. V Senthil Balaji',      'IT-101'),
('IT', 1, 'Thursday',  '10:00-11:00', 'Engineering Physics',            'Physics HOD',               'IT-101'),
('IT', 1, 'Thursday',  '11:15-12:15', 'Mathematics I',                  'Ms. A Sheelavathi',         'IT-101'),
('IT', 1, 'Thursday',  '12:15-13:15', 'Engineering Chemistry',          'Chemistry HOD',             'IT-101'),
('IT', 1, 'Thursday',  '14:00-15:00', 'English for Engineers',          'English HOD',               'IT-101'),
('IT', 1, 'Friday',    '09:00-10:00', 'English for Engineers',          'English HOD',               'IT-101'),
('IT', 1, 'Friday',    '10:00-11:00', 'Engineering Graphics',           'Mr. D Raghu Raman',         'IT-101'),
('IT', 1, 'Friday',    '11:15-12:15', 'Problem Solving & Python',       'Mr. V Senthil Balaji',      'IT-101'),
('IT', 1, 'Friday',    '14:00-16:00', 'Chemistry Lab',                  'Chemistry HOD',             'Chemistry Lab');

-- IT Year 2
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 2, 'Monday',    '09:00-10:00', 'Data Structures',                'Dr. R Rengaraj alias Muralidharan', 'IT-201'),
('IT', 2, 'Monday',    '10:00-11:00', 'Computer Architecture',          'Mr. V Senthil Balaji',      'IT-201'),
('IT', 2, 'Monday',    '11:15-12:15', 'Discrete Mathematics',           'Ms. A Sheelavathi',         'IT-201'),
('IT', 2, 'Monday',    '12:15-13:15', 'Object Oriented Programming',    'Ms. J Sangeethapriya',      'IT-201'),
('IT', 2, 'Monday',    '14:00-16:00', 'Data Structures Lab',            'Dr. R Rengaraj alias Muralidharan', 'IT Lab 2'),
('IT', 2, 'Tuesday',   '09:00-10:00', 'Mathematics III',                'Ms. A Sheelavathi',         'IT-201'),
('IT', 2, 'Tuesday',   '10:00-11:00', 'Data Structures',                'Dr. R Rengaraj alias Muralidharan', 'IT-201'),
('IT', 2, 'Tuesday',   '11:15-12:15', 'Operating Systems',              'Mr. D Raghu Raman',         'IT-201'),
('IT', 2, 'Tuesday',   '12:15-13:15', 'Computer Architecture',          'Mr. V Senthil Balaji',      'IT-201'),
('IT', 2, 'Tuesday',   '14:00-16:00', 'OOP Lab',                        'Ms. J Sangeethapriya',      'IT Lab 2'),
('IT', 2, 'Wednesday', '09:00-10:00', 'Discrete Mathematics',           'Ms. A Sheelavathi',         'IT-201'),
('IT', 2, 'Wednesday', '10:00-11:00', 'Object Oriented Programming',    'Ms. J Sangeethapriya',      'IT-201'),
('IT', 2, 'Wednesday', '11:15-12:15', 'Mathematics III',                'Ms. A Sheelavathi',         'IT-201'),
('IT', 2, 'Wednesday', '14:00-16:00', 'Networks Lab',                   'Ms. K Muthukarupaee',       'Networks Lab'),
('IT', 2, 'Thursday',  '09:00-10:00', 'Computer Networks',              'Ms. K Muthukarupaee',       'IT-201'),
('IT', 2, 'Thursday',  '10:00-11:00', 'Data Structures',                'Dr. R Rengaraj alias Muralidharan', 'IT-201'),
('IT', 2, 'Thursday',  '11:15-12:15', 'Operating Systems',              'Mr. D Raghu Raman',         'IT-201'),
('IT', 2, 'Thursday',  '12:15-13:15', 'Mathematics III',                'Ms. A Sheelavathi',         'IT-201'),
('IT', 2, 'Thursday',  '14:00-16:00', 'OS Lab',                         'Mr. D Raghu Raman',         'IT Lab 1'),
('IT', 2, 'Friday',    '09:00-10:00', 'Operating Systems',              'Mr. D Raghu Raman',         'IT-201'),
('IT', 2, 'Friday',    '10:00-11:00', 'Computer Networks',              'Ms. K Muthukarupaee',       'IT-201'),
('IT', 2, 'Friday',    '11:15-12:15', 'Object Oriented Programming',    'Ms. J Sangeethapriya',      'IT-201'),
('IT', 2, 'Friday',    '12:15-13:15', 'Discrete Mathematics',           'Ms. A Sheelavathi',         'IT-201');

-- IT Year 3
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 3, 'Monday',    '09:00-10:00', 'Database Management Systems',    'Dr. R Thillaikarasi',       'IT-301'),
('IT', 3, 'Monday',    '10:00-11:00', 'Software Engineering',           'Ms. M Jebarani',            'IT-301'),
('IT', 3, 'Monday',    '11:15-12:15', 'Internet Technologies',          'Ms. G Sathiya',             'IT-301'),
('IT', 3, 'Monday',    '14:00-16:00', 'DBMS Lab',                       'Dr. R Thillaikarasi',       'IT Lab 2'),
('IT', 3, 'Tuesday',   '09:00-10:00', 'Web Technologies',               'Ms. S Angel Sweety Sheeba', 'IT-301'),
('IT', 3, 'Tuesday',   '10:00-11:00', 'Database Management Systems',    'Dr. R Thillaikarasi',       'IT-301'),
('IT', 3, 'Tuesday',   '11:15-12:15', 'Software Engineering',           'Ms. M Jebarani',            'IT-301'),
('IT', 3, 'Tuesday',   '14:00-16:00', 'Web Technologies Lab',           'Ms. S Angel Sweety Sheeba', 'IT Lab 1'),
('IT', 3, 'Wednesday', '09:00-10:00', 'Internet Technologies',          'Ms. G Sathiya',             'IT-301'),
('IT', 3, 'Wednesday', '10:00-11:00', 'Web Technologies',               'Ms. S Angel Sweety Sheeba', 'IT-301'),
('IT', 3, 'Wednesday', '14:00-16:00', 'Software Engineering Lab',       'Ms. M Jebarani',            'IT Lab 2'),
('IT', 3, 'Thursday',  '09:00-10:00', 'Database Management Systems',    'Dr. R Thillaikarasi',       'IT-301'),
('IT', 3, 'Thursday',  '10:00-11:00', 'Elective I',                     'Ms. K Muthukarupaee',       'IT-301'),
('IT', 3, 'Thursday',  '11:15-12:15', 'Internet Technologies',          'Ms. G Sathiya',             'IT-301'),
('IT', 3, 'Thursday',  '14:00-16:00', 'Project Review I',               'Dr. R Thillaikarasi',       'Seminar Hall'),
('IT', 3, 'Friday',    '09:00-10:00', 'Software Engineering',           'Ms. M Jebarani',            'IT-301'),
('IT', 3, 'Friday',    '10:00-11:00', 'Elective I',                     'Ms. K Muthukarupaee',       'IT-301'),
('IT', 3, 'Friday',    '11:15-12:15', 'Web Technologies',               'Ms. S Angel Sweety Sheeba', 'IT-301');

-- IT Year 4
INSERT INTO timetable (department, year, day, time_slot, subject, faculty_name, room) VALUES
('IT', 4, 'Monday',    '09:00-10:00', 'Cloud Computing',                'Mr. V Senthil Balaji',      'IT-401'),
('IT', 4, 'Monday',    '10:00-11:00', 'Machine Learning',               'Dr. R Thillaikarasi',       'IT-401'),
('IT', 4, 'Monday',    '11:15-12:15', 'Elective III',                   'Ms. G Sathiya',             'IT-401'),
('IT', 4, 'Monday',    '14:00-16:00', 'Project Work',                   'Dr. R Thillaikarasi',       'Project Lab'),
('IT', 4, 'Tuesday',   '09:00-10:00', 'Cloud Computing',                'Mr. V Senthil Balaji',      'IT-401'),
('IT', 4, 'Tuesday',   '10:00-11:00', 'Elective II',                    'Ms. M Jebarani',            'IT-401'),
('IT', 4, 'Tuesday',   '14:00-16:00', 'Project Work',                   'Dr. R Thillaikarasi',       'Project Lab'),
('IT', 4, 'Wednesday', '09:00-10:00', 'Machine Learning',               'Dr. R Thillaikarasi',       'IT-401'),
('IT', 4, 'Wednesday', '14:00-16:00', 'Project Work',                   'Ms. M Jebarani',            'Project Lab'),
('IT', 4, 'Thursday',  '09:00-10:00', 'Elective III',                   'Ms. G Sathiya',             'IT-401'),
('IT', 4, 'Thursday',  '10:00-11:00', 'Cloud Computing',                'Mr. V Senthil Balaji',      'IT-401'),
('IT', 4, 'Thursday',  '14:00-16:00', 'Project Review',                 'Dr. R Thillaikarasi',       'Seminar Hall'),
('IT', 4, 'Friday',    '09:00-10:00', 'Machine Learning',               'Dr. R Thillaikarasi',       'IT-401'),
('IT', 4, 'Friday',    '10:00-11:00', 'Elective II',                    'Ms. M Jebarani',            'IT-401'),
('IT', 4, 'Friday',    '11:15-12:15', 'Elective III',                   'Ms. G Sathiya',             'IT-401');

-- Announcements (sample)
INSERT INTO announcements (title, body) VALUES
('Welcome to Campus Compass AI!', 'Your all-in-one smart campus assistant is now live. Explore events, clubs, timetables, and talk to our AI campus guide.'),
('Fee Payment Deadline', 'Semester fee payment deadline is August 31, 2026. Pay through the college portal or via DD to the accounts office.'),
('Smart India Hackathon 2026', 'Internal rounds for SIH 2026 will be held on August 20. Register your team on the Events page before August 15.');

SELECT CONCAT('Timetable rows: ', COUNT(*)) AS status FROM timetable;
SELECT CONCAT('Faculty rows: ', COUNT(*)) AS status FROM faculty;
SELECT CONCAT('Event rows: ', COUNT(*)) AS status FROM events;
SELECT CONCAT('Club rows: ', COUNT(*)) AS status FROM clubs;
SELECT CONCAT('Announcement rows: ', COUNT(*)) AS status FROM announcements;
