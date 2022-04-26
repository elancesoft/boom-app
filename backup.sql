-- MySQL dump 10.13  Distrib 5.7.31, for Linux (x86_64)
--
-- Host: localhost    Database: boomdb
-- ------------------------------------------------------
-- Server version	5.7.31-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bulks`
--

DROP TABLE IF EXISTS `bulks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bulks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `sendto` varchar(255) DEFAULT NULL,
  `cc` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bulks`
--

LOCK TABLES `bulks` WRITE;
/*!40000 ALTER TABLE `bulks` DISABLE KEYS */;
INSERT INTO `bulks` VALUES (1,'samwoodsdev@gmail.com','aaa','419 Virginia Ave, Phoenixville, PA 19460, USA','samwoodsdev@gmail.com','','','','2020-09-15 17:52:44','2020-09-15 17:52:44'),(2,'hughz49@gmail.com','aaa','28 Abel Pl, Media, PA 19063, USA','hughz49@gmail.com','','peter','6108641155','2020-09-15 17:56:12','2020-09-15 17:56:12'),(3,'hughz49@gmail.com','aaa','30 Abel Pl, Media, PA 19063, USA','hughz49@gmail.com','','john','6106660323','2020-09-15 17:56:31','2020-09-15 17:56:31'),(4,'hughz49@gmail.com','BBB','247 Cohasset Ln, West Chester, PA 19380, USA','hughz49@gmail.com','','peter','6104443232','2020-09-15 17:57:52','2020-09-15 17:57:52'),(5,'hughz49@gmail.com','BBB','300 Dean St, West Chester, PA 19382, USA','peter@guardha.com','','peter','5453332222','2020-09-15 17:59:49','2020-09-15 17:59:49'),(6,'hughz49@gmail.com','BBB','28 Abel Pl, Media, PA 19063, USA','hughz49@gmail.com','','peter','6103332232','2020-09-15 17:59:59','2020-09-15 17:59:59');
/*!40000 ALTER TABLE `bulks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'samwoodsdev@gmail.com','aaa','2020-09-15 17:50:46','2020-09-15 17:50:46'),(2,'hughz49@gmail.com','BBB','2020-09-15 17:51:04','2020-09-15 17:51:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-09-16  4:42:08
