import { ALGORITHMS } from "../lib/constants";
import type { AlgorithmId, Process } from "../lib/types";

type FormValues = {
  arrival: string;
  burst: string;
  priority: string;
};

type StageConfigProps = {
  algorithm: AlgorithmId;
  timeQuantum: number;
  processes: Process[];
  formValues: FormValues;
  editingId: string | null;
  formError: string;
  totalBurst: number;
  selectedAlgorithmName?: string;
  onAlgorithmChange: (id: AlgorithmId) => void;
  onTimeQuantumChange: (value: number) => void;
  onFormChange: (field: keyof FormValues, value: string) => void;
  onSubmit: () => void;
  onEdit: (process: Process) => void;
  onDelete: (processId: string) => void;
  onGenerateRandom: () => void;
  onResetAll: () => void;
  onVisualize: () => void;
  onCancelEdit: () => void;
};

export default function StageConfig({
  algorithm,
  timeQuantum,
  processes,
  formValues,
  editingId,
  formError,
  totalBurst,
  selectedAlgorithmName,
  onAlgorithmChange,
  onTimeQuantumChange,
  onFormChange,
  onSubmit,
  onEdit,
  onDelete,
  onGenerateRandom,
  onResetAll,
  onVisualize,
  onCancelEdit,
}: StageConfigProps) {
  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-8 animate-[rise_0.6s_ease-out]">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Configure Simulation
        </h1>
        <p className="text-muted text-lg">
          Select a scheduling algorithm and define your processes to begin the
          visualization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Algorithm Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-muted/20 text-sm font-mono text-muted">
              1
            </span>
            <h2 className="text-xl font-semibold">Choose Algorithm</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ALGORITHMS.map((item) => {
              const isSelected = algorithm === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAlgorithmChange(item.id)}
                  className={`relative p-4 text-left rounded-xl border transition-all duration-200 h-full flex flex-col justify-between group hover:border-muted/50 hover:cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className={`w-8 h-8 ${
                        isSelected
                          ? "text-accent"
                          : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="font-bold text-lg mb-1">{item.name}</div>
                      <div className="text-xs text-muted leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-3 right-3 text-accent">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 flex gap-4 items-start">
            <div className="text-accent mt-1">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <div className="space-y-2 text-sm text-muted leading-relaxed">
              <h3 className="font-semibold text-foreground">
                {ALGORITHMS.find((a) => a.id === algorithm)?.name ||
                  "Algorithm"}{" "}
                Guide
              </h3>
              <p>
                {ALGORITHMS.find((a) => a.id === algorithm)?.description ||
                  "Select an algorithm to see how processes are scheduled."}
              </p>
              {algorithm === "rr" && (
                <div className="pt-2">
                  <label
                    htmlFor="quantum"
                    className="block text-xs font-medium text-foreground mb-1.5"
                  >
                    Time Quantum (ms)
                  </label>
                  <input
                    id="quantum"
                    type="number"
                    min={1}
                    value={timeQuantum || ""}
                    onChange={(e) =>
                      onTimeQuantumChange(Number(e.target.value))
                    }
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-sm focus:border-accent focus:outline-none transition-colors"
                    placeholder="1"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Process Input */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded bg-muted/20 text-sm font-mono text-muted">
                2
              </span>
              <h2 className="text-xl font-semibold">Process Input</h2>
            </div>
            <button
              type="button"
              onClick={onGenerateRandom}
              className="text-accent hover:text-accent-strong text-sm font-medium flex items-center gap-2 transition-colors hover:cursor-pointer"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M2 12h20M2 12l4-4m-4 4l4 4M22 4l-4 4M22 4h-8M22 20l-4-4M22 20h-8" />
              </svg>
              Generate Random Data
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-muted uppercase tracking-wider">
                Add New Process
              </div>
              <div className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-3 space-y-1.5">
                  <label className="text-xs text-muted">Arrival Time</label>
                  <input
                    type="number"
                    min={0}
                    value={formValues.arrival}
                    onChange={(e) => onFormChange("arrival", e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <label className="text-xs text-muted">Burst Time</label>
                  <input
                    type="number"
                    min={1}
                    value={formValues.burst}
                    onChange={(e) => onFormChange("burst", e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none transition-colors"
                    placeholder="5"
                  />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <label className="text-xs text-muted">Priority</label>
                  <input
                    type="number"
                    min={1}
                    value={formValues.priority}
                    onChange={(e) => onFormChange("priority", e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-accent focus:outline-none transition-colors"
                    placeholder="1"
                  />
                </div>
                <div className="col-span-3 flex gap-2">
                  <button
                    type="button"
                    onClick={onSubmit}
                    className="flex-1 bg-foreground text-background hover:bg-white/85 font-semibold rounded-lg px-4 py-2 text-sm transition-colors flex items-center justify-center gap-2 hover:cursor-pointer"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-4 h-4"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    {editingId ? "Update" : "Add"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={onCancelEdit}
                      className="px-3 py-2 rounded-lg border border-border hover:bg-muted/10 text-muted hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              {formError && <p className="text-red-400 text-xs">{formError}</p>}
            </div>

            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-12 gap-4 text-xs font-bold text-muted uppercase tracking-wider mb-4 px-2">
                <div className="col-span-3">ID</div>
                <div className="col-span-3">Arrival</div>
                <div className="col-span-3">Burst</div>
                <div className="col-span-2">Priority</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              <div className="space-y-1">
                {processes.map((process) => (
                  <div
                    key={process.id}
                    className="grid grid-cols-12 gap-4 items-center px-2 py-3 rounded-lg hover:bg-muted/5 transition-colors text-sm"
                  >
                    <div className="col-span-3 flex items-center gap-3 font-medium">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                      {process.id}
                    </div>
                    <div className="col-span-3 text-muted">
                      {process.arrival}
                    </div>
                    <div className="col-span-3 text-muted">{process.burst}</div>
                    <div className="col-span-2 text-muted">
                      {process.priority}
                    </div>
                    <div className="col-span-1 flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(process)}
                        className="text-muted hover:text-foreground hover:cursor-pointer transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onDelete(process.id)}
                        className="text-muted hover:text-red-400 hover:cursor-pointer transition-colors"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-4 h-4"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-between text-xs text-muted">
                <span>{processes.length} Processes Added</span>
                <span>Total Burst: {totalBurst}ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 mx-auto bg-background/80 backdrop-blur-md border-2 border-border p-4 lg:px-8 max-w-screen-lg rounded-lg z-50">
        <div className="max-w-screen-lg mx-auto flex items-center justify-between">
          <div className="text-muted text-sm">
            <span className="font-bold text-foreground">Ready to start?</span>{" "}
            Selected: {selectedAlgorithmName ?? "None"} with {processes.length}{" "}
            processes.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onResetAll}
              className="text-muted hover:text-foreground text-sm font-medium transition-colors hover:cursor-pointer"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={onVisualize}
              className="bg-foreground text-background hover:bg-foreground/85 hover:cursor-pointer font-bold rounded-lg px-6 py-2.5 text-sm transition-colors flex items-center gap-2"
            >
              Visualize
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-4 h-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Spacer for fixed footer */}
      <div className="h-20" />
    </main>
  );
}
