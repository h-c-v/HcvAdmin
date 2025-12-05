// Role-based access control (RBAC) system

export type UserRole = 'ADMIN' | 'MANAGER' | 'CLIENT'

export interface PermissionConfig {
  allowedRoles: UserRole[]
}

// Define permissions for each route/section
export const PERMISSIONS: Record<string, PermissionConfig> = {
  // Dashboard - accessible to all authenticated users
  '/': {
    allowedRoles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },

  // Proveedores - only admin can access
  '/customers': {
    allowedRoles: ['ADMIN'],
  },

  // Talleres - admin and manager can access
  '/workshops': {
    allowedRoles: ['ADMIN', 'MANAGER'],
  },

  // Clientes - admin and manager can access
  '/all-clients': {
    allowedRoles: ['ADMIN', 'MANAGER'],
  },

  // Vehículos - admin and manager can access
  '/all-vehicles': {
    allowedRoles: ['ADMIN', 'MANAGER'],
  },

  // Servicios - admin and manager can access
  '/all-services': {
    allowedRoles: ['ADMIN', 'MANAGER'],
  },

  // Settings - accessible to all authenticated users
  '/settings': {
    allowedRoles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
  '/settings/account': {
    allowedRoles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
  '/settings/appearance': {
    allowedRoles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
  '/settings/notifications': {
    allowedRoles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
  '/settings/display': {
    allowedRoles: ['ADMIN', 'MANAGER', 'CLIENT'],
  },
}

/**
 * Check if a user has permission to access a specific route
 */
export function hasPermission(userRoles: string[], route: string): boolean {
  // If no permission config exists for the route, deny access by default
  const permission = PERMISSIONS[route]
  if (!permission) {
    return false
  }

  // Check if user has at least one of the allowed roles
  return userRoles.some((role) =>
    permission.allowedRoles.includes(role as UserRole)
  )
}

/**
 * Check if a user has any of the specified roles
 */
export function hasRole(userRoles: string[], allowedRoles: UserRole[]): boolean {
  return userRoles.some((role) => allowedRoles.includes(role as UserRole))
}

/**
 * Get user's primary role (first role in the array)
 */
export function getPrimaryRole(userRoles: string[]): UserRole | null {
  if (!userRoles || userRoles.length === 0) return null
  return userRoles[0] as UserRole
}
