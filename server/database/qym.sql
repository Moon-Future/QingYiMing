/*
 Navicat Premium Data Transfer

 Source Server         : aliyun
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : qym

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 16/03/2019 21:40:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `template` int(11) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for counter
-- ----------------------------
DROP TABLE IF EXISTS `counter`;
CREATE TABLE `counter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL DEFAULT '1',
  `cust` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `time` bigint(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for delivery
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery` (
  `id` varchar(50) NOT NULL,
  `ord` varchar(50) DEFAULT NULL,
  `ordId` varchar(50) DEFAULT NULL,
  `ordUuid` varchar(50) DEFAULT NULL,
  `sentQty` int(11) DEFAULT NULL,
  `sentAll` int(11) DEFAULT NULL,
  `prd` int(11) DEFAULT NULL,
  `prdm` varchar(50) DEFAULT NULL,
  `cust` int(11) DEFAULT NULL,
  `custm` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `nun` varchar(50) DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `unitm` varchar(50) DEFAULT NULL,
  `qty` varchar(50) DEFAULT NULL COMMENT '数量',
  `qtyR` varchar(50) DEFAULT NULL COMMENT '实收数量',
  `ptime` bigint(20) DEFAULT NULL COMMENT '生产时间',
  `lot` varchar(50) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL COMMENT '发货时间',
  `no` int(11) DEFAULT NULL COMMENT 'number',
  `counter` int(11) DEFAULT NULL COMMENT 'number ID',
  `template` int(11) NOT NULL DEFAULT '1',
  `createTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for deliverygrp
-- ----------------------------
DROP TABLE IF EXISTS `deliverygrp`;
CREATE TABLE `deliverygrp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust` int(11) NOT NULL,
  `delivery` varchar(50) NOT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=325 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for inventory
-- ----------------------------
DROP TABLE IF EXISTS `inventory`;
CREATE TABLE `inventory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prd` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `sentQty` int(11) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) NOT NULL,
  `off` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for inventoryIn
-- ----------------------------
DROP TABLE IF EXISTS `inventoryIn`;
CREATE TABLE `inventoryIn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prd` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `sentQty` int(11) NOT NULL DEFAULT '0',
  `time` bigint(20) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for inventoryOut
-- ----------------------------
DROP TABLE IF EXISTS `inventoryOut`;
CREATE TABLE `inventoryOut` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery` varchar(50) NOT NULL,
  `prd` int(11) NOT NULL COMMENT '产品id',
  `sentQty` int(11) NOT NULL DEFAULT '0' COMMENT '发货数量',
  `sentTime` bigint(20) NOT NULL COMMENT '发货时间',
  `cust` int(11) NOT NULL COMMENT '送到哪家公司',
  `createTime` bigint(20) NOT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=741 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ord
-- ----------------------------
DROP TABLE IF EXISTS `ord`;
CREATE TABLE `ord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) NOT NULL,
  `ord` varchar(50) NOT NULL,
  `cust` int(11) NOT NULL,
  `custm` varchar(50) DEFAULT NULL,
  `prd` int(11) NOT NULL,
  `prdm` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `qty` int(11) NOT NULL,
  `sentQty` int(11) NOT NULL DEFAULT '0',
  `finished` int(11) NOT NULL DEFAULT '0',
  `time` bigint(20) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for ordgrp
-- ----------------------------
DROP TABLE IF EXISTS `ordgrp`;
CREATE TABLE `ordgrp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ord` varchar(50) NOT NULL,
  `cust` int(11) NOT NULL,
  `qtyAll` int(11) NOT NULL DEFAULT '0',
  `sentAll` int(11) NOT NULL DEFAULT '0',
  `finished` int(11) NOT NULL DEFAULT '0',
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `unit` int(11) NOT NULL,
  `provider` int(11) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `unit` (`unit`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for supply
-- ----------------------------
DROP TABLE IF EXISTS `supply`;
CREATE TABLE `supply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cust` int(11) NOT NULL,
  `prd` int(11) NOT NULL,
  `nun` varchar(50) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `product` (`prd`) USING BTREE,
  KEY `customer` (`cust`) USING BTREE,
  CONSTRAINT `customer` FOREIGN KEY (`cust`) REFERENCES `company` (`id`),
  CONSTRAINT `product` FOREIGN KEY (`prd`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for unit
-- ----------------------------
DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `sign` varchar(20) DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `account` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `root` int(11) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
