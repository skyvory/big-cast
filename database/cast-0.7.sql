-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2015 at 11:33 PM
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
  `jumpto_line_id` int(16) DEFAULT NULL,
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
  `label` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `speaker` varchar(32) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fk_effect_id` int(11) DEFAULT NULL,
  `jumpto_line_id` int(11) DEFAULT NULL,
  `fk_linetype_id` int(8) NOT NULL,
  `fk_project_id` int(16) NOT NULL,
  PRIMARY KEY (`line_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=40 ;

--
-- Dumping data for table `line`
--

INSERT INTO `line` (`line_id`, `sequence`, `label`, `speaker`, `content`, `fk_effect_id`, `jumpto_line_id`, `fk_linetype_id`, `fk_project_id`) VALUES
(1, 1, 'beginning', 'protag', 'nothing', NULL, NULL, 1, 1),
(2, 3, NULL, 'akio', 'pucnh', NULL, 1, 1, 1),
(33, 2, NULL, 'hibiki', 'ghost buster', NULL, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `lineres`
--

CREATE TABLE IF NOT EXISTS `lineres` (
  `fk_line_id` int(16) NOT NULL,
  `fk_resource_id` int(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `lineres`
--

INSERT INTO `lineres` (`fk_line_id`, `fk_resource_id`) VALUES
(1, 85),
(33, 123),
(33, 85),
(33, 137);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=167 ;

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
(136, 'VOICE_arc_000003', '317a5aab093877e3509e0e1574b7f056.ogg', 'ageha', NULL, NULL, 5, 1),
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
(166, 'グリザイアの楽園_Blanc_Aile_no_Tane_OP', '1678335bc60938381dc335cbcaeb1ea2.mp4', NULL, NULL, NULL, 6, 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=25 ;

--
-- Dumping data for table `sprite`
--

INSERT INTO `sprite` (`sprite_id`, `fk_resource_id`, `position_x`, `position_y`, `position_z`, `fk_line_id`) VALUES
(1, 79, 0, 0, 0, 1),
(2, 80, 0, 0, 0, 1);

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
