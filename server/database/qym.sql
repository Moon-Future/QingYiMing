/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50721
 Source Host           : localhost:3306
 Source Schema         : qym

 Target Server Type    : MySQL
 Target Server Version : 50721
 File Encoding         : 65001

 Date: 11/10/2018 21:48:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for company
-- ----------------------------
DROP TABLE IF EXISTS `company`;
CREATE TABLE `company`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `alias` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT 0,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for counter
-- ----------------------------
DROP TABLE IF EXISTS `counter`;
CREATE TABLE `counter`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL DEFAULT 1,
  `type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for delivery
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery`  (
  `id` int(11) NOT NULL,
  `prd` int(11) DEFAULT NULL,
  `prdm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `cust` int(11) DEFAULT NULL,
  `custm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `nun` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `unitm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `qty` int(11) DEFAULT NULL COMMENT '数量',
  `qtyR` int(11) DEFAULT NULL COMMENT '实收数量',
  `ptime` bigint(20) DEFAULT NULL COMMENT '生产时间',
  `lot` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL COMMENT '发货时间',
  `no` int(11) DEFAULT NULL COMMENT 'number',
  `counter` int(11) DEFAULT NULL COMMENT 'number ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `unitId` int(11) NOT NULL,
  `provider` int(11) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `unit`(`unitId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for supply
-- ----------------------------
DROP TABLE IF EXISTS `supply`;
CREATE TABLE `supply`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer` int(11) NOT NULL,
  `product` int(11) NOT NULL,
  `nun` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `product`(`product`) USING BTREE,
  INDEX `customer`(`customer`) USING BTREE,
  CONSTRAINT `customer` FOREIGN KEY (`customer`) REFERENCES `company` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `product` FOREIGN KEY (`product`) REFERENCES `product` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for unit
-- ----------------------------
DROP TABLE IF EXISTS `unit`;
CREATE TABLE `unit`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sign` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `account` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `root` int(11) NOT NULL,
  `createTime` bigint(20) NOT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
