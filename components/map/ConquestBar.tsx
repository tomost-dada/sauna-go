import ProgressBar from "@/components/ui/ProgressBar";

interface ConquestBarProps {
  visited: number;
  total: number;
  percent: number;
}

export default function ConquestBar({ visited, total, percent }: ConquestBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-headline-md text-on-surface">{visited}/{total} 정복</span>
        <span className="text-title-md text-secondary">{percent}%</span>
      </div>
      <ProgressBar variant="secondary" percent={percent} />
    </div>
  );
}
