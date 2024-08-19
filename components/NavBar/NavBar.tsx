'use client'
import React from 'react'
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from '@nextui-org/react'
import ThemeSwitcher from './ThemeSwitcher'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  ShoppingBag,
  Edit,
  GitPullRequest,
  Cpu
} from 'react-feather'
import PercentList from '../Percent/PercentList'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isAdmin, setIsAdmin] = React.useState(false)
  console.log(isAdmin);
  
  const pathname = usePathname()

  React.useEffect(() => {
    const updateAuthState = () => {
      const username = localStorage.getItem('username')
      const admin = localStorage.getItem('role')
      setIsAuthenticated(!!username)
      setIsAdmin(admin === 'admin')
    }
  
    updateAuthState()
  
    document.addEventListener('authStateChanged', updateAuthState)
  
    return () => {
      document.removeEventListener('authStateChanged', updateAuthState)
    }
  }, [])

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        {isAuthenticated && (
          <NavbarMenuToggle
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className='sm:hidden'
          />
        )}
        <NavbarBrand>
          <p className='font-bold text-inherit'>ELCHINO</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden sm:flex'>
        {isAuthenticated && (
          <>
            <NavbarItem>
              <Link
                color={pathname === '/' ? undefined : 'foreground'}
                href='/'
              >
                Inicio
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color={pathname === '/clientes' ? undefined : 'foreground'}
                href='/clientes'
              >
                Clientes
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color={pathname === '/rutas' ? undefined : 'foreground'}
                href='/rutas'
              >
                Rutas
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color={pathname === '/pedidos' ? undefined : 'foreground'}
                href='/pedidos'
              >
                Pedidos
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link
                color={pathname === '/productos' ? undefined : 'foreground'}
                href='/productos'
              >
                Productos
              </Link>
            </NavbarItem>
            {isAdmin && (
              <NavbarItem>
                <Link
                  color={pathname === '/admin' ? undefined : 'foreground'}
                  href='/admin'
                >
                  Administrar
                </Link>
              </NavbarItem>
            )}
          </>
        )}
      </NavbarContent>

      <NavbarContent justify='end'>
        {isAdmin && (
          <NavbarItem>
            <PercentList />
          </NavbarItem>
        )}
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>

      {isAuthenticated && (
        <>
          <NavbarMenu>
            <NavbarMenuItem className='pt-4'>
              <Link className='w-full' href='/' size='lg'>
                <Home className='pr-2' />
                Inicio
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem className='pt-4'>
              <Link className='w-full' href='/clientes' size='lg'>
                <Users className='pr-2' />
                Clientes
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem className='pt-4'>
              <Link className='w-full' href='/rutas' size='lg'>
                <GitPullRequest className='pr-2' />
                Rutas
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem className='pt-4'>
              <Link className='w-full' href='/pedidos' size='lg'>
                <Edit className='pr-2' />
                Pedidos
              </Link>
            </NavbarMenuItem>
            <NavbarMenuItem className='pt-4'>
              <Link className='w-full' href='/productos' size='lg'>
                <ShoppingBag className='pr-2' />
                Productos
              </Link>
            </NavbarMenuItem>
            {isAdmin ? (
              <NavbarMenuItem className='pt-4'>
                <Link className='w-full' href='/admin' size='lg'>
                  <Cpu className='pr-2' />
                  Administrar
                </Link>
              </NavbarMenuItem>
            ) : <></>}
          </NavbarMenu>
        </>
      )}
    </Navbar>
  )
}
