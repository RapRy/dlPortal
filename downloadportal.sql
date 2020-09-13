-- phpMyAdmin SQL Dump
-- version 4.8.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 13, 2020 at 10:23 AM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `downloadportal`
--

-- --------------------------------------------------------

--
-- Table structure for table `registeredmobile`
--

CREATE TABLE `registeredmobile` (
  `registrationId` int(11) NOT NULL,
  `mobileNumber` int(8) NOT NULL,
  `registrationDate` datetime NOT NULL,
  `numberActivate` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `registeredmobile`
--

INSERT INTO `registeredmobile` (`registrationId`, `mobileNumber`, `registrationDate`, `numberActivate`) VALUES
(1, 1234567, '2020-05-19 13:00:03', 1),
(2, 2313131, '2020-05-19 13:01:36', 1),
(3, 3242342, '2020-05-19 13:03:02', 1),
(4, 1313213, '2020-05-19 13:03:25', 1),
(5, 454545, '2020-05-19 13:03:42', 1),
(6, 54354, '2020-05-19 13:04:48', 1),
(7, 12345678, '2020-05-19 13:35:04', 1),
(8, 12345, '2020-05-19 13:39:31', 1),
(9, 123456, '2020-05-19 13:41:26', 1),
(10, 13213, '2020-05-19 13:41:44', 1),
(11, 2131231, '2020-05-19 13:41:55', 1),
(12, 1213, '2020-05-19 13:43:22', 1),
(13, 123, '2020-05-19 13:45:50', 1),
(14, 123, '2020-05-19 13:46:03', 1),
(15, 1234, '2020-05-19 13:51:18', 1),
(16, 345, '2020-05-19 13:51:52', 1),
(17, 121, '2020-05-19 13:52:25', 1),
(18, 1312, '2020-05-19 13:53:27', 1),
(19, 121, '2020-05-19 13:53:55', 1),
(20, 123, '2020-05-19 13:54:19', 1),
(21, 123, '2020-05-19 13:55:10', 1),
(22, 123, '2020-05-19 13:56:02', 1),
(23, 696969, '2020-05-20 08:25:33', 1),
(24, 2147483647, '2020-05-20 08:54:46', 1),
(25, 45547, '2020-05-20 09:14:57', 1),
(26, 123456, '2020-05-20 09:15:36', 0),
(28, 123456, '2020-05-20 09:28:56', 1),
(29, 45547, '2020-05-20 09:32:11', 1),
(30, 65485, '2020-05-20 09:34:01', 1),
(33, 534543534, '2020-05-20 09:47:35', 1),
(34, 324234, '2020-05-20 09:59:56', 1),
(35, 456458, '2020-05-20 10:07:25', 1),
(36, 456845, '2020-05-20 11:54:24', 1),
(37, 8888, '2020-05-20 11:54:44', 1),
(38, 8579632, '2020-05-20 14:01:29', 1),
(39, 987, '2020-05-20 14:19:25', 1),
(40, 896, '2020-05-20 14:20:09', 1),
(41, 45820686, '2020-05-20 14:20:23', 1),
(42, 862, '2020-05-20 14:25:10', 1),
(43, 89651, '2020-05-20 14:25:44', 1),
(44, 895456456, '2020-05-20 15:16:34', 1),
(45, 345345, '2020-05-20 17:42:03', 1),
(46, 2147483647, '2020-05-21 08:57:31', 1),
(47, 78956, '2020-05-21 09:38:36', 1),
(48, 3456, '2020-05-21 09:40:45', 1),
(49, 8564, '2020-05-21 09:47:17', 1),
(50, 35808, '2020-05-21 09:48:09', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `registrationId` int(11) NOT NULL,
  `accountId` int(11) NOT NULL,
  `profilePicture` varchar(100) NOT NULL,
  `firstName` varchar(50) NOT NULL,
  `lastName` varchar(50) NOT NULL,
  `mobileNumber` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `userPassword` varchar(250) NOT NULL,
  `userType` varchar(8) NOT NULL,
  `subscriptionStatus` varchar(20) NOT NULL,
  `signUpDate` datetime NOT NULL,
  `lastSignIn` datetime NOT NULL,
  `receiveUpdate` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `registrationId`, `accountId`, `profilePicture`, `firstName`, `lastName`, `mobileNumber`, `email`, `userPassword`, `userType`, `subscriptionStatus`, `signUpDate`, `lastSignIn`, `receiveUpdate`) VALUES
(1, 4, 1212121212, '', 'Ryan', 'Olarte', 1313213, 'ryan@ryan', '', 'user', '', '2020-05-19 00:00:00', '2020-05-19 00:00:00', ''),
(2, 6, 1917846715, '', 'asdjkl', 'sakjdkas', 54354, 'kjaskdj@asdk;ja', '', 'user', '', '2020-05-19 17:03:41', '0000-00-00 00:00:00', ''),
(3, 1, 1507359819, '', 'asdjkl', 'sakjdkas', 1234567, 'kjaskdj@asdk;ja', '', 'user', '', '2020-05-19 17:05:47', '0000-00-00 00:00:00', ''),
(4, 9, 1451764993, '', 'testing', 'testing', 123456, 'testing@testing', '', 'user', '', '2020-05-19 17:16:33', '0000-00-00 00:00:00', ''),
(5, 11, 1171554289, '', 'test password', 'test password', 2131231, 'password@password', '$2y$10$d0CVrQa2wkhAh0p1meJ6/uL9ItYW8DkCRyyxtyEpwYM', 'user', '', '2020-05-19 17:21:09', '0000-00-00 00:00:00', ''),
(6, 2, 2142146300, '', 'test height', 'test height', 2313131, 'testheight@test', '$2y$10$g16SH9fyeXC43efq3ifu7.ed8MLSarS018ETtEyuRpm', 'user', '', '2020-05-19 17:49:22', '0000-00-00 00:00:00', ''),
(7, 34, 1129964314, '', 'test', 'test', 324234, 'ads@asdh', '$2y$10$OTknkdH8jSvEzTyqaTyYX.o4z13iiJg//YgG2xehNXP', 'user', '', '2020-05-20 10:02:24', '0000-00-00 00:00:00', ''),
(8, 5, 1186730652, '', 'test status', 'test status', 454545, 'testStatus@status', '$2y$10$2hblLZxtBZmmOigNjX.Xce7DmyBBFZ0xu4HbhVZyvGF', 'user', 'subscribed', '2020-05-20 10:57:31', '0000-00-00 00:00:00', ''),
(9, 12, 1664375897, '', 'test notif', 'test notif', 1213, 'testNotif@notif', '$2y$10$iJn5ydE/FFHw5ZjBBHVDo.yLRd44h1c3H0qG907AN7B', 'user', 'subscribed', '2020-05-20 10:59:43', '0000-00-00 00:00:00', ''),
(10, 38, 1231045250, '', 'test sign in', 'test sign in', 8579632, 'testSignin@sign', '$2y$10$Tk97qDchjozgWFYvmlH4CeywQ6AhDnaUrBmq66kZang', 'user', 'subscribed', '2020-05-20 14:02:10', '0000-00-00 00:00:00', ''),
(11, 39, 1649358545, '', 'test again pass', 'test again pass', 987, 'adsas@ajdg', '$2y$10$5yIuaKFQ3Y/nx6KSSvI0aO1q9MQFEfXsj5K1S8KV5ZL', 'user', 'subscribed', '2020-05-20 14:21:10', '0000-00-00 00:00:00', ''),
(12, 43, 2123971326, '', 'test', 'test', 89651, 'reahd@ahdjh', '$2y$10$fMGjhBbDeTm73HxqcphBwOuc5jn90jIpBvYsm8RBmKej7Tr4xHBZS', 'user', 'subscribed', '2020-05-20 14:26:23', '0000-00-00 00:00:00', ''),
(13, 44, 1560477501, '', 'fgh', 'SJDFHJKS', 895456456, 'ASDJKL@ADKJKAJ', '$2y$10$GnW5HDCz4ttBQQFRhCg1q.83LGD8skFjYmVEfULMO1lwjpldkheKu', 'user', 'subscribed', '2020-05-20 15:17:11', '0000-00-00 00:00:00', ''),
(14, 47, 1033979731, '', 'test session', 'test session', 78956, 'test@session', '$2y$10$xIdVFHQFezQw498RefIUN./8qFnxmdijW/roZv8NzYL2N85Ln5B52', 'user', 'subscribed', '2020-05-21 09:39:33', '0000-00-00 00:00:00', ''),
(15, 48, 1012768567, '', 'test session again', 'test session again', 3456, 'test@session', '$2y$10$rVpM6hc1Li/jhu0DbVfu6O0MGI.VqGUlcMFDpYDpu.RDMrtoQ7g/2', 'user', 'subscribed', '2020-05-21 09:41:10', '2020-05-22 17:15:49', ''),
(16, 50, 1332200544, '519495-change againadsdertret.jpg', 'Guy', 'Gustav', 35808, 'test@test', '$2y$10$d9ffbl9WKX94UYKllNmBV.zd/XdSx1rRagmS339Acomkt1ISmp0pC', 'user', 'subscribed', '2020-05-21 09:48:47', '2020-06-26 17:58:31', 'SMS');

-- --------------------------------------------------------

--
-- Table structure for table `userslog`
--

CREATE TABLE `userslog` (
  `activityId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `activityType` varchar(50) NOT NULL,
  `userActivity` varchar(200) NOT NULL,
  `activityDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userslog`
--

INSERT INTO `userslog` (`activityId`, `userId`, `activityType`, `userActivity`, `activityDate`) VALUES
(42, 16, 'updateProfile', 'lastName', '2020-06-25 16:14:24'),
(113, 16, 'updateProfile', 'firstName', '2020-06-24 00:00:00'),
(114, 16, 'updateProfile', 'firstName', '2020-06-24 00:00:00'),
(115, 16, 'updateProfile', 'firstName', '2020-06-26 17:58:15'),
(116, 16, 'updateProfile', 'lastName', '2020-06-26 17:58:15');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `registeredmobile`
--
ALTER TABLE `registeredmobile`
  ADD PRIMARY KEY (`registrationId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD KEY `registrationId` (`registrationId`);

--
-- Indexes for table `userslog`
--
ALTER TABLE `userslog`
  ADD PRIMARY KEY (`activityId`),
  ADD KEY `userId` (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `registeredmobile`
--
ALTER TABLE `registeredmobile`
  MODIFY `registrationId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `userslog`
--
ALTER TABLE `userslog`
  MODIFY `activityId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`registrationId`) REFERENCES `registeredmobile` (`registrationId`);

--
-- Constraints for table `userslog`
--
ALTER TABLE `userslog`
  ADD CONSTRAINT `userslog_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
