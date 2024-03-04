'use client'

import '../app/globals.css'
import Providers from '../app/providers'
import RootLayout from '../app/layout' 

function MyApp({ Component, pageProps }) {
  return (
    <Providers>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </Providers>
  )
}

export default MyApp
