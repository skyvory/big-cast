-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2015 at 03:59 AM
-- Server version: 5.5.27
-- PHP Version: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `cast`
--

-- --------------------------------------------------------

--
-- Table structure for table `choice`
--

CREATE TABLE IF NOT EXISTS `choice` (
  `choice_id` int(16) NOT NULL AUTO_INCREMENT,
  `content` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `jumpto_line_id` int(16) DEFAULT NULL,
  `fk_line_id` int(16) NOT NULL,
  PRIMARY KEY (`choice_id`),
  KEY `choice_id` (`choice_id`),
  KEY `jumpto_line_id` (`jumpto_line_id`),
  KEY `fk_line_id` (`fk_line_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=32 ;

--
-- Dumping data for table `choice`
--

INSERT INTO `choice` (`choice_id`, `content`, `jumpto_line_id`, `fk_line_id`) VALUES
(23, 'first', 1, 48),
(24, 'first choice will throw you to the beginning', 1, 45),
(25, 'second choice would continue as is', NULL, 45),
(26, 'aaaa', 1, 44),
(27, 'bbbb', NULL, 44),
(28, 'cccc', NULL, 44),
(29, 'ddddd', NULL, 44),
(30, 'second', 46, 48),
(31, 'getting through the lines', NULL, 48);

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

CREATE TABLE IF NOT EXISTS `configuration` (
  `configuration_id` int(16) NOT NULL AUTO_INCREMENT,
  `fk_fonttype_id` int(8) NOT NULL,
  `text_speed` int(16) NOT NULL COMMENT 'delay per character',
  `bgm_volume` float NOT NULL,
  `voice_volume` float NOT NULL,
  `sfx_volume` float NOT NULL,
  `fk_user_id` int(16) NOT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`configuration_id`),
  KEY `configuration_id` (`configuration_id`),
  KEY `fk_fonttype_id` (`fk_fonttype_id`),
  KEY `fk_user_id` (`fk_user_id`),
  KEY `fk_project_id` (`fk_project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `configuration`
--

INSERT INTO `configuration` (`configuration_id`, `fk_fonttype_id`, `text_speed`, `bgm_volume`, `voice_volume`, `sfx_volume`, `fk_user_id`, `fk_project_id`) VALUES
(1, 7, 3, 0.6, 0.3, 0.3, 1, 1),
(2, 1, 1, 1, 1, 1, 7, 20),
(3, 1, 1, 1, 1, 1, 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `effect`
--

CREATE TABLE IF NOT EXISTS `effect` (
  `effect_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`effect_id`),
  KEY `effect_id` (`effect_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=13 ;

--
-- Dumping data for table `effect`
--

INSERT INTO `effect` (`effect_id`, `name`) VALUES
(1, 'no effect'),
(2, 'fade in (default)'),
(3, 'fade out (default)'),
(4, 'move in from left'),
(5, 'move out to left'),
(6, 'move in from right'),
(7, 'move out ot right'),
(8, 'move in from above'),
(9, 'move out to above'),
(10, 'move in from below'),
(11, 'move out to below');

-- --------------------------------------------------------

--
-- Table structure for table `fonttype`
--

CREATE TABLE IF NOT EXISTS `fonttype` (
  `fonttype_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`fonttype_id`),
  KEY `fonttype_id` (`fonttype_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Dumping data for table `fonttype`
--

INSERT INTO `fonttype` (`fonttype_id`, `name`) VALUES
(1, 'Arial'),
(2, 'Helvetica'),
(3, 'Times New Roman'),
(4, 'MS UI Gothic'),
(5, 'Verdana'),
(6, 'Tahoma'),
(7, 'Comic Sans MS');

-- --------------------------------------------------------

--
-- Table structure for table `line`
--

CREATE TABLE IF NOT EXISTS `line` (
  `line_id` int(16) NOT NULL AUTO_INCREMENT,
  `sequence` int(16) NOT NULL,
  `label` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `speaker` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `jumpto_line_id` int(11) DEFAULT NULL,
  `fk_linetype_id` int(8) NOT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`line_id`),
  KEY `line_id` (`line_id`),
  KEY `jumpto_line_id` (`jumpto_line_id`),
  KEY `fk_linetype_id` (`fk_linetype_id`),
  KEY `fk_project_id` (`fk_project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=347 ;

--
-- Dumping data for table `line`
--

INSERT INTO `line` (`line_id`, `sequence`, `label`, `speaker`, `content`, `jumpto_line_id`, `fk_linetype_id`, `fk_project_id`) VALUES
(1, 1, 'beginning', 'protag', 'this is the beginning', NULL, 1, 1),
(2, 7, NULL, 'akio', ' piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, loo', NULL, 1, 1),
(33, 18, NULL, 'hibiki', 'mbarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, mak', NULL, 1, 1),
(40, 14, NULL, NULL, 'line fourteen through', NULL, 1, 1),
(41, 6, NULL, 'akio', ' leap into electronic typesetting, remaining essentially unchanged. It was popul', NULL, 1, 1),
(42, 2, 'after the beginning', 'akio', 's been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type speci\ngfggfhghggg', NULL, 1, 1),
(44, 15, NULL, NULL, NULL, NULL, 2, 1),
(45, 4, 'first choice', NULL, NULL, NULL, 2, 1),
(46, 32, 'fv', NULL, NULL, NULL, 3, 1),
(48, 17, NULL, NULL, NULL, NULL, 2, 1),
(51, 16, NULL, 'adsfj', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised word', NULL, 1, 1),
(57, 12, NULL, 'akio', 'scover', NULL, 1, 1),
(58, 13, NULL, 'akio', 'dgs dgvbvg  g', NULL, 1, 1),
(59, 11, NULL, 'akio', 'ge of Lorem Ipsum, you need to be sure there isn''t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend ', NULL, 1, 1),
(62, 8, NULL, 'kerberos', '" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is" (The Ext', NULL, 1, 1),
(65, 5, NULL, 'akio', '....!!!', NULL, 1, 1),
(66, 9, NULL, 'kerberos', 'tise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in sec', NULL, 1, 1),
(67, 10, NULL, 'kerberos', 'Lorem Ipsum passage, and going through the cites of the word in classical lite', NULL, 1, 1),
(68, 19, NULL, 'hibiki', 'aaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaa', NULL, 1, 1),
(69, 20, NULL, 'hibiki', 'bbbbbbbbbbbbbbbbbbb', NULL, 1, 1),
(70, 21, NULL, 'hibiki', 'bbbvbdvcb', NULL, 1, 1),
(71, 22, NULL, 'hibiki', 'bdfgjhdrtrhht thtr hbtbhsrth htjnr drhjn', NULL, 1, 1),
(72, 23, NULL, 'hibiki', 'orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unkn', NULL, 1, 1),
(73, 24, NULL, 'hibiki', 'n book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s', NULL, 1, 1),
(74, 25, NULL, 'hibiki', 'aset sheets containing Lorem Ipsum passages, and more recently with des', NULL, 1, 1),
(75, 26, NULL, 'hibiki', 'piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virgini', NULL, 1, 1),
(76, 27, NULL, 'hibiki', 'er 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virgini', NULL, 1, 1),
(77, 28, NULL, 'hibiki', ' unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also ', NULL, 1, 1),
(78, 29, NULL, 'hibiki', 'se Lorem Ipsum as their default model text, and a search for ''lorem ipsum'' ', NULL, 1, 1),
(79, 30, NULL, 'hibiki', 'mbarrassing hidden in the middle of text. All the Lorem Ipsum generators on t', NULL, 1, 1),
(81, 31, NULL, 'hibiki', 'rwgr', NULL, 1, 1),
(82, 34, NULL, 'hibiki', 'goddbye', NULL, 1, 1),
(89, 3, NULL, 'akio', ' leap into electronic typesetting, remaining essentially unchanged. It was popul', NULL, 1, 1),
(91, 1, NULL, 'akki', 'aaaaaaaaaa', NULL, 1, 20),
(92, 2, NULL, 'akki', 'bbbbbbbbbbbbbbb', NULL, 1, 20),
(93, 3, NULL, NULL, NULL, NULL, 4, 20),
(94, 2, NULL, NULL, NULL, NULL, 1, 2),
(95, 1, NULL, NULL, NULL, NULL, 1, 2),
(96, 6, NULL, NULL, NULL, NULL, 4, 2),
(97, 1, NULL, NULL, NULL, NULL, 1, 6),
(98, 2, NULL, NULL, NULL, NULL, 1, 6),
(99, 3, NULL, NULL, NULL, NULL, 1, 6),
(100, 4, NULL, NULL, NULL, NULL, 4, 6),
(102, 33, NULL, NULL, 'no text', NULL, 1, 1),
(103, 35, NULL, NULL, NULL, NULL, 4, 1),
(108, 4, NULL, NULL, NULL, NULL, 2, 20),
(109, 1, 'begin', NULL, NULL, NULL, 1, 23),
(110, 2, NULL, NULL, NULL, NULL, 3, 23),
(111, 3, NULL, NULL, NULL, 171, 1, 2),
(112, 4, NULL, NULL, NULL, NULL, 2, 2),
(113, 5, NULL, NULL, NULL, NULL, 2, 2),
(114, 7, NULL, NULL, NULL, NULL, 1, 2),
(115, 8, NULL, NULL, NULL, NULL, 3, 2),
(116, 9, NULL, NULL, NULL, NULL, 1, 2),
(117, 10, NULL, NULL, NULL, NULL, 3, 2),
(118, 11, NULL, NULL, NULL, NULL, 2, 2),
(119, 12, NULL, NULL, NULL, NULL, 1, 2),
(120, 13, NULL, NULL, NULL, NULL, 2, 2),
(121, 14, NULL, NULL, NULL, NULL, 2, 2),
(125, 15, NULL, NULL, NULL, NULL, 1, 2),
(126, 16, NULL, NULL, NULL, NULL, 2, 2),
(127, 17, NULL, NULL, NULL, NULL, 3, 2),
(128, 18, NULL, NULL, NULL, NULL, 2, 2),
(160, 19, NULL, NULL, NULL, NULL, 2, 2),
(161, 20, NULL, NULL, NULL, NULL, 2, 2),
(162, 21, NULL, NULL, NULL, NULL, 3, 2),
(163, 23, NULL, NULL, NULL, NULL, 2, 2),
(164, 22, NULL, NULL, NULL, NULL, 2, 2),
(165, 24, NULL, NULL, NULL, NULL, 3, 2),
(166, 25, NULL, NULL, NULL, NULL, 3, 2),
(167, 26, NULL, NULL, NULL, NULL, 4, 2),
(168, 27, NULL, NULL, NULL, NULL, 2, 2),
(169, 28, NULL, NULL, NULL, NULL, 2, 2),
(170, 29, NULL, NULL, NULL, NULL, 2, 2),
(171, 30, 'middle', NULL, NULL, NULL, 1, 2),
(172, 31, NULL, NULL, NULL, NULL, 1, 2),
(173, 32, NULL, NULL, NULL, NULL, 1, 2),
(174, 33, NULL, NULL, NULL, NULL, 1, 2),
(175, 34, NULL, NULL, NULL, NULL, 1, 2),
(176, 35, NULL, NULL, NULL, NULL, 1, 2),
(177, 36, NULL, NULL, NULL, NULL, 1, 2),
(178, 37, NULL, NULL, NULL, NULL, 1, 2),
(179, 38, NULL, NULL, NULL, NULL, 1, 2),
(180, 39, NULL, NULL, NULL, NULL, 1, 2),
(181, 40, NULL, NULL, NULL, NULL, 1, 2),
(182, 41, NULL, NULL, NULL, NULL, 1, 2),
(183, 42, NULL, NULL, NULL, NULL, 1, 2),
(184, 43, NULL, NULL, NULL, NULL, 1, 2),
(185, 44, NULL, NULL, NULL, NULL, 1, 2),
(186, 45, NULL, NULL, NULL, NULL, 1, 2),
(187, 46, NULL, NULL, NULL, NULL, 1, 2),
(188, 47, NULL, NULL, NULL, NULL, 1, 2),
(189, 48, NULL, NULL, NULL, NULL, 1, 2),
(190, 49, NULL, NULL, NULL, NULL, 1, 2),
(191, 50, NULL, NULL, NULL, NULL, 1, 2),
(235, 52, NULL, 'aki', 'agdbvavgbav', NULL, 1, 2),
(236, 51, NULL, NULL, 'sdfsgfga', NULL, 1, 2),
(238, 53, NULL, 'adg', 'adgavgb', NULL, 1, 2),
(239, 54, NULL, 'dg', NULL, NULL, 1, 2),
(240, 55, NULL, NULL, NULL, NULL, 1, 2),
(241, 56, NULL, NULL, NULL, NULL, 1, 2),
(242, 57, NULL, NULL, NULL, NULL, 1, 2),
(243, 58, NULL, NULL, NULL, NULL, 1, 2),
(246, 59, NULL, NULL, NULL, NULL, 1, 2),
(247, 60, NULL, NULL, NULL, NULL, 1, 2),
(248, 61, NULL, NULL, NULL, NULL, 1, 2),
(249, 62, NULL, NULL, NULL, NULL, 1, 2),
(251, 63, NULL, NULL, NULL, NULL, 1, 2),
(252, 64, NULL, NULL, NULL, NULL, 1, 2),
(253, 65, NULL, NULL, NULL, NULL, 1, 2),
(254, 66, NULL, NULL, NULL, NULL, 1, 2),
(256, 67, NULL, NULL, NULL, NULL, 1, 2),
(257, 68, NULL, NULL, NULL, NULL, 1, 2),
(258, 69, NULL, NULL, NULL, NULL, 1, 2),
(259, 70, NULL, NULL, NULL, NULL, 1, 2),
(260, 71, NULL, NULL, NULL, NULL, 1, 2),
(261, 72, NULL, NULL, NULL, NULL, 1, 2),
(262, 73, NULL, NULL, NULL, NULL, 1, 2),
(263, 74, NULL, NULL, NULL, NULL, 1, 2),
(264, 75, NULL, NULL, NULL, NULL, 1, 2),
(265, 76, NULL, NULL, NULL, NULL, 1, 2),
(266, 77, NULL, NULL, NULL, NULL, 1, 2),
(267, 78, NULL, NULL, NULL, NULL, 1, 2),
(268, 79, NULL, NULL, NULL, NULL, 1, 2),
(269, 82, NULL, NULL, NULL, NULL, 1, 2),
(270, 81, NULL, NULL, NULL, NULL, 1, 2),
(271, 80, NULL, NULL, NULL, NULL, 1, 2),
(272, 83, NULL, NULL, NULL, NULL, 1, 2),
(273, 85, NULL, NULL, NULL, NULL, 1, 2),
(274, 84, NULL, NULL, NULL, NULL, 1, 2),
(275, 86, NULL, NULL, NULL, NULL, 1, 2),
(276, 87, NULL, NULL, NULL, NULL, 2, 2),
(277, 88, NULL, NULL, NULL, NULL, 3, 2),
(278, 89, NULL, NULL, NULL, NULL, 1, 2),
(279, 92, NULL, NULL, NULL, NULL, 1, 2),
(280, 91, NULL, NULL, NULL, NULL, 1, 2),
(281, 90, NULL, NULL, NULL, NULL, 1, 2),
(282, 93, NULL, NULL, NULL, NULL, 1, 2),
(283, 94, NULL, NULL, NULL, NULL, 2, 2),
(284, 95, NULL, NULL, NULL, NULL, 3, 2),
(285, 96, NULL, NULL, NULL, NULL, 4, 2),
(286, 97, 'sdg', 'aki', 'dgvsgdsgv', NULL, 1, 2),
(300, 101, NULL, 'aki', 'aaaa', NULL, 1, 2),
(335, 100, NULL, NULL, NULL, NULL, 2, 2),
(336, 99, NULL, NULL, NULL, NULL, 3, 2),
(337, 98, NULL, NULL, NULL, NULL, 4, 2),
(338, 106, NULL, NULL, NULL, NULL, 4, 2),
(339, 102, NULL, 'aki', NULL, NULL, 1, 2),
(340, 105, NULL, NULL, NULL, NULL, 1, 2),
(341, 103, NULL, NULL, NULL, NULL, 1, 2),
(342, 104, NULL, NULL, NULL, NULL, 1, 2),
(343, 3, NULL, NULL, NULL, NULL, 1, 23),
(344, 4, NULL, NULL, NULL, NULL, 1, 23),
(345, 5, NULL, NULL, NULL, NULL, 1, 23),
(346, 6, NULL, NULL, NULL, NULL, 1, 23);

-- --------------------------------------------------------

--
-- Table structure for table `lineres`
--

CREATE TABLE IF NOT EXISTS `lineres` (
  `fk_line_id` int(16) NOT NULL,
  `fk_resource_id` int(16) NOT NULL,
  KEY `fk_line_id` (`fk_line_id`),
  KEY `fk_resource_id` (`fk_resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `lineres`
--

INSERT INTO `lineres` (`fk_line_id`, `fk_resource_id`) VALUES
(1, 85),
(33, 123),
(33, 113),
(33, 137),
(1, 122),
(42, 85),
(41, 85),
(46, 166),
(1, 131),
(1, 140),
(41, 123),
(42, 137),
(41, 138),
(51, 85),
(51, 123),
(57, 96),
(57, 123),
(57, 144),
(58, 98),
(58, 123),
(59, 89),
(65, 86),
(65, 125),
(62, 86),
(62, 124),
(62, 138),
(66, 87),
(66, 124),
(66, 161),
(67, 88),
(67, 124),
(42, 121),
(40, 106),
(68, 113),
(68, 122),
(69, 113),
(69, 122),
(70, 113),
(70, 122),
(71, 113),
(71, 122),
(72, 113),
(72, 122),
(73, 113),
(73, 122),
(74, 113),
(74, 122),
(75, 113),
(75, 122),
(76, 113),
(76, 122),
(77, 113),
(77, 122),
(78, 87),
(78, 122),
(79, 88),
(79, 122),
(81, 113),
(81, 122),
(82, 113),
(82, 122),
(89, 121),
(91, 170),
(91, 173),
(91, 175),
(92, 169),
(92, 173),
(286, 414),
(235, 415),
(238, 418),
(239, 425),
(300, 415),
(300, 447),
(300, 449),
(339, 447),
(339, 449);

-- --------------------------------------------------------

--
-- Table structure for table `linetype`
--

CREATE TABLE IF NOT EXISTS `linetype` (
  `linetype_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`linetype_id`),
  KEY `linetype_id` (`linetype_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- Dumping data for table `linetype`
--

INSERT INTO `linetype` (`linetype_id`, `name`) VALUES
(1, 'text'),
(2, 'choice'),
(3, 'video'),
(4, 'end');

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE IF NOT EXISTS `permission` (
  `permission_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `permission`
--

INSERT INTO `permission` (`permission_id`, `name`) VALUES
(1, 'administrator'),
(2, 'member');

-- --------------------------------------------------------

--
-- Table structure for table `project`
--

CREATE TABLE IF NOT EXISTS `project` (
  `project_id` int(16) NOT NULL AUTO_INCREMENT,
  `title` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(512) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cover` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_date` datetime NOT NULL,
  `published_date` datetime DEFAULT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fk_user_id` int(16) NOT NULL,
  `fk_projectstatus_id` int(8) NOT NULL,
  PRIMARY KEY (`project_id`),
  KEY `project_id` (`project_id`),
  KEY `fk_user_id` (`fk_user_id`,`fk_projectstatus_id`),
  KEY `fk_projectstatus_id` (`fk_projectstatus_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=26 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `title`, `description`, `cover`, `created_date`, `published_date`, `updated_date`, `fk_user_id`, `fk_projectstatus_id`) VALUES
(1, 'Lorem Ipsum', 'Random words from lorem ipsum', '1', '2015-04-25 17:25:06', '2015-05-25 03:58:27', '2015-05-25 01:58:27', 1, 2),
(2, 'Chronicle', 'new', '1', '2015-04-25 23:43:45', '2015-05-23 08:31:20', '2015-05-23 09:31:48', 1, 1),
(3, 'Chronological', NULL, NULL, '2015-04-28 03:22:16', NULL, '2015-04-28 01:22:17', 5, 1),
(4, 'After', NULL, NULL, '2015-04-28 03:27:30', NULL, '2015-04-28 01:27:30', 5, 1),
(6, 'abundance x', '', '1', '2015-05-20 01:54:10', '2015-05-23 11:31:37', '2015-05-23 09:31:37', 1, 2),
(7, 'metronome', '', NULL, '2015-05-20 03:37:04', NULL, '2015-05-20 23:16:42', 1, 1),
(8, 'metroboot', NULL, NULL, '2015-05-20 03:37:25', NULL, '2015-05-20 01:37:25', 1, 1),
(18, 'bbbbb', '', NULL, '2015-05-20 18:05:45', NULL, '2015-05-20 16:05:45', 1, 1),
(19, 'bbbbb', 'new descrioption date 22', '1', '2015-05-20 18:05:52', '2015-05-21 01:16:04', '2015-05-23 08:15:48', 1, 2),
(20, 'new', 'adsg bfdg', '1', '2015-05-20 22:28:13', '2015-05-21 00:12:38', '2015-05-20 22:12:38', 7, 2),
(21, 'test', 'test', '1', '2015-05-21 01:16:52', '2015-05-23 00:30:33', '2015-05-22 22:30:33', 1, 2),
(22, 'aaa1', '', NULL, '2015-05-21 03:23:49', NULL, '2015-05-21 01:23:49', 8, 1),
(23, 'aaaa', '', NULL, '2015-05-21 10:00:03', NULL, '2015-05-21 08:00:03', 10, 1),
(25, 'bbbb', '', NULL, '2015-05-24 03:47:43', NULL, '2015-05-24 01:47:43', 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `projectstatus`
--

CREATE TABLE IF NOT EXISTS `projectstatus` (
  `projectstatus_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`projectstatus_id`),
  KEY `projectstatus_id` (`projectstatus_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `projectstatus`
--

INSERT INTO `projectstatus` (`projectstatus_id`, `name`) VALUES
(1, 'unpublished'),
(2, 'published');

-- --------------------------------------------------------

--
-- Table structure for table `resource`
--

CREATE TABLE IF NOT EXISTS `resource` (
  `resource_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `file_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `character_name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `figure_name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `expression_name` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_resourcetype_id` int(8) NOT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`resource_id`),
  KEY `resource_id` (`resource_id`),
  KEY `fk_resourcetype_id` (`fk_resourcetype_id`,`fk_project_id`),
  KEY `fk_project_id` (`fk_project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=450 ;

--
-- Dumping data for table `resource`
--

INSERT INTO `resource` (`resource_id`, `name`, `file_name`, `character_name`, `figure_name`, `expression_name`, `fk_resourcetype_id`, `fk_project_id`) VALUES
(79, 'cgak22t', '129aef0b1449a0760529db0031325c8c.png', 'akio', 'standing', 'normal', 1, 1),
(80, 'cgak12t', '5e852d0635e7d393a2e3313665ef2dcf.png', 'akio', 'standing', 'angry', 1, 1),
(81, 'cgak14t', 'e8766f3c05de240e8f29fc74438db625.png', 'amio', 'standing', 'hmm', 1, 1),
(82, 'cgak17t', '1ad2dfa3d49f01dcf34f994921a5f193.png', 'akio', 'standing', 'happy', 1, 1),
(83, 'cgak13t', '32e4af9c91ca981c9ab9d14783bd4f67.png', 'akio', 'standing', 'sigh', 1, 1),
(84, 'cgak19t', '63e49a1267b9be5b26b7f1b2417d2bab.png', 'akio', 'standing', 'stare', 1, 1),
(85, 'bg_crop', 'a5639f9c8d418f21878aef216287ce39.jpg', NULL, NULL, NULL, 2, 1),
(86, 'bg01_01b', '88a6dba41463a42f2957cb5a3bf27918.jpg', NULL, NULL, NULL, 2, 1),
(87, 'bg03_01b', '8af5607cc1df8561a9aa8ef8e8f08fe4.jpg', NULL, NULL, NULL, 2, 1),
(88, 'bg02_01b', 'a2c2f257acee87ab85363022bc85ca1a.jpg', NULL, NULL, NULL, 2, 1),
(89, 'bg04_01b', '2bd3693c606853b13d2ac5712ddb1237.jpg', NULL, NULL, NULL, 2, 1),
(96, 'bg14_01s', 'bc83d99d2fe52215fae3eb91191f58f1.jpg', NULL, NULL, NULL, 2, 1),
(97, 'bg14_02b', '3a543f59eb3c0a84c932113c19137f13.jpg', NULL, NULL, NULL, 2, 1),
(98, 'bg14_02s', 'e8b8790c67f63125160ba59c1bb8b6ee.jpg', NULL, NULL, NULL, 2, 1),
(106, 'bg15_01b', '2072465ee10a79f008c5bba29c124f9c.jpg', NULL, NULL, NULL, 2, 1),
(107, 'bg15_01s', '38f3d938a965da53b9dcdd2cf97ff03a.jpg', NULL, NULL, NULL, 2, 1),
(108, 'bg15_02s', 'e0312c744116fa23185d920eaf3265bd.jpg', NULL, NULL, NULL, 2, 1),
(109, 'bg15_03b', '0be88484f2cd2a8aa17ba81a530e3b40.jpg', NULL, NULL, NULL, 2, 1),
(110, 'bg15_03s', '42a37995e79bc7415035850a85878dcd.jpg', NULL, NULL, NULL, 2, 1),
(111, 'bg15_05s', '6c76324b06a19f904b0f1a5e24f892d9.jpg', NULL, NULL, NULL, 2, 1),
(112, 'bg15b_01b', 'acc5c5cb3a005845a065dde96fc5d50d.jpg', NULL, NULL, NULL, 2, 1),
(113, 'bg15b_01s', 'a6cd5fa00b30a3de7b873d0a59dc2f4c.jpg', NULL, NULL, NULL, 2, 1),
(114, 'bg15b_02b', '890aa133b4fc0cc6b1c51c6c89464ed8.jpg', NULL, NULL, NULL, 2, 1),
(115, 'bg15b_02s', '20322744b64c809bcb8f530bef4dae0f.jpg', NULL, NULL, NULL, 2, 1),
(116, 'bg16_01b', 'd235cabd07fc0e529b8b5bc69628a04f.jpg', NULL, NULL, NULL, 2, 1),
(117, 'bg23_01s', '70bb3211aca6926a45b4c22a9edac7f5.jpg', NULL, NULL, NULL, 2, 1),
(118, 'bg25_01s', 'a5a07604b935f43f9db03eac4e6d33a9.jpg', NULL, NULL, NULL, 2, 1),
(121, 'Gentle', '61ec677bafecd8c25e3656fa69cdb561.mp3', NULL, NULL, NULL, 3, 1),
(122, 'Eventide', 'f695974f26edf665edf8e3966db85114.mp3', NULL, NULL, NULL, 3, 1),
(123, 'Active', '1f6a84b63e22e44c97217d093a4adc8c.mp3', NULL, NULL, NULL, 3, 1),
(124, 'Bound', 'ddb7db6cb74f0e36eff1943b1a4fe080.mp3', NULL, NULL, NULL, 3, 1),
(125, 'Clam', '18e83b4828faa12fd9787df7c7eba9a5.mp3', NULL, NULL, NULL, 3, 1),
(126, 'se002', '0c8c8e90ff8312d6cbaa67547ccb115f.ogg', NULL, NULL, NULL, 4, 1),
(127, 'se003', '87f7a9c678f66dc3b63cdcc04edcbc3f.ogg', NULL, NULL, NULL, 4, 1),
(128, 'se005', 'd289005391e5d5823d4de86dfacfa285.ogg', NULL, NULL, NULL, 4, 1),
(129, 'se006', 'd11203e67e05e1fb1839faf5f0846fd0.ogg', NULL, NULL, NULL, 4, 1),
(130, 'se001', '9a48dc21a5d31ed24b55ac960c78ef57.ogg', NULL, NULL, NULL, 4, 1),
(131, 'se004', '4061f8d2e2be436f72b12dca1e3431cc.ogg', NULL, NULL, NULL, 4, 1),
(132, 'se007', 'e5c022f7a6a0bbdac32fa386db985cba.ogg', NULL, NULL, NULL, 4, 1),
(133, 'se008', 'a06a6327cd70fdf8656a22ffd17260f1.ogg', NULL, NULL, NULL, 4, 1),
(134, 'se009', '213bdc9d3ca48fd6486abf943eaf53aa.ogg', NULL, NULL, NULL, 4, 1),
(135, 'se010', '0f5c3c04de4a3894107e154a3a131c30.ogg', NULL, NULL, NULL, 4, 1),
(136, 'VOICE 03 asd fds', '317a5aab093877e3509e0e1574b7f056.ogg', NULL, NULL, NULL, 5, 1),
(137, 'VOICE_arc_000002', '40edcab327d158ebafb2ede7945f3889.ogg', 'ageha', NULL, NULL, 5, 1),
(138, 'VOICE_arc_000006', '3bc4bfa93a0c0a747b9afe9567941738.ogg', 'ageha', NULL, NULL, 5, 1),
(139, 'VOICE_arc_000004', '267337ccdd3bd77e53994568dcdfafbc.ogg', 'ageha', NULL, NULL, 5, 1),
(140, 'VOICE_arc_000001', '78da378dd4623030a5f4ce1a781fa528.ogg', 'ageha', NULL, NULL, 5, 1),
(141, 'VOICE_arc_000005', '12573a62c1ff3bf7b4a207ea360dc82a.ogg', 'ageha', NULL, NULL, 5, 1),
(142, 'VOICE_arc_000007', 'c46e316d2d1fbadef28ed0688dee91c3.ogg', 'ageha', NULL, NULL, 5, 1),
(143, 'VOICE_arc_000008', '17e2c788eaf2f4861ce9a48482c4322d.ogg', 'ageha', NULL, NULL, 5, 1),
(144, 'VOICE_arc_000009', '146795899ef27adfd1513660f5d3bfd1.ogg', 'ageha', NULL, NULL, 5, 1),
(145, 'VOICE_arc_000010', 'bed4cce787652386f53f699e26ae7a21.ogg', 'ageha', NULL, NULL, 5, 1),
(146, 'VOICE_arc_000011', '3fc2ff436726ff5647ba078b628fd869.ogg', 'ageha', NULL, NULL, 5, 1),
(147, 'VOICE_arc_000012', '219a0084b31028e9ffaa981751f3c6c1.ogg', 'ageha', NULL, NULL, 5, 1),
(148, 'VOICE_arc_000013', '1de32a3e37a746cce7ba914588ac296b.ogg', 'ageha', NULL, NULL, 5, 1),
(149, 'VOICE_arc_000014', 'f5e281ee64fa06cdd323c23603e01084.ogg', 'ageha', NULL, NULL, 5, 1),
(150, 'VOICE_arc_000015', 'a77e71a9f9984905bb5c1c213e705721.ogg', 'ageha', NULL, NULL, 5, 1),
(151, 'VOICE_arc_000016', 'bfe9c1175528196093e57f8be19492a0.ogg', 'ageha', NULL, NULL, 5, 1),
(152, 'VOICE_arc_000017', '1c366d537a032d8899766234fe83ad28.ogg', 'ageha', NULL, NULL, 5, 1),
(153, 'VOICE_arc_000018', '0a10fdfad70549ed65389510ac137dc9.ogg', 'ageha', NULL, NULL, 5, 1),
(154, 'VOICE_arc_000019', '3c54ae8ba625bc9833faf17aa90eb3de.ogg', 'ageha', NULL, NULL, 5, 1),
(155, 'VOICE_arc_000020', '31deb0359cc6bc492a6c0e6c36c3ab82.ogg', 'ageha', NULL, NULL, 5, 1),
(156, 'VOICE_arc_000021', 'a9cb828164e58498495d6ef27b5cc26a.ogg', 'ageha', NULL, NULL, 5, 1),
(157, 'VOICE_arc_000022', '8d69a8be10d39944c27798e45b889a3b.ogg', 'ageha', NULL, NULL, 5, 1),
(158, 'VOICE_arc_000023', '892c950026c1076c5aafb3dba718594f.ogg', 'ageha', NULL, NULL, 5, 1),
(159, 'VOICE_arc_000024', 'eaff63816266227736deb14b9ad287a5.ogg', 'ageha', NULL, NULL, 5, 1),
(160, 'VOICE_arc_000025', 'cefa9475ffea868bba56ba63fb39917a.ogg', 'ageha', NULL, NULL, 5, 1),
(161, 'VOICE_arc_000026', 'ceb8a19acfa6c5f75cc2a4ea254c8df7.ogg', 'ageha', NULL, NULL, 5, 1),
(162, 'VOICE_arc_000027', '0c3c95b4367ee00def33828341ee10b9.ogg', 'ageha', NULL, NULL, 5, 1),
(163, 'VOICE_arc_000028', 'b50438f2141dc8b28c32b176a6926bc6.ogg', 'ageha', NULL, NULL, 5, 1),
(164, 'VOICE_arc_000029', 'b2e082bc06b4e473f2d3b4c5ab34f120.ogg', 'ageha', NULL, NULL, 5, 1),
(165, 'VOICE_arc_000030', 'f501968f75df509e37c004f48d5ca714.ogg', 'ageha', NULL, NULL, 5, 1),
(166, 'Blanc Aile OP', '1678335bc60938381dc335cbcaeb1ea2.mp4', NULL, NULL, NULL, 6, 1),
(167, '~akio', 'a49cef79f0e5e2dd6728c94b8ed13781.png', '', '', NULL, 1, 6),
(168, '~akio', 'd475dd23ad24b73ab22941e8198b410f.png', 'akki', 'none', NULL, 1, 20),
(169, '~sky', '48c88a28525e250b025d4e87b113c436.jpg', NULL, NULL, NULL, 2, 20),
(170, '~sky', '24262b9b9989bc3fdd7233f828277431.jpg', NULL, NULL, NULL, 2, 20),
(171, '~potrait', '87e49111968cb05a3a783a488fea1049.jpg', NULL, NULL, NULL, 2, 20),
(172, '~sky', '85acd27738d718821229525c6f8f3158.jpg', NULL, NULL, NULL, 2, 20),
(173, '~gentle', '78a99a1030dcfc5cfd8a46663cd1f5a3.mp3', NULL, NULL, NULL, 3, 20),
(174, '~effect', '43bc0bb174ab5478a906217aaf1cfcf5.ogg', NULL, NULL, NULL, 4, 20),
(175, '~agevoice', 'd5ae87dae85c638ba3d3715900da5f3b.ogg', NULL, NULL, NULL, 5, 20),
(296, 'cgak14t', '86828eebe5a83ffa22f6b470942da91b.png', 'Fake Akki', 'what', 'wew', 1, 23),
(297, 'cgak13t', '8a0c604bc630cfed1749d37756466c72.png', 'Fake Akki', 'what', 'digh', 1, 23),
(299, 'cgak17t', '5cbb1dbc4bc07add51c793179c5b7581.png', 'Fake Akki', 'what', '', 1, 23),
(300, 'cgak22t', '83a2a6b0b5a23434dd4e94e54f6b2ace.png', 'Fake Akki', 'what', 'gmm', 1, 23),
(301, 'cgak19t', '58f8d3076f0cd8fad86a1fd0cf93a42c.png', 'Fake Akki', 'what', 'hmm', 1, 23),
(302, 'cgak19t', '5ad89ecfe8fb3959c872eda3a2bba4b2.png', 'More Fake Akki', 'ewwww', 'eww', 1, 23),
(303, 'cgak13t', '6296c622cdf7eb2ce48e319c34619c92.png', 'More Fake Akki', 'ewwww', 'hhh', 1, 23),
(304, 'cgak12t', '76a44f3cdff27ae080ebf6381552da4c.png', 'More Fake Akki', 'ewwww', 'grr', 1, 23),
(305, 'cgak14t', '98343a22f5f93b511ba800bf39bf466e.png', 'More Fake Akki', 'ewwww', 'hmm', 1, 23),
(306, 'cgak22t', '0bef96a815b63a0532774fb0011394cb.png', 'More Fake Akki', 'ewwww', 'heh', 1, 23),
(307, 'cgak17t', '06e25b259607363c828789d70f75883d.png', 'More Fake Akki', 'ewwww', 'haha', 1, 23),
(309, '~skyvvgdf', '9d36ae2d8e76892927f740d4efbc2210.jpg', NULL, NULL, NULL, 2, 23),
(310, '~sky', 'ffb197896fa5cae351f905344d34d652.jpg', NULL, NULL, NULL, 2, 23),
(312, '~akio', 'd6d8bd74804fb3684d0e0c2a13ebd774.png', 'bbbb', '', '', 1, 21),
(313, '~akio', '163db11b91ef59c03f0cb1744db45c3e.png', '', '', NULL, 1, 21),
(314, '~gentle', '9c471ea18ee18d75eec7dcac029c14dd.mp3', NULL, NULL, NULL, 3, 21),
(315, '~effect', 'adaa7fefcd276684c06b12e40880ce49.ogg', NULL, NULL, NULL, 4, 21),
(316, '~agevoice', '9674292c80038d6a2fc920986c9cdb2f.ogg', NULL, NULL, NULL, 5, 21),
(317, '~blancaile', 'd4a2cb0b642b3826c4b89f8daaac93e5.mp4', NULL, NULL, NULL, 6, 21),
(318, '~sky', '4d4e0cd50fba11136f5e2af356505714.jpg', NULL, NULL, NULL, 2, 21),
(319, '~gentle', '43f7f8dc0f1c784c466ad6d424bdf2ed.mp3', NULL, NULL, NULL, 3, 21),
(320, '~akio', '071d462b11badcf8ab1f2f11468e050b.png', '', '', NULL, 1, 21),
(321, '~akio', '7cf6f4541fcf199ffe8d84ab57568d03.png', '', '', NULL, 1, 21),
(414, 'bg15b_01s', '20817c54b0cf1a6acc6c7174da466778.jpg', NULL, NULL, NULL, 2, 2),
(415, 'bg15b_01b', '2bc979ab9b31939e53be9accdebf93b9.jpg', NULL, NULL, NULL, 2, 2),
(416, 'bg23_01s', '394f02d991ca0c10780ff8dfd00354e6.jpg', NULL, NULL, NULL, 2, 2),
(417, 'bg16_01b', '4a2e5fe2b9ac090481342fdd0b688b6d.jpg', NULL, NULL, NULL, 2, 2),
(418, 'bg15b_02s', '8bd7acd72008b3e9d82950f5078749ee.jpg', NULL, NULL, NULL, 2, 2),
(419, 'bg15b_02b', 'c2e846e91502010f46ecec47be9c0b39.jpg', NULL, NULL, NULL, 2, 2),
(420, 'bg25_01s', 'ba1404185dec2b84e18cf4168c3c5f70.jpg', NULL, NULL, NULL, 2, 2),
(421, 'bg_crop', '64805b259cd5fe2d09d9ab6343fe4815.jpg', NULL, NULL, NULL, 2, 2),
(422, 'bg01_01b', '99c29f95d120b7b1e55badc933a9e027.jpg', NULL, NULL, NULL, 2, 2),
(423, 'bg02_01b', '32b745cbb6d2e94726e6edd55a461717.jpg', NULL, NULL, NULL, 2, 2),
(424, 'bg03_01b', '5765dd52c877090d6edf0293b3932e09.jpg', NULL, NULL, NULL, 2, 2),
(425, 'bg04_01b', 'e5595b2f84cfe57b8a70048b6a0bbf44.jpg', NULL, NULL, NULL, 2, 2),
(426, 'bg14_01s', 'a4f674803e43a297dbf7503ce7a17c00.jpg', NULL, NULL, NULL, 2, 2),
(427, 'bg14_02b', '6ecbebed1881bb54fc43cbe483b5c90a.jpg', NULL, NULL, NULL, 2, 2),
(428, 'bg14_02s', '5ec9ff53c4830d005718eb2fe9ca5227.jpg', NULL, NULL, NULL, 2, 2),
(429, 'bg15_01b', '091b65c95b3cb8270e8ace99f6422e30.jpg', NULL, NULL, NULL, 2, 2),
(430, 'bg15_01s', 'b2882f03c8d04130a6bbd43b4723478c.jpg', NULL, NULL, NULL, 2, 2),
(431, 'bg15_02s', '0e176d5bc6398f181a264169e9a86f97.jpg', NULL, NULL, NULL, 2, 2),
(432, 'bg15_03b', '4c8edeb8e310b5450e3a0f5e088ac8a8.jpg', NULL, NULL, NULL, 2, 2),
(433, 'bg15_03s', '00d88b55e69b261a8fcd82dd1df09838.jpg', NULL, NULL, NULL, 2, 2),
(434, 'bg15_05s', '8371bcc0c6705421a896a1175c223159.jpg', NULL, NULL, NULL, 2, 2),
(441, 'cgak13t', '1d6ca569ad4aef75555cc7501139ada3.png', 'aki', 's', NULL, 1, 2),
(442, 'cgak19t', '73e9f3740db1475f0076e1034ba4d680.png', 'aki', 's', NULL, 1, 2),
(443, 'cgak14t', '6e4fe961f0981e5e30dc41614d9282f7.png', 'aki', 's', NULL, 1, 2),
(444, 'cgak22t', '2ce985422a910146723f6e344d3b34a5.png', 'aki', 's', NULL, 1, 2),
(445, 'cgak17t', 'cf89abf26e3919407cb4a6c051e6cf92.png', 'aki', 's', NULL, 1, 2),
(446, 'cgak12t', '452fe8e90a3455648fb39e2d48d034e0.png', 'aki', 's', NULL, 1, 2),
(447, '~gentle', '54a60ff7d999f54a164f0705e03117cd.mp3', NULL, NULL, NULL, 3, 2),
(448, '~effect', '7bd9f0040b41c8f1d2bb6bfd6fd7c825.ogg', NULL, NULL, NULL, 4, 2),
(449, '~agevoice', '9ba8ab0e9b8b22893ffd38cadc67215a.ogg', NULL, NULL, NULL, 5, 2);

-- --------------------------------------------------------

--
-- Table structure for table `resourcetype`
--

CREATE TABLE IF NOT EXISTS `resourcetype` (
  `resourcetype_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`resourcetype_id`),
  KEY `resourcetype_id` (`resourcetype_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Dumping data for table `resourcetype`
--

INSERT INTO `resourcetype` (`resourcetype_id`, `name`) VALUES
(1, 'sprite'),
(2, 'background image'),
(3, 'background music'),
(4, 'sound effect'),
(5, 'character voice'),
(6, 'video');

-- --------------------------------------------------------

--
-- Table structure for table `savedata`
--

CREATE TABLE IF NOT EXISTS `savedata` (
  `savedata_id` int(16) NOT NULL AUTO_INCREMENT,
  `save_date` datetime NOT NULL,
  `fk_line_id` int(16) NOT NULL,
  `fk_user_id` int(16) NOT NULL,
  `fk_savedatatype_id` int(8) NOT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`savedata_id`),
  KEY `savedata_id` (`savedata_id`),
  KEY `fk_line_id` (`fk_line_id`),
  KEY `fk_user_id` (`fk_user_id`),
  KEY `fk_savedatatype_id` (`fk_savedatatype_id`),
  KEY `fk_project_id` (`fk_project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=8 ;

--
-- Dumping data for table `savedata`
--

INSERT INTO `savedata` (`savedata_id`, `save_date`, `fk_line_id`, `fk_user_id`, `fk_savedatatype_id`, `fk_project_id`) VALUES
(1, '2015-05-20 00:03:03', 89, 1, 1, 1),
(2, '2015-05-22 00:16:14', 82, 1, 1, 1),
(3, '2015-05-20 00:03:03', 89, 1, 1, 1),
(4, '2015-05-20 00:03:03', 89, 1, 1, 1),
(5, '2015-05-20 00:03:03', 89, 1, 1, 1),
(6, '2015-05-21 02:00:41', 97, 1, 2, 6),
(7, '2015-05-22 02:22:15', 82, 10, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `savedatatype`
--

CREATE TABLE IF NOT EXISTS `savedatatype` (
  `savedatatype_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`savedatatype_id`),
  KEY `savedatatype_id` (`savedatatype_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `savedatatype`
--

INSERT INTO `savedatatype` (`savedatatype_id`, `name`) VALUES
(1, 'normal'),
(2, 'quick');

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE IF NOT EXISTS `setting` (
  `setting_id` int(16) NOT NULL AUTO_INCREMENT,
  `fk_splashscreen_id` int(16) DEFAULT NULL,
  `fk_titlebackground_id` int(16) DEFAULT NULL,
  `fk_titlebgm_id` int(16) DEFAULT NULL,
  `fk_configurationbackground_id` int(16) DEFAULT NULL,
  `fk_configurationbgm_id` int(16) DEFAULT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`setting_id`),
  KEY `setting_id` (`setting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sprite`
--

CREATE TABLE IF NOT EXISTS `sprite` (
  `sprite_id` int(16) NOT NULL AUTO_INCREMENT,
  `fk_resource_id` int(16) DEFAULT NULL,
  `position_x` int(16) DEFAULT NULL,
  `position_y` int(16) DEFAULT NULL,
  `position_z` int(16) DEFAULT NULL,
  `fk_effect_id` int(8) DEFAULT NULL,
  `fk_line_id` int(16) NOT NULL,
  PRIMARY KEY (`sprite_id`),
  KEY `sprite_id` (`sprite_id`),
  KEY `fk_resource_id` (`fk_resource_id`),
  KEY `fk_effect_id` (`fk_effect_id`),
  KEY `fk_line_id` (`fk_line_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=70 ;

--
-- Dumping data for table `sprite`
--

INSERT INTO `sprite` (`sprite_id`, `fk_resource_id`, `position_x`, `position_y`, `position_z`, `fk_effect_id`, `fk_line_id`) VALUES
(29, 81, 4, 0, 0, 5, 42),
(49, 442, 0, 0, 0, NULL, 300),
(50, 441, 0, 0, 0, NULL, 339),
(51, 81, 0, 0, 0, NULL, 89),
(52, 81, 0, 0, 0, 11, 65),
(53, 80, 0, 0, 0, NULL, 62),
(54, 83, 0, 0, 0, NULL, 66),
(55, 83, 0, 0, 0, NULL, 67),
(56, 84, 0, 0, 0, 10, 57),
(57, 84, 0, 0, 0, NULL, 58),
(58, 80, 0, 0, 0, NULL, 40),
(59, 79, 0, 0, 0, NULL, 51),
(60, 81, -3, 0, 0, NULL, 33),
(61, 80, 3, 0, 0, NULL, 33),
(62, 81, 3, 0, 0, NULL, 68),
(63, 80, -3, 0, 0, NULL, 68),
(64, 80, 0, 0, 0, NULL, 70),
(65, 81, 0, 0, 0, NULL, 71),
(66, 82, 0, 0, 0, NULL, 72),
(67, 80, 0, 0, 0, NULL, 79),
(68, 84, 0, 0, 0, NULL, 102),
(69, 83, 0, 0, 0, NULL, 82);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(16) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `salt` char(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fk_permission_id` int(8) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `user_id` (`user_id`),
  KEY `fk_permission_id` (`fk_permission_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=12 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `salt`, `created_date`, `updated_date`, `fk_permission_id`) VALUES
(1, 'sv', '$2a$07$1cd6dfb5886fac276ff0dugHlw49Ykidio2cqtgI6BBszPaemYgRm', '$2a$07$1cd6dfb5886fac276ff0d3d13605cc1f893415b865aa76db614af7750d2ba768e3276193ffa9cc6c2ff251da76083e2d4cf6c0febe31949d8cabc125eb9b9f30$', '2015-04-11 16:32:12', '2015-05-21 20:59:33', 2),
(2, 'skyvory', '$2a$07$b60547c3e56786ebc1d49OtFRYS4njPc/NfNMs0FBY9TfrJU6t0CC', '$2a$07$b60547c3e56786ebc1d49dc27722eb01637a32f0af1d0c3bdf61bafbd3b1b16cafbebf68513f70f1a0a56d9d8621725c17a0ba5507d74b25945369216ea85c58$', '2015-04-28 01:29:14', '2015-04-27 23:29:14', 2),
(4, 'dummy', '$2a$07$b461a6c1d94feb55941d2uS2U6xXzgIP797NDxHMtUBFlNsCAKf7S', '$2a$07$b461a6c1d94feb55941d2411f2dce3b60c80dc1cd75df4450a567af547626040a976c800109c8fd7e3b9a68dcdd59f32fbd9ec9156c182a527d6798c7328c262$', '2015-04-28 01:39:40', '2015-04-27 23:39:40', 2),
(5, 'dummy1', '$2a$07$67696950dc8e23c1594b0OWLYDMFKId2vv.rrIlLvmQUEn.79lBUm', '$2a$07$67696950dc8e23c1594b0b48794fba10e893c9a4ed1508770282dedd35fd8e9a173ebb38c4f9425e1b49d8650d1af1df7b86e9b99280bf040fff7b28f04273e6$', '2015-04-28 03:15:09', '2015-04-28 01:15:09', 2),
(7, 'bbbb', '$2a$07$e9946924c03d91b9fa3a8eDjbA2IKctkP5igWhUPpLkF7XskNd6MW', '$2a$07$e9946924c03d91b9fa3a8f6338c9e177c49067d9abce55152db6f3c418580987827aef81f7d0b4a8b2312c1e9556ac1774c1fbeb1e33f2f0b6cfbaec19ed1b0b$', '2015-05-20 22:27:49', '2015-05-20 20:27:49', 2),
(8, 'aaa1', '$2a$07$ccf0c98297b8418ec3bffe76jAcK4jEHm6PTr.8Vq6M2UU.Tl95WK', '$2a$07$ccf0c98297b8418ec3bffe59c646bb7f87312f195ff79cd728cc8b3ffa0bb8a1782c1852bb444de3799ebae30ed50de2535ad4516756ee4d8057d44bd1ebece0$', '2015-05-21 03:23:38', '2015-05-21 01:23:38', 2),
(9, 'aaa2', '$2a$07$3559e1b06d40fc967d47au/lYqI0KCD76fUtJvDZgHamfj53GL6me', '$2a$07$3559e1b06d40fc967d47a53df3f98117a8fb0e6f2b2318e38a286469994a0691939b71db9277a8be14498966e4ce4e805670d2e2bf2657fc2d58a068d35253ba$', '2015-05-21 07:12:24', '2015-05-21 05:12:24', 2),
(10, 'aaaa', '$2a$07$a7fced9d98faf0ab2efdfuHgUA12vvbe8DV85iU.U2MLKrVh85zVi', '$2a$07$a7fced9d98faf0ab2efdf38c6e30ccfd1aa7882116afa262df92a69ff6625e8a36a0292d4279e71af3030284139337b541e2842c6a2172723cca9d05633c87cc$', '2015-05-21 09:59:53', '2015-05-21 07:59:53', 2),
(11, 'admin', '$2a$07$53b701839a43b18214295O8FgSqSXBJWI8kMf8rpdQsRnKBST1lJC', '$2a$07$53b701839a43b18214295bcc44f969fdf2058704bd8ec2aa4077f6ac2b6697d596d9f30b27dc58face8911aff4cb10440d79f698669a8e43d4ec6071f19de965$', '2015-05-24 11:48:00', '2015-05-24 09:48:29', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `choice`
--
ALTER TABLE `choice`
  ADD CONSTRAINT `choice_ibfk_2` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `choice_ibfk_1` FOREIGN KEY (`jumpto_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `configuration`
--
ALTER TABLE `configuration`
  ADD CONSTRAINT `configuration_ibfk_3` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `configuration_ibfk_1` FOREIGN KEY (`fk_fonttype_id`) REFERENCES `fonttype` (`fonttype_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `configuration_ibfk_2` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `line`
--
ALTER TABLE `line`
  ADD CONSTRAINT `line_ibfk_3` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `line_ibfk_1` FOREIGN KEY (`jumpto_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `line_ibfk_2` FOREIGN KEY (`fk_linetype_id`) REFERENCES `linetype` (`linetype_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `lineres`
--
ALTER TABLE `lineres`
  ADD CONSTRAINT `lineres_ibfk_2` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `lineres_ibfk_1` FOREIGN KEY (`fk_resource_id`) REFERENCES `resource` (`resource_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`fk_projectstatus_id`) REFERENCES `projectstatus` (`projectstatus_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `resource`
--
ALTER TABLE `resource`
  ADD CONSTRAINT `resource_ibfk_2` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `resource_ibfk_1` FOREIGN KEY (`fk_resourcetype_id`) REFERENCES `resourcetype` (`resourcetype_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `savedata`
--
ALTER TABLE `savedata`
  ADD CONSTRAINT `savedata_ibfk_4` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedata_ibfk_1` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedata_ibfk_2` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedata_ibfk_3` FOREIGN KEY (`fk_savedatatype_id`) REFERENCES `savedatatype` (`savedatatype_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `sprite`
--
ALTER TABLE `sprite`
  ADD CONSTRAINT `sprite_ibfk_1` FOREIGN KEY (`fk_resource_id`) REFERENCES `resource` (`resource_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sprite_ibfk_2` FOREIGN KEY (`fk_effect_id`) REFERENCES `effect` (`effect_id`),
  ADD CONSTRAINT `sprite_ibfk_3` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`fk_permission_id`) REFERENCES `permission` (`permission_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
