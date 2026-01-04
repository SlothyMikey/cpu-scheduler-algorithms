export type AlgorithmId = "fcfs" | "sjf" | "rr" | "priority";

export type Process = {
  id: string;
  arrival: number;
  burst: number;
  priority: number;
};

export type TimelineSegment = {
  pid: string;
  start: number;
  end: number;
};

export type Snapshot = {
  time: number;
  running: string | null;
  readyQueue: string[];
};

export type SimulationResult = {
  timeline: TimelineSegment[];
  snapshots: Snapshot[];
  completionTimes: Record<string, number>;
  totalTime: number;
  idleTime: number;
};

export type MetricsRow = Process & {
  completion: number;
  turnaround: number;
  waiting: number;
};

export type MetricsSummary = {
  rows: MetricsRow[];
  avgWaiting: number;
  avgTurnaround: number;
  idlePercent: number;
  efficiency: number;
};
