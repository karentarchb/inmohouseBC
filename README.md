# Proyecto InmoHouse - Reto Técnico Frontend
## **Diseño de Arquitectura**
## **1. Visión General del Proyecto**
InmoHouse es una aplicación web moderna y completa diseñada para la gestión de una empresa inmobiliaria. La plataforma permite a diferentes tipos de usuarios (administradores, agentes) gestionar y consultar información de propiedades de manera segura y eficiente, modernizando los procesos manuales y propensos a errores.

La aplicación está desplegada y completamente funcional, accesible para su evaluación.

Aplicación en vivo: https://inmohouse-bc.vercel.app/login

Credenciales de Prueba
Para facilitar la evaluación de los diferentes roles y permisos, se han creado los siguientes usuarios:

Rol Administrador:

Email: kt.arch@inmohouse.com

Contraseña: admin123

Rol Agente:

Email: isamaru@inmohouse.com

Contraseña: agente123

Rol Cliente (para futuras implementaciones):

Email: manubel@hotmail.com

Contraseña: cliente123

## **2. Decisiones de Arquitectura y Diseño**
Se tomaron decisiones clave para asegurar que la aplicación sea robusta, escalable, mantenible y segura, siguiendo las mejores prácticas de la industria.

## **2.1. Arquitectura del Frontend (Angular 17)**
Framework y Versión: Se eligió Angular 17, la última versión LTS, para aprovechar sus significativas mejoras de rendimiento, la API de Signals para un manejo de estado reactivo y eficiente, y la arquitectura de Componentes Standalone. Este enfoque elimina la necesidad de NgModules, simplificando la estructura del código, mejorando los tiempos de compilación y facilitando el "lazy loading" de componentes de forma nativa.

Estructura de Carpetas Orientada a Features: El código está organizado por funcionalidades para maximizar la escalabilidad y mantenibilidad.
### **Frontend (Angular 17)**
```

inmhouse/
src/app/
├── core/
│   ├── guards/         # Guards de rutas (auth, admin, etc.)
│   └── interceptors/   # Interceptores HTTP (ej. para añadir tokens)
│
├── features/
│   ├── auth/           # Lógica de autenticación (login, register)
│   ├── dashboard/      # Layout principal y páginas del dashboard
│   ├── properties/     # Lógica de propiedades (servicios, modelos)
│   └── users/          # Lógica de usuarios (servicios, modelos)
│
└── shared/
    └── components/     # Componentes reutilizables (diálogos, spinners, etc.)

```
Principios SOLID:

Single Responsibility Principle (SRP): Los componentes se encargan únicamente de la vista y la interacción del usuario. Toda la lógica de negocio (llamadas a API, manejo de estado complejo) se delega a servicios inyectables (AuthService, PropertyService, UserService).

Dependency Inversion Principle (DIP): Se utiliza el sistema de Inyección de Dependencias (DI) de Angular en toda la aplicación. Los componentes no crean sus dependencias (new Service()), sino que las reciben en el constructor, lo que facilita las pruebas unitarias (con mocks) y el desacoplamiento del código.

Manejo de Estado Reactivo:

RxJS: Se utiliza para manejar todas las operaciones asíncronas, especialmente las llamadas HTTP, permitiendo un manejo de errores robusto (catchError), la composición de flujos de datos (forkJoin) y la transformación de datos (pipe, map).

Angular Signals: Se usan para el manejo de estado local y síncrono en los componentes (ej. isLoading, agentOfTheMonth, datos para la UI). Los signals ofrecen una detección de cambios más granular y eficiente que los métodos tradicionales, mejorando el rendimiento de la renderización.

## **2.2. Arquitectura del Backend (Node.js, Express)**
API RESTful: Se diseñó una API siguiendo los principios REST para una comunicación clara y estandarizada entre el frontend y el backend, utilizando verbos HTTP (GET, POST, PUT, DELETE) y rutas basadas en recursos (/users, /properties).

Seguridad con JWT (JSON Web Tokens): La autenticación se basa en JWT. Tras un login exitoso, el backend genera un token firmado que contiene la información del usuario (ID, rol). El frontend almacena este token de forma segura y lo envía en el encabezado Authorization de cada petición subsecuente.

Middleware de Autorización: El backend cuenta con middlewares que interceptan las peticiones a rutas protegidas. Estos validan el JWT y verifican que el rol del usuario (administrator, agente) tenga los permisos necesarios para ejecutar la acción solicitada.

## **2.3. Diseño Visual y Experiencia de Usuario (UI/UX)**
Librería de Componentes: Se eligió Angular Material como base para la UI. Proporciona un conjunto de componentes accesibles, bien probados y personalizables que aceleran el desarrollo y aseguran una experiencia de usuario consistente y profesional.

## **3. Identidad Visual**

Logo: Se optó por un icono simple y universal de una casa, que representa de forma inmediata el núcleo del negocio inmobiliario.

Paleta de Colores: La paleta principal se basa en tonos de azul y morado. Estos colores fueron seleccionados para transmitir profesionalismo, confianza y tecnología. Los degradados se utilizan en elementos clave para dar un toque moderno y dinámico.

Tipografía: Se utiliza la fuente Roboto, proveída por Angular Material, por su alta legibilidad en pantallas de todos los tamaños.

Diseño Responsivo: Se implementó un diseño completamente responsivo utilizando una combinación de Flexbox y CSS Grid. El layout se adapta fluidamente a diferentes tamaños de pantalla, desde móviles hasta escritorios, reorganizando los elementos para asegurar una experiencia de usuario óptima en cualquier dispositivo.

Dashboard por Roles: La aplicación presenta un dashboard unificado que adapta su contenido y funcionalidades según el rol del usuario que ha iniciado sesión. Por ejemplo, el enlace al "Panel de Administración" solo es visible para los administradores, mejorando la seguridad y simplificando la interfaz para otros roles.

## **4. Guía de Instalación y Ejecución Local**
## **4.1. Prerrequisitos**
Node.js (versión 18.x o superior)

Angular CLI (versión 17.x o superior)

Git

## **4.2. Repositorios**
Frontend: https://github.com/karentarchb/inmohouseBC

Backend: https://github.com/karentarchb/inmohouse-backend

## **4.3. Pasos para la Ejecución**
Clonar los Repositorios:

# Clona el frontend
git clone https://github.com/karentarchb/inmohouseBC.git

# Clona el backend
git clone https://github.com/karentarchb/inmohouse-backend.git

Configurar el Backend:

# Navega a la carpeta del backend
cd inmohouse-backend

# Instala las dependencias
npm install

# Inicia el servidor del backend
npm start

El servidor del backend estará corriendo en http://localhost:3000.

Configurar el Frontend:

# Navega a la carpeta del frontend
cd ../inmohouseBC

# Instala las dependencias
npm install

# Inicia la aplicación de Angular
ng serve -o

La aplicación se abrirá automáticamente en tu navegador en http://localhost:4200.

## **5. Funcionalidades Implementadas**
[x] Autenticación y Registro de Usuarios.

[x] Seguridad Basada en Roles (JWT) con HttpInterceptor y Route Guards.

[x] Dashboard Unificado y Responsivo con sidenav y header.

[x] Visualización de Datos con tarjetas de estadísticas y gráfico de barras (ng2-charts).

[x] Gestión de Propiedades (CRUD) con tabla paginada y diálogos modales.

[x] Panel de Administración de Usuarios (CRUD) completo y protegido.

[x] Despliegue Continuo en Vercel.
