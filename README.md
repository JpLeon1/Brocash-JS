# 💸 Brocash

Aplicación web para la gestión de créditos y préstamos. Permite a los usuarios registrarse, solicitar créditos, hacer seguimiento a sus solicitudes, realizar pagos y radicar PQR; y permite a los analistas de crédito revisar, aprobar o rechazar esas solicitudes.

Proyecto académico (SENA)

---

## 📋 Funcionalidades

### Usuario
- Registro e inicio de sesión
- Solicitud de crédito con formulario y validación de datos
- Adjuntar documentos de soporte
- Consultar estado del crédito y estado de cuenta
- Consultar calendario y fechas límite de pago
- Pagos en línea (PSE, Nequi, Daviplata)
- Generación de comprobantes de pago
- Historial de pagos y transacciones
- Creación de PQR y solicitudes de soporte

### Analista de crédito
- Revisar solicitudes de crédito
- Revisar y modificar el score de riesgo
- Aprobar o rechazar solicitudes
- Solicitar información adicional al usuario
- Evaluar la información para determinar el estado del crédito

---

## 🛠️ Tecnologías

- **Backend:** Node.js
- **Frontend:** HTML, JavaScript
- **Base de datos relacional:** MySQL 
- **Base de datos NoSQL:** MongoDB (actividad complementaria, colección `parque`)
- **Herramientas:** MySQL Workbench, Visual Studio Code, Postman

---

## 🗄️ Base de datos

Tablas principales (ver `db.sql`):

| Tabla | Descripción |
|---|---|
| `REGISTRO_USUARIO` | Datos de los usuarios registrados |
| `CUENTA` | Cuenta y saldo asociados a cada usuario |
| `CREDITO` | Solicitudes de crédito y su estado |
| `ANALISTA` | Analistas de crédito |
| `PAGO` | Pagos realizados por los usuarios |
| `TRANSACCION` | Transacciones asociadas a los pagos |

---

## 🚀 Cómo levantar el proyecto localmente

1. Clona el repositorio y entra a la carpeta del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Activa **Apache** y **MySQL** desde XAMPP.
4. Importa `db.sql` en phpMyAdmin para crear la base de datos `brocash` con todas sus tablas.
5. Levanta el servidor:
   ```bash
   node server.js
   ```
6. Si la conexión fue exitosa verás el mensaje de confirmación en la consola (🛢️).

---

## 📁 Estructura del proyecto

```
Brocash-JS/
├── config/
│   └── db.js              # Conexión a MySQL
├── controllers/
│   ├── authController.js      # Login y registro
│   └── creditoController.js   # CRUD de solicitudes de crédito
├── models/
│   ├── usuarioModel.js
│   └── creditoModel.js
├── db.sql                 # Script de creación de la base de datos
└── server.js               # Punto de entrada del servidor
```

---

## 📄 Documentación

El proyecto incluye diagramas UML de:
- Casos de uso
- Actividades
- Clases
- Paquetes

---

## 👥 Equipo

Juan Pablo Leon Pineda. https://github.com/JpLeon1
Brandon Stiven Ganzo Murcia. https://github.com/Stiven89
Jonathan Fernando Riaño Calonge. https://github.com/jonaria230897
Erika Mayerly Mora Rodriguez. 

