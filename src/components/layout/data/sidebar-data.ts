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
          allowedRoles: ['admin', 'manager'],
        },
        {
          title: 'Proveedores',
          url: '/customers',
          icon: UserCog,
          allowedRoles: ['admin'], // Solo admin
        },
        {
          title: 'Talleres',
          url: '/workshops',
          icon: Store,
          allowedRoles: ['admin', 'manager'], // Admin y manager
        },
        {
          title: 'Clientes',
          url: '/all-clients',
          icon: Users,
          allowedRoles: ['admin', 'manager'], // Admin y manager
        },
        {
          title: 'Vehículos',
          url: '/all-vehicles',
          icon: Car,
          allowedRoles: ['admin', 'manager'], // Admin y manager
        },
        {
          title: 'Servicios',
          url: '/all-services',
          icon: WrenchIcon,
          allowedRoles: ['admin', 'manager'], // Admin y manager
        },
      ],
    },
    {
      title: 'Configuración',
      items: [
        {
          title: 'Configuración',
          icon: Settings,
          allowedRoles: ['admin', 'manager'],
          items: [
            {
              title: 'Perfil',
              url: '/settings',
              icon: Building2,
              allowedRoles: ['admin', 'manager'],
            },
            {
              title: 'Cuenta',
              url: '/settings/account',
              icon: Wrench,
              allowedRoles: ['admin', 'manager'],
            },
            {
              title: 'Apariencia',
              url: '/settings/appearance',
              icon: Palette,
              allowedRoles: ['admin', 'manager'],
            },
            {
              title: 'Notificaciones',
              url: '/settings/notifications',
              icon: Bell,
              allowedRoles: ['admin', 'manager'],
            },
            {
              title: 'Pantalla',
              url: '/settings/display',
              icon: Monitor,
              allowedRoles: ['admin', 'manager'],
            },
          ],
        },
      ],
    },
  ],
}
