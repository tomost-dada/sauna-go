"use client";

import Chip from "@/components/ui/Chip";

interface Region {
  key: string;
  label: string;
}

interface RegionTabsProps {
  regions: Region[];
  activeRegion: string;
  onChange: (region: string) => void;
}

export default function RegionTabs({ regions, activeRegion, onChange }: RegionTabsProps) {
  return (
    <div className="overflow-x-auto flex gap-3 scrollbar-hide py-1">
      {regions.map((region) => (
        <Chip
          key={region.key}
          active={region.key === activeRegion}
          onClick={() => onChange(region.key)}
        >
          {region.label}
        </Chip>
      ))}
    </div>
  );
}
