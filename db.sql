-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-09-2026 a las 08:35:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `brocash`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `analista`
--

CREATE TABLE `analista` (
  `ID_ANALISTA` int(11) NOT NULL,
  `NOMBRE` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `analista`
--

INSERT INTO `analista` (`ID_ANALISTA`, `NOMBRE`) VALUES
(1020856325, 'Jonathan Riaño');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `credito`
--

CREATE TABLE `credito` (
  `ID_CREDITO` int(11) NOT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `NOMBRE_COMPLETO` varchar(150) DEFAULT NULL,
  `ID_ANALISTA` int(11) DEFAULT NULL,
  `INGRESOS` decimal(12,2) DEFAULT NULL,
  `MONTO_SOLICITADO` decimal(12,2) DEFAULT NULL,
  `ESTADO` varchar(40) DEFAULT NULL,
  `OCUPACION` varchar(100) DEFAULT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL,
  `FECHA_SOLICITUD` date DEFAULT NULL,
  `PLAZO_MESES` int(11) NOT NULL DEFAULT 1 COMMENT 'Número de meses/cuotas del préstamo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `credito`
--

INSERT INTO `credito` (`ID_CREDITO`, `ID_USUARIO`, `NOMBRE_COMPLETO`, `ID_ANALISTA`, `INGRESOS`, `MONTO_SOLICITADO`, `ESTADO`, `OCUPACION`, `TELEFONO`, `FECHA_SOLICITUD`, `PLAZO_MESES`) VALUES
(1, 987654321, 'Juan Prueba', 1020856325, 1500000.00, 3000000.00, 'aprobado', 'Asesor de ventas', '3001234567', '2026-08-13', 1),
(2, 1234567890, 'Carlos', 1020856325, 1800000.00, NULL, 'Denegado', 'Asesor de ventas', '3019876543', '2026-08-13', 1),
(3, 1234567891, 'Pedro', 1020856325, 1800000.00, NULL, 'Pendiente', 'Asesor de ventas', '3019876544', '2026-08-13', 1),
(20261404, 980504563, 'Alejandro Guevara', 1020856325, 2000000.00, NULL, 'Pendiente', 'Asesor de ventas', '3229494001', '2026-08-13', 1),
(20261405, 1192713973, 'Erika Mora', 1020856325, 2000000.00, NULL, 'Denegado', 'Asesor de ventas', '3227139685', '2026-08-14', 1),
(20261406, 1014298336, 'Pablo Pineda', 1020856325, 2500000.00, NULL, 'Aprobado', 'Trabajador', '3229494840', '2026-09-26', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta`
--

CREATE TABLE `cuenta` (
  `ID_CUENTA` varchar(40) NOT NULL,
  `ID_USUARIO` int(11) DEFAULT NULL,
  `TIPO_CUENTA` varchar(80) DEFAULT NULL,
  `SALDO` decimal(12,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuotas`
--

CREATE TABLE `cuotas` (
  `ID_CUOTA` int(11) NOT NULL,
  `ID_CREDITO` int(11) NOT NULL,
  `NUMERO_CUOTA` int(11) NOT NULL,
  `MONTO_CUOTA` decimal(12,2) NOT NULL,
  `FECHA_VENCIMIENTO` date NOT NULL,
  `ESTADO` varchar(20) DEFAULT 'PENDIENTE',
  `FECHA_PAGO` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `ID_PAGO` int(11) NOT NULL,
  `ID_CREDITO` int(11) DEFAULT NULL,
  `FECHA` date DEFAULT NULL,
  `MONTO` decimal(15,2) DEFAULT NULL,
  `METODO` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- Estructura de tabla para la tabla `registro_usuario`
--

CREATE TABLE `registro_usuario` (
  `ID_USUARIO` int(11) NOT NULL,
  `NOMBRE` varchar(30) DEFAULT NULL,
  `APELLIDO` varchar(20) DEFAULT NULL,
  `EDAD` int(11) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `TELEFONO` varchar(15) DEFAULT NULL,
  `PASSWORD` varchar(255) DEFAULT NULL,
  `ROL` varchar(20) DEFAULT 'cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_usuario`
--

INSERT INTO `registro_usuario` (`ID_USUARIO`, `NOMBRE`, `APELLIDO`, `EDAD`, `EMAIL`, `TELEFONO`, `PASSWORD`, `ROL`) VALUES
(39548678, 'Maria', 'Gomez', 32, 'maria@gmail.com', '3109876543', '123456', 'cliente'),
(980504563, 'Alejandro Guevara', 'N/A', 18, 'alejandroguevara@gmail.com', '3019876545', 'Prueba123456', 'cliente'),
(987654321, 'Juan Prueba', 'N/A', 18, 'juan.prueba@gmail.com', '3001234567', 'Prueba123', 'cliente'),
(999999999, 'Analista', 'Brocash', 35, 'analista@brocash.com', '3000000000', 'admin123', 'analista'),
(1000394226, 'Carlos', 'Ramirez', 19, 'carlos@outlook.com', '3114567890', '123456', 'cliente'),
(1014298331, 'Pablo Pineda', 'N/A', 18, 'juanpablo30_10@hotmail.com', '3229494840', 'Del1al9', 'cliente'),
(1014298336, 'Juan', 'Leon', 27, 'juanpablo30_10@hotmail.com', '3001234567', '123456', 'cliente'),
(1192713973, NULL, 'N/A', 18, 'moraerika105@gmail.com', '3227139685', 'prueba123', 'cliente'),
(1234567890, 'Carlos', 'Prueba', 30, 'carlos.prueba@gmail.com', '3019876543', 'Prueba123', 'cliente'),
(1234567891, 'Pedro', 'Prueba', 28, 'pedro.prueba@gmail.com', '3019876544', 'Prueba123', 'cliente'),
(2147483647, NULL, 'N/A', 18, 'moraerika105@gmail.com', '3227139685', 'prueba123', 'cliente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transaccion`
--

CREATE TABLE `transaccion` (
  `ID_TRANSACCION` int(11) NOT NULL,
  `ID_CUENTA` varchar(40) DEFAULT NULL,
  `FECHA` date DEFAULT NULL,
  `MONTO` decimal(15,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `analista`
--
ALTER TABLE `analista`
  ADD PRIMARY KEY (`ID_ANALISTA`);

--
-- Indices de la tabla `credito`
--
ALTER TABLE `credito`
  ADD PRIMARY KEY (`ID_CREDITO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`),
  ADD KEY `ID_ANALISTA` (`ID_ANALISTA`);

--
-- Indices de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD PRIMARY KEY (`ID_CUENTA`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `cuotas`
--
ALTER TABLE `cuotas`
  ADD PRIMARY KEY (`ID_CUOTA`),
  ADD KEY `ID_CREDITO` (`ID_CREDITO`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`ID_PAGO`),
  ADD KEY `ID_CREDITO` (`ID_CREDITO`);

--
-- Indices de la tabla `registro_usuario`
--
ALTER TABLE `registro_usuario`
  ADD PRIMARY KEY (`ID_USUARIO`);

--
-- Indices de la tabla `transaccion`
--
ALTER TABLE `transaccion`
  ADD PRIMARY KEY (`ID_TRANSACCION`),
  ADD KEY `ID_CUENTA` (`ID_CUENTA`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `credito`
--
ALTER TABLE `credito`
  MODIFY `ID_CREDITO` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20261407;

--
-- AUTO_INCREMENT de la tabla `cuotas`
--
ALTER TABLE `cuotas`
  MODIFY `ID_CUOTA` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `credito`
--
ALTER TABLE `credito`
  ADD CONSTRAINT `credito_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `registro_usuario` (`ID_USUARIO`),
  ADD CONSTRAINT `credito_ibfk_2` FOREIGN KEY (`ID_ANALISTA`) REFERENCES `analista` (`ID_ANALISTA`);

--
-- Filtros para la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD CONSTRAINT `cuenta_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `registro_usuario` (`ID_USUARIO`);

--
-- Filtros para la tabla `cuotas`
--
ALTER TABLE `cuotas`
  ADD CONSTRAINT `cuotas_ibfk_1` FOREIGN KEY (`ID_CREDITO`) REFERENCES `credito` (`ID_CREDITO`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`ID_CREDITO`) REFERENCES `credito` (`ID_CREDITO`);

--
-- Filtros para la tabla `transaccion`
--
ALTER TABLE `transaccion`
  ADD CONSTRAINT `transaccion_ibfk_1` FOREIGN KEY (`ID_CUENTA`) REFERENCES `cuenta` (`ID_CUENTA`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
