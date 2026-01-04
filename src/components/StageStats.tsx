import type { MetricsSummary } from "../lib/types";

type StageStatsProps = {
  metrics: MetricsSummary;
  selectedAlgorithmName?: string;
  onRestart: () => void;
  onNewConfig: () => void;
  formatNumber: (value: number) => string;
};

export default function StageStats({
  metrics,
  selectedAlgorithmName,
  onRestart,
  onNewConfig,
  formatNumber,
}: StageStatsProps) {
  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-[rise_0.6s_ease-out]">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Performance Results
        </h1>
        <p className="text-muted text-lg">
          Detailed analysis and statistics for the simulated scheduling
          algorithm.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Avg. Turnaround Time
            </div>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">
            {formatNumber(metrics.avgTurnaround)}{" "}
            <span className="text-lg text-muted font-normal">ms</span>
          </div>
          <p className="text-sm text-muted">
            Average time to complete a process
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-transparent opacity-50" />
        </div>

        <div className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Avg. Waiting Time
            </div>
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M5 22h14" />
                <path d="M5 2h14" />
                <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
                <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">
            {formatNumber(metrics.avgWaiting)}{" "}
            <span className="text-lg text-muted font-normal">ms</span>
          </div>
          <p className="text-sm text-muted">
            Average time spent in ready queue
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent to-transparent opacity-50" />
        </div>
      </div>

      {/* Detailed Statistics Table */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M3 3v18h18" />
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Detailed Process Statistics</h2>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border text-xs font-bold text-muted uppercase tracking-wider bg-muted/5">
            <div className="col-span-2">Process ID</div>
            <div className="col-span-2">Arrival</div>
            <div className="col-span-2">Burst</div>
            <div className="col-span-2">Completion</div>
            <div className="col-span-2 text-accent">Turnaround</div>
            <div className="col-span-2 text-accent">Waiting</div>
          </div>

          <div className="divide-y divide-border">
            {metrics.rows.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-12 gap-4 p-4 text-sm hover:bg-muted/5 transition-colors"
              >
                <div className="col-span-2 font-medium text-foreground">
                  {row.id}
                </div>
                <div className="col-span-2 text-muted">{row.arrival} ms</div>
                <div className="col-span-2 text-muted">{row.burst} ms</div>
                <div className="col-span-2 text-muted">{row.completion} ms</div>
                <div className="col-span-2 font-bold text-foreground">
                  {row.turnaround} ms
                </div>
                <div className="col-span-2 font-bold text-foreground">
                  {row.waiting} ms
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted/5 border-t border-border flex justify-between items-center text-xs text-muted">
            <div>
              Showing statistics for{" "}
              <span className="font-bold text-foreground">
                {selectedAlgorithmName ?? "selected"}
              </span>{" "}
              algorithm
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-muted" />
                System Idle: {formatNumber(metrics.idlePercent)}%
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                Efficiency: {formatNumber(metrics.efficiency)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-2 border-border p-4 lg:px-8 max-w-screen-lg mx-auto rounded-lg z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-muted text-sm">
            <span className="font-bold text-foreground">
              Simulation Complete
            </span>{" "}
            View results above or start a new simulation.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onRestart}
              className="text-muted hover:text-foreground hover:cursor-pointer text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Restart
            </button>
            <button
              onClick={onNewConfig}
              className="bg-foreground text-background hover:cursor-pointer hover:bg-gray-200 font-bold rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
              </svg>
              New Config
            </button>
          </div>
        </div>
      </div>
      {/* Spacer for fixed footer */}
      <div className="h-20" />
    </main>
  );
}
