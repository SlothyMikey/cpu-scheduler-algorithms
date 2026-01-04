import { useEffect, useState } from "react";
import { STAGES } from "../lib/constants";

type AppHeaderProps = {
  stage: number;
  onStageChange: (stage: number) => void;
};

export default function AppHeader({ stage, onStageChange }: AppHeaderProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="app-header flex justify-between items-center">
      <div className="logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-title">CPU Scheduling Algorithms Simulator</div>
          <div className="logo-subtitle">Mike Kerby E. Dalanon BSCS-3C</div>
        </div>
      </div>
      <div className="stepper">
        {STAGES.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`step ${stage === step.id ? "active" : ""}`}>
              <span className="step-number">{step.id}</span>
              <span>{step.label}</span>
            </div>
            {index < STAGES.length - 1 && (
              <div className="w-8 h-[1px] bg-border mx-3" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted/10 text-muted hover:text-foreground transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
