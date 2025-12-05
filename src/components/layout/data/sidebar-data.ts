import {
  LayoutDashboard,
  Monitor,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
  Users,
  Command,
  Store,
  Car,
  Wrench as WrenchIcon,
  Building2,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Administrador',
      logo: Command,
      plan: 'Pro',
    },
    // {
    //   name: 'Acme Inc',
    //   logo: GalleryVerticalEnd,
    //   plan: 'Enterprise',
    // },
    // {
    //   name: 'Acme Corp.',
    //   logo: AudioWaveform,
    //   plan: 'Startup',
    // },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          allowedRoles: ['ADMIN', 'MANAGER'],
        },
        {
          title: 'Proveedores',
          url: '/customers',
          icon: UserCog,
          allowedRoles: ['ADMIN'], // Solo admin
        },
        {
          title: 'Talleres',
          url: '/workshops',
          icon: Store,
          allowedRoles: ['ADMIN', 'MANAGER'], // Admin y manager
        },
        {
          title: 'Clientes',
          url: '/all-clients',
          icon: Users,
          allowedRoles: ['ADMIN', 'MANAGER'], // Admin y manager
        },
        {
          title: 'Vehículos',
          url: '/all-vehicles',
          icon: Car,
          allowedRoles: ['ADMIN', 'MANAGER'], // Admin y manager
        },
        {
          title: 'Servicios',
          url: '/all-services',
          icon: WrenchIcon,
          allowedRoles: ['ADMIN', 'MANAGER'], // Admin y manager
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          title: 'Configuración',
          icon: Settings,
          allowedRoles: ['ADMIN', 'MANAGER'],
          items: [
            {
              title: 'Perfil',
              url: '/settings',
              icon: Building2,
              allowedRoles: ['ADMIN', 'MANAGER'],
            },
            {
              title: 'Cuenta',
              url: '/settings/account',
              icon: Wrench,
              allowedRoles: ['ADMIN', 'MANAGER'],
            },
            {
              title: 'Apariencia',
              url: '/settings/appearance',
              icon: Palette,
              allowedRoles: ['ADMIN', 'MANAGER'],
            },
            {
              title: 'Notificaciones',
              url: '/settings/notifications',
              icon: Bell,
              allowedRoles: ['ADMIN', 'MANAGER'],
            },
            {
              title: 'Pantalla',
              url: '/settings/display',
              icon: Monitor,
              allowedRoles: ['ADMIN', 'MANAGER'],
            },
          ],
        },
      ],
    },
  ],
}
