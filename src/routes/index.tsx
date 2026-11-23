import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Hero } from '../sections/Hero'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
    </>
  )
}
