export type Card = {
  id: string
  title: string
  capabilities: string[]
  visual?: { shot: string } | { replay: 'ssh' } | { demo: 'cursor' | 'sounds' }
}

/** Everything the story chapters don't cover (groups E, F, G, H, J, and the agent tab's details). */
export const grid: Card[] = [
  { id: 'agent-box', title: 'The agent box', capabilities: ['b-agent-box', 'b-attach-commands', 'b-history', 'b-suggestions', 'b-file-pills', 'b-image-pills'], visual: { shot: 'suggestion' } },
  { id: 'agent-extras', title: 'Agent tabs, the small stuff', capabilities: ['b-select-copy', 'b-code-copy', 'b-paste', 'b-top-bar', 'b-latest-prompt', 'b-take-back', 'b-drag-block'], visual: { shot: 'chat-select' } },
  { id: 'menus', title: 'Right-click, everywhere', capabilities: ['c-context-menus', 'd-files-menu'], visual: { shot: 'files-menu' } },
  { id: 'browser', title: 'A browser in a pane', capabilities: ['f-browser-tabs', 'f-links', 'f-auto-open', 'f-agent-browser'], visual: { shot: 'browser' } },
  { id: 'diffs', title: 'Diffs worth reading', capabilities: ['e-diff-cards'], visual: { shot: 'diff-cards' } },
  { id: 'code', title: 'Code, read-only', capabilities: ['e-viewer', 'e-code-view'] },
  { id: 'markdown', title: 'A Markdown reader', capabilities: ['e-markdown'], visual: { shot: 'md-reader' } },
  { id: 'catch-up', title: 'Whatever you missed', capabilities: ['a-command-finished', 'a-bell-activity'] },
  { id: 'ssh', title: 'SSH, done properly', capabilities: ['g-ssh', 'g-persistent'], visual: { replay: 'ssh' } },
  { id: 'shell-cards', title: 'Shell tabs as cards', capabilities: ['h-shell-cards'], visual: { shot: 'shell-cards' } },
  { id: 'blocks', title: 'Command blocks', capabilities: ['h-command-blocks'], visual: { shot: 'command-blocks' } },
  { id: 'terminal', title: 'A real terminal', capabilities: ['h-gpu-terminal', 'h-low-cpu'] },
  { id: 'cursor', title: 'A cursor with personality', capabilities: ['h-cursor'], visual: { demo: 'cursor' } },
  { id: 'sounds', title: 'Key sounds', capabilities: ['h-sounds'], visual: { demo: 'sounds' } },
  { id: 'themes', title: 'Themes', capabilities: ['h-themes', 'c-cards'], visual: { shot: 'preferences' } },
  { id: 'settings', title: 'Settings and help', capabilities: ['j-preferences', 'j-help'] },
  { id: 'welcome', title: 'A proper first run', capabilities: ['j-welcome'], visual: { shot: 'welcome' } },
  { id: 'updates', title: 'Updates itself', capabilities: ['j-updates'], visual: { shot: 'update' } },
]
