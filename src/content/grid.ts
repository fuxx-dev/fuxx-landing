export type Card = {
  id: string
  title: string
  capabilities: string[]
  visual?: { shot: string } | { replay: 'ssh' } | { demo: 'cursor' | 'sounds' }
}

/** Everything the story chapters don't cover (groups E, F, G, H, J, and agent-tab details). */
export const grid: Card[] = [
  { id: 'agent-extras', title: 'Agent tabs, the small stuff', capabilities: ['b-select-copy', 'b-top-bar', 'b-image-pills', 'b-drag-block'], visual: { shot: 'chat-select' } },
  { id: 'diffs', title: 'Diffs worth reading', capabilities: ['e-diff-cards'], visual: { shot: 'diff-cards' } },
  { id: 'code', title: 'Code, read-only', capabilities: ['e-viewer', 'e-code-view'] },
  { id: 'markdown', title: 'A Markdown reader', capabilities: ['e-markdown'], visual: { shot: 'md-reader' } },
  { id: 'browser', title: 'A browser in a pane', capabilities: ['f-browser-tabs', 'f-agent-browser'], visual: { shot: 'browser' } },
  { id: 'ssh', title: 'SSH, done properly', capabilities: ['g-ssh', 'g-persistent'], visual: { replay: 'ssh' } },
  { id: 'shell-cards', title: 'Shell tabs as cards', capabilities: ['h-shell-cards'], visual: { shot: 'shell-cards' } },
  { id: 'blocks', title: 'Command blocks', capabilities: ['h-command-blocks'], visual: { shot: 'command-blocks' } },
  { id: 'terminal', title: 'A real terminal', capabilities: ['h-gpu-terminal', 'h-low-cpu'] },
  { id: 'cursor', title: 'A cursor with personality', capabilities: ['h-cursor'], visual: { demo: 'cursor' } },
  { id: 'sounds', title: 'Key sounds', capabilities: ['h-sounds'], visual: { demo: 'sounds' } },
  { id: 'themes', title: 'Themes', capabilities: ['h-themes'], visual: { shot: 'preferences' } },
  { id: 'settings', title: 'Settings and help', capabilities: ['j-preferences', 'j-help'] },
  { id: 'welcome', title: 'A proper first run', capabilities: ['j-welcome'], visual: { shot: 'welcome' } },
  { id: 'updates', title: 'Updates itself', capabilities: ['j-updates'], visual: { shot: 'update' } },
]
