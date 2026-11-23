import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Hero } from '../sections/Hero'
import { Pain } from '../sections/Pain'
import { Story } from '../sections/Story'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Pain />
        <Story />
        <div style={{ height: '60vh' }} />
      </main>
    </>
  )
}
