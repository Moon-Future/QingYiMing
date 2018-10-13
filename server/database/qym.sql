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

 Date: 12/10/2018 21:55:25
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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of company
-- ----------------------------
INSERT INTO `company` VALUES (1, '情义明木业有限公司', '情义明', 1, 1539106236226, NULL, 0);
INSERT INTO `company` VALUES (6, '骆驼集团襄阳蓄电池有限公司', '骆驼', 0, 1539150339197, NULL, 0);
INSERT INTO `company` VALUES (7, '湖北回天新材料股份有限公司', '回天', 0, 1539150294048, NULL, 0);

-- ----------------------------
-- Table structure for counter
-- ----------------------------
DROP TABLE IF EXISTS `counter`;
CREATE TABLE `counter`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) NOT NULL DEFAULT 1,
  `type` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of counter
-- ----------------------------
INSERT INTO `counter` VALUES (4, 6, 'delivery');

-- ----------------------------
-- Table structure for delivery
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery`  (
  `id` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `prd` int(11) DEFAULT NULL,
  `prdm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `cust` int(11) DEFAULT NULL,
  `custm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `model` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `nun` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `unitm` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `qty` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '数量',
  `qtyR` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '实收数量',
  `ptime` bigint(20) DEFAULT NULL COMMENT '生产时间',
  `lot` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL COMMENT '发货时间',
  `no` int(11) DEFAULT NULL COMMENT 'number',
  `counter` int(11) DEFAULT NULL COMMENT 'number ID',
  `createTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of delivery
-- ----------------------------
INSERT INTO `delivery` VALUES ('c4700be0-cdcc-11e8-8818-ab8727981475', 15, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3#', '26060003', 11, '个', '', '15', 1538697600000, '', '', 1539313971507, 1, 4, 1539313998750, NULL, 0);
INSERT INTO `delivery` VALUES ('c4700be0-cdcc-11e8-8818-ab8727981475', 13, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '1#', '26060001', 11, '个', '', '68', 1538697600000, '', '', 1539313971507, 1, 4, 1539313998750, NULL, 0);
INSERT INTO `delivery` VALUES ('c4700be0-cdcc-11e8-8818-ab8727981475', 19, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '4#', '26060004', 11, '个', '', '', 1538697600000, '', '', 1539313971507, 1, 4, 1539313998750, NULL, 0);
INSERT INTO `delivery` VALUES ('c4700be0-cdcc-11e8-8818-ab8727981475', 18, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-3#', '26060019', 11, '个', '', '13', 1538697600000, '', '', 1539313971507, 1, 4, 1539313998750, NULL, 0);
INSERT INTO `delivery` VALUES ('e5d4a160-cdcc-11e8-8818-ab8727981475', 39, '木托盘', 7, '湖北回天新材料股份有限公司', '806Z折边胶木托盘', '', 11, '个', '', '', 1538697600000, '', '', 1539314042719, 2, 4, 1539314054774, NULL, 0);
INSERT INTO `delivery` VALUES ('e5d4a160-cdcc-11e8-8818-ab8727981475', 43, '木托盘', 7, '湖北回天新材料股份有限公司', '906Z单桶木托盘', '', 11, '个', '', '', 1538697600000, '', '', 1539314042719, 2, 4, 1539314054774, NULL, 0);
INSERT INTO `delivery` VALUES ('e5d4a160-cdcc-11e8-8818-ab8727981475', 42, '木托盘', 7, '湖北回天新材料股份有限公司', '906Z单桶木箱', '', 14, '套', '', '', 1538697600000, '', '', 1539314042719, 2, 4, 1539314054774, NULL, 0);
INSERT INTO `delivery` VALUES ('007d6dd0-cdcd-11e8-8818-ab8727981475', 18, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-3#', '26060019', 11, '个', '', '', 1538697600000, '', '', 1539314084886, 3, 4, 1539314099501, NULL, 0);
INSERT INTO `delivery` VALUES ('007d6dd0-cdcd-11e8-8818-ab8727981475', 35, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '31#', '26060067', 11, '个', '', '', 1538697600000, '', '', 1539314084886, 3, 4, 1539314099501, NULL, 0);
INSERT INTO `delivery` VALUES ('007d6dd0-cdcd-11e8-8818-ab8727981475', 32, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '24#', '26060044', 11, '个', '', '', 1538697600000, '', '', 1539314084886, 3, 4, 1539314099501, NULL, 0);
INSERT INTO `delivery` VALUES ('007d6dd0-cdcd-11e8-8818-ab8727981475', 38, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '44#', '26060173', 11, '个', '', '', 1538697600000, '', '', 1539314084886, 3, 4, 1539314099501, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 13, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '1#', '26060001', 11, '个', '', '', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 14, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '2#', '26060002', 11, '个', '', '', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 15, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3#', '26060003', 11, '个', '', '', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 16, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-1#', '26060017', 11, '个', '', '23', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 17, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-2#', '26060018', 11, '个', '', '', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 18, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-3#', '26060019', 11, '个', '', '', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 19, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '4#', '26060004', 11, '个', '', '66', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('29fe6dd0-cdcd-11e8-8818-ab8727981475', 20, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '5#', '26060005', 11, '个', '', '', 1538697600000, '', '', 1539314152739, 4, 4, 1539314169133, NULL, 0);
INSERT INTO `delivery` VALUES ('32123e10-cdd3-11e8-8818-ab8727981475', 16, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-1#', '26060017', 11, '个', '', '', 1538697600000, '', '', 1539316751182, 5, 4, 1539316759665, NULL, 0);
INSERT INTO `delivery` VALUES ('32123e10-cdd3-11e8-8818-ab8727981475', 18, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '3-3#', '26060019', 11, '个', '', '', 1538697600000, '', '', 1539316751182, 5, 4, 1539316759665, NULL, 0);
INSERT INTO `delivery` VALUES ('4d0bc290-cdd3-11e8-8818-ab8727981475', 13, '木托盘', 6, '骆驼集团襄阳蓄电池有限公司', '1#', '26060001', 11, '个', '', '', 1538697600000, '', '', 1539316797389, 6, 4, 1539302400000, NULL, 1);

-- ----------------------------
-- Table structure for deliverygrp
-- ----------------------------
DROP TABLE IF EXISTS `deliverygrp`;
CREATE TABLE `deliverygrp`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `delivery` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `createTime` bigint(20) DEFAULT NULL,
  `updateTime` bigint(20) DEFAULT NULL,
  `off` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of deliverygrp
-- ----------------------------
INSERT INTO `deliverygrp` VALUES (4, 'c4700be0-cdcc-11e8-8818-ab8727981475', 1539313998750, NULL, 0);
INSERT INTO `deliverygrp` VALUES (5, 'e5d4a160-cdcc-11e8-8818-ab8727981475', 1539314054774, NULL, 0);
INSERT INTO `deliverygrp` VALUES (6, '007d6dd0-cdcd-11e8-8818-ab8727981475', 1539314099501, NULL, 0);
INSERT INTO `deliverygrp` VALUES (7, '29fe6dd0-cdcd-11e8-8818-ab8727981475', 1539314169133, NULL, 0);
INSERT INTO `deliverygrp` VALUES (8, '32123e10-cdd3-11e8-8818-ab8727981475', 1539316759665, NULL, 0);
INSERT INTO `deliverygrp` VALUES (9, '4d0bc290-cdd3-11e8-8818-ab8727981475', 1539302400000, NULL, 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 62 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (13, '木托盘', '1#', 11, 1, 1539106370011, NULL, 1);
INSERT INTO `product` VALUES (14, '木托盘', '2#', 11, 1, 1539106370015, NULL, 0);
INSERT INTO `product` VALUES (15, '木托盘', '3#', 11, 1, 1539106370019, NULL, 0);
INSERT INTO `product` VALUES (16, '木托盘', '3-1#', 11, 1, 1539106370024, NULL, 0);
INSERT INTO `product` VALUES (17, '木托盘', '3-2#', 11, 1, 1539106370027, NULL, 0);
INSERT INTO `product` VALUES (18, '木托盘', '3-3#', 11, 1, 1539106370032, NULL, 0);
INSERT INTO `product` VALUES (19, '木托盘', '4#', 11, 1, 1539106370036, NULL, 0);
INSERT INTO `product` VALUES (20, '木托盘', '5#', 11, 1, 1539106370039, NULL, 0);
INSERT INTO `product` VALUES (21, '木托盘', '6#', 11, 1, 1539106370043, NULL, 0);
INSERT INTO `product` VALUES (22, '木托盘', '7#', 11, 1, 1539106391119, NULL, 0);
INSERT INTO `product` VALUES (23, '木托盘', '8#', 11, 1, 1539106391123, NULL, 0);
INSERT INTO `product` VALUES (24, '木托盘', '10#', 11, 1, 1539106522660, NULL, 0);
INSERT INTO `product` VALUES (25, '木托盘', '10-1#', 11, 1, 1539106522664, NULL, 0);
INSERT INTO `product` VALUES (26, '木托盘', '17#', 11, 1, 1539106522669, NULL, 0);
INSERT INTO `product` VALUES (27, '木托盘', '18#', 11, 1, 1539106522675, NULL, 0);
INSERT INTO `product` VALUES (28, '木托盘', '19#', 11, 1, 1539106522679, NULL, 0);
INSERT INTO `product` VALUES (29, '木托盘', '20#', 11, 1, 1539106522683, NULL, 0);
INSERT INTO `product` VALUES (30, '木托盘', '22#', 11, 1, 1539106522686, NULL, 0);
INSERT INTO `product` VALUES (31, '木托盘', '23#', 11, 1, 1539106522690, NULL, 0);
INSERT INTO `product` VALUES (32, '木托盘', '24#', 11, 1, 1539106522693, NULL, 0);
INSERT INTO `product` VALUES (33, '木托盘', '29#', 11, 1, 1539106522697, NULL, 0);
INSERT INTO `product` VALUES (34, '木托盘', '30#', 11, 1, 1539106522700, NULL, 0);
INSERT INTO `product` VALUES (35, '木托盘', '31#', 11, 1, 1539106522704, NULL, 0);
INSERT INTO `product` VALUES (36, '木托盘', '37#', 11, 1, 1539106522708, NULL, 0);
INSERT INTO `product` VALUES (37, '木托盘', '43#', 11, 1, 1539106522712, NULL, 0);
INSERT INTO `product` VALUES (38, '木托盘', '44#', 11, 1, 1539106522715, NULL, 0);
INSERT INTO `product` VALUES (39, '木托盘', '806Z折边胶木托盘', 11, 1, 1539228040123, NULL, 0);
INSERT INTO `product` VALUES (40, '木托盘', '906Z双桶木箱', 14, 1, 1539228040127, NULL, 0);
INSERT INTO `product` VALUES (41, '木托盘', '906Z双桶木托盘', 11, 1, 1539228166351, NULL, 0);
INSERT INTO `product` VALUES (42, '木托盘', '906Z单桶木箱', 14, 1, 1539228166356, NULL, 0);
INSERT INTO `product` VALUES (43, '木托盘', '906Z单桶木托盘', 11, 1, 1539228166359, NULL, 0);
INSERT INTO `product` VALUES (44, '木托盘', '周转用木托盘1150*1000', 11, 1, 1539228166362, NULL, 0);
INSERT INTO `product` VALUES (45, '木托盘', '623专用木托盘1150*1000', 11, 1, 1539228166370, NULL, 0);
INSERT INTO `product` VALUES (46, '木托盘', 'CP3木托盘', 11, 1, 1539228798974, NULL, 0);
INSERT INTO `product` VALUES (47, '木托盘', '开口桶木托盘', 11, 1, 1539228798979, NULL, 0);
INSERT INTO `product` VALUES (48, '木托盘', 'PUR产品专用木托盘920*920', 11, 1, 1539228798983, NULL, 0);
INSERT INTO `product` VALUES (49, '木托盘', '8264水务胶专用木托盘1000*1000', 11, 1, 1539228798986, NULL, 0);
INSERT INTO `product` VALUES (50, '木托盘', 'CP4木托盘1200*1150', 11, 1, 1539228798991, NULL, 0);
INSERT INTO `product` VALUES (51, '木托盘', '松芝专用木托盘1150*1000', 11, 1, 1539228798994, NULL, 0);
INSERT INTO `product` VALUES (52, '木托盘', '松芝专用木托盘1350*1150', 11, 1, 1539228798997, NULL, 0);
INSERT INTO `product` VALUES (53, '木托盘', '外贸免熏蒸木托盘1140*1140', 11, 1, 1539228952593, NULL, 0);
INSERT INTO `product` VALUES (54, '木托盘', '外贸免熏蒸木托盘1200*1150', 11, 1, 1539228952860, NULL, 0);
INSERT INTO `product` VALUES (55, '木托盘', '外贸免熏蒸木托盘1150*900', 11, 1, 1539228952865, NULL, 0);
INSERT INTO `product` VALUES (56, '木托盘', '外贸免熏蒸木托盘1100*800', 11, 1, 1539228952908, NULL, 0);
INSERT INTO `product` VALUES (57, '木托盘', '外贸免熏蒸双桶盘1250*680', 11, 1, 1539228952912, NULL, 0);
INSERT INTO `product` VALUES (58, '木托盘', '外贸免熏蒸木压板1200*1150', 13, 1, 1539229090194, NULL, 0);
INSERT INTO `product` VALUES (59, '木托盘', '外贸免熏蒸木压板1140*1140', 13, 1, 1539229090198, NULL, 0);
INSERT INTO `product` VALUES (60, '木托盘', '外贸免熏蒸木压板1100*800', 13, 1, 1539229090202, NULL, 0);
INSERT INTO `product` VALUES (61, '木托盘', '外贸免熏蒸木压板1150*900', 13, 1, 1539229090205, NULL, 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of supply
-- ----------------------------
INSERT INTO `supply` VALUES (7, 6, 13, '26060001', 1539106635420, NULL, 0);
INSERT INTO `supply` VALUES (8, 6, 14, '26060002', 1539106635425, NULL, 0);
INSERT INTO `supply` VALUES (9, 6, 15, '26060003', 1539106635429, NULL, 0);
INSERT INTO `supply` VALUES (10, 6, 16, '26060017', 1539106635434, NULL, 0);
INSERT INTO `supply` VALUES (11, 6, 17, '26060018', 1539106635438, NULL, 0);
INSERT INTO `supply` VALUES (12, 6, 18, '26060019', 1539106635441, NULL, 0);
INSERT INTO `supply` VALUES (13, 6, 19, '26060004', 1539106635448, NULL, 0);
INSERT INTO `supply` VALUES (14, 6, 20, '26060005', 1539106635454, NULL, 0);
INSERT INTO `supply` VALUES (15, 6, 21, '26060006', 1539106635463, NULL, 0);
INSERT INTO `supply` VALUES (16, 6, 22, '26060007', 1539106635476, NULL, 0);
INSERT INTO `supply` VALUES (17, 6, 23, '26060008', 1539106635483, NULL, 0);
INSERT INTO `supply` VALUES (18, 6, 24, '26060010', 1539106635488, NULL, 0);
INSERT INTO `supply` VALUES (27, 6, 25, '26060025', 1539226780264, NULL, 0);
INSERT INTO `supply` VALUES (28, 6, 26, '26060028', 1539227036986, NULL, 0);
INSERT INTO `supply` VALUES (29, 6, 27, '26060027', 1539227037002, NULL, 0);
INSERT INTO `supply` VALUES (30, 6, 28, '26060029', 1539227037006, NULL, 0);
INSERT INTO `supply` VALUES (31, 6, 29, '26060041', 1539227037014, NULL, 0);
INSERT INTO `supply` VALUES (32, 6, 30, '26060042', 1539227037018, NULL, 0);
INSERT INTO `supply` VALUES (33, 6, 31, '26060043', 1539227037021, NULL, 0);
INSERT INTO `supply` VALUES (34, 6, 32, '26060044', 1539227037025, NULL, 0);
INSERT INTO `supply` VALUES (35, 6, 33, '26060050', 1539227037029, NULL, 0);
INSERT INTO `supply` VALUES (36, 6, 34, '26060051', 1539227037033, NULL, 0);
INSERT INTO `supply` VALUES (37, 6, 35, '26060067', 1539227037037, NULL, 0);
INSERT INTO `supply` VALUES (38, 6, 36, '26060037', 1539227037040, NULL, 0);
INSERT INTO `supply` VALUES (39, 6, 37, '26060172', 1539227037044, NULL, 0);
INSERT INTO `supply` VALUES (40, 6, 38, '26060173', 1539227037048, NULL, 0);
INSERT INTO `supply` VALUES (41, 7, 39, '', 1539230307161, NULL, 0);
INSERT INTO `supply` VALUES (42, 7, 40, '', 1539230307166, NULL, 0);
INSERT INTO `supply` VALUES (43, 7, 41, '', 1539230307170, NULL, 0);
INSERT INTO `supply` VALUES (44, 7, 42, '', 1539230307173, NULL, 0);
INSERT INTO `supply` VALUES (45, 7, 43, '', 1539230307176, NULL, 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of unit
-- ----------------------------
INSERT INTO `unit` VALUES (11, '个', '', 1539106290655, NULL, 0);
INSERT INTO `unit` VALUES (13, '块', '', 1539183768077, NULL, 0);
INSERT INTO `unit` VALUES (14, '套', '', 1539227991486, NULL, 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '陈亮', '236338364', 'f889134a41063043803618b18908b6bd6d57b027', 1, 1539190580107, NULL, 0);
INSERT INTO `user` VALUES (4, 'r', '2', '77de68daecd823babbb58edb1c8e14d7106e83bb', 0, 1539330034198, NULL, 0);

SET FOREIGN_KEY_CHECKS = 1;