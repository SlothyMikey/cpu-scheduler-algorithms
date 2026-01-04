import type {
  AlgorithmId,
  Process,
  SimulationResult,
  Snapshot,
  TimelineSegment,
} from "./types";

export const simulateSchedule = (
  processes: Process[],
  algorithm: AlgorithmId,
  quantum: number
): SimulationResult => {
  const sorted = [...processes].sort(
    (a, b) => a.arrival - b.arrival || a.id.localeCompare(b.id)
  );
  const processMap = new Map(sorted.map((process) => [process.id, process]));
  const remaining = new Map(
    sorted.map((process) => [process.id, process.burst])
  );
  const completionTimes: Record<string, number> = {};
  const timeline: TimelineSegment[] = [];
  const snapshots: Snapshot[] = [];
  let time = 0;
  let completed = 0;
  let current: string | null = null;
  let timeSliceRemaining = 0;
  let arrivalIndex = 0;
  const readyQueue: Process[] = [];

  const addSegment = (pid: string, start: number, end: number) => {
    const last = timeline[timeline.length - 1];
    if (last && last.pid === pid && last.end === start) {
      last.end = end;
      return;
    }
    timeline.push({ pid, start, end });
  };

  const pickNext = () => {
    if (readyQueue.length === 0) {
      return null;
    }
    if (algorithm === "sjf") {
      let bestIndex = 0;
      let bestBurst = Infinity;
      readyQueue.forEach((process, index) => {
        const remainingTime = remaining.get(process.id) ?? process.burst;
        if (
          remainingTime < bestBurst ||
          (remainingTime === bestBurst &&
            process.arrival < readyQueue[bestIndex].arrival)
        ) {
          bestIndex = index;
          bestBurst = remainingTime;
        }
      });
      return readyQueue.splice(bestIndex, 1)[0];
    }
    if (algorithm === "priority") {
      let bestIndex = 0;
      let bestPriority = Infinity;
      readyQueue.forEach((process, index) => {
        if (
          process.priority < bestPriority ||
          (process.priority === bestPriority &&
            process.arrival < readyQueue[bestIndex].arrival)
        ) {
          bestIndex = index;
          bestPriority = process.priority;
        }
      });
      return readyQueue.splice(bestIndex, 1)[0];
    }
    return readyQueue.shift() ?? null;
  };

  while (completed < sorted.length) {
    while (
      arrivalIndex < sorted.length &&
      sorted[arrivalIndex].arrival <= time
    ) {
      readyQueue.push(sorted[arrivalIndex]);
      arrivalIndex += 1;
    }

    if (!current) {
      const nextProcess = pickNext();
      if (!nextProcess) {
        addSegment("IDLE", time, time + 1);
        snapshots.push({
          time,
          running: null,
          readyQueue: readyQueue.map((process) => process.id),
        });
        time += 1;
        continue;
      }
      current = nextProcess.id;
      if (algorithm === "rr") {
        timeSliceRemaining = Math.max(1, Math.floor(quantum));
      }
    }

    addSegment(current, time, time + 1);
    snapshots.push({
      time,
      running: current,
      readyQueue: readyQueue.map((process) => process.id),
    });
    const updatedRemaining = (remaining.get(current) ?? 1) - 1;
    remaining.set(current, updatedRemaining);
    if (algorithm === "rr") {
      timeSliceRemaining -= 1;
    }

    if (updatedRemaining <= 0) {
      completionTimes[current] = time + 1;
      completed += 1;
      current = null;
      timeSliceRemaining = 0;
    } else if (algorithm === "rr" && timeSliceRemaining <= 0) {
      const process = processMap.get(current);
      if (process) {
        readyQueue.push(process);
      }
      current = null;
    }

    time += 1;
  }

  const idleTime = timeline.reduce(
    (sum, segment) =>
      sum + (segment.pid === "IDLE" ? segment.end - segment.start : 0),
    0
  );

  return {
    timeline,
    snapshots,
    completionTimes,
    totalTime: time,
    idleTime,
  };
};
