'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@nextui-org/button'
import { Sun, Moon } from 'react-feather'

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className='flex gap-4'>
      <Button
        size='md'
        variant='flat'
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} // Alterna entre light y dark
      >
        {theme === 'light' ? <Moon /> : <Sun />} {/* Muestra el icono Sun o Moon según el tema */}
      </Button>
    </div>
  )
}
