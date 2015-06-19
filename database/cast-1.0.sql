-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 28, 2015 at 02:23 PM
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
  PRIMARY KEY (`configuration_id`),
  KEY `configuration_id` (`configuration_id`),
  KEY `fk_fonttype_id` (`fk_fonttype_id`),
  KEY `fk_user_id` (`fk_user_id`),
  KEY `fk_project_id` (`fk_project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

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
