CREATE DATABASE IF NOT EXISTS counterdb;

USE counterdb;

CREATE TABLE IF NOT EXISTS `messagetable` (
	`msgid` DOUBLE NOT NULL,
	`userid` DOUBLE NOT NULL,
	`username` varchar(255),
	`groupid` DOUBLE NOT NULL,
	`time` TIME,
	PRIMARY KEY (`msgid`,`userid`,`groupid`)
);

CREATE TABLE IF NOT EXISTS `optintable` (
	`userid` DOUBLE NOT NULL,
	PRIMARY KEY (`userid`)
);
ALTER TABLE `counterdb`.`messagetable` CHANGE COLUMN `time` `time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
