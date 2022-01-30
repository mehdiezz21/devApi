SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS gameapi;
USE gameapi;

CREATE TABLE `gameplayers` (
  `playerId` int(11) DEFAULT NULL,
  `gameId` int(11) DEFAULT NULL,
  `remainingShots` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `order` int(11) DEFAULT NULL,
  `inGame` tinyint(1) DEFAULT 1,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `mode` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` tinyint(1) DEFAULT 1,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `gameshots` (
  `id` int(11) NOT NULL,
  `gameId` int(11) DEFAULT NULL,
  `playerId` int(11) DEFAULT NULL,
  `multiplicator` int(11) DEFAULT NULL,
  `sector` int(11) DEFAULT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `gameWin` int(11) DEFAULT NULL,
  `gameLost` int(11) DEFAULT NULL,
  `createdAt` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `gameshots`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `players`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `gameshots`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;
