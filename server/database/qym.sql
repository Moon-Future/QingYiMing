/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50719
Source Host           : localhost:3306
Source Database       : qym

Target Server Type    : MYSQL
Target Server Version : 50719
File Encoding         : 65001

Date: 2018-10-28 13:43:53
*/

SET FOREIGN_KEY_CHECKS=0;

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of company
-- ----------------------------
INSERT INTO `company` VALUES ('1', '情义明木业有限公司', '情义明', '1', null, '1539106236226', null, '0');
INSERT INTO `company` VALUES ('6', '骆驼集团襄阳蓄电池有限公司', '骆驼', '0', '1', '1539150339197', null, '0');
INSERT INTO `company` VALUES ('7', '湖北回天新材料股份有限公司', '回天', '0', '3', '1539150294048', '1539835639964', '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of counter
-- ----------------------------
INSERT INTO `counter` VALUES ('6', '3', '6', 'delivery', '1540656716152');
INSERT INTO `counter` VALUES ('7', '3', '7', 'delivery', '1539835678076');

-- ----------------------------
-- Table structure for delivery
-- ----------------------------
DROP TABLE IF EXISTS `delivery`;
CREATE TABLE `delivery` (
  `id` varchar(50) NOT NULL,
  `ord` varchar(50) DEFAULT NULL,
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
-- Records of delivery
-- ----------------------------
INSERT INTO `delivery` VALUES ('dfe995a0-d289-11e8-a79b-cd997e20a3eb', '', '13', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '1#', '26060001', '11', '个', '', '13', '1539216000000', '', '', '1539835012253', '1', '6', '1', '1539835024378', null, '0');
INSERT INTO `delivery` VALUES ('e5553800-d289-11e8-a79b-cd997e20a3eb', '', '16', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '3-1#', '26060017', '11', '个', '', '', '1539216000000', '', '', '1539835012253', '2', '6', '1', '1539835033472', null, '0');
INSERT INTO `delivery` VALUES ('e5553800-d289-11e8-a79b-cd997e20a3eb', '', '17', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '3-2#', '26060018', '11', '个', '', '', '1539216000000', '', '', '1539835012253', '2', '6', '1', '1539835033472', null, '0');
INSERT INTO `delivery` VALUES ('b95c64c0-d28a-11e8-a79b-cd997e20a3eb', '', '43', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z单桶木托盘', '', '11', '个', '32', '', '1539216000000', '', '', '1539835363739', '1', '7', '2', '1539835389196', null, '0');
INSERT INTO `delivery` VALUES ('b95c64c0-d28a-11e8-a79b-cd997e20a3eb', '', '40', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z双桶木箱', '', '14', '套', '15', '', '1539216000000', '', '你的', '1539835363739', '1', '7', '2', '1539835389196', null, '0');
INSERT INTO `delivery` VALUES ('38bce230-d28b-11e8-a79b-cd997e20a3eb', '', '39', '木托盘', '7', '湖北回天新材料股份有限公司', '806Z折边胶木托盘', '', '11', '个', '', '', '1539216000000', '', '', '1539835591180', '2', '7', '2', '1539835602899', null, '0');
INSERT INTO `delivery` VALUES ('38bce230-d28b-11e8-a79b-cd997e20a3eb', '', '41', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z双桶木托盘', '', '11', '个', '31', '', '1539216000000', '', '', '1539835591180', '2', '7', '2', '1539835602899', null, '0');
INSERT INTO `delivery` VALUES ('38bce230-d28b-11e8-a79b-cd997e20a3eb', '', '43', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z单桶木托盘', '', '11', '个', '', '', '1539216000000', '', '', '1539835591180', '2', '7', '2', '1539835602899', null, '0');
INSERT INTO `delivery` VALUES ('38bce230-d28b-11e8-a79b-cd997e20a3eb', '', '49', '木托盘', '7', '湖北回天新材料股份有限公司', '8264水务胶专用木托盘1000*1000', '89076666', '11', '个', '12', '', '1539216000000', '', '', '1539835591180', '2', '7', '2', '1539835602899', null, '0');
INSERT INTO `delivery` VALUES ('38bce230-d28b-11e8-a79b-cd997e20a3eb', '', '40', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z双桶木箱', '', '14', '套', '', '', '1539216000000', '', '', '1539835591180', '2', '7', '2', '1539835602899', null, '0');
INSERT INTO `delivery` VALUES ('38bce230-d28b-11e8-a79b-cd997e20a3eb', '', '42', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z单桶木箱', '', '14', '套', '', '', '1539216000000', '', '', '1539835591180', '2', '7', '2', '1539835602899', null, '0');
INSERT INTO `delivery` VALUES ('658bfbc0-d28b-11e8-a79b-cd997e20a3eb', '234342', '41', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z双桶木托盘', '', '11', '个', '232', '', '1539216000000', '', '', '1539835649553', '3', '7', '3', '1539835678076', null, '0');
INSERT INTO `delivery` VALUES ('658bfbc0-d28b-11e8-a79b-cd997e20a3eb', '', '43', '木托盘', '7', '湖北回天新材料股份有限公司', '906Z单桶木托盘', '', '11', '个', '67', '', '1539216000000', '', '', '1539835649553', '3', '7', '3', '1539835678076', null, '0');
INSERT INTO `delivery` VALUES ('658bfbc0-d28b-11e8-a79b-cd997e20a3eb', '', '49', '木托盘', '7', '湖北回天新材料股份有限公司', '8264水务胶专用木托盘1000*1000', '89076666', '11', '个', '', '', '1539216000000', '', '没有订单', '1539835649553', '3', '7', '3', '1539835678076', null, '0');
INSERT INTO `delivery` VALUES ('45375090-d344-11e8-86d7-6d225cf9a638', '', '14', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '2#', '26060002', '11', '个', '67', '', '1539302400000', '', '', '1539915061696', '3', '6', '1', '1539915080729', null, '0');
INSERT INTO `delivery` VALUES ('45375090-d344-11e8-86d7-6d225cf9a638', '', '15', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '3#', '26060003', '11', '个', '', '', '1539302400000', '', '', '1539915061696', '3', '6', '1', '1539915080729', null, '0');
INSERT INTO `delivery` VALUES ('45375090-d344-11e8-86d7-6d225cf9a638', '', '18', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '3-3#', '26060019', '11', '个', '98', '', '1539302400000', '', '', '1539915061696', '3', '6', '1', '1539915080729', null, '0');
INSERT INTO `delivery` VALUES ('e1de1d60-da02-11e8-9f56-33fb1c6e25db', '', '23', '木托盘', '6', '骆驼集团襄阳蓄电池有限公司', '8#', '26060008', '11', '个', '56', '', '1540080000000', '', '', '1540656593792', '4', '6', '1', '1540656654902', null, '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of deliverygrp
-- ----------------------------
INSERT INTO `deliverygrp` VALUES ('28', '6', 'dfe995a0-d289-11e8-a79b-cd997e20a3eb', '1539835024378', null, '0');
INSERT INTO `deliverygrp` VALUES ('29', '6', 'e5553800-d289-11e8-a79b-cd997e20a3eb', '1539835033472', null, '0');
INSERT INTO `deliverygrp` VALUES ('30', '7', 'b95c64c0-d28a-11e8-a79b-cd997e20a3eb', '1539835389196', null, '0');
INSERT INTO `deliverygrp` VALUES ('31', '7', '38bce230-d28b-11e8-a79b-cd997e20a3eb', '1539835602899', null, '0');
INSERT INTO `deliverygrp` VALUES ('32', '7', '658bfbc0-d28b-11e8-a79b-cd997e20a3eb', '1539835678076', null, '0');
INSERT INTO `deliverygrp` VALUES ('33', '6', '45375090-d344-11e8-86d7-6d225cf9a638', '1539915080729', null, '0');
INSERT INTO `deliverygrp` VALUES ('34', '6', 'e1de1d60-da02-11e8-9f56-33fb1c6e25db', '1540656654902', null, '1');

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
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of ord
-- ----------------------------
INSERT INTO `ord` VALUES ('3', '8aeba1d0-d91c-11e8-832e-3f4db4b7b226', '#a', '6', '骆驼集团襄阳蓄电池有限公司', '13', '木托盘', '1#', '12', '0', '0', '1540557709964', '1540557724781', null, '0');
INSERT INTO `ord` VALUES ('4', '8aeba1d0-d91c-11e8-832e-3f4db4b7b226', '#a', '6', '骆驼集团襄阳蓄电池有限公司', '14', '木托盘', '2#', '23', '0', '0', '1540557709964', '1540557724781', null, '0');
INSERT INTO `ord` VALUES ('5', '8aeba1d0-d91c-11e8-832e-3f4db4b7b226', '#a', '6', '骆驼集团襄阳蓄电池有限公司', '15', '木托盘', '3#', '56', '0', '0', '1540557709964', '1540557724781', null, '0');
INSERT INTO `ord` VALUES ('6', '3b0f1d60-d91f-11e8-832e-3f4db4b7b226', '#20181026', '7', '湖北回天新材料股份有限公司', '39', '木托盘', '806Z折边胶木托盘', '560', '0', '0', '1540558862853', '1540558879286', null, '0');
INSERT INTO `ord` VALUES ('7', '3b0f1d60-d91f-11e8-832e-3f4db4b7b226', '#20181026', '7', '湖北回天新材料股份有限公司', '43', '木托盘', '906Z单桶木托盘', '780', '0', '0', '1540558862853', '1540558879286', null, '0');
INSERT INTO `ord` VALUES ('8', '412c53e0-d9cc-11e8-b159-3f38f859e2c7', '#20181027', '7', '湖北回天新材料股份有限公司', '39', '木托盘', '806Z折边胶木托盘', '550', '0', '0', '1540633164160', '1540633192478', null, '0');
INSERT INTO `ord` VALUES ('9', '412c53e0-d9cc-11e8-b159-3f38f859e2c7', '#20181027', '7', '湖北回天新材料股份有限公司', '41', '木托盘', '906Z双桶木托盘', '650', '0', '0', '1540633164160', '1540633192478', null, '0');
INSERT INTO `ord` VALUES ('10', '412c53e0-d9cc-11e8-b159-3f38f859e2c7', '#20181027', '7', '湖北回天新材料股份有限公司', '43', '木托盘', '906Z单桶木托盘', '750', '0', '0', '1540633164160', '1540633192478', null, '0');
INSERT INTO `ord` VALUES ('11', '412c53e0-d9cc-11e8-b159-3f38f859e2c7', '#20181027', '7', '湖北回天新材料股份有限公司', '49', '木托盘', '8264水务胶专用木托盘1000*1000', '850', '0', '0', '1540633164160', '1540633192478', null, '0');
INSERT INTO `ord` VALUES ('12', '412c53e0-d9cc-11e8-b159-3f38f859e2c7', '#20181027', '7', '湖北回天新材料股份有限公司', '40', '木托盘', '906Z双桶木箱', '950', '0', '0', '1540633164160', '1540633192478', null, '0');
INSERT INTO `ord` VALUES ('21', 'fa5fe120-da70-11e8-9f70-977836751642', '#20181028', '7', '湖北回天新材料股份有限公司', '39', '木托盘', '806Z折边胶木托盘', '530', '0', '0', '1540703665095', '1540703940658', null, '0');
INSERT INTO `ord` VALUES ('22', 'fa5fe120-da70-11e8-9f70-977836751642', '#20181028', '7', '湖北回天新材料股份有限公司', '41', '木托盘', '906Z双桶木托盘', '730', '0', '0', '1540703665095', '1540703940658', null, '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of ordgrp
-- ----------------------------
INSERT INTO `ordgrp` VALUES ('12', '8aeba1d0-d91c-11e8-832e-3f4db4b7b226', '6', '91', '0', '0', '1540557724781', null, '0');
INSERT INTO `ordgrp` VALUES ('13', '3b0f1d60-d91f-11e8-832e-3f4db4b7b226', '7', '1340', '0', '0', '1540558879286', null, '0');
INSERT INTO `ordgrp` VALUES ('14', '412c53e0-d9cc-11e8-b159-3f38f859e2c7', '7', '3750', '0', '0', '1540633192478', null, '0');
INSERT INTO `ordgrp` VALUES ('15', 'fa5fe120-da70-11e8-9f70-977836751642', '7', '1260', '0', '0', '1540703940658', null, '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES ('13', '木托盘', '1#', '11', '1', '1539106370011', '1540654188885', '0');
INSERT INTO `product` VALUES ('14', '木托盘', '2#', '11', '1', '1539106370015', null, '0');
INSERT INTO `product` VALUES ('15', '木托盘', '3#', '11', '1', '1539106370019', null, '0');
INSERT INTO `product` VALUES ('16', '木托盘', '3-1#', '11', '1', '1539106370024', null, '0');
INSERT INTO `product` VALUES ('17', '木托盘', '3-2#', '11', '1', '1539106370027', null, '0');
INSERT INTO `product` VALUES ('18', '木托盘', '3-3#', '11', '1', '1539106370032', null, '0');
INSERT INTO `product` VALUES ('19', '木托盘', '4#', '11', '1', '1539106370036', null, '0');
INSERT INTO `product` VALUES ('20', '木托盘', '5#', '11', '1', '1539106370039', null, '0');
INSERT INTO `product` VALUES ('21', '木托盘', '6#', '11', '1', '1539106370043', null, '0');
INSERT INTO `product` VALUES ('22', '木托盘', '7#', '11', '1', '1539106391119', null, '0');
INSERT INTO `product` VALUES ('23', '木托盘', '8#', '11', '1', '1539106391123', null, '0');
INSERT INTO `product` VALUES ('24', '木托盘', '10#', '11', '1', '1539106522660', null, '0');
INSERT INTO `product` VALUES ('25', '木托盘', '10-1#', '11', '1', '1539106522664', null, '0');
INSERT INTO `product` VALUES ('26', '木托盘', '17#', '11', '1', '1539106522669', null, '0');
INSERT INTO `product` VALUES ('27', '木托盘', '18#', '11', '1', '1539106522675', null, '0');
INSERT INTO `product` VALUES ('28', '木托盘', '19#', '11', '1', '1539106522679', null, '0');
INSERT INTO `product` VALUES ('29', '木托盘', '20#', '11', '1', '1539106522683', null, '0');
INSERT INTO `product` VALUES ('30', '木托盘', '22#', '11', '1', '1539106522686', null, '0');
INSERT INTO `product` VALUES ('31', '木托盘', '23#', '11', '1', '1539106522690', null, '0');
INSERT INTO `product` VALUES ('32', '木托盘', '24#', '11', '1', '1539106522693', null, '0');
INSERT INTO `product` VALUES ('33', '木托盘', '29#', '11', '1', '1539106522697', null, '0');
INSERT INTO `product` VALUES ('34', '木托盘', '30#', '11', '1', '1539106522700', null, '0');
INSERT INTO `product` VALUES ('35', '木托盘', '31#', '11', '1', '1539106522704', null, '0');
INSERT INTO `product` VALUES ('36', '木托盘', '37#', '11', '1', '1539106522708', null, '0');
INSERT INTO `product` VALUES ('37', '木托盘', '43#', '11', '1', '1539106522712', null, '0');
INSERT INTO `product` VALUES ('38', '木托盘', '44#', '11', '1', '1539106522715', null, '0');
INSERT INTO `product` VALUES ('39', '木托盘', '806Z折边胶木托盘', '11', '1', '1539228040123', null, '0');
INSERT INTO `product` VALUES ('40', '木托盘', '906Z双桶木箱', '14', '1', '1539228040127', null, '0');
INSERT INTO `product` VALUES ('41', '木托盘', '906Z双桶木托盘', '11', '1', '1539228166351', null, '0');
INSERT INTO `product` VALUES ('42', '木托盘', '906Z单桶木箱', '14', '1', '1539228166356', null, '0');
INSERT INTO `product` VALUES ('43', '木托盘', '906Z单桶木托盘', '11', '1', '1539228166359', null, '0');
INSERT INTO `product` VALUES ('44', '木托盘', '周转用木托盘1150*1000', '11', '1', '1539228166362', null, '0');
INSERT INTO `product` VALUES ('45', '木托盘', '623专用木托盘1150*1000', '11', '1', '1539228166370', null, '0');
INSERT INTO `product` VALUES ('46', '木托盘', 'CP3木托盘', '11', '1', '1539228798974', null, '0');
INSERT INTO `product` VALUES ('47', '木托盘', '开口桶木托盘', '11', '1', '1539228798979', null, '0');
INSERT INTO `product` VALUES ('48', '木托盘', 'PUR产品专用木托盘920*920', '11', '1', '1539228798983', null, '0');
INSERT INTO `product` VALUES ('49', '木托盘', '8264水务胶专用木托盘1000*1000', '11', '1', '1539228798986', null, '0');
INSERT INTO `product` VALUES ('50', '木托盘', 'CP4木托盘1200*1150', '11', '1', '1539228798991', null, '0');
INSERT INTO `product` VALUES ('51', '木托盘', '松芝专用木托盘1150*1000', '11', '1', '1539228798994', null, '0');
INSERT INTO `product` VALUES ('52', '木托盘', '松芝专用木托盘1350*1150', '11', '1', '1539228798997', null, '0');
INSERT INTO `product` VALUES ('53', '木托盘', '外贸免熏蒸木托盘1140*1140', '11', '1', '1539228952593', null, '0');
INSERT INTO `product` VALUES ('54', '木托盘', '外贸免熏蒸木托盘1200*1150', '11', '1', '1539228952860', null, '0');
INSERT INTO `product` VALUES ('55', '木托盘', '外贸免熏蒸木托盘1150*900', '11', '1', '1539228952865', null, '0');
INSERT INTO `product` VALUES ('56', '木托盘', '外贸免熏蒸木托盘1100*800', '11', '1', '1539228952908', null, '0');
INSERT INTO `product` VALUES ('57', '木托盘', '外贸免熏蒸双桶盘1250*680', '11', '1', '1539228952912', null, '0');
INSERT INTO `product` VALUES ('58', '木托盘', '外贸免熏蒸木压板1200*1150', '13', '1', '1539229090194', null, '0');
INSERT INTO `product` VALUES ('59', '木托盘', '外贸免熏蒸木压板1140*1140', '13', '1', '1539229090198', null, '0');
INSERT INTO `product` VALUES ('60', '木托盘', '外贸免熏蒸木压板1100*800', '13', '1', '1539229090202', null, '0');
INSERT INTO `product` VALUES ('61', '木托盘', '外贸免熏蒸木压板1150*900', '13', '1', '1539229090205', null, '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of supply
-- ----------------------------
INSERT INTO `supply` VALUES ('7', '6', '13', '26060001', '1539106635420', '1540655257036', '0');
INSERT INTO `supply` VALUES ('8', '6', '14', '26060002', '1539106635425', null, '0');
INSERT INTO `supply` VALUES ('9', '6', '15', '26060003', '1539106635429', null, '0');
INSERT INTO `supply` VALUES ('10', '6', '16', '26060017', '1539106635434', null, '0');
INSERT INTO `supply` VALUES ('11', '6', '17', '26060018', '1539106635438', null, '0');
INSERT INTO `supply` VALUES ('12', '6', '18', '26060019', '1539106635441', null, '0');
INSERT INTO `supply` VALUES ('13', '6', '19', '26060004', '1539106635448', null, '0');
INSERT INTO `supply` VALUES ('14', '6', '20', '26060005', '1539106635454', null, '0');
INSERT INTO `supply` VALUES ('15', '6', '21', '26060006', '1539106635463', null, '0');
INSERT INTO `supply` VALUES ('16', '6', '22', '26060007', '1539106635476', null, '0');
INSERT INTO `supply` VALUES ('17', '6', '23', '26060008', '1539106635483', null, '0');
INSERT INTO `supply` VALUES ('18', '6', '24', '26060010', '1539106635488', null, '0');
INSERT INTO `supply` VALUES ('27', '6', '25', '26060025', '1539226780264', null, '0');
INSERT INTO `supply` VALUES ('28', '6', '26', '26060028', '1539227036986', null, '0');
INSERT INTO `supply` VALUES ('29', '6', '27', '26060027', '1539227037002', null, '0');
INSERT INTO `supply` VALUES ('30', '6', '28', '26060029', '1539227037006', null, '0');
INSERT INTO `supply` VALUES ('31', '6', '29', '26060041', '1539227037014', null, '0');
INSERT INTO `supply` VALUES ('32', '6', '30', '26060042', '1539227037018', null, '0');
INSERT INTO `supply` VALUES ('33', '6', '31', '26060043', '1539227037021', null, '0');
INSERT INTO `supply` VALUES ('34', '6', '32', '26060044', '1539227037025', null, '0');
INSERT INTO `supply` VALUES ('35', '6', '33', '26060050', '1539227037029', null, '0');
INSERT INTO `supply` VALUES ('36', '6', '34', '26060051', '1539227037033', null, '0');
INSERT INTO `supply` VALUES ('37', '6', '35', '26060067', '1539227037037', null, '0');
INSERT INTO `supply` VALUES ('38', '6', '36', '26060037', '1539227037040', null, '0');
INSERT INTO `supply` VALUES ('39', '6', '37', '26060172', '1539227037044', null, '0');
INSERT INTO `supply` VALUES ('40', '6', '38', '26060173', '1539227037048', null, '0');
INSERT INTO `supply` VALUES ('41', '7', '39', '', '1539230307161', null, '0');
INSERT INTO `supply` VALUES ('42', '7', '40', '', '1539230307166', null, '0');
INSERT INTO `supply` VALUES ('43', '7', '41', '', '1539230307170', null, '0');
INSERT INTO `supply` VALUES ('44', '7', '42', '', '1539230307173', null, '0');
INSERT INTO `supply` VALUES ('45', '7', '43', '', '1539230307176', null, '0');
INSERT INTO `supply` VALUES ('46', '7', '34', '90木托盘木托盘木托盘1000*3000', '1539418892857', '1539418921899', '1');
INSERT INTO `supply` VALUES ('47', '7', '49', '89076666', '1539418958506', null, '0');

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
-- Records of unit
-- ----------------------------
INSERT INTO `unit` VALUES ('11', '个', '', '1539106290655', null, '0');
INSERT INTO `unit` VALUES ('13', '块', '', '1539183768077', null, '0');
INSERT INTO `unit` VALUES ('14', '套', '', '1539227991486', null, '0');

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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', '陈亮', '236338364', 'f889134a41063043803618b18908b6bd6d57b027', '1', '1539190580107', null, '0');
INSERT INTO `user` VALUES ('4', 'r', '2', '77de68daecd823babbb58edb1c8e14d7106e83bb', '0', '1539330034198', null, '0');
