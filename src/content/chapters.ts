export type Chapter = {
  id: string
  title: string
  lede: string
  capabilities: string[]
  /** Renders, a typed replay, or a drawn demo (for a capability whose render hasn't been made yet). */
  visual: { shots: string[] } | { replay: 'cli' | 'ssh' } | { demo: 'tracks' }
}

export const chapters: Chapter[] = [
  {
    id: 'agents',
    title: 'Knows your agents',
    lede: 'Every terminal knows what its agent is up to. You hear the moment one needs a human, and its questions come as a card you can actually answer.',
    capabilities: ['a-live-status', 'a-question-card', 'a-question-anywhere', 'a-question-agy', 'a-native-banners', 'a-wait-jump'],
    visual: { shots: ['agent-waiting'] },
  },
  {
    id: 'activity',
    title: 'Shows its work',
    lede: 'No more scrolling a wall of tool calls. Every step shows which files it read, searched and changed, and whether its checks actually passed.',
    capabilities: ['k-tracks', 'k-rows', 'k-checks', 'k-planned', 'k-ledger'],
    visual: { demo: 'tracks' },
  },
  {
    id: 'subagents',
    title: 'Subagents, out in the open',
    lede: 'When the agent sends out helpers, each one gets a lane. Watch any of them live, and talk to the ones still running.',
    capabilities: ['b-subagents', 'l-rows', 'l-orchestrating', 'l-relay', 'l-closing'],
    visual: { shots: ['agent-subagents'] },
  },
  {
    id: 'agent-tabs',
    title: 'Agent tabs with an undo',
    lede: 'Claude Code and agy as a proper chat. Click a permission, rewind the prompt you regret, fork one to try it another way.',
    capabilities: ['b-providers', 'b-chat', 'b-permissions', 'b-rewind', 'b-fork', 'b-usage'],
    visual: { shots: ['agent-chat', 'agent-permission', 'usage'] },
  },
  {
    id: 'workspaces',
    title: 'Workspaces, panes, tabs',
    lede: 'Split it how you like. Terminals, agents, files and web pages share one window, and it all comes back after a restart.',
    capabilities: ['c-splits', 'c-tab-bars', 'c-new-tab', 'c-drag', 'c-sidebar', 'c-palette', 'c-restore'],
    visual: { shots: ['window-split', 'palette'] },
  },
  {
    id: 'repo',
    title: 'Your repo, live',
    lede: 'Watch the agent’s edits land as they happen, ask about the lines you don’t like, and commit without leaving the window.',
    capabilities: ['d-files', 'd-changes', 'd-commit', 'd-branches', 'd-graph', 'e-live-changes', 'e-ask'],
    visual: { shots: ['changes', 'live-changes', 'ask', 'commit', 'graph'] },
  },
  {
    id: 'script',
    title: 'Script it',
    lede: 'Inside any fuxx terminal, the fuxx command talks to the app. Your scripts can start agents and wait on them, and so can your agents.',
    capabilities: ['i-cli', 'i-mcp'],
    visual: { replay: 'cli' },
  },
]
