export type Chapter = {
  id: string
  title: string
  lede: string
  capabilities: string[]
  visual: { shots: string[] } | { replay: 'cli' | 'ssh' }
}

export const chapters: Chapter[] = [
  {
    id: 'agents',
    title: 'Knows your agents',
    lede: 'Every terminal knows what its agent is up to. You hear about it the moment one needs a human, and otherwise fuxx leaves you alone.',
    capabilities: ['a-live-status', 'a-status-everywhere', 'a-question-sidebar', 'a-native-banners', 'a-command-finished', 'a-bell-activity', 'a-wait-jump'],
    visual: { shots: ['agent-waiting'] },
  },
  {
    id: 'agent-tabs',
    title: 'Agent tabs & the agent box',
    lede: 'Claude Code and agy as a proper chat: permissions you can click, tools you can open, subagents you can follow, usage you can see.',
    capabilities: ['b-providers', 'b-chat', 'b-permissions', 'b-agent-box', 'b-attach-commands', 'b-subagents', 'b-usage'],
    visual: { shots: ['agent-chat', 'agent-permission', 'agent-subagents', 'usage'] },
  },
  {
    id: 'workspaces',
    title: 'Workspaces, panes, tabs',
    lede: 'Split it how you like. Terminals, agents, files and web pages share one window, and it all comes back after a restart.',
    capabilities: ['c-splits', 'c-tab-bars', 'c-drag', 'c-sidebar', 'c-palette', 'c-cards', 'c-restore'],
    visual: { shots: ['window-split', 'palette'] },
  },
  {
    id: 'repo',
    title: 'Your repo, live',
    lede: 'Watch the agent’s edits land as they happen, ask about the lines you don’t like, and commit without leaving the window.',
    capabilities: ['d-files', 'd-changes', 'd-commit', 'd-branches', 'd-graph', 'e-live-changes', 'e-ask'],
    visual: { shots: ['changes', 'live-changes', 'ask', 'commit'] },
  },
  {
    id: 'script',
    title: 'Script it',
    lede: 'Inside any fuxx terminal, the fuxx command talks to the app. Your scripts can start agents and wait on them, and so can your agents.',
    capabilities: ['i-cli', 'i-mcp'],
    visual: { replay: 'cli' },
  },
]
