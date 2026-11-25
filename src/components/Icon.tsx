import {
  Activity, Archive, ArrowRight, BookOpen, Bell, Bot, Check, ChevronDown, ChevronRight, ClipboardCopy, Copy,
  CornerDownLeft, Download, ExternalLink, FileCode, FileDiff, FolderGit2, Globe, Hand, Keyboard, Layers,
  LayoutGrid, LayoutPanelLeft, ListChecks, MessageSquareText, MessagesSquare, MousePointerClick, Network, Palette,
  Pencil, Puzzle, RefreshCw, Rows3, Server, Settings, ShieldCheck, SquareTerminal, Star, Tag, Terminal, TextCursor,
  Undo2,
} from 'lucide-react'

/** Every icon the page uses, by name. Content files name icons from here, so a typo fails the type check. */
export const ICONS = {
  activity: Activity,
  archive: Archive,
  arrowRight: ArrowRight,
  bell: Bell,
  bookOpen: BookOpen,
  bot: Bot,
  check: Check,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  clipboardCopy: ClipboardCopy,
  copy: Copy,
  cornerDownLeft: CornerDownLeft,
  download: Download,
  externalLink: ExternalLink,
  fileCode: FileCode,
  fileDiff: FileDiff,
  folderGit2: FolderGit2,
  globe: Globe,
  hand: Hand,
  keyboard: Keyboard,
  layers: Layers,
  layoutGrid: LayoutGrid,
  layoutPanelLeft: LayoutPanelLeft,
  listChecks: ListChecks,
  messageSquareText: MessageSquareText,
  messagesSquare: MessagesSquare,
  mousePointerClick: MousePointerClick,
  network: Network,
  palette: Palette,
  pencil: Pencil,
  puzzle: Puzzle,
  refreshCw: RefreshCw,
  rows3: Rows3,
  server: Server,
  settings: Settings,
  shieldCheck: ShieldCheck,
  squareTerminal: SquareTerminal,
  star: Star,
  tag: Tag,
  terminal: Terminal,
  textCursor: TextCursor,
  undo2: Undo2,
} as const

export type IconName = keyof typeof ICONS

/** A decorative Lucide icon (aria-hidden, Lucide's default) at one stroke weight across the page. */
export function Icon({ name, size = 16, className = '' }: { name: IconName; size?: number | string; className?: string }) {
  const Svg = ICONS[name]
  return <Svg size={size} strokeWidth={1.75} className={`icon ${className}`.trim()} />
}
