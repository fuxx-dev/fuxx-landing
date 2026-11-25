// Every user-facing capability of fuxx v0.13.7 (the spec's inventory, one entry each; sources: fuxx-cli's progress log
// and note 93's "Chores after M11ar").
// The page may claim nothing beyond this list; tests/coverage.test.ts checks every entry is shown.
export type Group = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L'
export type Capability = { id: string; group: Group; text: string; keys?: string }

export const inventory: Capability[] = [
  // A. Agent awareness
  { id: 'a-live-status', group: 'A', text: 'Live status for every terminal and agent tab (working, waiting, done, idle) on the sidebar, the tab, the status bar, even the cursor’s colour.' },
  { id: 'a-question-card', group: 'A', text: 'Claude’s questions come as a card: a digit or ↑↓ picks, your own words answer, Esc twice skips. It docks at the bottom if you scroll away.' },
  { id: 'a-question-anywhere', group: 'A', text: 'A waiting question shows in the sidebar with an Open button. One key takes you to the oldest, from any tab.', keys: '⇧⌘A' },
  { id: 'a-question-agy', group: 'A', text: 'agy asks too. It can’t wait for you, so fuxx shows the same card and sends your picks as a message.' },
  { id: 'a-native-banners', group: 'A', text: 'Native macOS banners that open the right terminal. Never about the one you’re looking at.' },
  { id: 'a-command-finished', group: 'A', text: 'Banners say which command finished and how: “cargo test · Failed (exit 101) after 40s”.' },
  { id: 'a-bell-activity', group: 'A', text: 'A bell list and an Activity log for whatever you missed.' },
  { id: 'a-unseen-dot', group: 'A', text: 'A quiet dot on a tab that finished while you looked elsewhere, gone once you open it.' },
  { id: 'a-wait-jump', group: 'A', text: 'Jump to whoever has waited longest for you. Again for the next one.', keys: '⇧⌘U' },
  // B. Agent tabs & chat
  { id: 'b-providers', group: 'B', text: 'Chat tabs for Claude Code and agy, starting in Auto; ⇧Tab changes the mode. Presets for claude, agy, opencode, codex and your own.', keys: '⇧Tab' },
  { id: 'b-chat', group: 'B', text: 'The conversation as a chat: streamed Markdown, tool rows that open in detail, a live todo list.' },
  { id: 'b-permissions', group: 'B', text: 'Allow, Allow all edits or Deny right in the chat. Stop and Force stop when it goes sideways.' },
  { id: 'b-top-bar', group: 'B', text: 'Cost per turn and a live context meter behind a clock in the box, a warning dot past 80%.' },
  { id: 'b-agent-box', group: 'B', text: 'Folder and branch chips, a model menu with effort levels, and the permission mode, all in the box you type in. The folder picker leads with each folder’s name, ⌘1–⌘8 for recent ones; the branch chip follows a git switch made anywhere.' },
  { id: 'b-attach-commands', group: 'B', text: '+ attaches files and images, / runs commands and skills, @ mentions files and subagents.' },
  { id: 'b-image-pills', group: 'B', text: 'Pasted images become “Image #1” pills, with a viewer.' },
  { id: 'b-file-pills', group: 'B', text: 'Drag a file from the Files tree or Finder into the chat and it becomes a pill in your message. Click a pill to open the file.' },
  { id: 'b-suggestions', group: 'B', text: 'Claude’s guess at your next message waits in the empty box, grey and italic. Tab takes it; Enter never sends it.', keys: '⇥' },
  { id: 'b-drag-block', group: 'B', text: 'Drag a shell command block onto an agent tab to hand it the output.' },
  { id: 'b-select-copy', group: 'B', text: 'Select anything in the chat and copy it: drag, double-click a word, ⌘C. ⌘A takes the whole chat.', keys: '⌘C' },
  { id: 'b-rewind', group: 'B', text: 'Rewind Claude to any message you sent: your words go back in the box, and its own checkpoints can undo the file changes too.', keys: 'Esc Esc' },
  { id: 'b-fork', group: 'B', text: 'Fork a Claude chat at any message: a “(fork)” tab opens beside it, the message ready to edit.' },
  { id: 'b-history', group: 'B', text: '↑ and ↓ in the box bring back what you sent: this tab’s prompts, then the folder’s.', keys: '↑ / ↓' },
  { id: 'b-latest-prompt', group: 'B', text: 'Your latest message floats over the chat while it’s scrolled away. Click it to jump back.' },
  { id: 'b-take-back', group: 'B', text: '× takes back a message Claude hasn’t read yet.' },
  { id: 'b-plan-card', group: 'B', text: 'Plan Mode you can read: Claude’s plan arrives as a card, rendered and folded when long, its file one click away. Approve with edits accepted, approve asking per edit, or keep planning with a note.', keys: '⏎' },
  { id: 'b-plan-progress', group: 'B', text: 'A ☰ 4/6 tab follows the plan: each task done (with its commit), in progress, or next.' },
  { id: 'b-code-copy', group: 'B', text: 'Every code block in the chat has a copy button.' },
  { id: 'b-paste', group: 'B', text: '⌘V never stays silent: files copied in Finder paste as pills, TIFF and BMP become PNG, and what fuxx can’t take, it says.', keys: '⌘V' },
  { id: 'b-usage', group: 'B', text: 'Live usage in the status bar: % used and when it resets, every limit in a popover.' },
  // C. Workspaces, panes, tabs, sidebar
  { id: 'c-splits', group: 'C', text: 'Split panes from every pane’s bar, then move between them with ⌥⌘ and the arrows.', keys: '⌘D / ⇧⌘D' },
  { id: 'c-tab-bars', group: 'C', text: 'Every pane has its own tab bar. Its + opens a menu that searches URLs, agents, tabs, history and files.' },
  { id: 'c-new-tab', group: 'C', text: 'A new tab is like the last one: a terminal, a browser, or the same agent and model.', keys: '⌘T' },
  { id: 'c-context-menus', group: 'C', text: 'Right-click menus on terminals, file tabs, the chat and the agent box: Open Link, Copy Link, Copy, Paste, Select All, and Add to Chat.', keys: '⇧F10' },
  { id: 'c-drag', group: 'C', text: 'Drag anything anywhere: tabs between panes and workspaces, workspaces in and out of groups.' },
  { id: 'c-sidebar', group: 'C', text: 'A sidebar with coloured avatars, folder groups and pins. Rename with ⌘R, pick with ⌘1–9.' },
  { id: 'c-palette', group: 'C', text: '⌘K searches actions, workspaces, files and settings. ⌘P jumps to a workspace.', keys: '⌘K' },
  { id: 'c-cards', group: 'C', text: 'Panes float on one rounded card, in light themes and dark.' },
  { id: 'c-undo', group: 'C', text: '⌘Z and ⇧⌘Z in every text field, and at the shell prompt.', keys: '⌘Z' },
  { id: 'c-close-confirm', group: 'C', text: 'Closing a tab that’s still working asks first, with Don’t ask again.' },
  { id: 'c-restore', group: 'C', text: 'Workspaces, panes, tabs and each terminal’s folder come back after a restart.' },
  // D. Repo
  { id: 'd-files', group: 'D', text: 'A Files tree that follows the active file. Click to preview, double-click to keep.', keys: '⌥⌘\\' },
  { id: 'd-changes', group: 'D', text: 'Changes: staged and unstaged, with a branch bar for Fetch, Pull, Push and Publish.' },
  { id: 'd-commit', group: 'D', text: 'Commit from the panel in a two-line message box (↵ or ⌘↵). ✦ lets the agent write the message.' },
  { id: 'd-branches', group: 'D', text: 'A branch switcher with a confirm step and conflict warnings.' },
  { id: 'd-graph', group: 'D', text: 'A commit graph with lanes, branch pills and Open on GitHub.' },
  { id: 'd-files-menu', group: 'D', text: 'Right-click in the Files tree: Open to the Side, Show Changes, Reveal in Finder, Copy Path, Rename, Move to Trash. ⌘Z puts it back.' },
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
  { id: 'f-links', group: 'F', text: 'Links open where you choose: a split on the right (the default), a tab in the same pane, or your default browser. Paths in terminal output open the file at that line.' },
  { id: 'f-auto-open', group: 'F', text: 'When npm run dev or Vite opens a browser, the page lands in fuxx like a clicked link, and your focus stays put.' },
  // G. SSH & persistent sessions
  { id: 'g-ssh', group: 'G', text: 'Pick a host from ~/.ssh/config. It runs your own ssh, reconnects, and can keep it alive in tmux on the host.', keys: '⇧⌘S' },
  { id: 'g-persistent', group: 'G', text: 'Opt in and sessions keep running after you quit. Reopen and they’re live.' },
  // H. Terminal niceties
  { id: 'h-gpu-terminal', group: 'H', text: 'A real GPU terminal on alacritty: scrollback, clickable links, ligatures, Nerd Font prompt icons.' },
  { id: 'h-low-cpu', group: 'H', text: 'Idles at low CPU.' },
  { id: 'h-shell-cards', group: 'H', text: 'Chat-style shell tabs: every finished command becomes a card with Copy and Rerun.' },
  { id: 'h-command-blocks', group: 'H', text: 'Command blocks: a slim bar per command, red when it failed. ⇧⌘C copies its output.', keys: '⇧⌘↑ / ⇧⌘↓' },
  { id: 'h-cursor', group: 'H', text: 'A cursor that glides and breathes instead of blinking, with an optional comet trail or sparks.' },
  { id: 'h-sounds', group: 'H', text: 'Key sounds for Enter and Ctrl+C, plus a banner sound. Click-clack.' },
  { id: 'h-themes', group: 'H', text: 'Catppuccin, Dracula, Gruvbox, TokyoNight and more, with a live preview. Light themes look good too.' },
  // K. Agent activity
  { id: 'k-tracks', group: 'K', text: 'A busy step draws as tracks: an icon tile per call per file (read, search, edit, command, test) under phase bands (Looking around, Ran, Changing, Checking), a summary like “edited · +2 −1”. Hover a column to name it.' },
  { id: 'k-rows', group: 'K', text: 'Smaller steps read as plain rows: the agent’s own words, the command as a dim trace, and chips like “2 passed” or “build failed · E0425”.' },
  { id: 'k-checks', group: 'K', text: 'Honest checks: cargo, pytest, jest, vitest and go test are read from their output, so a failing cargo test | tail is never green.' },
  { id: 'k-planned', group: 'K', text: 'A failure the agent planned (“red first”) says “red, as planned”. A real one stays under its step until the same check passes.' },
  { id: 'k-ledger', group: 'K', text: 'The turn so far, over the box: “Cultivating… · Running tests 0:14”, and “4 changed · checks 2/6” under it. Click it for the changed files under their folders, with A/M/D and +/−, and any file’s diff.' },
  // L. Subagents
  { id: 'b-subagents', group: 'L', text: 'Every subagent gets a pill above the chat. Click one and the chat becomes that subagent’s live conversation.', keys: '⌥⌘[ / ⌥⌘]' },
  { id: 'l-rows', group: 'L', text: 'In the main chat a subagent’s row wears a robot and says what it’s doing: “Running Read · 0:12”, “Needs input”, “14 steps · 2:10”.' },
  { id: 'l-orchestrating', group: 'L', text: 'The tab reads “Orchestrating…” while only subagents are working.' },
  { id: 'l-relay', group: 'L', text: 'Message a Claude subagent running in the background, right from its lane. Main passes your words on, and the lane tells you when they’re delivered.' },
  { id: 'l-closing', group: 'L', text: 'A finished subagent can’t be messaged by mistake: its box becomes Back to Main, or Ask Main about it.' },
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
