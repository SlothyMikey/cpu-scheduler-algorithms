import { JSX } from "react";
import type { AlgorithmId } from "./types";

export type AlgorithmOption = {
  id: AlgorithmId;
  name: string;
  subtitle: string;
  description: string;
  badge: string;
  preemptive: boolean;
  icon: JSX.Element;
};

export const ALGORITHMS: AlgorithmOption[] = [
  {
    id: "fcfs",
    name: "FCFS",
    subtitle: "First Come First Serve. Non-preemptive.",
    description: "First Come First Serve. Non-preemptive.",
    badge: "NON-PREEMPTIVE",
    preemptive: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    id: "sjf",
    name: "SJF",
    subtitle: "Shortest Job First. Minimizes waiting time.",
    description: "Shortest Job First. Minimizes waiting time.",
    badge: "NON-PREEMPTIVE",
    preemptive: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 10h16M4 14h10M4 18h6" />
      </svg>
    ),
  },
  {
    id: "rr",
    name: "Round Robin",
    subtitle: "Time slicing. Requires Time Quantum.",
    description: "Time slicing. Requires Time Quantum.",
    badge: "PREEMPTIVE",
    preemptive: true,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c2.12 0 4.07.74 5.61 1.97L21 12z" />
        <path d="M21 3v9h-9" />
      </svg>
    ),
  },
  {
    id: "priority",
    name: "Priority",
    subtitle: "Execution based on assigned priority.",
    description: "Execution based on assigned priority.",
    badge: "NON-PREEMPTIVE",
    preemptive: false,
    icon: (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="12" r="10" />
        <path d="M12 7v5" />
        <path d="M12 17v.01" />
      </svg>
    ),
  },
];

export const STAGES = [
  { id: 1, label: "Configure" },
  { id: 2, label: "Simulate" },
  { id: 3, label: "Stats" },
];

