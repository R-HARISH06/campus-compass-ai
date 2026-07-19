-- Faculty seed data — from saranathan.ac.in (Phase 1)
-- Clear existing faculty data before re-seeding
DELETE FROM faculty;

-- CSE Department (19 members — scraped)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. V Punitha', 'M.E., Ph.D', 'Professor & Head', 'CSE', 'punitha-it@saranathan.ac.in', TRUE),
('Dr. R Senthamil Selvi', 'M.E., Ph.D', 'Professor', 'CSE', 'senthamilselvi-cse@saranathan.ac.in', FALSE),
('Dr. S Mohana', 'M.E., Ph.D', 'Professor', 'CSE', 'mohana-cse@saranathan.ac.in', FALSE),
('Dr. K.S Chandrasekaran', 'M.E., Ph.D', 'Associate Professor', 'CSE', 'chandrasekaran-cse@saranathan.ac.in', FALSE),
('Dr. S Rajalakshmi', 'M.E, Ph.D', 'Assistant Professor', 'CSE', 'rajalakshmi7103@saranathan.ac.in', FALSE),
('Mr. D Boobala Muralitharan', 'M.E.', 'Assistant Professor', 'CSE', 'boobala-cse@saranathan.ac.in', FALSE),
('Ms. R Sugantha Lakshmi', 'M.E', 'Assistant Professor', 'CSE', 'suganthalakshmi7127@saranathan.ac.in', FALSE),
('Ms. T Nagalakshmi', 'M.E', 'Assistant Professor', 'CSE', 'nagalakshmi7160@saranathan.ac.in', FALSE),
('Mr. R Karthik', 'M.E.', 'Assistant Professor', 'CSE', 'karthik-cse@saranathan.ac.in', FALSE),
('Ms. K Mohanappriya', 'M.E.', 'Assistant Professor', 'CSE', 'mohanapriya-cse@saranathan.ac.in', FALSE),
('Ms. J Sathiaparkavi', 'M.E.', 'Assistant Professor', 'CSE', 'parkavi-cse@saranathan.ac.in', FALSE),
('Ms. E Shapna Rani', 'M.E', 'Assistant Professor', 'CSE', 'shapnarani-cse@saranathan.ac.in', FALSE),
('Ms. P Rohini', 'M.E', 'Assistant Professor', 'CSE', 'rohini7133@saranathan.ac.in', FALSE),
('Ms. C Maria Rhythm', 'M.E.', 'Assistant Professor', 'CSE', 'mariarhythm7182@saranathan.ac.in', FALSE),
('Ms. A Rachel Roselin', 'M.E', 'Assistant Professor', 'CSE', 'rachelroselin7158@saranathan.ac.in', FALSE),
('Ms. N Ramya', 'M.E', 'Assistant Professor', 'CSE', 'ramya-cse@saranathan.ac.in', FALSE),
('Mr. L Parthipan', 'M.E', 'Assistant Professor', 'CSE', 'parthipan7129@saranathan.ac.in', FALSE),
('Ms. G Sathya', 'M.E', 'Assistant Professor', 'CSE', 'sathya7144@saranathan.ac.in', FALSE),
('Ms. G Roshini', 'M.Tech.', 'Assistant Professor', 'CSE', 'roshini7146@saranathan.ac.in', FALSE);

-- IT Department (10 members — scraped)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. R Thillaikarasi', 'M.Tech., Ph.D', 'Professor & Head', 'IT', 'thillai-cse@saranathan.ac.in', TRUE),
('Dr. R Rengaraj alias Muralidharan', 'M.E, Ph.D', 'Assistant Professor', 'IT', 'rengaraj-it@saranathan.ac.in', FALSE),
('Ms. J Sangeethapriya', 'M.Tech.', 'Assistant Professor', 'IT', 'jspriya-it@saranathan.ac.in', FALSE),
('Mr. V Senthil Balaji', 'M.E.', 'Assistant Professor', 'IT', 'senthilbalaji-it@saranathan.ac.in', FALSE),
('Ms. A Sheelavathi', 'M.E.', 'Assistant Professor', 'IT', 'sheelavathi-it@saranathan.ac.in', FALSE),
('Mr. D Raghu Raman', 'M.E.', 'Assistant Professor', 'IT', 'raghuraman7188@saranathan.ac.in', FALSE),
('Ms. K Muthukarupaee', 'M.E.', 'Assistant Professor', 'IT', 'muthukarupaee-it@saranathan.ac.in', FALSE),
('Ms. M Jebarani', 'M.E', 'Assistant Professor', 'IT', 'jebarani7104@saranathan.ac.in', FALSE),
('Ms. G Sathiya', 'M.E', 'Assistant Professor', 'IT', 'sathiya-cse@saranathan.ac.in', FALSE),
('Ms. S Angel Sweety Sheeba', 'M.E.', 'Assistant Professor', 'IT', 'angel-it@saranathan.ac.in', FALSE);

-- ECE (representative — update via admin panel once scraped)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. S Rajkumar', 'M.E., Ph.D', 'Professor & Head', 'ECE', 'rajkumar-ece@saranathan.ac.in', TRUE),
('Dr. N Krishnaveni', 'M.E., Ph.D', 'Professor', 'ECE', 'krishnaveni-ece@saranathan.ac.in', FALSE),
('Mr. P Aravind', 'M.E.', 'Assistant Professor', 'ECE', 'aravind-ece@saranathan.ac.in', FALSE),
('Ms. R Priya', 'M.E.', 'Assistant Professor', 'ECE', 'priya-ece@saranathan.ac.in', FALSE),
('Mr. S Vignesh', 'M.E.', 'Assistant Professor', 'ECE', 'vignesh-ece@saranathan.ac.in', FALSE);

-- EEE (representative)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. T Mahalakshmi', 'M.E., Ph.D', 'Professor & Head', 'EEE', 'mahalakshmi-eee@saranathan.ac.in', TRUE),
('Mr. K Suresh', 'M.E.', 'Assistant Professor', 'EEE', 'suresh-eee@saranathan.ac.in', FALSE),
('Ms. B Kavitha', 'M.E.', 'Assistant Professor', 'EEE', 'kavitha-eee@saranathan.ac.in', FALSE),
('Mr. R Dinesh', 'M.E.', 'Assistant Professor', 'EEE', 'dinesh-eee@saranathan.ac.in', FALSE);

-- AIDS (representative)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. M Anitha', 'M.E., Ph.D', 'Professor & Head', 'AIDS', 'anitha-aids@saranathan.ac.in', TRUE),
('Ms. P Deepika', 'M.E.', 'Assistant Professor', 'AIDS', 'deepika-aids@saranathan.ac.in', FALSE),
('Mr. S Harish', 'M.E.', 'Assistant Professor', 'AIDS', 'harish-aids@saranathan.ac.in', FALSE),
('Ms. T Santhiya', 'M.Tech.', 'Assistant Professor', 'AIDS', 'santhiya-aids@saranathan.ac.in', FALSE);

-- AIML (representative)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. R Vijayalakshmi', 'M.E., Ph.D', 'Professor & Head', 'AIML', 'vijaya-aiml@saranathan.ac.in', TRUE),
('Mr. A Prasanth', 'M.E.', 'Assistant Professor', 'AIML', 'prasanth-aiml@saranathan.ac.in', FALSE),
('Ms. K Nithya', 'M.Tech.', 'Assistant Professor', 'AIML', 'nithya-aiml@saranathan.ac.in', FALSE);

-- MECH (representative)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. V Murugan', 'M.E., Ph.D', 'Professor & Head', 'MECH', 'murugan-mech@saranathan.ac.in', TRUE),
('Mr. S Balasubramanian', 'M.E.', 'Associate Professor', 'MECH', 'bala-mech@saranathan.ac.in', FALSE),
('Mr. T Karthikeyan', 'M.E.', 'Assistant Professor', 'MECH', 'karthikeyan-mech@saranathan.ac.in', FALSE),
('Ms. R Uma', 'M.E.', 'Assistant Professor', 'MECH', 'uma-mech@saranathan.ac.in', FALSE);

-- MBA (representative)
INSERT INTO faculty (name, qualification, designation, department, email, is_hod) VALUES
('Dr. A Jayanthi', 'MBA, Ph.D', 'Professor & Head', 'MBA', 'jayanthi-mba@saranathan.ac.in', TRUE),
('Mr. S Senthilkumar', 'MBA', 'Assistant Professor', 'MBA', 'senthil-mba@saranathan.ac.in', FALSE),
('Ms. P Lavanya', 'MBA', 'Assistant Professor', 'MBA', 'lavanya-mba@saranathan.ac.in', FALSE);

SELECT CONCAT('Faculty seeded: ', COUNT(*), ' records') AS status FROM faculty;
