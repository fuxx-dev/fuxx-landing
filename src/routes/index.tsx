import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Landing })

function Landing() {
  return (
    <main>
      <h1 className="wrap">Your not-so-friendly neighborhood CLI.</h1>
    </main>
  )
}
