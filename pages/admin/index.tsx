import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    if (storedRole !== 'admin'){
      router.push("/")
    }
  }, [])

  return (
        <p>Bienvenido!</p>
       )
}
