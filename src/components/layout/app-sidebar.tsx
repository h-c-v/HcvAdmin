import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import { useAuthStore } from '@/stores/auth-store'
import { hasRole } from '@/lib/permissions'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
// import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'
import type { NavGroup as NavGroupType, NavItem } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { auth } = useAuthStore()

  // Filter navigation items based on user roles
  const filteredNavGroups = useMemo(() => {
    if (!auth.user?.role) return []

    const userRoles = auth.user.role

    return sidebarData.navGroups
    .map((group): NavGroupType => {
        const filteredItems = group.items
          .filter((item) => {
            // If no allowedRoles specified, show to everyone
            if (!item.allowedRoles) return true
            // Check if user has permission
            return hasRole(userRoles, item.allowedRoles)
          })
          .map((item): NavItem => {
            // Filter sub-items for collapsible menus
            if ('items' in item && item.items) {
              const filteredSubItems = item.items.filter((subItem) => {
                if (!subItem.allowedRoles) return true
                return hasRole(userRoles, subItem.allowedRoles)
              })
              return { ...item, items: filteredSubItems }
            }
            return item
          })
          // Remove collapsible items that have no visible sub-items
          .filter((item) => {
            if ('items' in item && item.items) {
              return item.items.length > 0
            }
            return true
          })

        return { ...group, items: filteredItems }
      })
      // Remove groups that have no visible items
      .filter((group) => group.items.length > 0)
  }, [auth.user?.role])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
