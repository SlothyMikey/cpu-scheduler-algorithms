import type { AlgorithmOption } from "../lib/constants";
import type { Process, SimulationResult, Snapshot } from "../lib/types";

type StageSimProps = {
  selectedAlgorithm?: AlgorithmOption;
  currentTime: number;
  maxTime: number;
  isPlaying: boolean;
  speed: number;
  zoom: number;
  runningProcess: Process | null;
  activeProgress: number;
  activeRemaining: number;
  simulation: SimulationResult | null;
  currentSnapshot: Snapshot | null;
  queueOrder: string[];
  processes: Process[];
  onTogglePlay: () => void;
  onReset: () => void;
  onStep: () => void;
  onSpeedChange: (value: number) => void;
  onZoomChange: (value: number) => void;
  onBack: () => void;
  onViewStats: () => void;
  canViewStats: boolean;
};

export default function StageSim({
  selectedAlgorithm,
  currentTime,
  maxTime,
  isPlaying,
  speed,
  zoom,
  runningProcess,
  activeProgress,
  activeRemaining,
  simulation,
  currentSnapshot,
  queueOrder,
  processes,
  onTogglePlay,
  onReset,
  onStep,
  onSpeedChange,
  onZoomChange,
  onBack,
  onViewStats,
  canViewStats,
}: StageSimProps) {
  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-6 animate-[rise_0.6s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold text-foreground">
            {selectedAlgorithm?.name} Simulation
          </h2>
          <span className="px-3 py-1 rounded text-xs font-bold bg-muted/20 text-muted tracking-wider uppercase">
            {selectedAlgorithm?.badge}
          </span>
        </div>
        <div className="flex items-center gap-4 px-5 py-2.5 bg-card border border-border rounded-xl">
          <div className="text-right">
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">
              Global Timer
            </div>
            <div className="text-2xl font-mono font-bold leading-none">
              {currentTime}{" "}
              <span className="text-sm text-muted font-sans">ms</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Controls & Active Process */}
        <div className="lg:col-span-3 space-y-6">
          {/* Simulation Control */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                Simulation Control
              </h3>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPlaying ? "bg-accent animate-pulse" : "bg-muted"
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    isPlaying ? "text-accent" : "text-muted"
                  }`}
                >
                  {isPlaying ? "LIVE" : "PAUSED"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={onReset}
                className="text-muted hover:text-foreground transition-colors"
                title="Reset"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5"
                >
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>

              <button
                onClick={onTogglePlay}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 ${
                  isPlaying
                    ? "bg-accent text-card-strong"
                    : "bg-accent text-card-strong"
                }`}
              >
                {isPlaying ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 ml-1"
                  >
                    <path d="M5 3l14 9-14 9V3z" />
                  </svg>
                )}
              </button>

              <button
                onClick={onStep}
                className="text-muted hover:text-foreground transition-colors"
                title="Step Forward"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M5 4l10 8-10 8V4zM19 4v16h-2V4h2z" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-xs font-bold text-muted uppercase tracking-wider">
                <span>Speed Multiplier</span>
                <span className="text-accent">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2}
                step={0.25}
                value={speed}
                onChange={(e) => onSpeedChange(Number(e.target.value))}
                className="w-full h-1.5 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>

          {/* Active Process */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-muted uppercase tracking-wider">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4 text-accent"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              CPU Active Process
            </div>

            {runningProcess ? (
              <div className="space-y-6">
                <div className="flex justify-center py-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent to-accent-strong flex flex-col items-center justify-center text-card-strong">
                    <span className="text-3xl font-bold">
                      {runningProcess.id}
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <div className="text-lg font-bold">
                    Process {runningProcess.id.replace("P", "")}
                  </div>
                  <div className="flex justify-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-muted/10 text-muted text-[10px] font-mono border border-border">
                      Priority: {runningProcess.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-muted/10 text-muted text-[10px] font-mono border border-border">
                      Burst: {runningProcess.burst}ms
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Execution Progress</span>
                    <span>{Math.round(activeProgress)}%</span>
                  </div>
                  <div className="h-2 bg-muted/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent transition-all duration-300 ease-linear"
                      style={{ width: `${activeProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted font-mono">
                    <span>0ms</span>
                    <span>Remaining: {activeRemaining}ms</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center text-muted space-y-3 opacity-50">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted flex items-center justify-center">
                  <span className="text-xs font-bold">IDLE</span>
                </div>
                <p className="text-sm">No process executing</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="w-3 h-3 rounded bg-accent" />
              Running (CPU)
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="w-3 h-3 rounded bg-accent/20 border border-accent/50" />
              Waiting (Ready Queue)
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="w-3 h-3 rounded bg-muted/20" />
              Completed
            </div>
          </div>
        </div>

        {/* Right Column: Gantt & Tables */}
        <div className="lg:col-span-9 space-y-6">
          {/* Gantt Chart */}
          <div className="bg-card border border-border rounded-xl p-6 h-[320px] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-5 h-5 text-muted"
                >
                  <path d="M3 3v18h18" />
                  <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
                <h3 className="font-bold text-foreground">
                  Gantt Chart Visualization
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-muted/10 rounded-lg p-1">
                <button
                  onClick={() => onZoomChange(zoom - 0.2)}
                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-foreground hover:bg-muted/20 rounded transition-colors"
                >
                  -
                </button>
                <span className="text-xs font-mono w-12 text-center text-muted">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => onZoomChange(zoom + 0.2)}
                  className="w-6 h-6 flex items-center justify-center text-muted hover:text-foreground hover:bg-muted/20 rounded transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 relative overflow-hidden border border-border/50 rounded-lg bg-background/50">
              <div className="absolute inset-0 overflow-x-auto custom-scrollbar">
                <div
                  className="h-full min-w-full relative"
                  style={{ width: `100%` }}
                >
                  {/* Grid Lines */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--border) 1px, transparent 1px)",
                      backgroundSize: `${40 * zoom}px 100%`,
                      opacity: 0.1,
                    }}
                  />

                  {/* Timeline Blocks */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 h-16 flex items-center">
                    {simulation?.timeline.map((segment, i) => {
                      const duration = segment.end - segment.start;
                      const isCurrent =
                        segment.start <= currentTime &&
                        currentTime < segment.end;
                      const isPast = segment.end <= currentTime;

                      return (
                        <div
                          key={`${segment.pid}-${segment.start}-${i}`}
                          className={`absolute h-12 rounded-md flex items-center justify-center text-xs font-bold border transition-all duration-300 ${
                            segment.pid === "IDLE"
                              ? "bg-transparent border-dashed border-muted/30 text-muted/50"
                              : isCurrent
                              ? "bg-accent text-card-strong border-accent z-10 scale-105"
                              : "bg-accent/10 text-accent border-accent/30"
                          }`}
                          style={{
                            left: `${segment.start * 40 * zoom}px`,
                            width: `${duration * 40 * zoom}px`,
                            opacity: isPast || isCurrent ? 1 : 0.3,
                          }}
                        >
                          {segment.pid !== "IDLE" && segment.pid}
                          {isCurrent && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-card-strong rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Current Time Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-px bg-accent z-20 transition-all duration-300 ease-linear"
                      style={{ left: `${currentTime * 40 * zoom}px` }}
                    >
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-accent text-card-strong text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {currentTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Axis Labels */}
            <div className="h-6 mt-2 relative overflow-hidden">
              {/* Simplified axis for visual cleanliness - could be enhanced */}
              <div className="text-[10px] text-muted flex justify-between px-1">
                <span>0</span>
                <span>{maxTime}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ready Queue */}
            <div className="bg-card border border-border rounded-xl p-6 h-[240px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4 text-muted"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                    Ready Queue
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-muted/10 text-muted px-2 py-1 rounded border border-border">
                  FIFO ORDER
                </span>
              </div>

              <div className="flex-1 flex items-center gap-4 overflow-x-auto custom-scrollbar pb-2">
                <div className="text-[10px] font-bold text-muted/50 -rotate-90 whitespace-nowrap">
                  HEAD
                </div>
                {queueOrder.length > 0 ? (
                  queueOrder.map((pid, index) => {
                    const process = processes.find((p) => p.id === pid);
                    return (
                      <div key={pid} className="flex items-center">
                        <div className="w-16 h-16 rounded-xl bg-accent/10 border border-accent/30 flex flex-col items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-accent">
                            {pid}
                          </span>
                        </div>
                        {index < queueOrder.length - 1 && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-4 h-4 text-muted/30 mx-2 shrink-0"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="w-16 h-16 rounded-xl border border-dashed border-border flex items-center justify-center text-[10px] text-muted">
                    Empty
                  </div>
                )}
              </div>
            </div>

            {/* Process Status */}
            <div className="bg-card border border-border rounded-xl p-6 h-[240px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-4 h-4 text-muted"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-xs font-bold text-muted uppercase tracking-wider">
                    Process Status
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-muted">
                  {processes.length} Total
                </span>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] text-muted uppercase border-b border-border">
                      <th className="pb-2 font-bold pl-2">PID</th>
                      <th className="pb-2 font-bold">Burst</th>
                      <th className="pb-2 font-bold">Arrival</th>
                      <th className="pb-2 font-bold text-right pr-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {processes.map((process) => {
                      const completion =
                        simulation?.completionTimes[process.id] ?? 0;
                      let status = "READY";
                      let statusClass = "text-muted border border-border";
                      let icon = (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-3 h-3"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      );

                      if (completion && currentTime >= completion) {
                        status = "DONE";
                        statusClass =
                          "text-accent bg-accent/10 border border-accent/20";
                        icon = (
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-3 h-3"
                          >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        );
                      } else if (currentSnapshot?.running === process.id) {
                        status = "RUNNING";
                        statusClass = "text-accent animate-pulse";
                        icon = (
                          <div className="w-2 h-2 rounded-full bg-accent" />
                        );
                      } else if (currentTime < process.arrival) {
                        status = "PENDING";
                        statusClass = "text-muted opacity-50";
                      }

                      return (
                        <tr
                          key={process.id}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="py-2.5 pl-2 font-medium">
                            {process.id}
                          </td>
                          <td className="py-2.5 text-muted">
                            {process.burst}ms
                          </td>
                          <td className="py-2.5 text-muted">
                            {process.arrival}ms
                          </td>
                          <td className="py-2.5 text-right pr-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusClass}`}
                            >
                              {icon}
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-2 border-border p-4 lg:px-8 z-50 max-w-screen-lg mx-auto rounded-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2V4z" />
              </svg>
            </div>
            <div className="text-sm text-muted">
              Simulation in progress.{" "}
              <strong className="text-foreground">
                {processes.length} processes
              </strong>{" "}
              loaded. Modifying input requires reset.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-bold text-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Input
            </button>
            <button
              onClick={onViewStats}
              disabled={!canViewStats}
              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors flex items-center gap-2 ${
                canViewStats
                  ? "border-border/50 bg-foreground hover:bg-foreground/85 text-background cursor-pointer"
                  : "border-border/50 text-muted/50 cursor-not-allowed"
              }`}
              title={canViewStats ? "" : "Simulate First to View Statistics"}
            >
              View Statistics
              {!canViewStats && (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3 h-3"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Spacer for fixed footer */}
      <div className="h-20" />
    </main>
  );
}
