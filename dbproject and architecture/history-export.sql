-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 02, 2015 at 06:51 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `achievements`
--

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE IF NOT EXISTS `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `completed_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `task_id` (`task_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=273 ;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `task_id`, `completed_at`) VALUES
(7, 1, '2015-04-24 16:00:00'),
(8, 1, '2015-04-25 21:00:00'),
(9, 1, '2015-04-27 21:00:00'),
(10, 1, '2015-04-29 21:00:00'),
(11, 1, '2015-05-01 21:00:00'),
(12, 1, '2015-05-03 21:00:00'),
(13, 1, '2015-05-05 21:00:00'),
(14, 1, '2015-05-07 21:00:00'),
(15, 1, '2015-05-09 21:00:00'),
(16, 1, '2015-05-11 21:00:00'),
(17, 1, '2015-05-13 21:00:00'),
(18, 1, '2015-05-15 21:00:00'),
(19, 1, '2015-05-17 21:00:00'),
(26, 1, '2015-05-19 21:00:00'),
(30, 1, '2015-05-21 21:00:00'),
(31, 1, '2015-05-23 21:00:00'),
(38, 1, '2015-05-25 21:00:00'),
(39, 1, '2015-05-27 21:00:00'),
(40, 3, '2015-05-29 21:00:00'),
(41, 2, '2015-05-29 21:00:00'),
(42, 3, '2015-05-28 21:00:00'),
(43, 1, '2015-05-29 21:00:00'),
(44, 2, '2015-05-30 21:00:00'),
(45, 3, '2015-05-30 21:00:00'),
(46, 3, '2015-05-31 21:00:00'),
(47, 1, '2015-05-31 21:00:00'),
(48, 2, '2015-05-31 21:00:00'),
(50, 2, '2015-06-01 21:00:00'),
(51, 3, '2015-06-01 21:00:00'),
(52, 1, '2015-06-02 21:00:00'),
(53, 2, '2015-06-02 21:00:00'),
(54, 3, '2015-06-02 21:00:00'),
(55, 3, '2015-06-03 21:00:00'),
(56, 2, '2015-06-03 21:00:00'),
(57, 3, '2015-06-04 21:00:00'),
(58, 2, '2015-06-04 21:00:00'),
(59, 1, '2015-06-04 21:00:00'),
(60, 2, '2015-06-05 21:00:00'),
(61, 3, '2015-06-05 21:00:00'),
(62, 1, '2015-06-06 21:00:00'),
(63, 3, '2015-06-06 21:00:00'),
(64, 2, '2015-06-06 21:00:00'),
(65, 3, '2015-06-07 21:00:00'),
(66, 2, '2015-06-07 21:00:00'),
(67, 3, '2015-06-08 21:00:00'),
(68, 2, '2015-06-08 21:00:00'),
(69, 1, '2015-06-08 21:00:00'),
(70, 2, '2015-06-09 21:00:00'),
(71, 3, '2015-06-09 21:00:00'),
(72, 1, '2015-06-10 21:00:00'),
(73, 2, '2015-06-10 21:00:00'),
(74, 3, '2015-06-10 21:00:00'),
(75, 2, '2015-06-11 21:00:00'),
(76, 3, '2015-06-11 21:00:00'),
(77, 1, '2015-06-12 21:00:00'),
(78, 3, '2015-06-12 21:00:00'),
(79, 2, '2015-06-12 21:00:00'),
(80, 2, '2015-06-13 21:00:00'),
(81, 1, '2015-06-14 21:00:00'),
(82, 2, '2015-06-14 21:00:00'),
(83, 3, '2015-06-14 21:00:00'),
(84, 3, '2015-06-15 21:00:00'),
(85, 2, '2015-06-15 21:00:00'),
(86, 1, '2015-06-16 21:00:00'),
(87, 2, '2015-06-16 21:00:00'),
(88, 3, '2015-06-16 21:00:00'),
(89, 3, '2015-06-17 21:00:00'),
(90, 2, '2015-06-17 21:00:00'),
(91, 1, '2015-06-18 21:00:00'),
(92, 2, '2015-06-18 21:00:00'),
(93, 3, '2015-06-18 21:00:00'),
(94, 2, '2015-06-19 21:00:00'),
(95, 3, '2015-06-19 21:00:00'),
(96, 1, '2015-06-20 21:00:00'),
(97, 2, '2015-06-20 21:00:00'),
(98, 3, '2015-06-21 21:00:00'),
(101, 1, '2015-06-22 21:00:00'),
(102, 2, '2015-06-22 21:00:00'),
(103, 3, '2015-06-22 21:00:00'),
(104, 3, '2015-06-23 21:00:00'),
(105, 2, '2015-06-23 21:00:00'),
(106, 1, '2015-06-24 21:00:00'),
(107, 2, '2015-06-24 21:00:00'),
(108, 3, '2015-06-24 21:00:00'),
(109, 3, '2015-06-25 21:00:00'),
(110, 2, '2015-06-25 21:00:00'),
(111, 1, '2015-06-26 21:00:00'),
(112, 2, '2015-06-26 21:00:00'),
(113, 3, '2015-06-26 21:00:00'),
(114, 3, '2015-06-27 21:00:00'),
(115, 2, '2015-06-27 21:00:00'),
(116, 1, '2015-06-28 21:00:00'),
(117, 2, '2015-06-28 21:00:00'),
(119, 3, '2015-06-29 21:00:00'),
(120, 2, '2015-06-29 21:00:00'),
(121, 3, '2015-06-30 21:00:00'),
(122, 2, '2015-06-30 21:00:00'),
(123, 1, '2015-06-30 21:00:00'),
(125, 2, '2015-07-01 21:00:00'),
(126, 3, '2015-07-01 21:00:00'),
(127, 3, '2015-07-02 21:00:00'),
(128, 2, '2015-07-02 21:00:00'),
(129, 1, '2015-07-02 21:00:00'),
(130, 2, '2015-07-03 21:00:00'),
(131, 3, '2015-07-03 21:00:00'),
(132, 3, '2015-07-04 21:00:00'),
(133, 1, '2015-07-04 21:00:00'),
(134, 2, '2015-07-04 21:00:00'),
(135, 2, '2015-07-05 21:00:00'),
(136, 3, '2015-07-05 21:00:00'),
(137, 3, '2015-07-06 21:00:00'),
(138, 2, '2015-07-06 21:00:00'),
(139, 1, '2015-07-06 21:00:00'),
(140, 2, '2015-07-07 21:00:00'),
(141, 3, '2015-07-07 21:00:00'),
(142, 1, '2015-07-08 21:00:00'),
(145, 2, '2015-07-08 21:00:00'),
(146, 3, '2015-07-08 21:00:00'),
(147, 2, '2015-07-09 21:00:00'),
(148, 3, '2015-07-09 21:00:00'),
(149, 2, '2015-07-10 21:00:00'),
(150, 1, '2015-07-10 21:00:00'),
(151, 3, '2015-07-10 21:00:00'),
(154, 3, '2015-07-12 06:00:00'),
(155, 2, '2015-07-12 08:00:00'),
(156, 2, '2015-07-12 21:00:00'),
(157, 3, '2015-07-12 21:00:00'),
(158, 1, '2015-07-12 21:00:00'),
(159, 2, '2015-07-13 21:00:00'),
(160, 3, '2015-07-13 21:00:00'),
(161, 1, '2015-07-14 21:00:00'),
(162, 2, '2015-07-14 21:00:00'),
(163, 3, '2015-07-14 21:00:00'),
(164, 2, '2015-07-15 21:00:00'),
(165, 3, '2015-07-15 21:00:00'),
(166, 3, '2015-07-16 21:00:00'),
(167, 2, '2015-07-16 21:00:00'),
(168, 1, '2015-07-16 21:00:00'),
(169, 3, '2015-07-17 21:00:00'),
(170, 2, '2015-07-17 21:00:00'),
(171, 2, '2015-07-18 21:00:00'),
(172, 1, '2015-07-18 21:00:00'),
(173, 2, '2015-07-19 21:00:00'),
(174, 3, '2015-07-20 21:00:00'),
(175, 2, '2015-07-20 21:00:00'),
(176, 1, '2015-07-20 21:00:00'),
(177, 2, '2015-07-21 21:00:00'),
(178, 3, '2015-07-21 21:00:00'),
(179, 1, '2015-07-22 21:00:00'),
(180, 1, '2015-07-24 21:00:00'),
(181, 1, '2015-07-26 21:00:00'),
(182, 1, '2015-07-28 21:00:00'),
(183, 2, '2015-07-22 21:00:00'),
(184, 2, '2015-07-23 21:00:00'),
(185, 2, '2015-07-24 21:00:00'),
(186, 2, '2015-07-25 21:00:00'),
(187, 2, '2015-07-26 21:00:00'),
(188, 2, '2015-07-27 21:00:00'),
(189, 2, '2015-07-28 21:00:00'),
(190, 3, '2015-07-22 21:00:00'),
(191, 3, '2015-07-23 21:00:00'),
(192, 3, '2015-07-24 21:00:00'),
(193, 3, '2015-07-25 21:00:00'),
(194, 3, '2015-07-26 21:00:00'),
(195, 3, '2015-07-27 21:00:00'),
(196, 3, '2015-07-28 21:00:00'),
(197, 2, '2015-07-29 21:00:00'),
(198, 2, '2015-07-30 21:00:00'),
(199, 2, '2015-07-31 21:00:00'),
(200, 2, '2015-08-02 21:00:00'),
(201, 2, '2015-08-03 21:00:00'),
(202, 2, '2015-08-04 21:00:00'),
(203, 3, '2015-07-29 21:00:00'),
(204, 3, '2015-07-30 21:00:00'),
(205, 3, '2015-07-31 21:00:00'),
(206, 3, '2015-08-02 21:00:00'),
(207, 3, '2015-08-03 21:00:00'),
(208, 3, '2015-08-04 21:00:00'),
(209, 1, '2015-07-30 21:00:00'),
(210, 1, '2015-08-01 21:00:00'),
(211, 1, '2015-08-03 21:00:00'),
(212, 2, '2015-08-01 21:00:00'),
(213, 3, '2015-08-01 21:00:00'),
(214, 1, '2015-08-05 21:00:00'),
(215, 1, '2015-08-07 21:00:00'),
(216, 1, '2015-08-09 21:00:00'),
(217, 2, '2015-08-05 21:00:00'),
(218, 2, '2015-08-06 21:00:00'),
(219, 2, '2015-08-07 21:00:00'),
(220, 2, '2015-08-08 21:00:00'),
(221, 2, '2015-08-09 21:00:00'),
(222, 3, '2015-08-09 21:00:00'),
(223, 3, '2015-08-08 21:00:00'),
(224, 3, '2015-08-07 21:00:00'),
(225, 3, '2015-08-06 21:00:00'),
(226, 3, '2015-08-05 21:00:00'),
(228, 1, '2015-08-11 21:00:00'),
(229, 2, '2015-08-10 21:00:00'),
(230, 2, '2015-08-11 21:00:00'),
(232, 3, '2015-08-10 21:00:00'),
(233, 3, '2015-08-11 21:00:00'),
(234, 3, '2015-08-12 21:00:00'),
(235, 1, '2015-08-13 21:00:00'),
(236, 2, '2015-08-13 21:00:00'),
(237, 3, '2015-08-13 21:00:00'),
(238, 2, '2015-08-14 21:00:00'),
(239, 3, '2015-08-14 21:00:00'),
(240, 3, '2015-08-15 21:00:00'),
(241, 1, '2015-08-15 21:00:00'),
(243, 3, '2015-08-19 21:00:00'),
(244, 3, '2015-08-18 21:00:00'),
(245, 3, '2015-08-17 21:00:00'),
(246, 3, '2015-08-16 21:00:00'),
(247, 2, '2015-08-19 21:00:00'),
(248, 2, '2015-08-18 21:00:00'),
(249, 2, '2015-08-17 21:00:00'),
(250, 2, '2015-08-16 21:00:00'),
(251, 1, '2015-08-17 21:00:00'),
(252, 3, '2015-08-20 21:00:00'),
(253, 3, '2015-08-21 21:00:00'),
(254, 3, '2015-08-22 21:00:00'),
(256, 3, '2015-08-24 21:00:00'),
(257, 3, '2015-08-25 21:00:00'),
(258, 3, '2015-08-26 21:00:00'),
(259, 3, '2015-08-27 21:00:00'),
(260, 3, '2015-08-28 21:00:00'),
(261, 3, '2015-08-29 21:00:00'),
(262, 3, '2015-08-30 21:00:00'),
(263, 3, '2015-08-31 21:00:00'),
(264, 2, '2015-08-20 21:00:00'),
(265, 2, '2015-08-21 21:00:00'),
(266, 1, '2015-08-21 21:00:00'),
(267, 2, '2015-08-22 21:00:00'),
(268, 3, '2015-09-01 21:00:00'),
(269, 2, '2015-08-23 21:00:00'),
(271, 3, '2015-08-23 21:00:00'),
(272, 1, '2015-08-23 21:00:00');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
