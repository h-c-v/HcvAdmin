import { redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { hasPermission } from './permissions'

/**
 * Check if user has permission to access a route
 * If not, redirect to unauthorized page
 */
export function checkRoutePermission(pathname: string) {
  const { auth } = useAuthStore.getState()

  if (!auth.user?.role) {
    throw redirect({
      to: '/sign-in-2',
      replace: true,
    })
  }

  const userRoles = auth.user.role

  // Check if user has permission to access this route
  if (!hasPermission(userRoles, pathname)) {
    throw redirect({
      to: '/errors/unauthorized',
      replace: true,
    })
  }
}
