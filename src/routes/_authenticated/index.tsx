import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: ({ location }) => {
    const { auth } = useAuthStore.getState()

    // Si no está autenticado, redirigir a sign-in-2
    if (!auth.accessToken || !auth.user) {
      throw redirect({
        to: '/sign-in-2',
        search: {
          redirect: location.href,
        },
        replace: true,
      })
    }
  },
  component: Dashboard,
})
