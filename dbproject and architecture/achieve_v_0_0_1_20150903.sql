-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Sep 03, 2015 at 06:50 PM
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `achievements`
--

INSERT INTO `achievements` (`id`, `achv_types_id`, `categories_id`, `tasks_id`, `alias`, `title`, `color`, `bg_color`, `image`, `user_defined`, `users_id`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, 'man_of_steel', 'Man of Steel', '', '', 'icon-man-of-steel', 0, NULL, '2015-08-15 07:32:07', '2015-08-15 07:32:07'),
(2, 3, 4, 2, 'daredevil', 'Daredevil', '', '', 'fa-motorcycle', 0, NULL, '2015-08-17 11:00:21', '2015-08-17 11:00:21'),
(3, 2, 3, 3, 'gaijin', 'Gaijin', '', '', 'fa-plane', 0, NULL, '2015-08-17 11:03:01', '2015-08-17 11:03:01'),
(4, 1, 2, 4, 'early_bird', 'Early Bird', NULL, NULL, 'icon-early-bird', 0, NULL, '2015-09-02 16:13:24', '2015-09-02 16:13:24'),
(5, 1, 4, 5, 'mind_like_water', 'Mind like water', NULL, NULL, 'icon-mind-like-water', 0, NULL, '2015-09-02 16:13:24', '2015-09-02 16:13:24');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=14 ;

--
-- Dumping data for table `achievements_lang`
--

INSERT INTO `achievements_lang` (`id`, `achievements_id`, `locale`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Man of Steel', '2015-08-15 07:32:26', '2015-08-15 07:32:26'),
(2, 2, 'en', 'Daredevil', '2015-08-17 11:03:23', '2015-08-17 11:03:23'),
(3, 3, 'en', 'Gaijin', '2015-08-17 11:03:23', '2015-08-17 11:03:23'),
(7, 1, 'bg', 'Човек от стомана', '2015-08-30 10:02:17', '2015-08-30 10:02:17'),
(8, 2, 'bg', 'Дердевил', '2015-08-30 10:02:17', '2015-08-30 10:02:17'),
(9, 3, 'bg', 'Гайджин', '2015-08-30 10:02:17', '2015-08-30 10:02:17'),
(10, 4, 'en', 'Early Bird', '2015-09-02 16:15:22', '2015-09-02 16:15:22'),
(11, 4, 'bg', 'Ранно Пиле', '2015-09-02 16:15:22', '2015-09-02 16:15:22'),
(12, 5, 'en', 'Mind like water', '2015-09-02 16:15:22', '2015-09-02 16:15:22'),
(13, 5, 'bg', 'Съзнание като вода', '2015-09-02 16:15:22', '2015-09-02 16:15:22');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=56 ;

--
-- Dumping data for table `achv_levels`
--

INSERT INTO `achv_levels` (`id`, `achievements_id`, `level_num`, `repetition`, `timeframe`, `alias`, `title`, `image`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 0, 0, 'novice_trainee', 'Novice Trainee', 'icon-novice-trainee', '2015-08-15 07:33:21', '2015-08-15 07:33:21'),
(31, 1, 2, 15, 30, 'getting_the_fat_out', 'Getting the fat out', 'icon-getting-the-fat-out', '2015-08-15 09:00:29', '2015-08-15 09:00:29'),
(32, 2, 1, 0, 0, 'scaredy_cat', 'Scaredy Cat', '', '2015-08-17 11:06:27', '2015-08-17 11:06:27'),
(33, 2, 2, 10, 0, 'frightful', 'Frightful', '', '2015-08-17 11:06:27', '2015-08-17 11:06:27'),
(34, 3, 1, 0, 0, 'local', 'Local', '', '2015-08-17 11:07:38', '2015-08-17 11:07:38'),
(35, 3, 2, 1, 0, 'gaijin', 'Gaijin', '', '2015-08-17 11:07:38', '2015-08-17 11:07:38'),
(36, 1, 3, 30, 60, 'semi_serious_athlete', 'Semi-Serious Athlete', 'icon-semi-serious-athlete', '2015-08-17 12:40:50', '2015-08-17 12:40:50'),
(37, 2, 3, 20, 0, 'anxious', 'Anxious', '', '2015-08-20 17:39:35', '2015-08-20 17:39:35'),
(38, 4, 1, 0, 0, 'night_owl', 'Night Owl', 'icon-night-owl', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(39, 4, 2, 13, 15, 'not_so_morning_person', 'Not-so-Morning-Person', 'icon-not-so-morning-person', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(40, 4, 3, 26, 30, 'back_to_local_timezone', 'Back to local Timezone', 'icon-back-to-the-local-timezone', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(41, 4, 4, 78, 90, 'good_morning', 'Good Morning!', 'icon-good-morning', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(42, 4, 5, 156, 180, 'first_rays_of_sunshine', 'First rays of Sunshine', 'icon-first-rays-of-sunshine', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(43, 4, 6, 312, 360, 'morning_person', 'Morning Person', 'icon-morning-person', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(44, 4, 7, 624, 720, 'early_bird', 'Early Bird', 'icon-early-bird', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(45, 1, 4, 45, 90, 'musle_maker', 'Musle-Maker', 'icon-musle-maker', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(46, 1, 5, 90, 180, 'serious_athlete', 'Serious Athlete', 'icon-serious-athlete', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(47, 1, 6, 180, 360, 'beach_body', 'Beach Body', 'icon-beach-body', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(48, 1, 7, 360, 720, 'man_of_steel', 'Man of Steel', 'icon-man-of-steel', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(49, 5, 0, 0, 0, 'busy_mind', 'Busy Mind', 'icon-busy-mind', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(50, 5, 1, 14, 15, 'training_mind', 'Training Mind', 'icon-training-mind', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(51, 5, 2, 28, 30, 'calming_mind', 'Calming Mind', 'icon-calming-mind', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(52, 5, 3, 84, 90, 'present_mind', 'Present Mind', 'icon-present-mind', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(53, 5, 4, 168, 180, 'trained_mind', 'Trained Mind', 'icon-trained-mind', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(54, 5, 5, 336, 360, 'relaxed_mind', 'Relaxed Mind', 'icon-relaxed-mind', '0000-00-00 00:00:00', '0000-00-00 00:00:00'),
(55, 5, 6, 672, 720, 'mind_like_water', 'Mind like Water', 'icon-mind-like-water', '0000-00-00 00:00:00', '0000-00-00 00:00:00');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=240 ;

--
-- Dumping data for table `history`
--

INSERT INTO `history` (`id`, `users_id`, `tasks_id`, `date`) VALUES
(1, 9, 1, '2015-04-24 13:00:00'),
(2, 9, 1, '2015-04-25 18:00:00'),
(3, 9, 1, '2015-04-27 18:00:00'),
(4, 9, 1, '2015-04-29 18:00:00'),
(5, 9, 1, '2015-05-01 18:00:00'),
(6, 9, 1, '2015-05-03 18:00:00'),
(7, 9, 1, '2015-05-05 18:00:00'),
(8, 9, 1, '2015-05-07 18:00:00'),
(9, 9, 1, '2015-05-09 18:00:00'),
(10, 9, 1, '2015-05-11 18:00:00'),
(11, 9, 1, '2015-05-13 18:00:00'),
(12, 9, 1, '2015-05-15 18:00:00'),
(13, 9, 1, '2015-05-17 18:00:00'),
(14, 9, 1, '2015-05-19 18:00:00'),
(15, 9, 1, '2015-05-21 18:00:00'),
(16, 9, 1, '2015-05-23 18:00:00'),
(17, 9, 1, '2015-05-25 18:00:00'),
(18, 9, 1, '2015-05-27 18:00:00'),
(19, 9, 4, '2015-05-29 18:00:00'),
(20, 9, 5, '2015-05-29 18:00:00'),
(21, 9, 4, '2015-05-28 18:00:00'),
(22, 9, 1, '2015-05-29 18:00:00'),
(23, 9, 5, '2015-05-30 18:00:00'),
(24, 9, 4, '2015-05-30 18:00:00'),
(25, 9, 4, '2015-05-31 18:00:00'),
(26, 9, 1, '2015-05-31 18:00:00'),
(27, 9, 5, '2015-05-31 18:00:00'),
(28, 9, 5, '2015-06-01 18:00:00'),
(29, 9, 4, '2015-06-01 18:00:00'),
(30, 9, 1, '2015-06-02 18:00:00'),
(31, 9, 5, '2015-06-02 18:00:00'),
(32, 9, 4, '2015-06-02 18:00:00'),
(33, 9, 4, '2015-06-03 18:00:00'),
(34, 9, 5, '2015-06-03 18:00:00'),
(35, 9, 4, '2015-06-04 18:00:00'),
(36, 9, 5, '2015-06-04 18:00:00'),
(37, 9, 1, '2015-06-04 18:00:00'),
(38, 9, 5, '2015-06-05 18:00:00'),
(39, 9, 4, '2015-06-05 18:00:00'),
(40, 9, 1, '2015-06-06 18:00:00'),
(41, 9, 4, '2015-06-06 18:00:00'),
(42, 9, 5, '2015-06-06 18:00:00'),
(43, 9, 4, '2015-06-07 18:00:00'),
(44, 9, 5, '2015-06-07 18:00:00'),
(45, 9, 4, '2015-06-08 18:00:00'),
(46, 9, 5, '2015-06-08 18:00:00'),
(47, 9, 1, '2015-06-08 18:00:00'),
(48, 9, 5, '2015-06-09 18:00:00'),
(49, 9, 4, '2015-06-09 18:00:00'),
(50, 9, 1, '2015-06-10 18:00:00'),
(51, 9, 5, '2015-06-10 18:00:00'),
(52, 9, 4, '2015-06-10 18:00:00'),
(53, 9, 5, '2015-06-11 18:00:00'),
(54, 9, 4, '2015-06-11 18:00:00'),
(55, 9, 1, '2015-06-12 18:00:00'),
(56, 9, 4, '2015-06-12 18:00:00'),
(57, 9, 5, '2015-06-12 18:00:00'),
(58, 9, 5, '2015-06-13 18:00:00'),
(59, 9, 1, '2015-06-14 18:00:00'),
(60, 9, 5, '2015-06-14 18:00:00'),
(61, 9, 4, '2015-06-14 18:00:00'),
(62, 9, 4, '2015-06-15 18:00:00'),
(63, 9, 5, '2015-06-15 18:00:00'),
(64, 9, 1, '2015-06-16 18:00:00'),
(65, 9, 5, '2015-06-16 18:00:00'),
(66, 9, 4, '2015-06-16 18:00:00'),
(67, 9, 4, '2015-06-17 18:00:00'),
(68, 9, 5, '2015-06-17 18:00:00'),
(69, 9, 1, '2015-06-18 18:00:00'),
(70, 9, 5, '2015-06-18 18:00:00'),
(71, 9, 4, '2015-06-18 18:00:00'),
(72, 9, 5, '2015-06-19 18:00:00'),
(73, 9, 4, '2015-06-19 18:00:00'),
(74, 9, 1, '2015-06-20 18:00:00'),
(75, 9, 5, '2015-06-20 18:00:00'),
(76, 9, 4, '2015-06-21 18:00:00'),
(77, 9, 1, '2015-06-22 18:00:00'),
(78, 9, 5, '2015-06-22 18:00:00'),
(79, 9, 4, '2015-06-22 18:00:00'),
(80, 9, 4, '2015-06-23 18:00:00'),
(81, 9, 5, '2015-06-23 18:00:00'),
(82, 9, 1, '2015-06-24 18:00:00'),
(83, 9, 5, '2015-06-24 18:00:00'),
(84, 9, 4, '2015-06-24 18:00:00'),
(85, 9, 4, '2015-06-25 18:00:00'),
(86, 9, 5, '2015-06-25 18:00:00'),
(87, 9, 1, '2015-06-26 18:00:00'),
(88, 9, 5, '2015-06-26 18:00:00'),
(89, 9, 4, '2015-06-26 18:00:00'),
(90, 9, 4, '2015-06-27 18:00:00'),
(91, 9, 5, '2015-06-27 18:00:00'),
(92, 9, 1, '2015-06-28 18:00:00'),
(93, 9, 5, '2015-06-28 18:00:00'),
(94, 9, 4, '2015-06-29 18:00:00'),
(95, 9, 5, '2015-06-29 18:00:00'),
(96, 9, 4, '2015-06-30 18:00:00'),
(97, 9, 5, '2015-06-30 18:00:00'),
(98, 9, 1, '2015-06-30 18:00:00'),
(99, 9, 5, '2015-07-01 18:00:00'),
(100, 9, 4, '2015-07-01 18:00:00'),
(101, 9, 4, '2015-07-02 18:00:00'),
(102, 9, 5, '2015-07-02 18:00:00'),
(103, 9, 1, '2015-07-02 18:00:00'),
(104, 9, 5, '2015-07-03 18:00:00'),
(105, 9, 4, '2015-07-03 18:00:00'),
(106, 9, 4, '2015-07-04 18:00:00'),
(107, 9, 1, '2015-07-04 18:00:00'),
(108, 9, 5, '2015-07-04 18:00:00'),
(109, 9, 5, '2015-07-05 18:00:00'),
(110, 9, 4, '2015-07-05 18:00:00'),
(111, 9, 4, '2015-07-06 18:00:00'),
(112, 9, 5, '2015-07-06 18:00:00'),
(113, 9, 1, '2015-07-06 18:00:00'),
(114, 9, 5, '2015-07-07 18:00:00'),
(115, 9, 4, '2015-07-07 18:00:00'),
(116, 9, 1, '2015-07-08 18:00:00'),
(117, 9, 5, '2015-07-08 18:00:00'),
(118, 9, 4, '2015-07-08 18:00:00'),
(119, 9, 5, '2015-07-09 18:00:00'),
(120, 9, 4, '2015-07-09 18:00:00'),
(121, 9, 5, '2015-07-10 18:00:00'),
(122, 9, 1, '2015-07-10 18:00:00'),
(123, 9, 4, '2015-07-10 18:00:00'),
(124, 9, 4, '2015-07-12 03:00:00'),
(125, 9, 5, '2015-07-12 05:00:00'),
(126, 9, 5, '2015-07-12 18:00:00'),
(127, 9, 4, '2015-07-12 18:00:00'),
(128, 9, 1, '2015-07-12 18:00:00'),
(129, 9, 5, '2015-07-13 18:00:00'),
(130, 9, 4, '2015-07-13 18:00:00'),
(131, 9, 1, '2015-07-14 18:00:00'),
(132, 9, 5, '2015-07-14 18:00:00'),
(133, 9, 4, '2015-07-14 18:00:00'),
(134, 9, 5, '2015-07-15 18:00:00'),
(135, 9, 4, '2015-07-15 18:00:00'),
(136, 9, 4, '2015-07-16 18:00:00'),
(137, 9, 5, '2015-07-16 18:00:00'),
(138, 9, 1, '2015-07-16 18:00:00'),
(139, 9, 4, '2015-07-17 18:00:00'),
(140, 9, 5, '2015-07-17 18:00:00'),
(141, 9, 5, '2015-07-18 18:00:00'),
(142, 9, 1, '2015-07-18 18:00:00'),
(143, 9, 5, '2015-07-19 18:00:00'),
(144, 9, 4, '2015-07-20 18:00:00'),
(145, 9, 5, '2015-07-20 18:00:00'),
(146, 9, 1, '2015-07-20 18:00:00'),
(147, 9, 5, '2015-07-21 18:00:00'),
(148, 9, 4, '2015-07-21 18:00:00'),
(149, 9, 1, '2015-07-22 18:00:00'),
(150, 9, 1, '2015-07-24 18:00:00'),
(151, 9, 1, '2015-07-26 18:00:00'),
(152, 9, 1, '2015-07-28 18:00:00'),
(153, 9, 5, '2015-07-22 18:00:00'),
(154, 9, 5, '2015-07-23 18:00:00'),
(155, 9, 5, '2015-07-24 18:00:00'),
(156, 9, 5, '2015-07-25 18:00:00'),
(157, 9, 5, '2015-07-26 18:00:00'),
(158, 9, 5, '2015-07-27 18:00:00'),
(159, 9, 5, '2015-07-28 18:00:00'),
(160, 9, 4, '2015-07-22 18:00:00'),
(161, 9, 4, '2015-07-23 18:00:00'),
(162, 9, 4, '2015-07-24 18:00:00'),
(163, 9, 4, '2015-07-25 18:00:00'),
(164, 9, 4, '2015-07-26 18:00:00'),
(165, 9, 4, '2015-07-27 18:00:00'),
(166, 9, 4, '2015-07-28 18:00:00'),
(167, 9, 5, '2015-07-29 18:00:00'),
(168, 9, 5, '2015-07-30 18:00:00'),
(169, 9, 5, '2015-07-31 18:00:00'),
(170, 9, 5, '2015-08-02 18:00:00'),
(171, 9, 5, '2015-08-03 18:00:00'),
(172, 9, 5, '2015-08-04 18:00:00'),
(173, 9, 4, '2015-07-29 18:00:00'),
(174, 9, 4, '2015-07-30 18:00:00'),
(175, 9, 4, '2015-07-31 18:00:00'),
(176, 9, 4, '2015-08-02 18:00:00'),
(177, 9, 4, '2015-08-03 18:00:00'),
(178, 9, 4, '2015-08-04 18:00:00'),
(179, 9, 1, '2015-07-30 18:00:00'),
(180, 9, 1, '2015-08-01 18:00:00'),
(181, 9, 1, '2015-08-03 18:00:00'),
(182, 9, 5, '2015-08-01 18:00:00'),
(183, 9, 4, '2015-08-01 18:00:00'),
(184, 9, 1, '2015-08-05 18:00:00'),
(185, 9, 1, '2015-08-07 18:00:00'),
(186, 9, 1, '2015-08-09 18:00:00'),
(187, 9, 5, '2015-08-05 18:00:00'),
(188, 9, 5, '2015-08-06 18:00:00'),
(189, 9, 5, '2015-08-07 18:00:00'),
(190, 9, 5, '2015-08-08 18:00:00'),
(191, 9, 5, '2015-08-09 18:00:00'),
(192, 9, 4, '2015-08-09 18:00:00'),
(193, 9, 4, '2015-08-08 18:00:00'),
(194, 9, 4, '2015-08-07 18:00:00'),
(195, 9, 4, '2015-08-06 18:00:00'),
(196, 9, 4, '2015-08-05 18:00:00'),
(197, 9, 1, '2015-08-11 18:00:00'),
(198, 9, 5, '2015-08-10 18:00:00'),
(199, 9, 5, '2015-08-11 18:00:00'),
(200, 9, 4, '2015-08-10 18:00:00'),
(201, 9, 4, '2015-08-11 18:00:00'),
(202, 9, 4, '2015-08-12 18:00:00'),
(203, 9, 1, '2015-08-13 18:00:00'),
(204, 9, 5, '2015-08-13 18:00:00'),
(205, 9, 4, '2015-08-13 18:00:00'),
(206, 9, 5, '2015-08-14 18:00:00'),
(207, 9, 4, '2015-08-14 18:00:00'),
(208, 9, 4, '2015-08-15 18:00:00'),
(209, 9, 1, '2015-08-15 18:00:00'),
(210, 9, 4, '2015-08-19 18:00:00'),
(211, 9, 4, '2015-08-18 18:00:00'),
(212, 9, 4, '2015-08-17 18:00:00'),
(213, 9, 4, '2015-08-16 18:00:00'),
(214, 9, 5, '2015-08-19 18:00:00'),
(215, 9, 5, '2015-08-18 18:00:00'),
(216, 9, 5, '2015-08-17 18:00:00'),
(217, 9, 5, '2015-08-16 18:00:00'),
(218, 9, 1, '2015-08-17 18:00:00'),
(219, 9, 4, '2015-08-20 18:00:00'),
(220, 9, 4, '2015-08-21 18:00:00'),
(221, 9, 4, '2015-08-22 18:00:00'),
(222, 9, 4, '2015-08-24 18:00:00'),
(223, 9, 4, '2015-08-25 18:00:00'),
(224, 9, 4, '2015-08-26 18:00:00'),
(225, 9, 4, '2015-08-27 18:00:00'),
(226, 9, 4, '2015-08-28 18:00:00'),
(227, 9, 4, '2015-08-29 18:00:00'),
(228, 9, 4, '2015-08-30 18:00:00'),
(229, 9, 4, '2015-08-31 18:00:00'),
(230, 9, 5, '2015-08-20 18:00:00'),
(231, 9, 5, '2015-08-21 18:00:00'),
(232, 9, 1, '2015-08-21 18:00:00'),
(233, 9, 5, '2015-08-22 18:00:00'),
(234, 9, 4, '2015-09-01 18:00:00'),
(235, 9, 5, '2015-08-23 18:00:00'),
(236, 9, 4, '2015-08-23 18:00:00'),
(237, 9, 1, '2015-08-23 18:00:00'),
(238, 9, 4, '2015-09-02 06:30:29'),
(239, 9, 4, '2015-09-03 06:30:41');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `categories_id`, `alias`, `title`, `description`, `color`, `bg_color`, `image`, `user_defined`, `users_id`, `created_at`, `updated_at`) VALUES
(1, 2, 'train', 'Train', 'Sitting in the couch, watching TV, or spending countless hours in front of the PC, even working all day. This stationary lifestyle is bad for anybody. Why not try something different? <br /><br />\n\n<i>For this task you need to train for at least 30 minutes everyday </i>', '', '', 'icon-train', 0, NULL, '2015-08-15 07:31:01', '2015-08-15 07:31:01'),
(2, 4, 'fight_fear', 'Fight Fear', 'We have all been there. Be it anxiety from talking to a girl or straight-up fear from heights, dogs, spiders and closet-monsters. The hearth starts pounding and your hands get sweaty. You are almost paralyzed. Your only choice is to walk away, right? <br /><br />\n\n<i> For this task you need to face your fears in whatever way you can. The smallest of steps count </i> ', '', '', '', 0, NULL, '2015-09-02 15:40:22', '2015-09-02 15:40:22'),
(3, 3, 'visit_japan', 'Visit Japan', 'Ancient cultures, breathtaking scenery, anime and noodles. A nerd''s and a travelers paradise. <br /><br />\n\n<i>Let''s go to Japan</i>', '', '', '', 0, NULL, '2015-09-02 15:41:53', '2015-09-02 15:41:53'),
(4, 2, 'get_up_early', 'Get up early', 'You are probably used to hearing the birds sing... probably before you go to bed early in the morning. You gotta turn this around man. It''s worth it: the smell of the morning, the clear mind that comes as well as the satisfaction of having the whole day ahead of you. Why not give it a shot.<br /><br />\n\n<i> For this task you have to get up before 9:30 each morning </i>', '', '', 'icon-get-up-early', 0, NULL, '2015-09-02 15:29:05', '2015-09-02 15:29:05'),
(5, 4, 'meditate', 'Meditate', 'You''ve heard of it time and time again - the practice, which the eastern monks have adopted as their lifestyle - Meditation. You know it brings peace of mind, feelings of self-fulfilment and tranquility. Give it a shot.<br /><br />\n\n<i>For this task you need to meditate at least 10 minutes each day.</i>', '', '', 'icon-meditate', 0, NULL, '2015-09-02 15:35:25', '2015-09-02 15:35:25');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=11 ;

--
-- Dumping data for table `tasks_lang`
--

INSERT INTO `tasks_lang` (`id`, `tasks_id`, `locale`, `title`, `description`, `created_at`, `updated_at`) VALUES
(1, 1, 'en', 'Train', 'Sitting in the couch, watching TV, or spending countless hours in front of the PC, even working all day. This stationary lifestyle is bad for anybody. Why not try something different? <br /><br />\r\n\r\n<i>For this task you need to train for at least 30 minutes during the day </i>', '2015-09-02 15:59:31', '2015-09-02 15:59:31'),
(2, 2, 'en', 'Fight Fear', 'We have all been there. Be it anxiety from talking to a girl or straight-up fear from heights, dogs, spiders and closet-monsters. The hearth starts pounding and your hands get sweaty. You are almost paralyzed. Your only choice is to walk away, right? <br /><br />\n\n<i> For this task you need to face your fears in whatever way you can. The smallest of steps count </i> ', '2015-08-17 11:02:07', '2015-08-17 11:02:07'),
(3, 3, 'en', 'Visit Japan', 'Ancient cultures, breathtaking scenery, anime and noodles. A nerd''s and a travelers paradise. <br /><br />\n\n<i>Let''s go to Japan</i>', '2015-08-17 11:02:07', '2015-08-17 11:02:07'),
(4, 1, 'bg', 'Тренировки', 'Седиш си на дивана и си гледаш телевизия или прекарваш безкрайни часове пред компютъра. Този стационарен живот не е полезен за никого. Защо не пробваш нещо различно? <br /><br /><i>За тази задача трябва да тренираш поне 30 минути през деня.</i>', '2015-08-30 10:13:41', '2015-08-30 10:13:41'),
(5, 2, 'bg', 'Борба със страха', 'Всички сме били там. Дали се притесняваш да заговориш някое момиче или си направо ужасен от височини, кучета, паяци или чудовища. Сърцето ти започва да тупти безумно бързо и ръцете ти се изпотяват. Почти си парализиран. Единствения ти шанс е да избягаш, нали?\r\n<br /><br />\r\n\r\n<i>За тази задача трябва да се изправиш срещу страховете си по какъвто начин можеш. И най-малките крачки се броят. </i> ', '2015-09-02 16:03:26', '2015-09-02 16:03:26'),
(6, 3, 'bg', 'Посети Япония', 'Древна кулура, спиращи дъха гледки, аниме и нудълс. Рай за пътешественици и нърдове. <br /><br />\r\n\r\n<i>Да посетим Япония</i>', '2015-09-02 16:05:07', '2015-09-02 16:05:07'),
(7, 5, 'en', 'Meditate', 'You''ve heard of it time and time again - the practice, which the eastern monks have adopted as their lifestyle - Meditation. You know it brings peace of mind, feelings of self-fulfilment and tranquility. Give it a shot.<br /><br />\n\n<i>For this task you need to meditate at least 10 minutes each day.</i>', '2015-09-02 15:48:49', '2015-09-02 15:48:49'),
(8, 5, 'bg', 'Медитирай', 'Чувал си отново и отново - техниката която източните монаси са превърнали в начин на живот - Медитацията. Знаеш че води то вътрешен мир и чувство за спокойствие. Дай й шанс.<br /><br />\r\n\r\n<i>За тази задача трябва да медитираш поне 10 минути през деня.</i>', '2015-09-02 16:07:28', '2015-09-02 16:07:28'),
(9, 4, 'en', 'Get up early', 'You are probably used to hearing the birds sing... probably before you go to bed early in the morning. You gotta turn this around man. It''s worth it: the smell of the morning, the clear mind that comes as well as the satisfaction of having the whole day ahead of you. Why not give it a shot.<br /><br />\n\n<i> For this task you have to get up before 9:30 each morning (If you already get up before 9:30, try 8:00) </i>', '2015-09-02 16:10:38', '2015-09-02 16:10:38'),
(10, 4, 'bg', 'Стани рано', 'Най вероятно си свикнал да чуваш как птичките пеят... най-вероятно рано сутрин преди да заспиш. Трябва да го промениш. Заслужава си: миризмата на сутринта, ясното съзнание, и задоволството да имаш цял ден пред себе си. Защо не пробваш?<br /><br />\r\n\r\n<i> За тази задача трябва да ставаш преди 9:30 всеки ден. (Ако вече ставаш преди 9:30 пробвай 8:00) </i>', '2015-09-02 16:10:38', '2015-09-02 16:10:38');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `user_achievements`
--

INSERT INTO `user_achievements` (`id`, `users_id`, `achievements_id`, `achv_levels_id`, `created_at`, `updated_at`) VALUES
(4, 9, 4, 38, '2015-05-29 16:27:00', '2015-05-29 16:27:00'),
(5, 9, 1, 1, '2015-04-23 16:34:54', '2015-09-02 16:34:54'),
(6, 9, 5, 49, '2015-05-29 17:00:24', '2015-05-29 17:00:24'),
(7, 9, 1, 31, '2015-05-21 18:01:00', '2015-05-21 18:01:00'),
(8, 9, 1, 36, '2015-07-20 18:01:00', '2015-07-20 18:01:00'),
(9, 9, 5, 50, '2015-06-11 18:01:00', '2015-06-11 18:01:00'),
(10, 9, 5, 51, '2015-07-09 18:02:00', '2015-07-09 18:02:00'),
(11, 9, 4, 39, '2015-06-09 18:01:00', '2015-06-09 18:01:00'),
(12, 9, 4, 40, '2015-07-08 18:02:00', '2015-07-08 18:02:00');

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
