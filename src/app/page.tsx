"use client";

import { useEffect, useMemo, useState } from "react";
import AppHeader from "../components/AppHeader";
import StageConfig from "../components/StageConfig";
import StageSim from "../components/StageSim";
import StageStats from "../components/StageStats";
import { ALGORITHMS } from "../lib/constants";
import { simulateSchedule } from "../lib/scheduler";
import { createEmptyProcess, formatNumber } from "../lib/utils";
import type {
  AlgorithmId,
  MetricsSummary,
  Process,
  SimulationResult,
} from "../lib/types";

type FormValues = {
  arrival: string;
  burst: string;
  priority: string;
};

const INITIAL_PROCESSES: Process[] = [
  { id: "P1", arrival: 0, burst: 5, priority: 2 },
  { id: "P2", arrival: 2, burst: 3, priority: 1 },
  { id: "P3", arrival: 4, burst: 4, priority: 3 },
];

const INITIAL_FORM: FormValues = {
  arrival: "0",
  burst: "1",
  priority: "1",
};

export default function Home() {
  const [stage, setStage] = useState(1);
  const [algorithm, setAlgorithm] = useState<AlgorithmId>("fcfs");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [processes, setProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);

  const selectedAlgorithm = ALGORITHMS.find((item) => item.id === algorithm);

  const totalBurst = useMemo(
    () => processes.reduce((sum, process) => sum + process.burst, 0),
    [processes]
  );

  const metrics = useMemo<MetricsSummary | null>(() => {
    if (!simulation) {
      return null;
    }
    const rows = processes.map((process) => {
      const completion =
        simulation.completionTimes[process.id] ?? simulation.totalTime;
      const turnaround = completion - process.arrival;
      const waiting = turnaround - process.burst;
      return { ...process, completion, turnaround, waiting };
    });
    const avgWaiting =
      rows.reduce((sum, row) => sum + row.waiting, 0) /
      Math.max(1, rows.length);
    const avgTurnaround =
      rows.reduce((sum, row) => sum + row.turnaround, 0) /
      Math.max(1, rows.length);
    const idlePercent =
      simulation.totalTime > 0
        ? (simulation.idleTime / simulation.totalTime) * 100
        : 0;
    const efficiency =
      simulation.totalTime > 0 ? (totalBurst / simulation.totalTime) * 100 : 0;

    return { rows, avgWaiting, avgTurnaround, idlePercent, efficiency };
  }, [simulation, processes, totalBurst]);

  const maxTime = simulation?.totalTime ?? 0;
  const currentSnapshot = simulation?.snapshots[currentTime] ?? null;
  const runningProcess = currentSnapshot?.running
    ? processes.find((process) => process.id === currentSnapshot.running) ??
      null
    : null;
  const executedTimes = useMemo(() => {
    if (!simulation) {
      return {} as Record<string, number>;
    }
    const totals: Record<string, number> = {};
    simulation.timeline.forEach((segment) => {
      if (segment.pid === "IDLE") {
        return;
      }
      const end = Math.min(segment.end, currentTime);
      const duration = Math.max(0, end - segment.start);
      if (duration > 0) {
        totals[segment.pid] = (totals[segment.pid] ?? 0) + duration;
      }
    });
    return totals;
  }, [simulation, currentTime]);
  const activeExecution = runningProcess
    ? executedTimes[runningProcess.id] ?? 0
    : 0;
  const activeRemaining = runningProcess
    ? Math.max(0, runningProcess.burst - activeExecution)
    : 0;
  const activeProgress =
    runningProcess && runningProcess.burst > 0
      ? (activeExecution / runningProcess.burst) * 100
      : 0;

  useEffect(() => {
    if (!isPlaying || !simulation) {
      return;
    }
    if (currentTime >= simulation.totalTime) {
      setIsPlaying(false);
      return;
    }
    const interval = window.setInterval(() => {
      setCurrentTime((value) => {
        if (!simulation) {
          return value;
        }
        const next = value + 1;
        if (next >= simulation.totalTime) {
          window.clearInterval(interval);
          setIsPlaying(false);
        }
        return Math.min(next, simulation.totalTime);
      });
    }, Math.max(120, 600 / speed));

    return () => window.clearInterval(interval);
  }, [isPlaying, simulation, currentTime, speed]);

  const handleFormChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  };

  const validateInput = () => {
    const arrival = Number(formValues.arrival);
    const burst = Number(formValues.burst);
    const priority = Number(formValues.priority);
    if (Number.isNaN(arrival) || arrival < 0) {
      return "Arrival time must be 0 or greater.";
    }
    if (Number.isNaN(burst) || burst <= 0) {
      return "Burst time must be greater than 0.";
    }
    if (Number.isNaN(priority) || priority < 0) {
      return "Priority must be 0 or greater.";
    }
    if (processes.length >= 10 && !editingId) {
      return "Supports up to 10 processes for this simulation.";
    }
    return "";
  };

  const handleSubmit = () => {
    const error = validateInput();
    if (error) {
      setFormError(error);
      return;
    }
    const arrival = Number(formValues.arrival);
    const burst = Number(formValues.burst);
    const priority = Number(formValues.priority);

    if (editingId) {
      setProcesses((prev) =>
        prev.map((process) =>
          process.id === editingId
            ? { ...process, arrival, burst, priority }
            : process
        )
      );
      setEditingId(null);
    } else {
      const nextId =
        processes.reduce((maxId, process) => {
          const numericId = Number(process.id.replace("P", ""));
          if (Number.isNaN(numericId)) {
            return maxId;
          }
          return Math.max(maxId, numericId);
        }, 0) + 1;
      setProcesses((prev) => [
        ...prev,
        { id: `P${nextId}`, arrival, burst, priority },
      ]);
    }
  };

  const handleEdit = (process: Process) => {
    setEditingId(process.id);
    setFormValues({
      arrival: String(process.arrival),
      burst: String(process.burst),
      priority: String(process.priority),
    });
    setFormError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormError("");
    setFormValues(INITIAL_FORM);
  };

  const handleDelete = (processId: string) => {
    setProcesses((prev) => prev.filter((process) => process.id !== processId));
    if (editingId === processId) {
      setEditingId(null);
    }
  };

  const handleGenerateRandom = () => {
    const count = 5;
    const generated = Array.from({ length: count }, (_, index) => ({
      ...createEmptyProcess(index + 1),
      arrival: Math.floor(Math.random() * 6),
      burst: Math.floor(Math.random() * 7) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
    }));
    setProcesses(generated);
  };

  const handleResetAll = () => {
    setProcesses([]);
    setEditingId(null);
    setFormValues(INITIAL_FORM);
  };

  const startSimulation = () => {
    if (!processes.length) {
      setFormError("Add at least one process before visualizing.");
      return;
    }
    if (algorithm === "rr" && timeQuantum <= 0) {
      setFormError("Time quantum must be at least 1 for Round Robin.");
      return;
    }
    const result = simulateSchedule(processes, algorithm, timeQuantum);
    setSimulation(result);
    setCurrentTime(0);
    setIsPlaying(false);
    setStage(2);
  };


  const queueOrder = currentSnapshot?.readyQueue ?? [];

  const canViewStats = Boolean(metrics) && currentTime >= maxTime;

  const handleZoomChange = (value: number) => {
    setZoom(Math.min(2, Math.max(0.6, value)));
  };

  const handleStageChange = (nextStage: number) => {
    if (nextStage === 2 && !simulation) {
      return;
    }
    if (nextStage === 3 && !metrics) {
      return;
    }
    setStage(nextStage);
  };

  return (
    <div className="app-shell">
      <AppHeader stage={stage} onStageChange={handleStageChange} />

      {stage === 1 && (
        <StageConfig
          algorithm={algorithm}
          timeQuantum={timeQuantum}
          processes={processes}
          formValues={formValues}
          editingId={editingId}
          formError={formError}
          totalBurst={totalBurst}
          selectedAlgorithmName={selectedAlgorithm?.name}
          onAlgorithmChange={setAlgorithm}
          onTimeQuantumChange={setTimeQuantum}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGenerateRandom={handleGenerateRandom}
          onResetAll={handleResetAll}
          onVisualize={startSimulation}
          onCancelEdit={handleCancelEdit}
        />
      )}

      {stage === 2 && (
        <StageSim
          selectedAlgorithm={selectedAlgorithm}
          currentTime={currentTime}
          maxTime={maxTime}
          isPlaying={isPlaying}
          speed={speed}
          zoom={zoom}
          runningProcess={runningProcess}
          activeProgress={activeProgress}
          activeRemaining={activeRemaining}
          simulation={simulation}
          currentSnapshot={currentSnapshot}
          queueOrder={queueOrder}
          processes={processes}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onReset={() => setCurrentTime(0)}
          onStep={() => setCurrentTime((value) => Math.min(value + 1, maxTime))}
          onSpeedChange={setSpeed}
          onZoomChange={handleZoomChange}
          onBack={() => setStage(1)}
          onViewStats={() => setStage(3)}
          canViewStats={canViewStats}
        />
      )}

      {stage === 3 && metrics && (
        <StageStats
          metrics={metrics}
          selectedAlgorithmName={selectedAlgorithm?.name}
          onRestart={() => {
            setCurrentTime(0);
            setStage(2);
          }}
          onNewConfig={() => setStage(1)}
          formatNumber={formatNumber}
        />
      )}
    </div>
  );
}
