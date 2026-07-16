# 💰 LIFEOS – Sistema Inteligente de Gestión Financiera

<div align="center">

<img src="docs\images\kid_buu_banner_siven06.png"/>

### Administra tus ingresos, gastos, presupuestos y metas financieras desde una sola plataforma.

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge\&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge\&logo=springboot)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge\&logo=mysql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-38BDF8?style=for-the-badge\&logo=tailwindcss)
![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge\&logo=jsonwebtokens)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge\&logo=docker)

**Aplicación Full Stack para la administración de finanzas personales desarrollada con Spring Boot, Java 17 y una SPA en JavaScript Vanilla.**

</div>

---

# 📖 Descripción

**LIFEOS** es una plataforma web diseñada para facilitar la administración de las finanzas personales mediante una interfaz moderna, rápida y segura.

La aplicación permite registrar ingresos y gastos, administrar presupuestos, definir metas financieras, visualizar estadísticas y recibir alertas relacionadas con el estado financiero del usuario.

---

<img src="docs\images\dashboard_ejm.png"/>
<img src="docs\images\screen1.png"/>
<img src="docs\images\screen2.png"/>

# ✨ Funcionalidades

* 🔐 Autenticación mediante JWT
* 👤 Gestión de usuarios y perfil
* 💵 Registro de ingresos y gastos
* 📂 Clasificación por categorías
* 📊 Dashboard financiero
* 📅 Resumen mensual
* 💰 Gestión de presupuestos
* 🎯 Metas de ahorro
* 🔔 Sistema de alertas
* 📈 Reportes y estadísticas
* 🌙 Interfaz Dark Mode basada en Material Design 3

---

# 🏗️ Arquitectura General

```
Frontend (Vanilla JS + Tailwind)
            │
            ▼
      API REST (Spring Boot)
            │
            ▼
      Spring Security + JWT
            │
            ▼
      MySQL (Docker)
```

---

# 📁 Estructura General

```
APP LIFEOS/
├── frontend/          → SPA (Single Page Application) en Vanilla JavaScript
├── backend/           → API REST desarrollada con Spring Boot (Java 17)
├── docker-compose.yml → Orquestación de contenedores (Backend + MySQL)
└── opencode.json      → Configuración del proyecto
```

---

# 🎨 Frontend

```
frontend/
│
├── index.html
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── router.js
│   ├── api.js
│   ├── utils.js
│   │
│   ├── components/
│   │   ├── toast.js
│   │   └── transactionModal.js
│   │
│   └── screens/
│       ├── auth.js
│       ├── dashboard.js
│       ├── transactions.js
│       ├── budgets.js
│       ├── goals.js
│       ├── alerts.js
│       └── profile.js
```

## Tecnologías Frontend

* JavaScript Vanilla
* HTML5
* Tailwind CSS (CDN)
* Material Icons
* Hash Routing SPA
* Fetch API

### Arquitectura

La aplicación Frontend implementa una **Single Page Application (SPA)** sin frameworks.

Cada pantalla se desarrolla como un módulo independiente que implementa un método `render()`, permitiendo una navegación fluida mediante hash routing (`#/dashboard`, `#/transactions`, etc.).

El acceso a la API se centraliza mediante `api.js`, mientras que los componentes reutilizables (Toast, Modal de transacciones) se encuentran desacoplados dentro del directorio `components`.

---

# ⚙️ Backend

```
backend/
└── src/main/java/com/lifeos/
    │
    ├── LifeosApplication.java
    │
    ├── config/
    │   ├── SecurityConfig.java
    │   ├── JwtAuthenticationFilter.java
    │   ├── JwtTokenProvider.java
    │   └── CorsConfig.java
    │
    ├── common/
    │   ├── ApiResponse.java
    │   ├── DataSeeder.java
    │   ├── HealthController.java
    │   └── GlobalExceptionHandler.java
    │
    ├── user/
    ├── transaction/
    ├── budget/
    ├── goal/
    ├── alert/
    └── dashboard/
```

## Tecnologías Backend

* Java 17
* Spring Boot 3.2.5
* Spring Security
* JWT Authentication
* Spring Data JPA
* Maven
* MySQL
* H2 Database (Desarrollo)
* Docker

---

# 📦 Módulos del Backend

## 👤 User

Administración de usuarios.

* Registro
* Inicio de sesión
* Actualización de perfil
* Gestión de roles

---

## 💳 Transaction

Gestión completa de movimientos financieros.

Incluye:

* Ingresos
* Gastos
* Categorías
* Estado de transacciones
* Resumen mensual
* Estadísticas por categoría

---

## 💰 Budget

Permite crear presupuestos personalizados para controlar el gasto mensual.

---

## 🎯 Goal

Administración de metas de ahorro.

Permite realizar seguimiento del progreso y porcentaje de cumplimiento.

---

## 🔔 Alert

Sistema de alertas financieras.

Ejemplos:

* Presupuesto excedido
* Meta próxima a completarse
* Gastos elevados

---

## 📊 Dashboard

Genera la información consolidada mostrada en la pantalla principal:

* Balance actual
* Total de ingresos
* Total de gastos
* Estadísticas mensuales
* Tendencias

---

# 🗄️ Base de Datos

## Producción

* MySQL 8

## Desarrollo

* H2 Database

La persistencia se implementa mediante **Spring Data JPA**, utilizando la configuración definida en `application.yml`.

---

# 🐳 Docker

El proyecto utiliza Docker Compose para facilitar el despliegue.

Servicios incluidos:

* MySQL 8.0
* Backend Spring Boot

Configuración mediante variables de entorno para:

* Base de datos
* JWT Secret
* Usuario
* Contraseña

---

# 🚀 Instalación

## Clonar el proyecto

```bash
git clone https://github.com/usuario/lifeos.git

cd APP-LIFEOS
```

---

## Backend

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

La API estará disponible en:

```
http://localhost:8080/api
```

---

## Frontend

Abrir el archivo:

```
frontend/index.html
```

O utilizar un servidor local como Live Server.

---

## Docker

```bash
docker compose up --build
```

---

# 📡 API REST

## Autenticación

```
POST /api/auth/register

POST /api/auth/login
```

## Usuarios

```
GET /api/users/profile

PUT /api/users/profile
```

## Transacciones

```
GET /api/transactions

POST /api/transactions

PUT /api/transactions/{id}

DELETE /api/transactions/{id}
```

## Presupuestos

```
GET /api/budgets

POST /api/budgets
```

## Metas

```
GET /api/goals

POST /api/goals
```

## Alertas

```
GET /api/alerts
```

## Dashboard

```
GET /api/dashboard
```

---

# 🔒 Seguridad

La autenticación está implementada mediante **Spring Security** y **JSON Web Tokens (JWT)**.

El flujo de autenticación incluye:

* Registro de usuarios
* Inicio de sesión
* Generación de JWT
* Validación del token en cada petición
* Protección de endpoints mediante filtros personalizados

---

# 📈 Próximas Mejoras

* 📱 Progressive Web App (PWA)
* 📊 Gráficas con Chart.js
* 📅 Calendario financiero
* 💳 Gestión de múltiples cuentas
* 🌎 Internacionalización (i18n)
* ☁️ Despliegue en la nube
* 🔔 Notificaciones en tiempo real

Y muchas mejoras mas....

---

# 👨‍💻 Autor **Siven06**

**Desarrollado como proyecto Full Stack utilizando Spring Boot, Java 17, MySQL, Docker y JavaScript Vanilla.**

Si este proyecto te resulta útil, no olvides dejar una ⭐ en el repositorio.
