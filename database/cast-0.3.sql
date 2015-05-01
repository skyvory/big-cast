-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2015 at 11:07 PM
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
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fk_user_id` int(16) NOT NULL,
  `fk_projectstatus_id` int(8) NOT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL COMMENT 'resource/character name',
  `filename` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `password`, `salt`, `created_date`, `updated_date`, `fk_permission_id`) VALUES
(1, 'sv', '$2a$07$1cd6dfb5886fac276ff0dugHlw49Ykidio2cqtgI6BBszPaemYgRm', '$2a$07$1cd6dfb5886fac276ff0d3d13605cc1f893415b865aa76db614af7750d2ba768e3276193ffa9cc6c2ff251da76083e2d4cf6c0febe31949d8cabc125eb9b9f30$', '2015-04-11 16:32:12', '2015-04-11 09:32:12', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
