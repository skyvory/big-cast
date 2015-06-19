-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2015 at 12:01 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `choice`
--

INSERT INTO `choice` (`choice_id`, `content`, `jumpto_line_id`, `fk_line_id`) VALUES
(1, 'Yes', 10, 8),
(2, 'Why do you ask?', 9, 8);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `configuration`
--

INSERT INTO `configuration` (`configuration_id`, `fk_fonttype_id`, `text_speed`, `bgm_volume`, `voice_volume`, `sfx_volume`, `fk_user_id`, `fk_project_id`) VALUES
(1, 4, 1, 1, 1, 1, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `effect`
--

CREATE TABLE IF NOT EXISTS `effect` (
  `effect_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`effect_id`),
  KEY `effect_id` (`effect_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=12 ;

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
(7, 'move out to right'),
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=17 ;

--
-- Dumping data for table `line`
--

INSERT INTO `line` (`line_id`, `sequence`, `label`, `speaker`, `content`, `jumpto_line_id`, `fk_linetype_id`, `fk_project_id`) VALUES
(1, 1, 'first line', 'Gentleman', 'Look here, boy, can you hold my horse a few minutes?', NULL, 1, 1),
(2, 2, NULL, 'Jack', 'Yes, sir, I''ll hold him as long as you like.', NULL, 1, 1),
(3, 3, NULL, 'Gentleman', 'All right! I''m going in at No. 39; I won''t be long.', NULL, 1, 1),
(4, 4, NULL, 'Frank', 'Have you set up a carriage, Jack?', NULL, 1, 1),
(8, 5, NULL, NULL, NULL, NULL, 2, 1),
(9, 6, 'asking answer', 'Frank', 'No real reason, just curious', 11, 1, 1),
(10, 7, 'yes answer', 'Jack', 'but it ain''t for long. I shall set down again pretty soon.', 11, 1, 1),
(11, 9, 'continue', 'Frank', 'I thought your grandmother had left you a fortune, and you had set up a team.', NULL, 1, 1),
(12, 8, NULL, 'Jack', 'No such good news. It belongs to a gentleman that''s inside.', NULL, 1, 1),
(13, 10, NULL, NULL, NULL, NULL, 3, 1),
(15, 11, NULL, 'Jack', '...', NULL, 1, 1),
(16, 12, NULL, NULL, NULL, NULL, 4, 1);

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
(1, 50),
(1, 51),
(1, 57),
(1, 70),
(2, 50),
(2, 51),
(2, 75),
(3, 50),
(3, 51),
(3, 72),
(4, 50),
(4, 51),
(4, 74),
(9, 50),
(9, 51),
(9, 73),
(10, 50),
(10, 51),
(10, 66),
(11, 50),
(11, 51),
(11, 68),
(12, 50),
(12, 51),
(12, 67),
(13, 76),
(15, 50),
(15, 51),
(15, 67);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `title`, `description`, `cover`, `created_date`, `published_date`, `updated_date`, `fk_user_id`, `fk_projectstatus_id`) VALUES
(1, 'Jack''s Ward', 'Story of the boy guardian.', '1', '2015-05-28 17:45:09', '2015-05-28 22:22:32', '2015-05-28 20:22:32', 2, 2);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=77 ;

--
-- Dumping data for table `resource`
--

INSERT INTO `resource` (`resource_id`, `name`, `file_name`, `character_name`, `figure_name`, `expression_name`, `fk_resourcetype_id`, `fk_project_id`) VALUES
(1, 'jack0007', '4d86f7fd6fea7f50b937c7869cee89ac.png', 'Jack', 'Standing', 'Normal', 1, 1),
(2, 'jack0008', '1692743ca6db3936d244640039d5b182.png', 'Jack', 'Standing', 'Angry', 1, 1),
(3, 'jack0009', 'c46173cf066f6fb0f84604a7a8db95d0.png', 'Jack', 'Standing', 'Flat', 1, 1),
(5, 'jack0005', '8f77068ec5a499b2f1423fc4e493cad9.png', 'Jack', 'Standing', 'Smile', 1, 1),
(6, 'jack0010', 'f098c5f5cc6143ae21fd1d07993c4092.png', 'Jack', 'Standing', 'Confused', 1, 1),
(11, 'jack0015', 'e0a4623d8ebe9cdccb99624d97d7abe4.png', 'Jack', 'Standing', 'Dislike', 1, 1),
(13, 'jack0002', 'f9650c0001bee6cd2a9b93442404d40e.png', 'Jack', 'Standing', 'Reflect', 1, 1),
(14, 'jack0004', '68165b7b60ded522a180fd8bf64c58b6.png', 'Jack', 'Standing', 'Wonder', 1, 1),
(15, 'jack0003', 'e9a6215e2f4f937e18b223a458c88e9f.png', 'Jack', 'Standing', 'Close', 1, 1),
(16, 'frank0005', 'a15a6474663055f2cb04b63ccbe139a1.png', 'Frank', 'Standing', 'Normal', 1, 1),
(17, 'frank0002', '8db762376cec13dd3f2d748890f3e7be.png', 'Frank', 'Standing', 'Happy', 1, 1),
(18, 'frank0003', '06bd8b91f567b704d4b3065bd597ffdd.png', 'Frank', 'Standing', 'Poker', 1, 1),
(19, 'frank0006', '45bee2ca8044206baa58d9d9fb5beb58.png', 'Frank', 'Standing', 'Angry', 1, 1),
(23, 'frank0008', 'e112bf82438337786a4bd947a4aa7b41.png', 'Frank', 'Standing', 'Confident', 1, 1),
(25, 'frank0010', 'beae17999990eaf2ab7452013b99da9b.png', 'Frank', 'Standing', 'Dislike', 1, 1),
(26, 'gentleman0006', '45b0eb9291f2f3e21be041977d9e6c07.png', 'Gentleman', 'Standing', 'Normal', 1, 1),
(27, 'gentleman0004', '63ef42031f80bf805cd12d0eabddfe69.png', 'Gentleman', 'Standing', 'Open Mouth', 1, 1),
(28, 'gentleman0007', 'f435a013ab73ff2bf1e07be026dbe8ae.png', 'Gentleman', 'Standing', 'Stare', 1, 1),
(29, 'gentleman0005', '0454ad46976123c98d75c5cf3402d8ec.png', 'Gentleman', 'Standing', 'Happy', 1, 1),
(30, 'gentleman0003', '1beb6de3efcd3ba538b28a27349499f4.png', 'Gentleman', 'Standing', 'Smile', 1, 1),
(31, 'gentleman0002', 'f9a9cfc5058ec6a50ba121d086b236a1.png', 'Gentleman', 'Standing', 'Dislike', 1, 1),
(33, 'harding0006', 'd5f86713d9da080a199e42a9e20ddb6f.png', 'Harding', 'Standing', 'Normal', 1, 1),
(34, 'harding0008', '16b29a41921a9634cddd22cf90958e64.png', 'Harding', 'Standing', 'Frown', 1, 1),
(35, 'harding0005', '5d9ac0fb8cb81e4a91ba0822ac393be5.png', 'Harding', 'Standing', 'Happy Closed Eyes', 1, 1),
(36, 'harding0009', '98eb48f27c5cd76ecbc79804e2016309.png', 'Harding', 'Standing', 'Big Smile', 1, 1),
(37, 'harding0007', '6d9e5b379b9fabc2db9e51719774fcd5.png', 'Harding', 'Standing', 'Open Mouth', 1, 1),
(38, 'harding0001', '983aab5b3e1e8f48f74b2688d58a2a51.png', 'Harding', 'Standing', 'Normal Closed Eyes', 1, 1),
(39, 'harding0002', 'ae18b3738b5986b6dbc3c610b222dfa9.png', 'Harding', 'Standing', 'Normal Smile', 1, 1),
(40, 'harding0003', '956281233452c0251a4f7fcff2c69b98.png', 'Harding', 'Standing', 'Smile', 1, 1),
(42, 'rachel0001', '3bdf0fc2fdd4290fbc1086f88715cfa0.png', 'Rachel', 'Standing', 'Normal', 1, 1),
(43, 'rachel0005', '4c212de2d306c1a8cf54fc6a62f6d809.png', 'Rachel', 'Standing', 'Big Smile', 1, 1),
(44, 'rachel0006', '5969e9abb71ec90d48812e805cad2053.png', 'Rachel', 'Standing', 'Smile', 1, 1),
(45, 'rachel0003', 'ce0f49770eea3dc4066f42833d446acd.png', 'Rachel', 'Standing', 'Frown', 1, 1),
(46, 'rachel0002', '8f1b7afe2d73838b4a899f900e49110b.png', 'Rachel', 'Standing', 'Open Mouth', 1, 1),
(47, 'rachel0004', '7031c89fb9cab5511c14a342d6e55444.png', 'Rachel', 'Standing', 'Frown', 1, 1),
(48, 'road', '0fce49b565c8b5a784421712bcf9a4a0.jpg', NULL, NULL, NULL, 2, 1),
(49, 'house', '6f75d7c9aa6348c50fce0601e121740e.jpg', NULL, NULL, NULL, 2, 1),
(50, 'crossing', '411f8094607bb894ae52ec217231a7bb.jpg', NULL, NULL, NULL, 2, 1),
(51, 'Active', '527795851f43374529e8744f70b1421d.mp3', NULL, NULL, NULL, 3, 1),
(52, 'Clam', '667adbed3a185ca14b92e1275b4457b9.mp3', NULL, NULL, NULL, 3, 1),
(53, 'Gentle', 'fd6b3b2798da36c935cd1963e77d0aa5.mp3', NULL, NULL, NULL, 3, 1),
(54, 'Eventide', '9fa892950c5838d3624f3c5d7272371a.mp3', NULL, NULL, NULL, 3, 1),
(55, 'Bound', 'e3420e097dfc2dbe4ef50ddd27dbf362.mp3', NULL, NULL, NULL, 3, 1),
(56, 'punch 2', 'dc97115f17c340e667957c07cd4aff59.ogg', NULL, NULL, NULL, 4, 1),
(57, 'bell', '30073d41848c8df8bd2d561260f145fd.ogg', NULL, NULL, NULL, 4, 1),
(59, 'door close hard', '6b63a5d4baa83a580a6439f2e3278f1d.ogg', NULL, NULL, NULL, 4, 1),
(60, 'shower', 'd44b34a2eee73528a64fd54022673d21.ogg', NULL, NULL, NULL, 4, 1),
(61, 'footstep', '9a8f39ce2c31ec1a953654d7be97cafd.ogg', NULL, NULL, NULL, 4, 1),
(62, 'door open', '8b7efd0bf843ed37e6331d8dde4f8b5c.ogg', NULL, NULL, NULL, 4, 1),
(63, 'drop', 'eca82571356ffcc5f0d0814e3fba05c8.ogg', NULL, NULL, NULL, 4, 1),
(64, 'punch', 'a4b37782c6600fa5302b6eb748597660.ogg', NULL, NULL, NULL, 4, 1),
(65, 'hit', '21c80624cf39230cf7e23e21e343f6bc.ogg', NULL, NULL, NULL, 4, 1),
(66, 'voice_000006', '0f7d736a91f1382042aa34a76794b0d0.ogg', NULL, NULL, NULL, 5, 1),
(67, 'voice_000008', 'ad5415c84c699b2257e72f2d98775a38.ogg', NULL, NULL, NULL, 5, 1),
(68, 'voice_000007', '50447c38137cc2096355bdee1412ce94.ogg', NULL, NULL, NULL, 5, 1),
(69, 'voice_000010', '3ef6871a8499cd0066e79bf4a7c4c205.ogg', NULL, NULL, NULL, 5, 1),
(70, 'voice_000001', '3b6d2764357daad486a3f7fb8de4cbb4.ogg', NULL, NULL, NULL, 5, 1),
(71, 'voice_000009', '49c109204a38f8d1fcf53c115ec6d02c.ogg', NULL, NULL, NULL, 5, 1),
(72, 'voice_000003', '28bbe5edfe9a7e78798d50f4b4c4b494.ogg', NULL, NULL, NULL, 5, 1),
(73, 'voice_000005', 'ec9cc517d897a13f5bb3807bdc2292e6.ogg', NULL, NULL, NULL, 5, 1),
(74, 'voice_000004', 'aea2407b81520dad25785ae52b90b8d1.ogg', NULL, NULL, NULL, 5, 1),
(75, 'voice_000002', '3e79dda34f4519ec116d9c48f689cd6a.ogg', NULL, NULL, NULL, 5, 1),
(76, 'video', 'ddcfe18eae1e38b8677f8fcc82cfbbd2.mp4', NULL, NULL, NULL, 6, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `savedata`
--

INSERT INTO `savedata` (`savedata_id`, `save_date`, `fk_line_id`, `fk_user_id`, `fk_savedatatype_id`, `fk_project_id`) VALUES
(1, '2015-05-28 22:51:24', 1, 2, 1, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=23 ;

--
-- Dumping data for table `sprite`
--

INSERT INTO `sprite` (`sprite_id`, `fk_resource_id`, `position_x`, `position_y`, `position_z`, `fk_effect_id`, `fk_line_id`) VALUES
(1, 26, 0, 0, 0, NULL, 1),
(2, 26, 0, 0, 0, NULL, 2),
(3, 1, 4, 1, 0, 6, 2),
(4, 27, 0, 0, 0, 7, 3),
(5, 1, 4, 1, 0, NULL, 3),
(6, 1, 4, 1, 0, NULL, 4),
(7, 16, 0, 1, 0, NULL, 4),
(14, 1, 4, 1, 0, NULL, 9),
(15, 16, 0, 1, 0, NULL, 9),
(16, 11, 4, 1, 0, NULL, 10),
(17, 16, 4, 1, 0, NULL, 10),
(18, 1, 4, 1, 0, NULL, 11),
(19, 25, 0, 1, 0, NULL, 11),
(20, 11, 4, 1, 0, NULL, 12),
(21, 16, 0, 1, 0, NULL, 12),
(22, 3, 2, 1, 0, NULL, 15);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=3 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `salt`, `created_date`, `updated_date`, `fk_permission_id`) VALUES
(1, 'admin', '$2a$07$53b701839a43b18214295O8FgSqSXBJWI8kMf8rpdQsRnKBST1lJC', '$2a$07$53b701839a43b18214295bcc44f969fdf2058704bd8ec2aa4077f6ac2b6697d596d9f30b27dc58face8911aff4cb10440d79f698669a8e43d4ec6071f19de965$', '2015-05-28 17:20:32', '2015-05-28 15:20:46', 1),
(2, 'fourleaves', '$2a$07$eedc5708261c69588b422uCfWdVFhlNd8PcobQLOt6c2OFyirkheq', '$2a$07$eedc5708261c69588b4223725e61fb59d222f13eec491c067d20bd2d0a627db73eb0eb8da4e9a591e508b53e5546bb27cde13cbb60e40135a388da76d9f0c7ec$', '2015-05-28 17:32:42', '2015-05-28 15:32:42', 2);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `choice`
--
ALTER TABLE `choice`
  ADD CONSTRAINT `choice_ibfk_1` FOREIGN KEY (`jumpto_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `choice_ibfk_2` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `configuration`
--
ALTER TABLE `configuration`
  ADD CONSTRAINT `configuration_ibfk_1` FOREIGN KEY (`fk_fonttype_id`) REFERENCES `fonttype` (`fonttype_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `configuration_ibfk_2` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `configuration_ibfk_3` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `line`
--
ALTER TABLE `line`
  ADD CONSTRAINT `line_ibfk_1` FOREIGN KEY (`jumpto_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `line_ibfk_2` FOREIGN KEY (`fk_linetype_id`) REFERENCES `linetype` (`linetype_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `line_ibfk_3` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `lineres`
--
ALTER TABLE `lineres`
  ADD CONSTRAINT `lineres_ibfk_1` FOREIGN KEY (`fk_resource_id`) REFERENCES `resource` (`resource_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `lineres_ibfk_2` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `project`
--
ALTER TABLE `project`
  ADD CONSTRAINT `project_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `project_ibfk_2` FOREIGN KEY (`fk_projectstatus_id`) REFERENCES `projectstatus` (`projectstatus_id`) ON UPDATE NO ACTION;

--
-- Constraints for table `resource`
--
ALTER TABLE `resource`
  ADD CONSTRAINT `resource_ibfk_1` FOREIGN KEY (`fk_resourcetype_id`) REFERENCES `resourcetype` (`resourcetype_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `resource_ibfk_2` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `savedata`
--
ALTER TABLE `savedata`
  ADD CONSTRAINT `savedata_ibfk_1` FOREIGN KEY (`fk_line_id`) REFERENCES `line` (`line_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedata_ibfk_2` FOREIGN KEY (`fk_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedata_ibfk_3` FOREIGN KEY (`fk_savedatatype_id`) REFERENCES `savedatatype` (`savedatatype_id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `savedata_ibfk_4` FOREIGN KEY (`fk_project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

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
