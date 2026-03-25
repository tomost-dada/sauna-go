import ProgressBar from "@/components/ui/ProgressBar";

interface ConquestBarProps {
  visited: number;
  total: number;
  percent: number;
}

export default function ConquestBar({ visited, total, percent }: ConquestBarProps) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-ambient-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏔️</span>
          <span className="text-headline-md text-on-surface">{visited}/{total} 정복</span>
        </div>
        <span className="text-display-sm text-secondary font-display">{percent}%</span>
      </div>
      <ProgressBar variant="secondary" percent={percent} />
    </div>
  );
}
