import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { auth } = useAuthStore.getState()

    // Verificar si el usuario está autenticado
    if (!auth.accessToken || !auth.user) {
      throw redirect({
        to: '/sign-in-2',
        search: {
          redirect: location.href,
        },
        replace: true,
      })
    }

    // Verificar si el token ha expirado
    if (auth.user.exp && Date.now() > auth.user.exp) {
      auth.reset()
      throw redirect({
        to: '/sign-in-2',
        search: {
          redirect: location.href,
        },
        replace: true,
      })
    }
  },
  component: AuthenticatedLayout,
})
