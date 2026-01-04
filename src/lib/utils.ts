import type { Process } from "./types";

export const formatNumber = (value: number) => value.toFixed(2);

export const createEmptyProcess = (id: number): Process => ({
  id: `P${id}`,
  arrival: 0,
  burst: 1,
  priority: 1,
});

export const toCsv = (rows: string[][]) =>
  rows.map((row) => row.map((value) => `"${value}"`).join(",")).join("\n");
