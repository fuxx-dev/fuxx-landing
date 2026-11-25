import type { IconName } from '../components/Icon'

export type Card = {
  id: string
  title: string
  /** A small Lucide icon beside the title. */
  icon: IconName
  capabilities: string[]
  visual?: { shot: string } | { replay: 'ssh' } | { demo: 'cursor' | 'sounds' | 'plan' }
}

/** Everything the story chapters don't cover (groups E, F, G, H, J, and the agent tab's details). */
export const grid: Card[] = [
  { id: 'plan-live', title: 'Plan Mode, live', icon: 'listChecks', capabilities: [], visual: { demo: 'plan' } },
  { id: 'agent-box', title: 'The agent box', icon: 'messageSquareText', capabilities: ['b-agent-box', 'b-attach-commands', 'b-history', 'b-suggestions', 'b-file-pills', 'b-image-pills'], visual: { shot: 'suggestion' } },
  { id: 'agent-extras', title: 'Agent tabs, the small stuff', icon: 'clipboardCopy', capabilities: ['b-select-copy', 'b-code-copy', 'b-paste', 'b-top-bar', 'b-latest-prompt', 'b-take-back', 'b-drag-block'], visual: { shot: 'chat-select' } },
  { id: 'second-thoughts', title: 'Undo, and a second thought', icon: 'undo2', capabilities: ['c-undo', 'c-close-confirm'] },
  { id: 'menus', title: 'Right-click, everywhere', icon: 'mousePointerClick', capabilities: ['c-context-menus', 'd-files-menu'], visual: { shot: 'files-menu' } },
  { id: 'browser', title: 'A browser in a pane', icon: 'globe', capabilities: ['f-browser-tabs', 'f-links', 'f-auto-open', 'f-agent-browser'], visual: { shot: 'browser' } },
  { id: 'diffs', title: 'Diffs worth reading', icon: 'fileDiff', capabilities: ['e-diff-cards'], visual: { shot: 'diff-cards' } },
  { id: 'code', title: 'Code, read-only', icon: 'fileCode', capabilities: ['e-viewer', 'e-code-view'] },
  { id: 'markdown', title: 'A Markdown reader', icon: 'bookOpen', capabilities: ['e-markdown'], visual: { shot: 'md-reader' } },
  { id: 'catch-up', title: 'Whatever you missed', icon: 'bell', capabilities: ['a-command-finished', 'a-bell-activity', 'a-unseen-dot'] },
  { id: 'ssh', title: 'SSH, done properly', icon: 'server', capabilities: ['g-ssh', 'g-persistent'], visual: { replay: 'ssh' } },
  { id: 'shell-cards', title: 'Shell tabs as cards', icon: 'rows3', capabilities: ['h-shell-cards'], visual: { shot: 'shell-cards' } },
  { id: 'blocks', title: 'Command blocks', icon: 'layers', capabilities: ['h-command-blocks'], visual: { shot: 'command-blocks' } },
  { id: 'terminal', title: 'A real terminal', icon: 'terminal', capabilities: ['h-gpu-terminal', 'h-low-cpu'] },
  { id: 'cursor', title: 'A cursor with personality', icon: 'textCursor', capabilities: ['h-cursor'], visual: { demo: 'cursor' } },
  { id: 'sounds', title: 'Key sounds', icon: 'keyboard', capabilities: ['h-sounds'], visual: { demo: 'sounds' } },
  { id: 'themes', title: 'Themes', icon: 'palette', capabilities: ['h-themes', 'c-cards'], visual: { shot: 'preferences' } },
  { id: 'settings', title: 'Settings and help', icon: 'settings', capabilities: ['j-preferences', 'j-help'] },
  { id: 'welcome', title: 'A proper first run', icon: 'hand', capabilities: ['j-welcome'], visual: { shot: 'welcome' } },
  { id: 'updates', title: 'Updates itself', icon: 'refreshCw', capabilities: ['j-updates'], visual: { shot: 'update' } },
]
