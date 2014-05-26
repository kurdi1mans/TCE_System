-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2014 at 12:08 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `tce_database`
--

-- --------------------------------------------------------

--
-- Table structure for table `account_creation_list`
--

CREATE TABLE IF NOT EXISTS `account_creation_list` (
  `email` varchar(40) NOT NULL,
  `processed` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `announcement_list`
--

CREATE TABLE IF NOT EXISTS `announcement_list` (
  `instance_id` int(10) NOT NULL,
  `supervisor_id` int(10) NOT NULL,
  `processed` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`instance_id`,`supervisor_id`),
  KEY `supervisor_id` (`supervisor_id`),
  KEY `instance_id` (`instance_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `announcement_list`:
--   `supervisor_id`
--       `supervisor` -> `Supervisor_ID`
--   `instance_id`
--       `evaluation_instance` -> `Instance_ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `college`
--

CREATE TABLE IF NOT EXISTS `college` (
  `college_code` varchar(7) NOT NULL,
  PRIMARY KEY (`college_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `college`
--

INSERT INTO `college` (`college_code`) VALUES
('CCSE'),
('CES'),
('CIM');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `Company_ID` int(10) NOT NULL AUTO_INCREMENT,
  `Company_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Company_location` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`Company_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`Company_ID`, `Company_name`, `Company_location`) VALUES
(1, 'Aramco', 'Dhahran'),
(2, 'Aramco', 'Ras Tanura'),
(3, 'Aramco', 'Tanajib'),
(4, 'Sabic', 'Riyadh'),
(5, 'Sabic', 'Yanbu');

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE IF NOT EXISTS `course` (
  `Course_ID` varchar(7) NOT NULL,
  `Training_Type` varchar(10) NOT NULL,
  `Major_Code` varchar(7) NOT NULL,
  `Department_Code` varchar(7) NOT NULL,
  `College_Code` varchar(7) NOT NULL,
  PRIMARY KEY (`Course_ID`),
  KEY `Major_Code` (`Major_Code`),
  KEY `Department_Code` (`Department_Code`),
  KEY `College_Code` (`College_Code`),
  KEY `Training_Type` (`Training_Type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `course`:
--   `Training_Type`
--       `training_type` -> `training_type`
--   `Major_Code`
--       `major` -> `major_code`
--   `Department_Code`
--       `department` -> `department_code`
--   `College_Code`
--       `college` -> `college_code`
--

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`Course_ID`, `Training_Type`, `Major_Code`, `Department_Code`, `College_Code`) VALUES
('ACCT350', 'coop', 'ACCT', 'ACCT', 'CIM'),
('ACCT351', 'coop', 'ACCT', 'ACCT', 'CIM'),
('ACCT353', 'coop', 'ACCT', 'ACCT', 'CIM'),
('ACCT399', 'summer', 'ACCT', 'ACCT', 'CIM'),
('COE350', 'coop', 'COE', 'COE', 'CCSE'),
('COE351', 'coop', 'COE', 'COE', 'CCSE'),
('COE399', 'summer', 'COE', 'COE', 'CCSE'),
('ICS350', 'coop', 'CS', 'ICS', 'CCSE'),
('ICS351', 'coop', 'CS', 'ICS', 'CCSE'),
('ICS399', 'summer', 'CS', 'ICS', 'CCSE'),
('ME350', 'coop', 'ME', 'ME', 'CES'),
('ME351', 'coop', 'ME', 'ME', 'CES'),
('ME399', 'summer', 'ME', 'ME', 'CES'),
('MIS350', 'coop', 'MIS', 'ACCT', 'CIM'),
('MIS351', 'coop', 'MIS', 'ACCT', 'CIM'),
('MIS399', 'summer', 'MIS', 'ACCT', 'CIM'),
('SWE399', 'summer', 'SWE', 'ICS', 'CCSE');

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollment`
--

CREATE TABLE IF NOT EXISTS `course_enrollment` (
  `Student_ID` varchar(10) NOT NULL,
  `Course_ID` varchar(7) NOT NULL,
  `Semester` varchar(3) NOT NULL,
  PRIMARY KEY (`Student_ID`,`Course_ID`,`Semester`),
  KEY `Course_ID` (`Course_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `course_enrollment`:
--   `Course_ID`
--       `course` -> `Course_ID`
--   `Student_ID`
--       `student` -> `Student_ID`
--

--
-- Dumping data for table `course_enrollment`
--

INSERT INTO `course_enrollment` (`Student_ID`, `Course_ID`, `Semester`) VALUES
('111111111', 'ACCT350', '132'),
('111111150', 'ACCT350', '132'),
('111111153', 'ACCT350', '132'),
('111111161', 'ACCT350', '132'),
('111111129', 'ACCT351', '131'),
('111111142', 'ACCT351', '131'),
('111111154', 'ACCT351', '131'),
('111111115', 'ACCT399', '133'),
('111111116', 'ACCT399', '133'),
('111111125', 'ACCT399', '133'),
('111111135', 'COE350', '132'),
('111111139', 'COE350', '132'),
('111111151', 'COE350', '132'),
('111111119', 'COE351', '131'),
('111111126', 'COE351', '131'),
('111111159', 'COE351', '131'),
('111111132', 'COE399', '133'),
('111111137', 'COE399', '133'),
('111111146', 'COE399', '133'),
('111111147', 'COE399', '133'),
('111111112', 'ICS350', '133'),
('111111143', 'ICS350', '132'),
('111111155', 'ICS350', '132'),
('111111163', 'ICS350', '131'),
('111111133', 'ICS351', '131'),
('111111145', 'ICS351', '131'),
('111111148', 'ICS351', '131'),
('111111123', 'ICS399', '133'),
('111111144', 'ICS399', '133'),
('111111152', 'ICS399', '133'),
('111111160', 'ICS399', '133'),
('111111127', 'ME350', '132'),
('111111136', 'ME350', '132'),
('111111149', 'ME350', '132'),
('111111114', 'ME351', '131'),
('111111117', 'ME351', '131'),
('111111121', 'ME351', '131'),
('111111120', 'ME399', '133'),
('111111130', 'ME399', '133'),
('111111140', 'ME399', '133'),
('111111124', 'MIS350', '132'),
('111111157', 'MIS350', '132'),
('111111162', 'MIS350', '132'),
('111111131', 'MIS351', '131'),
('111111156', 'MIS351', '131'),
('111111158', 'MIS351', '131'),
('111111128', 'MIS399', '133'),
('111111134', 'MIS399', '133'),
('111111138', 'MIS399', '133'),
('111111141', 'MIS399', '133'),
('111111113', 'SWE399', '133'),
('111111118', 'SWE399', '133'),
('111111122', 'SWE399', '133');

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE IF NOT EXISTS `department` (
  `department_code` varchar(7) NOT NULL,
  `college_code` varchar(7) NOT NULL,
  PRIMARY KEY (`department_code`),
  KEY `college_code` (`college_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `department`:
--   `college_code`
--       `college` -> `college_code`
--

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`department_code`, `college_code`) VALUES
('COE', 'CCSE'),
('ICS', 'CCSE'),
('ME', 'CES'),
('ACCT', 'CIM');

-- --------------------------------------------------------

--
-- Table structure for table `domain`
--

CREATE TABLE IF NOT EXISTS `domain` (
  `domain_id` int(10) NOT NULL AUTO_INCREMENT,
  `Instance_ID` int(10) NOT NULL,
  `Training_Type` varchar(10) NOT NULL,
  `Major_Code` varchar(7) NOT NULL,
  `Department_Code` varchar(7) NOT NULL,
  `College_Code` varchar(7) NOT NULL,
  `All` int(1) NOT NULL,
  PRIMARY KEY (`domain_id`),
  KEY `Training_Type` (`Training_Type`),
  KEY `Instance_ID` (`Instance_ID`),
  KEY `Instance_ID_2` (`Instance_ID`),
  KEY `Instance_ID_3` (`Instance_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- RELATIONS FOR TABLE `domain`:
--   `Instance_ID`
--       `evaluation_instance` -> `Instance_ID`
--

--
-- Dumping data for table `domain`
--

INSERT INTO `domain` (`domain_id`, `Instance_ID`, `Training_Type`, `Major_Code`, `Department_Code`, `College_Code`, `All`) VALUES
(2, 2, 'coop', '', 'ME', 'CCSE', 0),
(3, 3, 'coop', 'ACCT', '', 'CCSE', 0),
(4, 4, 'coop', '', 'ACCT', '', 0),
(5, 5, 'coop', 'MIS', '', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `evaluation`
--

CREATE TABLE IF NOT EXISTS `evaluation` (
  `Evaluation_ID` int(10) NOT NULL AUTO_INCREMENT,
  `Student_ID` varchar(10) NOT NULL,
  `Instance_ID` int(10) NOT NULL,
  `Evaluation_string` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Filling_date` date NOT NULL,
  `filled_by` int(10) NOT NULL,
  PRIMARY KEY (`Evaluation_ID`),
  KEY `Instance_ID` (`Instance_ID`),
  KEY `Student_ID` (`Student_ID`),
  KEY `filled_by` (`filled_by`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- RELATIONS FOR TABLE `evaluation`:
--   `Student_ID`
--       `student` -> `Student_ID`
--   `Instance_ID`
--       `evaluation_instance` -> `Instance_ID`
--   `filled_by`
--       `supervisor` -> `Supervisor_ID`
--

-- --------------------------------------------------------

--
-- Table structure for table `evaluation_instance`
--

CREATE TABLE IF NOT EXISTS `evaluation_instance` (
  `Instance_ID` int(10) NOT NULL AUTO_INCREMENT,
  `Template_ID` int(10) NOT NULL,
  `Semester` varchar(4) NOT NULL,
  `Starting_Date` date NOT NULL,
  `Expiration_Date` date NOT NULL,
  `fullyAnnounced` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`Instance_ID`),
  KEY `Template_ID` (`Template_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- RELATIONS FOR TABLE `evaluation_instance`:
--   `Template_ID`
--       `template` -> `Template_ID`
--

--
-- Dumping data for table `evaluation_instance`
--

INSERT INTO `evaluation_instance` (`Instance_ID`, `Template_ID`, `Semester`, `Starting_Date`, `Expiration_Date`, `fullyAnnounced`) VALUES
(1, 1, '131', '0000-00-00', '0000-00-00', 0),
(2, 1, '131', '2013-11-14', '2013-12-05', 0),
(3, 1, '132', '2014-02-06', '2014-03-20', 0),
(4, 1, '132', '2014-04-10', '2014-05-10', 0),
(5, 1, '132', '2014-04-13', '2014-05-10', 0);

-- --------------------------------------------------------

--
-- Table structure for table `major`
--

CREATE TABLE IF NOT EXISTS `major` (
  `major_code` varchar(7) NOT NULL,
  `department_code` varchar(7) NOT NULL,
  PRIMARY KEY (`major_code`),
  KEY `department_code` (`department_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `major`:
--   `department_code`
--       `department` -> `department_code`
--

--
-- Dumping data for table `major`
--

INSERT INTO `major` (`major_code`, `department_code`) VALUES
('ACCT', 'ACCT'),
('MIS', 'ACCT'),
('COE', 'COE'),
('CS', 'ICS'),
('SWE', 'ICS'),
('ME', 'ME');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE IF NOT EXISTS `student` (
  `Student_ID` varchar(10) NOT NULL,
  `Fname` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Lname` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(25) NOT NULL,
  `Supervisor_ID` int(10) NOT NULL,
  PRIMARY KEY (`Student_ID`),
  KEY `Supervisor_ID` (`Supervisor_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- RELATIONS FOR TABLE `student`:
--   `Supervisor_ID`
--       `supervisor` -> `Supervisor_ID`
--

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`Student_ID`, `Fname`, `Lname`, `Email`, `Supervisor_ID`) VALUES
('111111111', 'Mansour', 'Kurdi', '1111@123.com', 1),
('111111112', 'Ahmad', 'Khaled', '1112@123.com', 2),
('111111113', 'Khaled', 'Saeed', '1113@123.com', 3),
('111111114', 'Saeed', 'Ahamd', '1114@123.com', 1),
('111111115', 'Ahamd', 'Ali', '1115@123.com', 2),
('111111116', 'Ali', 'Neza', '1116@123.com', 2),
('111111117', 'Neza', 'Hamed', '1117@123.com', 4),
('111111118', 'Hamed', 'Husni', '1118@123.com', 4),
('111111119', 'Husni', 'Turki', '1119@123.com', 1),
('111111120', 'Turki', 'Saad', '1120@123.com', 2),
('111111121', 'Saad', 'Yasser', '1121@123.com', 3),
('111111122', 'Yasser', 'Yazan', '1122@123.com', 1),
('111111123', 'Yazan', 'Ibrahim', '1123@123.com', 2),
('111111124', 'Ibrahim', 'Moahammed', '1124@123.com', 4),
('111111125', 'Moahammed', 'Fahad', '1125@123.com', 3),
('111111126', 'Fahad', 'Malek', '1126@123.com', 2),
('111111127', 'Malek', 'Saeed', '1127@123.com', 4),
('111111128', 'Saeed', 'Ahamd', '1128@123.com', 3),
('111111129', 'Ahamd', 'Abdullah', '1129@123.com', 4),
('111111130', 'Abdullah', 'Baha', '1130@123.com', 4),
('111111131', 'Baha', 'Mamdoh', '1131@123.com', 4),
('111111132', 'Mamdoh', 'Yazeed', '1132@123.com', 1),
('111111133', 'Yazeed', 'Moahmmed', '1133@123.com', 2),
('111111134', 'Moahmmed', 'Senan', '1134@123.com', 4),
('111111135', 'Senan', 'Edrees', '1135@123.com', 1),
('111111136', 'Edrees', 'Salem', '1136@123.com', 4),
('111111137', 'Salem', 'Gabr', '1137@123.com', 2),
('111111138', 'Gabr', 'Lahouri', '1138@123.com', 4),
('111111139', 'Lahouri', 'Ghothi', '1139@123.com', 3),
('111111140', 'Ghothi', 'Youssef', '1140@123.com', 1),
('111111141', 'Youssef', 'Naser', '1141@123.com', 1),
('111111142', 'Naser', 'Mosaed', '1142@123.com', 4),
('111111143', 'Mosaed', 'Abullrahamn', '1143@123.com', 4),
('111111144', 'Abullrahamn', 'Turki', '1144@123.com', 3),
('111111145', 'Turki', 'Jasem', '1145@123.com', 2),
('111111146', 'Jasem', 'Soud', '1146@123.com', 1),
('111111147', 'Soud', 'Jameel', '1147@123.com', 1),
('111111148', 'Jameel', 'Jehad', '1148@123.com', 3),
('111111149', 'Jehad', 'Salem', '1149@123.com', 4),
('111111150', 'Salem', 'Khaled', '1150@123.com', 1),
('111111151', 'Khaled', 'Hossam', '1151@123.com', 1),
('111111152', 'Hossam', 'Abdullah', '1152@123.com', 1),
('111111153', 'Abdullah', 'Abdulraheem', '1153@123.com', 2),
('111111154', 'Abdulraheem', 'Abdulkareem', '1154@123.com', 4),
('111111155', 'Abdulkareem', 'Omar', '1155@123.com', 2),
('111111156', 'Omar', 'Mohsen', '1156@123.com', 2),
('111111157', 'Mohsen', 'Moahmmed', '1157@123.com', 2),
('111111158', 'Moahmmed', 'Ahmaed', '1158@123.com', 2),
('111111159', 'Ahmaed', 'Zain', '1159@123.com', 3),
('111111160', 'Zain', 'Mohialdeen', '1160@123.com', 4),
('111111161', 'Mohialdeen', 'Hossam', '1161@123.com', 1),
('111111162', 'Hossam', 'Taha', 's200924190@kfupm.edu.sa', 4),
('111111163', 'Hamdi', 'Abo Halawa', 'halawa@hhh.com', 4);

-- --------------------------------------------------------

--
-- Table structure for table `supervisor`
--

CREATE TABLE IF NOT EXISTS `supervisor` (
  `Supervisor_ID` int(10) NOT NULL AUTO_INCREMENT,
  `Name` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Email` varchar(25) NOT NULL,
  `Company_ID` int(10) NOT NULL,
  PRIMARY KEY (`Supervisor_ID`),
  KEY `Company_ID` (`Company_ID`),
  KEY `Email` (`Email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- RELATIONS FOR TABLE `supervisor`:
--   `Company_ID`
--       `company` -> `Company_ID`
--

--
-- Dumping data for table `supervisor`
--

INSERT INTO `supervisor` (`Supervisor_ID`, `Name`, `Email`, `Company_ID`) VALUES
(1, 'Aqeel', 'aqeel@123.com', 1),
(2, 'Yasser', 'yasser@123.com', 2),
(3, 'Khaled Al-qahta', 'khalid@123.com', 1),
(4, 'Ahmad Al-Harbi', 'ahmad@123.com', 3);

-- --------------------------------------------------------

--
-- Table structure for table `template`
--

CREATE TABLE IF NOT EXISTS `template` (
  `Template_ID` int(10) NOT NULL AUTO_INCREMENT,
  `template_name` varchar(50) NOT NULL,
  `Global_Values` text NOT NULL,
  `Evaluation_fields` text NOT NULL,
  PRIMARY KEY (`Template_ID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `template`
--

INSERT INTO `template` (`Template_ID`, `template_name`, `Global_Values`, `Evaluation_fields`) VALUES
(1, 'Template 1', 'a:4:{i:0;a:2:{i:0;s:31:"Excellent (exceeds expectation)";i:1;i:4;}i:1;a:2:{i:0;s:29:"Very Good (meets expectation)";i:1;i:3;}i:2;a:2:{i:0;s:31:"Good (barely meets expectation)";i:1;i:2;}i:3;a:2:{i:0;s:32:"Poor (fails to meet expectation)";i:1;i:1;}}', 'a:4:{i:0;a:7:{i:0;i:1;i:1;s:6:"rubric";i:2;s:66:"Ability to apply knowledge of mathematics, science and engineering";i:3;s:89:"Work demonstrates ample use of math, science and engineering principals in correct manner";i:4;s:94:"Work demonstrates adquete use of math, science and engineering principlas, with a few mistakes";i:5;s:90:"Work demonstrates some use of math, science and engineering principlas, with some mistakes";i:6;s:90:"Work demonstrates some use of math, science and engineering principlas, with many mistakes";}i:1;a:7:{i:0;i:2;i:1;s:6:"rubric";i:2;s:29:"Ability to function in a team";i:3;s:89:"Report shows clear interaction, cooperation or shared responsibility to complete the work";i:4;s:88:"Report shows some interaction, cooperation or shared responsibility to complete the work";i:5;s:88:"Report shows interaction, cooperation or shared responsibility with unclear contribution";i:6;s:73:"Report does not show any interaction, cooperation or shared responsbility";}i:2;a:3:{i:0;i:3;i:1;s:7:"textual";i:2;s:30:"Additional comments on student";}i:3;a:3:{i:0;i:4;i:1;s:7:"textual";i:2;s:11:"Suggestions";}}');

-- --------------------------------------------------------

--
-- Table structure for table `training_type`
--

CREATE TABLE IF NOT EXISTS `training_type` (
  `training_type` varchar(10) NOT NULL,
  PRIMARY KEY (`training_type`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `training_type`
--

INSERT INTO `training_type` (`training_type`) VALUES
('coop'),
('summer');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `username` varchar(30) NOT NULL,
  `hashed_password` varchar(100) NOT NULL,
  `user_type` varchar(10) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`username`, `hashed_password`, `user_type`) VALUES
('double click', '00000', 'tde');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `announcement_list`
--
ALTER TABLE `announcement_list`
  ADD CONSTRAINT `announcement_list_ibfk_2` FOREIGN KEY (`supervisor_id`) REFERENCES `supervisor` (`Supervisor_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `announcement_list_ibfk_3` FOREIGN KEY (`instance_id`) REFERENCES `evaluation_instance` (`Instance_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`Training_Type`) REFERENCES `training_type` (`training_type`) ON UPDATE CASCADE,
  ADD CONSTRAINT `course_ibfk_2` FOREIGN KEY (`Major_Code`) REFERENCES `major` (`major_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `course_ibfk_3` FOREIGN KEY (`Department_Code`) REFERENCES `department` (`department_code`) ON UPDATE CASCADE,
  ADD CONSTRAINT `course_ibfk_4` FOREIGN KEY (`College_Code`) REFERENCES `college` (`college_code`) ON UPDATE CASCADE;

--
-- Constraints for table `course_enrollment`
--
ALTER TABLE `course_enrollment`
  ADD CONSTRAINT `course_enrollment_ibfk_1` FOREIGN KEY (`Course_ID`) REFERENCES `course` (`Course_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `course_enrollment_ibfk_2` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `department_ibfk_1` FOREIGN KEY (`college_code`) REFERENCES `college` (`college_code`) ON UPDATE CASCADE;

--
-- Constraints for table `domain`
--
ALTER TABLE `domain`
  ADD CONSTRAINT `domain_ibfk_1` FOREIGN KEY (`Instance_ID`) REFERENCES `evaluation_instance` (`Instance_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`Student_ID`) REFERENCES `student` (`Student_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`Instance_ID`) REFERENCES `evaluation_instance` (`Instance_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `evaluation_ibfk_3` FOREIGN KEY (`filled_by`) REFERENCES `supervisor` (`Supervisor_ID`) ON UPDATE CASCADE;

--
-- Constraints for table `evaluation_instance`
--
ALTER TABLE `evaluation_instance`
  ADD CONSTRAINT `evaluation_instance_ibfk_1` FOREIGN KEY (`Template_ID`) REFERENCES `template` (`Template_ID`);

--
-- Constraints for table `major`
--
ALTER TABLE `major`
  ADD CONSTRAINT `major_ibfk_1` FOREIGN KEY (`department_code`) REFERENCES `department` (`department_code`) ON UPDATE CASCADE;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`Supervisor_ID`) REFERENCES `supervisor` (`Supervisor_ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `supervisor`
--
ALTER TABLE `supervisor`
  ADD CONSTRAINT `supervisor_ibfk_1` FOREIGN KEY (`Company_ID`) REFERENCES `company` (`Company_ID`) ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
