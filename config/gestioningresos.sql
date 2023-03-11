/*
 Navicat Premium Data Transfer

 Source Server         : LocalHost
 Source Server Type    : MySQL
 Source Server Version : 100427 (10.4.27-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : gestioningresos

 Target Server Type    : MySQL
 Target Server Version : 100427 (10.4.27-MariaDB)
 File Encoding         : 65001

 Date: 11/03/2023 15:59:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tbl_registros
-- ----------------------------
DROP TABLE IF EXISTS `tbl_registros`;
CREATE TABLE `tbl_registros`  (
  `id_registro` int NOT NULL AUTO_INCREMENT,
  `tipo_registro` int NOT NULL COMMENT '0 = INGRESO; 1 = SALIDA;',
  `fecha_hora_registro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `excusa_salida` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `id_usuario_Fk` int NOT NULL,
  PRIMARY KEY (`id_registro`) USING BTREE,
  INDEX `id_usuario_Fk`(`id_usuario_Fk` ASC) USING BTREE,
  CONSTRAINT `id_usuario_Fk` FOREIGN KEY (`id_usuario_Fk`) REFERENCES `tbl_usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tbl_registros
-- ----------------------------
INSERT INTO `tbl_registros` VALUES (8, 0, '2023-03-10 08:16:31', NULL, 3);
INSERT INTO `tbl_registros` VALUES (9, 1, '2023-03-10 10:18:46', 'Diligencia personal', 3);
INSERT INTO `tbl_registros` VALUES (10, 0, '2023-03-10 12:18:57', NULL, 3);
INSERT INTO `tbl_registros` VALUES (11, 1, '2023-03-10 14:19:01', 'Diligencia personal', 3);
INSERT INTO `tbl_registros` VALUES (12, 0, '2023-03-10 08:00:00', NULL, 4);
INSERT INTO `tbl_registros` VALUES (13, 1, '2023-03-10 15:19:34', 'Cita medica', 4);
INSERT INTO `tbl_registros` VALUES (14, 0, '2023-03-10 08:19:55', NULL, 9);
INSERT INTO `tbl_registros` VALUES (15, 1, '2023-03-10 13:20:01', 'Cita medica', 9);
INSERT INTO `tbl_registros` VALUES (16, 0, '2023-03-10 14:20:06', NULL, 9);
INSERT INTO `tbl_registros` VALUES (17, 1, '2023-03-10 18:20:10', 'Cita medica', 9);
INSERT INTO `tbl_registros` VALUES (18, 0, '2023-03-11 09:53:24', NULL, 13);
INSERT INTO `tbl_registros` VALUES (27, 0, '2023-03-11 10:00:00', NULL, 3);
INSERT INTO `tbl_registros` VALUES (29, 0, '2023-03-11 13:35:51', NULL, 8);
INSERT INTO `tbl_registros` VALUES (30, 0, '2023-03-11 13:37:40', NULL, 12);
INSERT INTO `tbl_registros` VALUES (31, 1, '2023-03-11 15:53:15', 'Diligencia personal', 12);

-- ----------------------------
-- Table structure for tbl_usuarios
-- ----------------------------
DROP TABLE IF EXISTS `tbl_usuarios`;
CREATE TABLE `tbl_usuarios`  (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cedula` int NOT NULL,
  `tipo_usuario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `area_usuario` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `fecha_creacion` datetime NULL DEFAULT NULL,
  `fecha_edicion` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id_usuario`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tbl_usuarios
-- ----------------------------
INSERT INTO `tbl_usuarios` VALUES (3, 'Carlos Orjuela L', 111, 'Empleado', 'Sistemas', '2023-03-10 20:50:34', '2023-03-11 15:47:40');
INSERT INTO `tbl_usuarios` VALUES (4, 'Andrea', 222, 'Invitado', 'Centro de costos', '2023-03-10 20:51:33', '2023-03-11 23:16:49');
INSERT INTO `tbl_usuarios` VALUES (8, 'Vanesa', 888, 'Proveedor', 'Sistemas', '2023-03-10 20:59:49', '2023-03-10 23:28:51');
INSERT INTO `tbl_usuarios` VALUES (9, 'Santiago', 666, 'Empleado', 'Mercadeo', '2023-03-10 21:00:50', '2023-03-10 23:26:52');
INSERT INTO `tbl_usuarios` VALUES (12, 'Mario', 777, 'Invitado', 'Produccion', '2023-03-10 22:48:59', NULL);
INSERT INTO `tbl_usuarios` VALUES (13, 'yaider', 0, 'Empleado', 'Sistemas', '2023-03-11 09:46:45', NULL);
INSERT INTO `tbl_usuarios` VALUES (14, 'felipe', 654, 'Empleado', 'Sistemas', '2023-03-11 09:51:06', NULL);

SET FOREIGN_KEY_CHECKS = 1;
