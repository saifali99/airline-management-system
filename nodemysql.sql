-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2020 at 07:36 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nodemysql`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `Admin_ID` varchar(300) DEFAULT NULL,
  `Admin_Password` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`Admin_ID`, `Admin_Password`) VALUES
('k173630@nu.edu.pk', '123');

-- --------------------------------------------------------

--
-- Table structure for table `airline`
--

CREATE TABLE `airline` (
  `AIRLINE_ID` varchar(300) NOT NULL,
  `AIRLINE_NAME` varchar(100) DEFAULT NULL,
  `AIRLINE_PASSWORD` varchar(100) DEFAULT NULL,
  `AIRLINE_Owner` varchar(100) DEFAULT NULL,
  `AIRLINE_Origin` varchar(100) DEFAULT NULL,
  `Airline_Abbreviation` varchar(100) DEFAULT NULL,
  `Established_year` int(4) DEFAULT NULL,
  `status` varchar(1) DEFAULT NULL,
  `Verification_Code` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `airline`
--

INSERT INTO `airline` (`AIRLINE_ID`, `AIRLINE_NAME`, `AIRLINE_PASSWORD`, `AIRLINE_Owner`, `AIRLINE_Origin`, `Airline_Abbreviation`, `Established_year`, `status`, `Verification_Code`) VALUES
('k173630@nu.edu.pk', 'Qatar International Airline', '1234', 'SaifAli', 'UAE', 'Qatar', 1987, 'Y', 279823),
('zainzulfiqarmaknojia@gmail.com', 'Emirates International Airline', '123', 'Zain Zulfiqar', 'UAE', 'Emirates', 1980, 'Y', 284788);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `CUSTOMER_ID` varchar(300) NOT NULL,
  `STATUS` varchar(1) DEFAULT NULL,
  `FIRST_NAME` varchar(14) DEFAULT NULL,
  `LAST_NAME` varchar(14) DEFAULT NULL,
  `CNIC` bigint(20) DEFAULT NULL,
  `PASSWORD` varchar(100) DEFAULT NULL,
  `Address` varchar(100) DEFAULT NULL,
  `Contact_Number` bigint(20) DEFAULT NULL,
  `CARD_NUMBER` bigint(20) DEFAULT NULL,
  `BALANCE` bigint(10) DEFAULT NULL,
  `CODE` bigint(20) DEFAULT NULL,
  `Passport_Number` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`CUSTOMER_ID`, `STATUS`, `FIRST_NAME`, `LAST_NAME`, `CNIC`, `PASSWORD`, `Address`, `Contact_Number`, `CARD_NUMBER`, `BALANCE`, `CODE`, `Passport_Number`) VALUES
('zainzulfiqarmaknojia@gmail.com', 'Y', 'Zain', 'Zulfiqar', 4210176892346, '123', 'Shahrah e Pakistan', 3124323456, 12345678, 9500000, 205211, 4234432442);

-- --------------------------------------------------------

--
-- Table structure for table `flight`
--

CREATE TABLE `flight` (
  `FLIGHT_NUMBER` varchar(20) NOT NULL,
  `FLIGHT_SOURCE` varchar(20) DEFAULT NULL,
  `FLIGHT_DESTINATION` varchar(20) DEFAULT NULL,
  `DEPARTURE_TIME` datetime NOT NULL,
  `Arrival_TIME` datetime DEFAULT NULL,
  `AIRLINE_ID` varchar(300) DEFAULT NULL,
  `FLIGHT_STATUS` varchar(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flight`
--

INSERT INTO `flight` (`FLIGHT_NUMBER`, `FLIGHT_SOURCE`, `FLIGHT_DESTINATION`, `DEPARTURE_TIME`, `Arrival_TIME`, `AIRLINE_ID`, `FLIGHT_STATUS`) VALUES
('QA-125', 'Karachi', 'Multan', '2020-06-10 22:00:00', '2020-06-12 16:00:00', 'zainzulfiqarmaknojia@gmail.com', 'Y');

-- --------------------------------------------------------

--
-- Table structure for table `flight_class`
--

CREATE TABLE `flight_class` (
  `FLIGHT_NUMBER` varchar(20) NOT NULL,
  `FLIGHT_CLASS` varchar(20) NOT NULL,
  `DEPARTURE_TIME` datetime NOT NULL,
  `NO_OF_SEATS` bigint(10) DEFAULT NULL,
  `PRICE` bigint(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `flight_class`
--

INSERT INTO `flight_class` (`FLIGHT_NUMBER`, `FLIGHT_CLASS`, `DEPARTURE_TIME`, `NO_OF_SEATS`, `PRICE`) VALUES
('QA-125', 'Business Class', '2020-06-10 22:00:00', 41, 500000),
('QA-125', 'Economy Class', '2020-06-10 22:00:00', 50, 37500);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('a5b06a37-e9a4-47b8-abaf-9162cedaeb86', 1591580749, '{\"cookie\":{\"originalMaxAge\":29999997,\"expires\":\"2020-06-08T01:45:48.731Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"code\":279823,\"loggedin\":false,\"code1\":205211,\"user1\":\"zainzulfiqarmaknojia@gmail.com\",\"passenger\":true,\"Airline_ID\":\"Emirates International Airline\",\"Flight_Number\":\"QA-125\",\"Flight_Source\":\"Karachi\",\"Flight_Destination\":\"Multan\",\"Departure_Time\":\"2020-06-10T17:00:00.000Z\",\"Arrival_Time\":\"2020-06-12T11:00:00.000Z\",\"Flight_Class\":\"Business Class\",\"Price\":500000,\"Seat\":41,\"ticket_code\":280828,\"customer\":\"Zain\"}');

-- --------------------------------------------------------

--
-- Table structure for table `ticket`
--

CREATE TABLE `ticket` (
  `TICKET_ID` varchar(20) NOT NULL,
  `Flight_Class` varchar(20) DEFAULT NULL,
  `CUSTOMER_ID` varchar(300) DEFAULT NULL,
  `FLIGHT_NUMBER` varchar(20) DEFAULT NULL,
  `DEPARTURE_TIME` datetime DEFAULT NULL,
  `No_Of_Ticket` bigint(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `ticket`
--

INSERT INTO `ticket` (`TICKET_ID`, `Flight_Class`, `CUSTOMER_ID`, `FLIGHT_NUMBER`, `DEPARTURE_TIME`, `No_Of_Ticket`) VALUES
('206276', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('209441', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('212935', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('229517', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('248528', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('254294', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('276764', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('280828', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1),
('291445', 'Business Class', 'zainzulfiqarmaknojia@gmail.com', 'QA-125', '2020-06-10 22:00:00', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `airline`
--
ALTER TABLE `airline`
  ADD PRIMARY KEY (`AIRLINE_ID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`CUSTOMER_ID`);

--
-- Indexes for table `flight`
--
ALTER TABLE `flight`
  ADD PRIMARY KEY (`FLIGHT_NUMBER`,`DEPARTURE_TIME`),
  ADD KEY `AIRLINE_ID` (`AIRLINE_ID`);

--
-- Indexes for table `flight_class`
--
ALTER TABLE `flight_class`
  ADD PRIMARY KEY (`FLIGHT_NUMBER`,`FLIGHT_CLASS`,`DEPARTURE_TIME`),
  ADD KEY `FLIGHT_NUMBER` (`FLIGHT_NUMBER`,`DEPARTURE_TIME`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`TICKET_ID`),
  ADD KEY `CUSTOMER_ID` (`CUSTOMER_ID`),
  ADD KEY `FLIGHT_NUMBER` (`FLIGHT_NUMBER`,`DEPARTURE_TIME`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `flight`
--
ALTER TABLE `flight`
  ADD CONSTRAINT `flight_ibfk_1` FOREIGN KEY (`AIRLINE_ID`) REFERENCES `airline` (`AIRLINE_ID`);

--
-- Constraints for table `flight_class`
--
ALTER TABLE `flight_class`
  ADD CONSTRAINT `flight_class_ibfk_1` FOREIGN KEY (`FLIGHT_NUMBER`,`DEPARTURE_TIME`) REFERENCES `flight` (`FLIGHT_NUMBER`, `DEPARTURE_TIME`);

--
-- Constraints for table `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`CUSTOMER_ID`) REFERENCES `customer` (`CUSTOMER_ID`),
  ADD CONSTRAINT `ticket_ibfk_2` FOREIGN KEY (`FLIGHT_NUMBER`,`DEPARTURE_TIME`) REFERENCES `flight` (`FLIGHT_NUMBER`, `DEPARTURE_TIME`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
