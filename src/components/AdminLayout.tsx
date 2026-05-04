import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, LogOut, Package, Tags } from 'lucide-react'
import useAppStore from '@/stores/use-app-store'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export function AdminLayout() {
  const { isAdmin, logout } = useAppStore()
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Dashboard'
    if (location.pathname.includes('produtos')) return 'Gestão de Produtos'
    if (location.pathname.includes('categorias')) return 'Gestão de Categorias'
    return 'Painel Administrativo'
  }

  return (
    <SidebarProvider>
      <Sidebar variant="sidebar">
        <SidebarHeader className="p-4 flex items-center justify-center">
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Jewelry Admin</span>
              <span className="truncate text-xs">Backoffice</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === '/admin'}>
                <Link to="/admin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith('/admin/produtos')}>
                <Link to="/admin/produtos">
                  <Package />
                  <span>Produtos</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={location.pathname.startsWith('/admin/categorias')}
              >
                <Link to="/admin/categorias">
                  <Tags />
                  <span>Categorias</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={logout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut />
                <span>Sair</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="font-semibold text-lg flex-1">{getPageTitle()}</h1>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-medium leading-none">Administrador</span>
              <span className="text-xs text-muted-foreground mt-1">admin@jewelry.com</span>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 dark:bg-transparent">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
