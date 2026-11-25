import type { ReactNode } from 'react'
import './fuxx-window.css'

/** A minimal fuxx window frame (traffic lights + title, and anything for the bar's right end) around a render or a mock. */
export function FuxxWindow({
  title,
  barEnd,
  children,
  className = '',
}: {
  title?: string
  barEnd?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={`fx-window ${className}`}>
      <div className="fx-window__bar" aria-hidden="true">
        <span className="fx-window__dot" />
        <span className="fx-window__dot" />
        <span className="fx-window__dot" />
        {title ? <span className="fx-window__title">{title}</span> : null}
        {barEnd ? <span className="fx-window__end">{barEnd}</span> : null}
      </div>
      <div className="fx-window__body">{children}</div>
    </figure>
  )
}
