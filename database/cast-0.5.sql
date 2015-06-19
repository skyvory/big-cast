-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 01, 2015 at 03:14 AM
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
  `content` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `fk_line_id` int(16) NOT NULL,
  PRIMARY KEY (`choice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
  PRIMARY KEY (`configuration_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `effect`
--

CREATE TABLE IF NOT EXISTS `effect` (
  `effect_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`effect_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=13 ;

--
-- Dumping data for table `effect`
--

INSERT INTO `effect` (`effect_id`, `name`) VALUES
(1, 'no effect'),
(2, 'fade in'),
(3, 'fade out'),
(4, 'crossfade'),
(5, 'move in from left'),
(6, 'move out to left'),
(7, 'move in from right'),
(8, 'move out ot right'),
(9, 'move in from above'),
(10, 'move out to above'),
(11, 'move in from below'),
(12, 'move out to below');

-- --------------------------------------------------------

--
-- Table structure for table `fonttype`
--

CREATE TABLE IF NOT EXISTS `fonttype` (
  `fonttype_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`fonttype_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

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
(7, 'Arial Unicode MS'),
(8, 'Comic Sans MS');

-- --------------------------------------------------------

--
-- Table structure for table `line`
--

CREATE TABLE IF NOT EXISTS `line` (
  `line_id` int(16) NOT NULL AUTO_INCREMENT,
  `sequence` int(16) NOT NULL,
  `description` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_linetype_id` int(8) NOT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`line_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `lineres`
--

CREATE TABLE IF NOT EXISTS `lineres` (
  `fk_line_id` int(16) NOT NULL,
  `fk_resource_id` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `linetype`
--

CREATE TABLE IF NOT EXISTS `linetype` (
  `linetype_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`linetype_id`)
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
  PRIMARY KEY (`permission_id`)
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
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `project`
--

INSERT INTO `project` (`project_id`, `title`, `description`, `cover`, `created_date`, `published_date`, `updated_date`, `fk_user_id`, `fk_projectstatus_id`) VALUES
(1, 'Tearstilla', 'Story of God of Whale who loses her oracle in an island of miraculous water', 'cover.jpg', '2015-04-25 17:25:06', '2015-04-25 11:34:25', '2015-04-25 22:46:57', 1, 1),
(2, 'Chronicle', NULL, NULL, '2015-04-25 23:43:45', NULL, '2015-04-25 21:56:02', 1, 1),
(3, 'Chronological', NULL, NULL, '2015-04-28 03:22:16', NULL, '2015-04-28 01:22:17', 5, 1),
(4, 'After', NULL, NULL, '2015-04-28 03:27:30', NULL, '2015-04-28 01:27:30', 5, 1),
(5, 'aaaa', NULL, NULL, '2015-04-30 00:57:35', NULL, '2015-04-29 22:57:35', 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `projectstatus`
--

CREATE TABLE IF NOT EXISTS `projectstatus` (
  `projectstatus_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`projectstatus_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `projectstatus`
--

INSERT INTO `projectstatus` (`projectstatus_id`, `name`) VALUES
(1, 'on progress'),
(2, 'finished'),
(3, 'published');

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
  PRIMARY KEY (`resource_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `resourcetype`
--

CREATE TABLE IF NOT EXISTS `resourcetype` (
  `resourcetype_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`resourcetype_id`)
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
  PRIMARY KEY (`savedata_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `savedatatype`
--

CREATE TABLE IF NOT EXISTS `savedatatype` (
  `savedatatype_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`savedatatype_id`)
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
  PRIMARY KEY (`setting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `sprite`
--

CREATE TABLE IF NOT EXISTS `sprite` (
  `sprite_id` int(16) NOT NULL AUTO_INCREMENT,
  `fk_resource_id` int(16) NOT NULL,
  `position_x` int(16) DEFAULT NULL,
  `position_y` int(16) DEFAULT NULL,
  `position_z` int(16) DEFAULT NULL,
  `fk_line_id` int(16) NOT NULL,
  PRIMARY KEY (`sprite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `salt`, `created_date`, `updated_date`, `fk_permission_id`) VALUES
(1, 'sv', '$2a$07$1cd6dfb5886fac276ff0dugHlw49Ykidio2cqtgI6BBszPaemYgRm', '$2a$07$1cd6dfb5886fac276ff0d3d13605cc1f893415b865aa76db614af7750d2ba768e3276193ffa9cc6c2ff251da76083e2d4cf6c0febe31949d8cabc125eb9b9f30$', '2015-04-11 16:32:12', '2015-05-01 00:50:29', 1),
(2, 'skyvory', '$2a$07$b60547c3e56786ebc1d49OtFRYS4njPc/NfNMs0FBY9TfrJU6t0CC', '$2a$07$b60547c3e56786ebc1d49dc27722eb01637a32f0af1d0c3bdf61bafbd3b1b16cafbebf68513f70f1a0a56d9d8621725c17a0ba5507d74b25945369216ea85c58$', '2015-04-28 01:29:14', '2015-04-27 23:29:14', 2),
(3, 'dummy2', '$2a$07$766150565a91e89c7d840ucuzIRsZ7WNx3hkGrKHnbB4uAAMtcXre', '$2a$07$766150565a91e89c7d8400679de4f66852ae5061ab3ede79d4ed4677396c33debca6f38b581d1c995613fb06b0de91e268658310ab2cb732fffec852bffe0a7d$', '2015-04-28 01:35:55', '2015-04-27 23:35:55', 2),
(4, 'dummy', '$2a$07$b461a6c1d94feb55941d2uS2U6xXzgIP797NDxHMtUBFlNsCAKf7S', '$2a$07$b461a6c1d94feb55941d2411f2dce3b60c80dc1cd75df4450a567af547626040a976c800109c8fd7e3b9a68dcdd59f32fbd9ec9156c182a527d6798c7328c262$', '2015-04-28 01:39:40', '2015-04-27 23:39:40', 2),
(5, 'dummy1', '$2a$07$67696950dc8e23c1594b0OWLYDMFKId2vv.rrIlLvmQUEn.79lBUm', '$2a$07$67696950dc8e23c1594b0b48794fba10e893c9a4ed1508770282dedd35fd8e9a173ebb38c4f9425e1b49d8650d1af1df7b86e9b99280bf040fff7b28f04273e6$', '2015-04-28 03:15:09', '2015-04-28 01:15:09', 2),
(6, 'aaaa', '$2a$07$a7fced9d98faf0ab2efdfuHgUA12vvbe8DV85iU.U2MLKrVh85zVi', '$2a$07$a7fced9d98faf0ab2efdf38c6e30ccfd1aa7882116afa262df92a69ff6625e8a36a0292d4279e71af3030284139337b541e2842c6a2172723cca9d05633c87cc$', '2015-04-30 00:57:25', '2015-04-29 22:57:25', 2);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
