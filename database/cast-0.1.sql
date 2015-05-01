-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2015 at 05:01 PM
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
  `content` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `fk_background_id` int(16) DEFAULT NULL,
  `fk_backgroundeffect` int(16) DEFAULT NULL,
  `fk_bgm_id` int(16) DEFAULT NULL,
  `fk_sfx_id` int(16) DEFAULT NULL,
  `fk_line_id` int(16) NOT NULL,
  `fk_nextline_id` int(16) NOT NULL,
  PRIMARY KEY (`choice_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

CREATE TABLE IF NOT EXISTS `configuration` (
  `configuration_id` int(16) NOT NULL AUTO_INCREMENT,
  `fk_fonttype_id` int(8) NOT NULL,
  `textspeed` int(16) NOT NULL COMMENT 'delay per character',
  `bgmvolume` float NOT NULL,
  `voicevolume` float NOT NULL,
  `sfxvolume` float NOT NULL,
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `fonttype`
--

CREATE TABLE IF NOT EXISTS `fonttype` (
  `fonttype_id` int(16) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`fonttype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
-- Table structure for table `linetype`
--

CREATE TABLE IF NOT EXISTS `linetype` (
  `linetype_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`linetype_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `permission`
--

CREATE TABLE IF NOT EXISTS `permission` (
  `permission_id` int(8) NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
  `fk_sprite_id` int(16) NOT NULL,
  `position_x` int(16) NOT NULL,
  `position_z` int(16) NOT NULL,
  `fk_effect_id` int(16) NOT NULL,
  `fk_line_id` int(16) NOT NULL,
  PRIMARY KEY (`sprite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `text`
--

CREATE TABLE IF NOT EXISTS `text` (
  `fk_line_id` int(16) NOT NULL,
  `speaker` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(512) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_voice_id` int(16) DEFAULT NULL,
  `fk_background_id` int(16) DEFAULT NULL,
  `fk_backgroundeffect_id` int(16) DEFAULT NULL,
  `fk_bgm_id` int(16) DEFAULT NULL,
  `fk_sfx_id` int(16) DEFAULT NULL,
  `fk_nextline_id` int(16) NOT NULL,
  PRIMARY KEY (`fk_line_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(16) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password` char(64) COLLATE utf8_unicode_ci NOT NULL,
  `created_date` datetime NOT NULL,
  `updated_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `fk_permission_id` int(8) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE IF NOT EXISTS `video` (
  `video_id` int(16) NOT NULL AUTO_INCREMENT,
  `fk_video_id` int(16) NOT NULL,
  `fk_line_id` int(16) NOT NULL,
  `fk_nextline_id` int(16) NOT NULL,
  PRIMARY KEY (`video_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
