-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 01, 2015 at 04:31 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `achieve_v.0.0.1`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE IF NOT EXISTS `achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `achv_types_id` int(11) NOT NULL,
  `categories_id` int(11) NOT NULL,
  `tasks_id` int(11) NOT NULL,
  `alias` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `bg_color` varchar(7) COLLATE utf8_unicode_ci DEFAULT NULL,
  `image` varchar(256) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_defined` tinyint(1) NOT NULL,
  `users_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `achievements_achv_types` (`achv_types_id`),
  KEY `achievements_categories` (`categories_id`),
  KEY `achievements_tasks` (`tasks_id`),
  KEY `achievements_users` (`users_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `achv_types_id`, `categories_id`, `tasks_id`, `alias`, `title`, `color`, `bg_color`, `image`, `user_defined`, `users_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, 'man_of_steel', 'Man of Steel', '', '', 'fa-mars-stroke', 0, NULL, '2015-08-15 07:32:07', '2015-08-15 07:32:07'),
(2, 3, 4, 2, 'daredevil', 'Daredevil', '', '', 'fa-motorcycle', 0, NULL, '2015-08-17 11:00:21', '2015-08-17 11:00:21'),
(3, 2, 3, 3, 'gaijin', 'Gaijin', '', '', 'fa-plane', 0, NULL, '2015-08-17 11:03:01', '2015-08-17 11:03:01');

-- --------------------------------------------------------

--
-- Table structure for table `achievements_lang`
--

CREATE TABLE IF NOT EXISTS `achievements_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `achievements_id` int(11) NOT NULL,
  `locale` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `achievements_lang_achievements` (`achievements_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

--
-- Dumping data for table `achievements_lang`
--

INSERT INTO `achievements_lang` (`id`, `achievements_id`, `locale`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Man of Steel', '2015-08-15 07:32:26', '2015-08-15 07:32:26'),
(2, 2, 'en', 'Daredevil', '2015-08-17 11:03:23', '2015-08-17 11:03:23'),
(3, 3, 'en', 'Gaijin', '2015-08-17 11:03:23', '2015-08-17 11:03:23'),
(7, 1, 'bg', 'Човек от стомана', '2015-08-30 10:02:17', '2015-08-30 10:02:17'),
(8, 2, 'bg', 'Дердевил', '2015-08-30 10:02:17', '2015-08-30 10:02:17'),
(9, 3, 'bg', 'Гайджин', '2015-08-30 10:02:17', '2015-08-30 10:02:17');

-- --------------------------------------------------------

--
-- Table structure for table `achv_levels`
--

CREATE TABLE IF NOT EXISTS `achv_levels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `achievements_id` int(11) NOT NULL,
  `level_num` int(11) NOT NULL,
  `repetition` int(11) NOT NULL,
  `timeframe` int(11) NOT NULL,
  `alias` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `achv_levels_achievements` (`achievements_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=38 ;

--
-- Dumping data for table `achv_levels`
--

INSERT INTO `achv_levels` (`id`, `achievements_id`, `level_num`, `repetition`, `timeframe`, `alias`, `title`, `image`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0, 0, 'novice_trainee', 'Novice Trainee', 'fa-tv', '2015-08-15 07:33:21', '2015-08-15 07:33:21'),
(31, 1, 2, 15, 30, 'getting_the_fat_out', 'Getting the fat out', 'fa-bicycle', '2015-08-15 09:00:29', '2015-08-15 09:00:29'),
(32, 2, 1, 0, 0, 'scaredy_cat', 'Scaredy Cat', '', '2015-08-17 11:06:27', '2015-08-17 11:06:27'),
(33, 2, 2, 10, 0, 'frightful', 'Frightful', '', '2015-08-17 11:06:27', '2015-08-17 11:06:27'),
(34, 3, 1, 0, 0, 'local', 'Local', '', '2015-08-17 11:07:38', '2015-08-17 11:07:38'),
(35, 3, 2, 1, 0, 'gaijin', 'Gaijin', '', '2015-08-17 11:07:38', '2015-08-17 11:07:38'),
(36, 1, 3, 30, 60, 'semi_serious_athlete', 'Semi-Serious Athlete', 'fa-soccer-ball-o', '2015-08-17 12:40:50', '2015-08-17 12:40:50'),
(37, 2, 3, 20, 0, 'anxious', 'Anxious', '', '2015-08-20 17:39:35', '2015-08-20 17:39:35');

-- --------------------------------------------------------

--
-- Table structure for table `achv_levels_lang`
--

CREATE TABLE IF NOT EXISTS `achv_levels_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `achv_levels_id` int(11) NOT NULL,
  `locale` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `achv_levels_lang_achv_levels` (`achv_levels_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=35 ;

--
-- Dumping data for table `achv_levels_lang`
--

INSERT INTO `achv_levels_lang` (`id`, `achv_levels_id`, `locale`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Novice Trainee', '2015-08-15 07:33:54', '2015-08-15 07:33:54'),
(20, 31, 'en', 'Getting the fat out', '2015-08-15 09:01:00', '2015-08-15 09:01:00'),
(21, 36, 'en', 'Semi-Serious Athlete', '2015-08-30 10:05:56', '2015-08-30 10:05:56'),
(22, 32, 'en', 'Scardy Cat', '2015-08-30 10:05:56', '2015-08-30 10:05:56'),
(23, 33, 'en', 'Frightful', '2015-08-30 10:05:56', '2015-08-30 10:05:56'),
(24, 37, 'en', 'Anxious', '2015-08-30 10:05:56', '2015-08-30 10:05:56'),
(25, 34, 'en', 'Local', '2015-08-30 10:05:56', '2015-08-30 10:05:56'),
(26, 35, 'en', 'Gaijin', '2015-08-30 10:05:56', '2015-08-30 10:05:56'),
(27, 1, 'bg', 'Новак', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(28, 31, 'bg', 'Стапяш Мазнините', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(29, 32, 'bg', 'Страхливец', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(30, 33, 'bg', 'Плашлив', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(31, 34, 'bg', 'Местен', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(32, 35, 'bg', 'Гайджин', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(33, 36, 'bg', 'Почти Сериозен Атлет', '2015-08-30 10:09:04', '2015-08-30 10:09:04'),
(34, 37, 'bg', 'Неспокоен', '2015-08-30 10:09:04', '2015-08-30 10:09:04');

-- --------------------------------------------------------

--
-- Table structure for table `achv_types`
--

CREATE TABLE IF NOT EXISTS `achv_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `achv_types`
--

INSERT INTO `achv_types` (`id`, `alias`, `title`, `created_at`, `updated_at`) VALUES
(1, 'timed', 'Timed', '2015-08-13 07:47:51', '2015-08-13 07:47:51'),
(2, 'one_time', 'One Time', '2015-08-17 10:55:55', '2015-08-17 10:55:55'),
(3, 'repetative', 'Repetative', '2015-08-17 10:56:06', '2015-08-17 10:56:06');

-- --------------------------------------------------------

--
-- Table structure for table `achv_types_lang`
--

CREATE TABLE IF NOT EXISTS `achv_types_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `achv_types_id` int(11) NOT NULL,
  `locale` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `achv_types_lang_achv_types` (`achv_types_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Dumping data for table `achv_types_lang`
--

INSERT INTO `achv_types_lang` (`id`, `achv_types_id`, `locale`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Timed', '2015-08-13 07:57:20', '2015-08-13 07:57:20'),
(2, 2, 'en', 'One Time', '2015-08-17 10:59:16', '2015-08-17 10:59:16'),
(3, 3, 'en', 'Repetative', '2015-08-17 10:59:16', '2015-08-17 10:59:16'),
(4, 1, 'bg', 'Времеви', '2015-08-30 10:09:57', '2015-08-30 10:09:57'),
(5, 2, 'bg', 'Еднократни', '2015-08-30 10:09:57', '2015-08-30 10:09:57'),
(6, 3, 'bg', 'Повторяеми', '2015-08-30 10:09:57', '2015-08-30 10:09:57');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `alias` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `bg_color` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `user_defined` tinyint(1) NOT NULL DEFAULT '0',
  `users_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_categories` (`parent_id`),
  KEY `categories_users` (`users_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `parent_id`, `alias`, `title`, `color`, `bg_color`, `image`, `user_defined`, `users_id`, `created_at`, `updated_at`) VALUES
(1, NULL, 'top', 'Top', '#212121', '#c1c1c1', '', 0, NULL, '2015-08-15 07:15:10', '2015-08-15 07:15:10'),
(2, 1, 'lifestyle', 'Lifestyle', '#0ba876', '#e1e1e1', 'fa-heartbeat', 0, NULL, '2015-08-19 16:00:32', '2015-08-19 16:00:32'),
(3, 1, 'travel', 'Travel', '#008edf', '#ffffff', 'fa-train', 0, NULL, '2015-08-19 16:01:05', '2015-08-19 16:01:05'),
(4, 1, 'self_improvement', 'Self Improvement', '#c0303a', '#ffffff', 'fa-line-chart', 0, NULL, '2015-08-19 16:01:46', '2015-08-19 16:01:46');

-- --------------------------------------------------------

--
-- Table structure for table `categories_lang`
--

CREATE TABLE IF NOT EXISTS `categories_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categories_id` int(11) NOT NULL,
  `locale` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_lang_categories` (`categories_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9 ;

--
-- Dumping data for table `categories_lang`
--

INSERT INTO `categories_lang` (`id`, `categories_id`, `locale`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Top', '2015-08-15 07:30:18', '2015-08-15 07:30:18'),
(2, 2, 'en', 'Lifestyle', '2015-08-19 16:20:19', '2015-08-19 16:20:19'),
(3, 3, 'en', 'Travel', '2015-08-19 16:20:19', '2015-08-19 16:20:19'),
(4, 4, 'en', 'Self Improvement', '2015-08-19 16:20:37', '2015-08-19 16:20:37'),
(5, 1, 'bg', 'Начало', '2015-08-30 10:11:36', '2015-08-30 10:11:36'),
(6, 2, 'bg', 'Начин на живот', '2015-08-30 10:11:36', '2015-08-30 10:11:36'),
(7, 3, 'bg', 'Пътуване', '2015-08-30 10:11:36', '2015-08-30 10:11:36'),
(8, 4, 'bg', 'Личностно развитие', '2015-08-30 10:11:36', '2015-08-30 10:11:36');

-- --------------------------------------------------------

--
-- Table structure for table `favourites`
--

CREATE TABLE IF NOT EXISTS `favourites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `achievements_id` int(11) DEFAULT NULL,
  `tasks_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `favourites_achievements` (`achievements_id`),
  KEY `favourites_tasks` (`tasks_id`),
  KEY `favourites_users` (`users_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `favourites`
--

INSERT INTO `favourites` (`id`, `users_id`, `achievements_id`, `tasks_id`, `created_at`, `updated_at`) VALUES
(5, 9, 3, NULL, '2015-08-20 12:13:52', '2015-08-20 12:13:52'),
(15, 9, 2, NULL, '2015-08-21 14:56:14', '2015-08-21 14:56:14'),
(18, 9, NULL, 1, '2015-08-30 08:04:26', '2015-08-30 08:04:26'),
(19, 9, 1, NULL, '2015-08-30 12:41:10', '2015-08-30 12:41:10');

-- --------------------------------------------------------

--
-- Table structure for table `history`
--

CREATE TABLE IF NOT EXISTS `history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `tasks_id` int(11) NOT NULL,
  `date` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `history_tasks` (`tasks_id`),
  KEY `history_users` (`users_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=158 ;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `users_id`, `tasks_id`, `date`) VALUES
(22, 9, 1, '2015-07-25 16:18:08'),
(23, 9, 1, '2015-07-27 16:18:21'),
(24, 9, 1, '2015-07-29 16:18:26'),
(25, 9, 1, '2015-07-31 16:18:32'),
(26, 9, 1, '2015-08-02 16:18:36'),
(27, 9, 1, '2015-08-04 16:18:41'),
(28, 9, 1, '2015-08-06 16:18:45'),
(29, 9, 1, '2015-08-08 16:18:58'),
(30, 9, 1, '2015-08-10 16:19:03'),
(31, 9, 1, '2015-08-12 16:19:07'),
(32, 9, 1, '2015-08-14 16:19:13'),
(33, 9, 1, '2015-08-16 16:19:17'),
(34, 9, 1, '2015-08-20 17:00:07'),
(35, 9, 3, '2015-08-19 17:37:22'),
(36, 9, 2, '2015-08-20 17:42:16'),
(37, 9, 1, '2015-08-20 16:46:22'),
(38, 9, 3, '2015-08-20 17:50:59'),
(131, 9, 2, '2015-08-21 13:59:53'),
(133, 9, 2, '2015-08-20 14:03:17'),
(134, 9, 2, '2015-08-19 14:03:24'),
(135, 9, 2, '2015-08-18 14:03:27'),
(136, 9, 2, '2015-08-17 14:03:30'),
(137, 9, 2, '2015-08-16 14:03:34'),
(138, 9, 2, '2015-08-15 14:03:37'),
(139, 9, 2, '2015-08-14 14:03:41'),
(151, 9, 1, '2015-08-21 14:39:04'),
(154, 9, 3, '2015-08-21 14:44:18'),
(155, 9, 2, '2015-08-21 14:45:01'),
(156, 9, 1, '2015-08-30 08:13:25'),
(157, 9, 1, '2015-08-30 12:41:20');

-- --------------------------------------------------------

--
-- Table structure for table `route_access`
--

CREATE TABLE IF NOT EXISTS `route_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `route` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `method` varchar(6) COLLATE utf8_unicode_ci NOT NULL,
  `user_groups_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `route_access_user_groups` (`user_groups_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Dumping data for table `route_access`
--

INSERT INTO `route_access` (`id`, `route`, `method`, `user_groups_id`, `created_at`, `updated_at`) VALUES
(1, 'categories', 'GET', 1, '2015-08-10 16:34:17', '2015-08-10 16:34:17');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `categories_id` int(11) NOT NULL,
  `alias` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `color` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `bg_color` varchar(7) COLLATE utf8_unicode_ci NOT NULL,
  `image` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `user_defined` tinyint(1) NOT NULL,
  `users_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_categories` (`categories_id`),
  KEY `tasks_users` (`users_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `categories_id`, `alias`, `title`, `description`, `color`, `bg_color`, `image`, `user_defined`, `users_id`, `created_at`, `updated_at`) VALUES
(1, 2, 'train', 'Train', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin at posuere libero, et posuere sapien. Etiam urna arcu, posuere id volutpat id, accumsan a eros. Quisque eu est ultricies, iaculis libero ut, posuere est. Suspendisse fermentum est magna, sit amet rutrum augue luctus ut. Donec venenatis enim et sem condimentum commodo. Vivamus nisi magna, consectetur eget felis vel, ultrices dignissim risus. ', '', '', 'fa-hand-rock-o ', 0, NULL, '2015-08-15 07:31:01', '2015-08-15 07:31:01'),
(2, 4, 'fight_fear', 'Fight Fear', '', '', '', '', 0, NULL, '2015-08-15 08:29:32', '2015-08-15 08:29:32'),
(3, 3, 'visit_japan', 'Visit Japan', '', '', '', '', 0, NULL, '2015-08-17 11:01:37', '2015-08-17 11:01:37');

-- --------------------------------------------------------

--
-- Table structure for table `tasks_lang`
--

CREATE TABLE IF NOT EXISTS `tasks_lang` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_id` int(11) NOT NULL,
  `locale` varchar(5) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `description` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_lang_tasks` (`tasks_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=7 ;

--
-- Dumping data for table `tasks_lang`
--

INSERT INTO `tasks_lang` (`id`, `tasks_id`, `locale`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Train', '', '2015-08-15 07:31:19', '2015-08-15 07:31:19'),
(2, 2, 'en', 'Fight Fear', '', '2015-08-17 11:02:07', '2015-08-17 11:02:07'),
(3, 3, 'en', 'Visit Japan', '', '2015-08-17 11:02:07', '2015-08-17 11:02:07'),
(4, 1, 'bg', 'Тренировки', 'Внимавайте вие, читатели и слушатели, роде български, които обичате и вземате присърце своя род и своето българско отечество и желаете да разберете и знаете известното за своя български род и за вашите бащи, прадеди и царе, патриарси и светии как изпърво са живели и прекарвали. За вас е потребно и полезно да знаете известното за делата на вашите бащи, както знаят всички други племена и народи своя род и език, имат история и всеки грамотен от тях знае, разказва и се гордее със своя род и език.', '2015-08-30 10:13:41', '2015-08-30 10:13:41'),
(5, 2, 'bg', 'Борба със страха', '', '2015-08-30 10:13:41', '2015-08-30 10:13:41'),
(6, 3, 'bg', 'Посети Япония', '', '2015-08-30 10:13:41', '2015-08-30 10:13:41');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(256) COLLATE utf8_unicode_ci NOT NULL,
  `last_login` timestamp NOT NULL,
  `last_login_from` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `user_groups_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_user_groups` (`user_groups_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=10 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `password`, `last_login`, `last_login_from`, `user_groups_id`, `created_at`, `updated_at`) VALUES
(9, 'teodorklissarov@gmail.com', 'Teodor Klissarov', '0491b02ab48e90761d271bd902460054', '0000-00-00 00:00:00', '', 1, '2015-08-07 12:48:39', '2015-08-07 12:48:39');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

CREATE TABLE IF NOT EXISTS `user_achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `users_id` int(11) NOT NULL,
  `achievements_id` int(11) NOT NULL,
  `achv_levels_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_achievements_achievements` (`achievements_id`),
  KEY `user_achievements_achv_levels` (`achv_levels_id`),
  KEY `user_achievements_users` (`users_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=42 ;

--
-- Dumping data for table `user_achievements`
--

INSERT INTO `user_achievements` (`id`, `users_id`, `achievements_id`, `achv_levels_id`, `created_at`, `updated_at`) VALUES
(14, 9, 1, 1, '2015-07-15 16:17:35', '2015-08-20 16:17:35'),
(26, 9, 2, 32, '2015-08-10 13:59:24', '2015-08-21 13:59:24'),
(29, 9, 3, 34, '2015-08-21 14:18:27', '2015-08-21 14:18:27'),
(37, 9, 1, 31, '2015-08-21 14:39:12', '2015-08-21 14:39:12'),
(40, 9, 3, 35, '2015-08-21 14:44:21', '2015-08-21 14:44:21'),
(41, 9, 2, 33, '2015-08-21 14:45:06', '2015-08-21 14:45:06');

-- --------------------------------------------------------

--
-- Table structure for table `user_groups`
--

CREATE TABLE IF NOT EXISTS `user_groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(128) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  `updated_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- Dumping data for table `user_groups`
--

INSERT INTO `user_groups` (`id`, `alias`, `title`, `created_at`, `updated_at`) VALUES
(1, 'administrator', 'Administrator', '2015-08-07 07:22:16', '2015-08-07 07:22:16'),
(3, 'free', 'Free', '2015-08-07 12:46:18', '2015-08-07 12:46:18');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `achievements`
--
ALTER TABLE `achievements`
  ADD CONSTRAINT `achievements_achv_types` FOREIGN KEY (`achv_types_id`) REFERENCES `achv_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `achievements_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `achievements_tasks` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `achievements_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `achievements_lang`
--
ALTER TABLE `achievements_lang`
  ADD CONSTRAINT `achievements_lang_achievements` FOREIGN KEY (`achievements_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `achv_levels`
--
ALTER TABLE `achv_levels`
  ADD CONSTRAINT `achv_levels_achievements` FOREIGN KEY (`achievements_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `achv_levels_lang`
--
ALTER TABLE `achv_levels_lang`
  ADD CONSTRAINT `achv_levels_lang_achv_levels` FOREIGN KEY (`achv_levels_id`) REFERENCES `achv_levels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `achv_types_lang`
--
ALTER TABLE `achv_types_lang`
  ADD CONSTRAINT `achv_types_lang_achv_types` FOREIGN KEY (`achv_types_id`) REFERENCES `achv_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_categories` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `categories_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `categories_lang`
--
ALTER TABLE `categories_lang`
  ADD CONSTRAINT `categories_lang_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `favourites`
--
ALTER TABLE `favourites`
  ADD CONSTRAINT `favourites_achievements` FOREIGN KEY (`achievements_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favourites_tasks` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `favourites_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `history`
--
ALTER TABLE `history`
  ADD CONSTRAINT `history_tasks` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `history_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `route_access`
--
ALTER TABLE `route_access`
  ADD CONSTRAINT `route_access_user_groups` FOREIGN KEY (`user_groups_id`) REFERENCES `user_groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_categories` FOREIGN KEY (`categories_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tasks_lang`
--
ALTER TABLE `tasks_lang`
  ADD CONSTRAINT `tasks_lang_tasks` FOREIGN KEY (`tasks_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_user_groups` FOREIGN KEY (`user_groups_id`) REFERENCES `user_groups` (`id`);

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_achievements` FOREIGN KEY (`achievements_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_achievements_achv_levels` FOREIGN KEY (`achv_levels_id`) REFERENCES `achv_levels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_achievements_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
