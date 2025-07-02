# Reto InmoHouse

## **Diseño de Arquitectura**
### **Frontend (Angular 17)**

```

inmhouse/
src/
├── app/
│   ├── core/                    # Servicios core y configuración
│   │   ├── guards/             # Auth, role guards
│   │   ├── interceptors/       # HTTP interceptors
│   │   ├── services/           # Servicios globales
│   │   └── models/             # Interfaces y tipos
│   │
│   ├── shared/                 # Componentes reutilizables
│   │   ├── components/         # Botones, modales, etc.
│   │   ├── pipes/              # Pipes personalizados
│   │   └── directives/         # Directivas personalizadas
│   │
│   ├── features/               # Módulos por funcionalidad
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── services/
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── properties/
│   │   │   ├── components/
│   │   │   │   ├── property-list/
│   │   │   │   ├── property-form/
│   │   │   │   └── property-detail/
│   │   │   ├── services/
│   │   │   └── properties.module.ts
│   │   │
│   │   ├── users/
│   │   │   ├── components/
│   │   │   │   ├── user-list/
│   │   │   │   └── user-form/
│   │   │   ├── services/
│   │   │   └── users.module.ts
│   │   │
│   │   └── dashboard/
│   │       ├── pages/
│   │       │   ├── admin-dashboard/
│   │       │   ├── agent-dashboard/
│   │       │   └── client-dashboard/
│   │       ├── components/
│   │       │   ├── stats-widget/
│   │       │   └── charts/
│   │       └── dashboard.module.ts
│   │
│   └── layouts/                # Layouts principales
│       ├── admin-layout/
│       ├── agent-layout/
│       ├── client-layout/
│       └── auth-layout/        # Para login/register

```
