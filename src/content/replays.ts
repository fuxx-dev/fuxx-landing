export type ReplayLine = { kind: 'cmd' | 'out'; text: string }

export const replays: Record<'cli' | 'ssh', ReplayLine[]> = {
  cli: [
    { kind: 'cmd', text: 'fuxx new --preset claude --split right' },
    { kind: 'out', text: 's4' },
    { kind: 'cmd', text: 'fuxx wait s4' },
    { kind: 'out', text: 's4 needs you' },
    { kind: 'cmd', text: 'fuxx question s4' },
    { kind: 'out', text: 'Apply the migration? (y/n)' },
    { kind: 'cmd', text: 'fuxx answer s4 "yes"' },
    { kind: 'out', text: 'ok' },
    { kind: 'cmd', text: 'claude mcp add fuxx -- fuxx mcp' },
    { kind: 'out', text: 'Added MCP server fuxx' },
  ],
  ssh: [
    { kind: 'out', text: '⇧⌘S  › devbox   (~/.ssh/config)' },
    { kind: 'cmd', text: 'ssh devbox' },
    { kind: 'out', text: 'attached to tmux session fuxx-1' },
  ],
}
