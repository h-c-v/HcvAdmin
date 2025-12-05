# Sistema de Gestión de Talleres Vehiculares

## Descripción del Proyecto

Sistema administrativo para la gestión de talleres mecánicos y lubricentros. Permite a administradores crear y gestionar talleres (Customers), quienes a su vez pueden administrar sus propios clientes, vehículos, y mantener un historial completo de servicios y reparaciones.

## Arquitectura del Sistema

### Jerarquía de Usuarios

```
Admin (Super Usuario)
  └── Customers (Usuarios propietarios) [CON password - autenticación]
        └── Talleres/Workshops [SIN password - pertenecen a un Customer]
              └── Servicios realizados en el taller

Clientes (Dueños de vehículos) [CON password - autenticación]
  └── Vehículos
        └── Servicios (relacionados al vehículo Y al taller donde se realizó)
```

**Relaciones importantes:**
- Un Customer (usuario) puede tener múltiples Talleres
- Un Taller pertenece a un Customer (obligatorio)
- Un Cliente puede tener múltiples Vehículos y tiene password para autenticación
- Un Vehículo pertenece a un Cliente (obligatorio)
- Un Servicio se relaciona con un Vehículo Y un Taller (ambos obligatorios)

## Funcionalidades Principales

### 1. Gestión de Customers (Usuarios Propietarios)
- **Crear/Editar/Eliminar** usuarios propietarios de talleres
- Cada Customer es un usuario que puede poseer múltiples talleres
- Los Customers tienen acceso a su propio dashboard administrativo
- Tienen credenciales (email/password) para autenticación

**Datos del Customer:**
- Nombre
- Apellido
- Email
- Password (encriptado)
- Teléfono de contacto
- Fecha de registro
- Estado (Activo/Inactivo)

### 2. Gestión de Talleres (Workshops)
- **Crear/Editar/Eliminar** talleres vehiculares o lubricentros
- Cada Taller debe pertenecer a un Customer (obligatorio)
- Un Customer puede tener múltiples talleres
- Los talleres NO tienen credenciales propias

**Datos del Taller:**
- Customer ID (propietario del taller)
- Nombre del negocio
- CUIT (opcional)
- Dirección completa
- Teléfono de contacto
- Email del negocio
- Nombre del responsable/encargado
- Fecha de registro
- Estado (Activo/Inactivo)

### 3. Gestión de Clientes (Dueños de Vehículos)
- Registro de clientes dueños de vehículos
- Los clientes TIENEN credenciales (con password para autenticación)
- Cada cliente puede tener múltiples vehículos asociados

**Datos del Cliente:**
- Nombre
- Apellido
- DNI/Cédula
- Teléfono
- Email
- Password (encriptado)
- Dirección
- Fecha de registro
- Notas adicionales

### 4. Gestión de Vehículos
- Registro completo de vehículos por cliente
- Cada vehículo pertenece a un cliente específico

**Datos del Vehículo:**
- Marca
- Modelo
- Año
- Placa/Patente
- VIN (Número de identificación vehicular)
- Color
- Tipo de vehículo (Auto, Camioneta, Moto, etc.)
- Kilometraje actual
- Tipo de combustible
- Fecha de registro

### 5. Historial de Servicios/Cambios
- Registro detallado de todos los servicios realizados a cada vehículo
- Funciona como "historia clínica" del vehículo
- Permite rastrear todo el mantenimiento y reparaciones

**Datos del Servicio:**
- **Taller ID** (donde se realizó el servicio - obligatorio)
- **Vehículo ID** (vehículo atendido - obligatorio)
- Fecha del servicio
- Tipo de servicio (Cambio de aceite, Reparación, Mantenimiento, etc.)
- Descripción detallada del trabajo realizado
- Repuestos utilizados (lista de items)
- Mano de obra
- Kilometraje al momento del servicio
- Costo total
- Técnico/Mecánico responsable
- Fotos (opcional)
- Próximo servicio sugerido (fecha/kilometraje)
- Estado (Completado, Pendiente, En proceso)
- Notas adicionales

## Stack Tecnológico

### Frontend
- **React 19** con TypeScript
- **TanStack Router** para navegación
- **ShadcnUI** (TailwindCSS + RadixUI) para componentes
- **Apollo Client** para GraphQL
- **React Hook Form** + **Zod** para formularios y validación
- **Zustand** para manejo de estado global

### Backend (Asumido)
- **GraphQL** API
- Base de datos relacional (PostgreSQL/MySQL)

## Flujo de Trabajo

### Para el Admin
1. Crear nuevos Customers (usuarios propietarios)
2. Gestionar y monitorear todos los talleres
3. Acceder a reportes globales

### Para el Customer (Usuario Propietario)
1. Iniciar sesión con email/password
2. Crear y gestionar sus talleres
3. Ver reportes consolidados de todos sus talleres
4. Administrar el personal y configuración de cada taller

### Para el Taller (Workshop)
1. Registrar nuevos clientes (dueños de vehículos)
2. Agregar vehículos a los clientes
3. Registrar servicios realizados (asociados al taller y al vehículo)
4. Consultar historial de servicios por vehículo
5. Generar reportes y facturas
6. Ver estadísticas del taller

### Para los Clientes (Dueños de Vehículos)
1. Ver el historial completo de su(s) vehículo(s)
2. Consultar servicios realizados en diferentes talleres
3. Ver próximos servicios sugeridos
4. Ver detalles de reparaciones pasadas

## Pantallas Principales a Implementar

### Fase 1 - Estructura Base (ACTUAL)
- [ ] Dashboard de Customers (usuarios propietarios)
- [ ] Formulario de creación/edición de Customer
- [ ] Listado de Customers con búsqueda y filtros
- [ ] Dashboard de Talleres (por Customer)
- [ ] Formulario de creación/edición de Taller (requiere seleccionar Customer)
- [ ] Listado de Talleres con búsqueda y filtros
- [ ] Dashboard de Clientes (dueños de vehículos)
- [ ] Formulario de creación/edición de Cliente
- [ ] Listado de Clientes con búsqueda y filtros

### Fase 2 - Gestión de Vehículos
- [ ] Formulario de registro de Vehículo (requiere seleccionar Cliente)
- [ ] Listado de Vehículos por Cliente
- [ ] Vista detallada de Vehículo con historial de servicios

### Fase 3 - Historial de Servicios
- [ ] Formulario de registro de Servicio (requiere Taller y Vehículo)
- [ ] Vista de historial completo por Vehículo
- [ ] Vista de servicios realizados por Taller
- [ ] Timeline de servicios
- [ ] Detalles de cada servicio
- [ ] Recordatorios de próximos servicios

### Fase 4 - Reportes y Análisis
- [ ] Dashboard con estadísticas por Taller
- [ ] Dashboard consolidado por Customer (todos sus talleres)
- [ ] Reportes de servicios realizados
- [ ] Análisis de ingresos por Taller
- [ ] Clientes frecuentes
- [ ] Servicios más comunes

## Modelo de Datos (Simplificado)

```typescript
// Customer (Usuario propietario) - CON password para autenticación
interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string // Credential para autenticación
  phone: string
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// Workshop (Taller) - SIN password, pertenece a un Customer
interface Workshop {
  id: string
  customerId: string // FK al Customer propietario (obligatorio)
  businessName: string
  taxId?: string // CUIT (opcional)
  address: string
  phone: string
  email: string
  ownerName: string // Encargado/responsable del taller
  status: 'active' | 'inactive'
  createdAt: Date
  updatedAt: Date
}

// Client (Cliente dueño de vehículos) - CON password para autenticación
interface Client {
  id: string
  firstName: string
  lastName: string
  dni: string
  phone: string
  email: string
  password: string // Credential para autenticación
  address: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Vehículo
interface Vehicle {
  id: string
  clientId: string // FK al cliente
  brand: string
  model: string
  year: number
  licensePlate: string
  vin: string
  color: string
  vehicleType: 'AUTOMOVIL' |
  'CAMIONETA' |
  'MOTOCICLETA' |
  'SUV' |
  'VAN_FURGONETA'
  currentMileage: number
  fuelType: 'GASOLINA' |
  'DIESEL' |
  'ELECTRICO' |
  'HIBRIDO' |
  'GAS_NATURAL' |
  'GAS_COMPRIMIDO'
  createdAt: Date
  updatedAt: Date
}

// Servicio/Cambio
interface Service {
  id: string
  workshopId: string // FK al taller donde se realizó (obligatorio)
  vehicleId: string // FK al vehículo (obligatorio)
  serviceDate: Date
  serviceType: string
  description: string
  parts: ServicePart[]
  laborCost: number
  mileage: number
  technicianName: string
  nextServiceDate?: Date
  nextServiceMileage?: number
  status: 'completed' | 'pending' | 'in_progress'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Repuesto/Parte utilizada
interface ServicePart {
  id: string
  serviceId: string
  partName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}
```

## Próximos Pasos

1. Definir schemas GraphQL completos
2. Implementar las pantallas de gestión de Customers
3. Implementar las pantallas de gestión de Clientes
4. Implementar el módulo de Vehículos
5. Implementar el módulo de Historial de Servicios
6. Agregar búsquedas, filtros y reportes
7. Implementar sistema de notificaciones para próximos servicios

---

**Fecha de inicio:** 2025-11-19
**Última actualización:** 2025-11-19
