import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { MotionRoot } from '../components/MotionRoot'
import { Hero } from '../sections/Hero'
import { Pain } from '../sections/Pain'
import { Story } from '../sections/Story'
import { Grid } from '../sections/Grid'
import { Plugins } from '../sections/Plugins'
import { Close, Footer } from '../sections/Close'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return (
    <MotionRoot>
      <Header />
      <main>
        <Hero />
        <Pain />
        <Story />
        <Grid />
        <Plugins />
        <Close />
      </main>
      <Footer />
    </MotionRoot>
  )
}
