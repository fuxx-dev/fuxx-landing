// Every user-facing capability of fuxx v0.12.6 (the spec's inventory, one entry each).
// The page may claim nothing beyond this list; tests/coverage.test.ts checks every entry is shown.
export type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
export type Capability = { id: string; group: Group; text: string; keys?: string }

export const inventory: Capability[] = [
  // A. Agent awareness
  { id: 'a-live-status', group: 'A', text: 'Live status for every terminal and agent tab: working, waiting for you, done, idle.' },
  { id: 'a-status-everywhere', group: 'A', text: 'You see it on the sidebar avatar, the tab, the status bar, even the cursor’s colour.' },
  { id: 'a-question-sidebar', group: 'A', text: 'A waiting agent’s question shows right in the sidebar, with an Open button.' },
  { id: 'a-native-banners', group: 'A', text: 'Native macOS banners that open the right terminal. Never about the one you’re looking at.' },
  { id: 'a-command-finished', group: 'A', text: 'Banners say which command finished and how: “cargo test · Failed (exit 101) after 40s”.' },
  { id: 'a-bell-activity', group: 'A', text: 'A bell list and an Activity log for whatever you missed.' },
  { id: 'a-wait-jump', group: 'A', text: 'Jump to whoever has waited longest for you. Again for the next one.', keys: '⇧⌘U' },
  // B. Agent tabs & chat
  { id: 'b-providers', group: 'B', text: 'Chat tabs for Claude Code and agy. Presets for claude, agy, opencode, codex and your own. Status works for any CLI agent.' },
  { id: 'b-chat', group: 'B', text: 'The conversation as a chat: streamed Markdown, tool rows that open in detail, a live todo list.' },
  { id: 'b-permissions', group: 'B', text: 'Allow, Allow all edits or Deny right in the chat. Stop and Force stop when it goes sideways.' },
  { id: 'b-top-bar', group: 'B', text: 'A top bar with status, cost per turn and a live context meter.' },
  { id: 'b-agent-box', group: 'B', text: 'The agent box: folder and branch chips, a model menu with effort levels, permission mode.' },
  { id: 'b-attach-commands', group: 'B', text: '+ attaches files and images, / runs commands and skills, @ mentions files and subagents.' },
  { id: 'b-image-pills', group: 'B', text: 'Pasted images become “Image #1” pills, with a viewer.' },
  { id: 'b-drag-block', group: 'B', text: 'Drag a shell command block onto an agent tab to hand it the output.' },
  { id: 'b-subagents', group: 'B', text: 'Subagents get a pill row: switch the chat to any subagent’s live conversation.', keys: '⌥⌘[ / ⌥⌘]' },
  { id: 'b-usage', group: 'B', text: 'Live usage in the status bar: % used and when it resets, every limit in a popover.' },
  // C. Workspaces, panes, tabs, sidebar
  { id: 'c-splits', group: 'C', text: 'A workspace is a layout of split panes. Move between them with ⌥⌘ and the arrows.', keys: '⌘D / ⇧⌘D' },
  { id: 'c-tab-bars', group: 'C', text: 'Every pane has its own tab bar: terminals, agent tabs, files and web pages side by side.' },
  { id: 'c-drag', group: 'C', text: 'Drag anything anywhere: tabs between panes and workspaces, workspaces in and out of groups.' },
  { id: 'c-sidebar', group: 'C', text: 'A sidebar with coloured avatars, folder groups and pins. Rename with ⌘R, pick with ⌘1–9.' },
  { id: 'c-palette', group: 'C', text: '⌘K searches actions, workspaces, files and settings. ⌘P jumps to a workspace.', keys: '⌘K' },
  { id: 'c-cards', group: 'C', text: 'Panes float on one rounded card, in light themes and dark.' },
  { id: 'c-restore', group: 'C', text: 'Workspaces, panes, tabs and each terminal’s folder come back after a restart.' },
  // D. Repo
  { id: 'd-files', group: 'D', text: 'A Files tree that follows the active file. Click to preview, double-click to keep.', keys: '⌥⌘\\' },
  { id: 'd-changes', group: 'D', text: 'Changes: staged and unstaged, with a branch bar for Fetch, Pull, Push and Publish.' },
  { id: 'd-commit', group: 'D', text: 'Commit from the panel with ⌘↵. ✦ lets the agent write the message.' },
  { id: 'd-branches', group: 'D', text: 'A branch switcher with a confirm step and conflict warnings.' },
  { id: 'd-graph', group: 'D', text: 'A commit graph with lanes, branch pills and Open on GitHub.' },
  // E. Code & Markdown viewers
  { id: 'e-viewer', group: 'E', text: 'Read-only file tabs with syntax colours, File | Diff | Preview, ⌘F and wrap. fuxx never edits your files.' },
  { id: 'e-code-view', group: 'E', text: 'A sticky scope line, breadcrumbs, folding, and ⌥↑ / ⌥↓ to hop between changes.' },
  { id: 'e-diff-cards', group: 'E', text: 'Diffs as review cards with the changed words marked, or side by side.' },
  { id: 'e-live-changes', group: 'E', text: 'Live changes: fresh lines glow and say who changed them, Claude, agy or you. “Follow claude” keeps up.' },
  { id: 'e-ask', group: 'E', text: 'Select lines and ⌘↵ sends them to the agent. Its reasons for an edit show as notes under the lines.' },
  { id: 'e-markdown', group: 'E', text: 'A Markdown reader with an outline, GitHub callouts, code you can copy, and Mermaid diagrams.' },
  // F. Browser
  { id: 'f-browser-tabs', group: 'F', text: 'Web pages as tabs next to your terminals. Click :3000 in the status bar to open your dev server.', keys: '⇧⌘B' },
  { id: 'f-agent-browser', group: 'F', text: 'Agents drive it too: fuxx browser open | click | fill | snapshot, or the MCP tools.' },
  // G. SSH & persistent sessions
  { id: 'g-ssh', group: 'G', text: 'Pick a host from ~/.ssh/config. It runs your own ssh, reconnects, and can keep it alive in tmux on the host.', keys: '⇧⌘S' },
  { id: 'g-persistent', group: 'G', text: 'Opt in and sessions keep running after you quit. Reopen and they’re live.' },
  // H. Terminal niceties
  { id: 'h-gpu-terminal', group: 'H', text: 'A real GPU terminal on alacritty: scrollback, clickable links, ligatures, Nerd Font prompt icons.' },
  { id: 'h-low-cpu', group: 'H', text: 'Idles at low CPU, even with the glow on.' },
  { id: 'h-shell-cards', group: 'H', text: 'Chat-style shell tabs: every finished command becomes a card with Copy and Rerun.' },
  { id: 'h-command-blocks', group: 'H', text: 'Command blocks: a slim bar per command, red when it failed. ⇧⌘C copies its output.', keys: '⇧⌘↑ / ⇧⌘↓' },
  { id: 'h-cursor', group: 'H', text: 'A cursor that glides and breathes instead of blinking, with an optional comet trail or sparks.' },
  { id: 'h-sounds', group: 'H', text: 'Key sounds for Enter and Ctrl+C, plus a banner sound. Click-clack.' },
  { id: 'h-themes', group: 'H', text: 'Catppuccin, Dracula, Gruvbox, TokyoNight and more, with a live preview. Light themes look good too.' },
  // I. Scripting
  { id: 'i-cli', group: 'I', text: 'The fuxx command: ls, new, wait, question, answer, events, note, progress. Agent tabs are a1, a2…' },
  { id: 'i-mcp', group: 'I', text: 'fuxx mcp: let your agents drive fuxx.' },
  // J. Settings, plugins, onboarding, updates
  { id: 'j-preferences', group: 'J', text: 'Preferences open as a panel over the window.', keys: '⌘,' },
  { id: 'j-help', group: 'J', text: 'A Help menu, and every shortcut one key away.', keys: '⌘/' },
  { id: 'j-welcome', group: 'J', text: 'A welcome screen on first run: pick a folder, start an agent.' },
  { id: 'j-updates', group: 'J', text: 'Updates itself: one click on Update Available.' },
  { id: 'j-plugins', group: 'J', text: 'Plugins from a GitHub link: share themes or bring zsh helper programs.' },
  { id: 'j-plugin-settings', group: 'J', text: 'Plugins can declare their own settings: switches and numbers in Settings → Plugins.' },
]

export const byId = new Map(inventory.map((c) => [c.id, c]))
