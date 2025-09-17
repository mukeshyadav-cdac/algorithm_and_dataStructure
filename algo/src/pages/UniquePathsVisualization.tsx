import { useEffect, useMemo, useState } from 'react'
import { theme } from '../theme'

type Mode = 'DFS' | 'DP'

type CellStatus = 'idle' | 'current' | 'inPath' | 'checking' | 'processed' | 'unprocessed'

interface GridCellState {
  row: number
  col: number
  status: CellStatus
  value?: number
}

interface StepFrame {
  grid: GridCellState[][]
  caption: string
  mode: Mode
  current?: { row: number; col: number }
  path?: Array<{ row: number; col: number }>
  pathsFound?: number
  highlightLines?: number[]
}

function createInitialGrid(rows: number, cols: number): GridCellState[][] {
  return Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => ({ row: r, col: c, status: 'idle' as CellStatus, value: undefined }))
  )
}

function cloneGrid(grid: GridCellState[][]): GridCellState[][] {
  return grid.map(row => row.map(cell => ({ ...cell })))
}

function UniquePathsVisualization() {
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [mode, setMode] = useState<Mode>('DFS')
  const [speedMs, setSpeedMs] = useState(600)
  const [isPlaying, setIsPlaying] = useState(false)
  const [frameIndex, setFrameIndex] = useState(0)

  const frames = useMemo(() => buildFrames(rows, cols, mode), [rows, cols, mode])
  const totalFrames = frames.length
  const current = frames[Math.min(frameIndex, Math.max(totalFrames - 1, 0))]

  useEffect(() => { setFrameIndex(0) }, [rows, cols, mode])

  useEffect(() => {
    if (!isPlaying) return
    if (frameIndex >= totalFrames - 1) { setIsPlaying(false); return }
    const id = setTimeout(() => setFrameIndex(prev => Math.min(prev + 1, totalFrames - 1)), speedMs)
    return () => clearTimeout(id)
  }, [isPlaying, frameIndex, speedMs, totalFrames])

  function reset() {
    setIsPlaying(false)
    setFrameIndex(0)
  }

  function stepOnce() {
    setFrameIndex(i => Math.min(i + 1, Math.max(totalFrames - 1, 0)))
  }

  return (
    <div style={{ padding: theme.spacing.lg, maxWidth: 1200, margin: '0 auto' }}>
      <Header mode={mode} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: theme.spacing.lg }}>
        <div>
          <Controls
            rows={rows}
            cols={cols}
            setRows={setRows}
            setCols={setCols}
            mode={mode}
            setMode={setMode}
            speedMs={speedMs}
            setSpeedMs={setSpeedMs}
            onReset={reset}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onStep={stepOnce}
            isPlaying={isPlaying}
            totalFrames={totalFrames}
            frameIndex={frameIndex}
            setFrameIndex={setFrameIndex}
          />

          <Legend mode={mode} />

          <GridView grid={current?.grid ?? createInitialGrid(rows, cols)} />

          <div style={{ marginTop: theme.spacing.sm, color: theme.colors.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: 999, padding: '2px 8px', fontSize: 12 }}>
              STEP {Math.min(frameIndex + 1, totalFrames)}
            </span>
            <span>{current?.caption}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gap: theme.spacing.md }}>
          <StatsPanel current={current} mode={mode} />
          <CodePanel mode={mode} highlightLines={current?.highlightLines ?? []} />
        </div>
      </div>

      <ProblemLink />
    </div>
  )
}

function Controls(props: {
  rows: number
  cols: number
  setRows: (n: number) => void
  setCols: (n: number) => void
  mode: Mode
  setMode: (m: Mode) => void
  speedMs: number
  setSpeedMs: (n: number) => void
  onReset: () => void
  onPlay: () => void
  onPause: () => void
  onStep: () => void
  isPlaying: boolean
  totalFrames: number
  frameIndex: number
  setFrameIndex: (i: number) => void
}) {
  const { rows, cols, setRows, setCols, mode, setMode, speedMs, setSpeedMs, onReset, onPlay, onPause, onStep, isPlaying, totalFrames, frameIndex, setFrameIndex } = props
  const buttonGroupStyle: React.CSSProperties = { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }
  const primaryBtn: React.CSSProperties = { background: theme.colors.primary, color: theme.colors.primaryText, border: `1px solid ${theme.colors.primary}` }
  const linkBtn: React.CSSProperties = { background: theme.colors.surface, color: theme.colors.primary, border: `1px solid ${theme.colors.border}` }
  const stepperStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8 }
  const stepBtn: React.CSSProperties = { width: 28, height: 28, borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: theme.colors.surface }
  return (
    <div style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.md, padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
      <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap', alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 }}>Rows</div>
          <div style={stepperStyle}>
            <button style={stepBtn} onClick={() => setRows(Math.max(1, rows - 1))}>−</button>
            <span>{rows}</span>
            <button style={stepBtn} onClick={() => setRows(Math.min(12, rows + 1))}>+</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 }}>Columns</div>
          <div style={stepperStyle}>
            <button style={stepBtn} onClick={() => setCols(Math.max(1, cols - 1))}>−</button>
            <span>{cols}</span>
            <button style={stepBtn} onClick={() => setCols(Math.min(12, cols + 1))}>+</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.colors.textMuted, marginBottom: 4 }}>Speed</div>
          <div style={stepperStyle}>
            <button style={stepBtn} onClick={() => setSpeedMs(Math.max(100, speedMs - 100))}>−</button>
            <span>{Math.round(speedMs / 100)}</span>
            <button style={stepBtn} onClick={() => setSpeedMs(Math.min(1500, speedMs + 100))}>+</button>
          </div>
        </div>
        <label>Mode
          <select value={mode} onChange={e => setMode(e.target.value as Mode)}>
            <option value="DFS">DFS</option>
            <option value="DP">Dynamic Programming</option>
          </select>
        </label>
        <a href="https://leetcode.com/problems/unique-paths/" target="_blank" rel="noreferrer">
          <button style={linkBtn}>View Problem</button>
        </a>
      </div>
      <div style={buttonGroupStyle}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setFrameIndex(Math.max(frameIndex - 1, 0))} disabled={frameIndex <= 0}>Step ◀︎</button>
          <button onClick={onStep} disabled={frameIndex >= totalFrames - 1}>Step ▶︎</button>
        </div>
        {!isPlaying ? (
          <button style={primaryBtn} onClick={onPlay} disabled={frameIndex >= totalFrames - 1}>Play</button>
        ) : (
          <button onClick={onPause}>Pause</button>
        )}
        <button onClick={onReset}>Reset</button>
        <span style={{ opacity: 0.7, color: theme.colors.textMuted }}>Frame {Math.min(frameIndex + 1, totalFrames)} / {Math.max(totalFrames, 1)}</span>
      </div>
    </div>
  )
}

function Legend({ mode }: { mode: Mode }) {
  const items = mode === 'DFS'
    ? [
        { label: 'Start Cell (0,0)', color: '#dbeafe' },
        { label: 'Target Cell', color: '#dcfce7' },
        { label: 'Current Cell', color: '#fef3c7' },
        { label: 'Current Path', color: '#fae8ff' },
      ]
    : [
        { label: 'Start Cell (0,0)', color: '#dbeafe' },
        { label: 'End Cell', color: '#dcfce7' },
        { label: 'Current Cell', color: '#fef3c7' },
        { label: 'Checking Neighbors', color: theme.colors.checking },
        { label: 'Processed Cell', color: '#e2e8f0' },
        { label: 'Unprocessed Cell', color: '#ffffff' },
      ]
  return (
    <div style={{ display: 'flex', gap: theme.spacing.md, flexWrap: 'wrap', marginBottom: theme.spacing.sm }}>
      {items.map(it => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: it.color, border: `1px solid ${theme.colors.border}` }} />
          <span style={{ fontSize: 12, color: theme.colors.textMuted }}>{it.label}</span>
        </div>
      ))}
    </div>
  )
}

function ProblemLink() {
  return (
    <div style={{ marginTop: theme.spacing.xl, fontSize: 14, color: theme.colors.textMuted }}>
      Reference: <a href="https://www.dpvisualizer.com/unique-paths-visualization" target="_blank" rel="noreferrer">Unique Paths (DFS and DP) visualization</a>.
    </div>
  )
}

function Header({ mode }: { mode: Mode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
      <h1 style={{ margin: 0 }}>{mode === 'DFS' ? 'DFS Path Finding' : 'Unique Paths DP Visualizer'}</h1>
      <a href="https://leetcode.com/problems/unique-paths/" target="_blank" rel="noreferrer">
        <button style={{ background: theme.colors.surface, color: theme.colors.primary, border: `1px solid ${theme.colors.border}` }}>View Problem</button>
      </a>
    </div>
  )
}

function GridView({ grid }: { grid: GridCellState[][] }) {
  const cols = grid[0]?.length ?? 0
  const getBg = (cell: GridCellState) => {
    if (cell.row === 0 && cell.col === 0) return '#dbeafe'
    if (cell.row === grid.length - 1 && cell.col === cols - 1) return '#dcfce7'
    switch (cell.status) {
      case 'current': return '#fef3c7'
      case 'inPath': return '#fae8ff'
      case 'checking': return theme.colors.checking
      case 'processed': return '#e2e8f0'
      case 'unprocessed': return '#ffffff'
      default: return '#ffffff'
    }
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 40px)`, gap: 6, margin: '12px 0' }}>
      {grid.flat().map(cell => (
        <div
          key={cell.row + '-' + cell.col}
          title={`(${cell.row}, ${cell.col})`}
          style={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            border: `2px solid ${cell.row === grid.length - 1 && cell.col === cols - 1 ? '#ef4444' : theme.colors.border}`,
            background: getBg(cell),
            fontSize: 12,
            position: 'relative',
          }}
        >
          {typeof cell.value === 'number' ? <span style={{ fontWeight: 600 }}>{cell.value}</span> : <span>{cell.row},{cell.col}</span>}
        </div>
      ))}
    </div>
  )
}

function StatsPanel({ current, mode }: { current?: StepFrame, mode: Mode }) {
  if (!current) return null
  return (
    <div style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.md, padding: theme.spacing.md }}>
      <h3 style={{ marginTop: 0 }}>{mode === 'DFS' ? 'DFS Path Finding' : 'Unique Paths DP Visualizer'}</h3>
      {mode === 'DFS' ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 12, color: theme.colors.textMuted }}>STEP</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{(current.path?.length ?? 0) + 1}</div>
          </div>
          <div><b>Current Position:</b> {current.current ? `(${current.current.row}, ${current.current.col})` : '-'}</div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Current Path</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(current.path ?? []).map((p, idx) => (
                <span key={idx} style={{ padding: '2px 6px', borderRadius: 6, background: theme.colors.chipBg, border: `1px solid ${theme.colors.chipBorder}` }}>({p.row}, {p.col})</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 12, color: theme.colors.textMuted }}>PATHS FOUND</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#2563eb' }}>{current.pathsFound ?? 0}</div>
          </div>
        </div>
      ) : (
        <div style={{ fontSize: 14, color: theme.colors.textMuted }}>
          Values inside cells show number of paths to reach that cell. Each cell uses up and left neighbors: value = up + left.
        </div>
      )}
    </div>
  )
}

function buildFrames(rows: number, cols: number, mode: Mode): StepFrame[] {
  if (rows <= 0 || cols <= 0) return []
  return mode === 'DFS' ? buildFramesDfs(rows, cols) : buildFramesDp(rows, cols)
}

function buildFramesDfs(rows: number, cols: number): StepFrame[] {
  const frames: StepFrame[] = []
  const grid = createInitialGrid(rows, cols)
  const path: Array<{ row: number; col: number }> = []
  let pathsFound = 0

  const push = (r: number, c: number, caption: string, mark?: (g: GridCellState[][]) => void, hl?: number[]) => {
    const snapshot = cloneGrid(grid)
    if (mark) mark(snapshot)
    frames.push({ grid: snapshot, caption, mode: 'DFS', current: { row: r, col: c }, path: [...path], pathsFound, highlightLines: hl })
  }

  function dfs(r: number, c: number) {
    if (r >= rows || c >= cols) { push(r, c, 'Out of bounds', undefined, [4]); return }
    path.push({ row: r, col: c })
    grid[r][c].status = 'current'
    push(r, c, `At (${r}, ${c})`, undefined, [6,7])
    grid[r][c].status = 'inPath'
    if (r === rows - 1 && c === cols - 1) {
      pathsFound++
      push(r, c, 'Reached target - path recorded', g => { g[r][c].status = 'processed' }, [5])
      path.pop()
      return
    }
    dfs(r, c + 1)
    dfs(r + 1, c)
    grid[r][c].status = 'processed'
    push(r, c, `Backtrack from (${r}, ${c})`)
    path.pop()
  }

  frames.push({ grid: cloneGrid(grid), caption: 'Start DFS', mode: 'DFS', current: { row: 0, col: 0 }, path: [], pathsFound, highlightLines: [1,9] })
  dfs(0, 0)
  return frames
}

function buildFramesDp(rows: number, cols: number): StepFrame[] {
  const frames: StepFrame[] = []
  const grid = createInitialGrid(rows, cols)
  // initialize unprocessed values to 0 visually
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c].status = 'unprocessed'
      grid[r][c].value = 0
    }
  }
  frames.push({ grid: cloneGrid(grid), caption: 'Initialize DP table with zeros', mode: 'DP', highlightLines: [1] })

  grid[0][0].value = 1
  grid[0][0].status = 'processed'
  frames.push({ grid: cloneGrid(grid), caption: 'Set dp[0][0] = 1 (base case)', mode: 'DP', current: { row: 0, col: 0 }, highlightLines: [2] })

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 && c === 0) continue
      grid[r][c].status = 'checking'
      const up = r > 0 ? grid[r - 1][c].value ?? 0 : 0
      const left = c > 0 ? grid[r][c - 1].value ?? 0 : 0
      frames.push({ grid: cloneGrid(grid), caption: `Compute dp[${r}][${c}] = up(${up}) + left(${left})`, mode: 'DP', current: { row: r, col: c }, highlightLines: [6,7] })
      grid[r][c].value = up + left
      grid[r][c].status = 'processed'
      frames.push({ grid: cloneGrid(grid), caption: `Set dp[${r}][${c}] = ${grid[r][c].value}`, mode: 'DP', current: { row: r, col: c }, highlightLines: [8] })
    }
  }
  frames.push({ grid: cloneGrid(grid), caption: `Answer = dp[${rows - 1}][${cols - 1}] = ${grid[rows - 1][cols - 1].value}`, mode: 'DP', current: { row: rows - 1, col: cols - 1 }, highlightLines: [9] })
  return frames
}

export default UniquePathsVisualization

function CodePanel({ mode, highlightLines }: { mode: Mode, highlightLines: number[] }) {
  const code = mode === 'DFS' ? DFS_CODE : DP_CODE
  return (
    <div style={{ background: theme.colors.surface, border: `1px solid ${theme.colors.border}`, borderRadius: theme.radii.md, padding: theme.spacing.md }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <h3 style={{ margin: 0, fontSize: 16 }}>{mode === 'DFS' ? 'DFS Implementation (JS)' : 'DP Implementation (JS)'}</h3>
      </div>
      <pre style={{ margin: 0, background: theme.colors.surfaceAlt, padding: theme.spacing.md, borderRadius: theme.radii.sm, overflowX: 'auto' }}>
        {code.map((line, idx) => {
          const lineNo = idx + 1
          const isHl = highlightLines.includes(lineNo)
          return (
            <div key={idx} style={{ display: 'flex', gap: 12, background: isHl ? theme.colors.checking : 'transparent' }}>
              <span style={{ width: 28, textAlign: 'right', color: theme.colors.textMuted }}>{lineNo}</span>
              <code style={{ whiteSpace: 'pre' }}>{line}</code>
            </div>
          )
        })}
      </pre>
    </div>
  )
}

const DFS_CODE: string[] = [
  'function uniquePathsDFS(rows, cols) {',
  '  let count = 0;',
  '  function dfs(r, c) {',
  '    if (r >= rows || c >= cols) return;',
  '    if (r === rows - 1 && c === cols - 1) { count++; return; }',
  '    dfs(r, c + 1);',
  '    dfs(r + 1, c);',
  '  }',
  '  dfs(0, 0);',
  '  return count;',
  '}',
]

const DP_CODE: string[] = [
  'function uniquePathsDP(rows, cols) {',
  '  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));',
  '  dp[0][0] = 1;',
  '  for (let r = 0; r < rows; r++) {',
  '    for (let c = 0; c < cols; c++) {',
  '      if (r === 0 && c === 0) continue;',
  '      const up = r > 0 ? dp[r - 1][c] : 0;',
  '      const left = c > 0 ? dp[r][c - 1] : 0;',
  '      dp[r][c] = up + left;',
  '    }',
  '  }',
  '  return dp[rows - 1][cols - 1];',
  '}',
]


