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
import { Home, Users, ShoppingBag, Edit, GitPullRequest } from 'react-feather'

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <Navbar isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className='sm:hidden' justify='start'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>

      <NavbarContent className='pr-3 sm:hidden' justify='center'>
        <NavbarBrand>
          <p className='font-bold text-inherit'>ELCHINO</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarBrand>
          <p className='font-bold text-inherit'>ELCHINO</p>
        </NavbarBrand>
        <NavbarItem>
          <Link color={pathname === '/' ? undefined : 'foreground'} href='/'>
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
      </NavbarContent>

      <NavbarContent justify='end'>
        <div className='gap-2 hidden sm:flex'>
        <NavbarItem>
          <Button as={Link} color='success' href='#' variant='flat'>
            Iniciar Sesion
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color='warning' href='#' variant='flat'>
            Registrarse
          </Button>
        </NavbarItem>
        </div>
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
      </NavbarContent>

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
        <div className='flex gap-2 justify-center'>
        <NavbarMenuItem>
          <Button as={Link} color='success' href='#' variant='flat'>
            Iniciar Sesion
          </Button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Button as={Link} color='warning' href='#' variant='flat'>
            Registrarse
          </Button>
        </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </Navbar>
  )
}
