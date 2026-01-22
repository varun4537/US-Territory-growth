export enum AcquisitionMethod {
  Treaty = "Treaty",
  Purchase = "Purchase",
  Annexation = "Annexation",
  Cession = "Cession",
  War = "War Settlement",
  Original = "Original Territory"
}

export interface Territory {
  id: string;
  name: string;
  year: number;
  areaSqMiles: number;
  cost?: number; // Original cost
  costInflationAdjusted?: number; // Cost in 2024 dollars
  method: AcquisitionMethod;
  fromEntity: string;
  description: string;
  comparison: string; // e.g., "3x size of Texas"
  path: string; // SVG Path data
  color: string;
  labelX: number; // For map label positioning
  labelY: number;
}

export interface AppState {
  currentYear: number;
  isPlaying: boolean;
  speed: number; // Multiplier (0.5, 1, 2)
  selectedTerritory: Territory | null;
  activeTerritories: Territory[];
  autoPauseEnabled: boolean;
}