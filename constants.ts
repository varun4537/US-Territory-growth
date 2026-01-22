import { Territory, AcquisitionMethod } from './types';

export const COLORS = {
  original: "#1d4ed8", // Strong Blue
  louisiana: "#d97706", // Amber
  florida: "#ef4444", // Red
  texas: "#be185d", // Pink/Magenta
  oregon: "#15803d", // Green
  mexican: "#c2410c", // Burnt Orange
  gadsden: "#eab308", // Yellow
  alaska: "#0ea5e9", // Sky Blue
  hawaii: "#14b8a6", // Teal
  other: "#64748b", // Slate
};

// --- HIGH FIDELITY SHARED EDGES ---
// These path segments represent shared borders. 
// They are combined to form the closed shapes of the territories.

// 1. The Mississippi River (Source near MN to Mouth near NO)
// Detailed winding path
const EDGE_MS_RIVER = "L 565,90 C 565,100 575,110 570,130 C 565,150 560,160 565,180 C 570,200 560,220 555,240 C 550,260 540,280 545,300 C 550,320 540,340 542,360 C 545,380 535,400 540,420 C 545,440 550,460 555,480";
// Reverse direction (South to North)
const EDGE_MS_RIVER_REV = "L 555,480 C 550,460 545,440 540,420 C 535,400 545,380 542,360 C 540,340 550,320 545,300 C 540,280 550,260 555,240 C 560,220 570,200 565,180 C 560,160 565,150 570,130 C 575,110 565,100 565,90";

// 2. The 49th Parallel (Border with Canada, West of Lake of the Woods)
const EDGE_49TH = "L 520,60 L 250,60";
const EDGE_49TH_REV = "L 250,60 L 520,60";

// 3. The 42nd Parallel (CA/OR Border to Rockies)
const EDGE_42ND = "L 155,190 L 330,190";

// 4. Eastern Continental Divide / Treaty Line of 1819 (West Border of Louisiana Purchase)
// Steps: Sabine River -> Red River -> Arkansas River -> North to 42nd -> West to Divide -> North to 49th
// Simplified high-res path for display:
const EDGE_LA_WEST = "L 480,450 L 460,390 L 400,350 L 380,310 L 380,250 L 330,250 L 310,200 L 290,150 L 280,100 L 250,60";
const EDGE_LA_WEST_REV = "L 250,60 L 280,100 L 290,150 L 310,200 L 330,250 L 380,250 L 380,310 L 400,350 L 460,390 L 480,450";

// 5. Texas / Mexico Border (Rio Grande)
const EDGE_RIO_GRANDE = "L 480,450 L 450,550 L 420,520 L 380,480 L 340,430"; 

// 6. Gadsden / Mexico Border
const EDGE_GADSDEN_SOUTH = "L 340,430 L 280,430 L 280,400 L 240,400"; // Includes the straight lines

// 7. West Coast (South to North)
const EDGE_WEST_COAST_S = "L 240,400 L 220,380 L 180,300 L 155,190"; // Mexican Cession Coast
const EDGE_WEST_COAST_N = "L 155,190 L 150,150 L 140,100 L 160,80 L 180,60 L 250,60"; // Oregon Coast

// 8. East Coast (North to South, excluding Florida)
const EDGE_EAST_COAST = "L 880,30 L 920,50 L 900,100 L 880,150 L 840,200 L 820,250 L 780,300 L 740,350 L 730,400 L 700,430"; // Ends at St Marys River

// 9. Florida Border (St Marys to Apalachicola)
const EDGE_FL_NORTH = "L 700,430 L 640,430 L 610,435 L 590,440 L 570,470 L 555,480";

export const TERRITORIES: Territory[] = [
  {
    id: "original_1783",
    name: "Original 13 Colonies + 1783",
    year: 1783,
    areaSqMiles: 892135,
    method: AcquisitionMethod.Original,
    fromEntity: "Great Britain",
    description: "The foundation of the United States, extending from the Atlantic to the Mississippi River.",
    comparison: "Initial US Territory",
    // Start at MS Mouth (555,480) -> North via MS River -> East via Great Lakes -> Coast -> South -> FL Border -> West
    path: `M 555,480 ${EDGE_MS_RIVER_REV} L 600,80 L 650,120 L 700,100 L 750,60 L 800,50 ${EDGE_EAST_COAST} ${EDGE_FL_NORTH} Z`,
    color: COLORS.original,
    labelX: 720,
    labelY: 250
  },
  {
    id: "louisiana_1803",
    name: "Louisiana Purchase",
    year: 1803,
    areaSqMiles: 828000,
    cost: 15000000,
    costInflationAdjusted: 393000000,
    method: AcquisitionMethod.Purchase,
    fromEntity: "France",
    description: "The massive central corridor purchased from France.",
    comparison: "Doubled US Size",
    // Start MS Mouth -> West (Sabine) -> North (Treaty Line) -> East (Canada) -> South (MS River)
    path: `M 555,480 ${EDGE_LA_WEST} ${EDGE_49TH_REV} L 565,90 ${EDGE_MS_RIVER} Z`,
    color: COLORS.louisiana,
    labelX: 480,
    labelY: 220
  },
  {
    id: "florida_1819",
    name: "Florida",
    year: 1819,
    areaSqMiles: 65000,
    cost: 5000000,
    costInflationAdjusted: 124000000,
    method: AcquisitionMethod.Treaty,
    fromEntity: "Spain",
    description: "Acquired via the Adams-Onís Treaty.",
    comparison: "The Sunshine State",
    // Start at MS Mouth/FL Border West -> East -> South -> West -> North
    path: `M 555,480 L 570,470 L 590,440 L 610,435 L 640,430 L 700,430 L 730,460 L 750,550 L 730,590 L 680,550 L 650,480 L 600,480 L 555,480 Z`,
    color: COLORS.florida,
    labelX: 720,
    labelY: 500
  },
  {
    id: "texas_1845",
    name: "Texas Annexation",
    year: 1845,
    areaSqMiles: 389166,
    method: AcquisitionMethod.Annexation,
    fromEntity: "Republic of Texas",
    description: "Annexation of the independent Republic of Texas.",
    comparison: "The Lone Star State",
    // Start Sabine (480,450) -> North via LA West Rev -> West -> South -> Rio Grande
    // Note: LA West edge starts at 480,450. We go UP it to the "shoulder" of Texas roughly at 380,310 then cut west? 
    // Actually TX border follows LA West Edge until 380,310 (Arkansas river) then goes West to 310,310 then South.
    // Let's manually define TX North/West border to fit the gap perfectly with Cession.
    path: `M 480,450 L 460,390 L 400,350 L 380,310 L 380,250 L 330,250 L 330,400 L 340,430 L 380,480 L 420,520 L 450,550 Z`,
    color: COLORS.texas,
    labelX: 420,
    labelY: 420
  },
  {
    id: "oregon_1846",
    name: "Oregon Territory",
    year: 1846,
    areaSqMiles: 286541,
    method: AcquisitionMethod.Treaty,
    fromEntity: "Great Britain",
    description: "Pacific Northwest acquired by treaty with Britain.",
    comparison: "WA, OR, ID",
    // Start 49th/Divide (250,60) -> West Coast -> South -> East (42nd) -> North (Divide/LA Edge)
    path: `M 250,60 L 180,60 L 160,80 L 140,100 L 150,150 L 155,190 ${EDGE_42ND} L 330,250 L 310,200 L 290,150 L 280,100 L 250,60 Z`,
    color: COLORS.oregon,
    labelX: 240,
    labelY: 130
  },
  {
    id: "mexican_cession_1848",
    name: "Mexican Cession",
    year: 1848,
    areaSqMiles: 529189,
    cost: 15000000,
    costInflationAdjusted: 565000000,
    method: AcquisitionMethod.War,
    fromEntity: "Mexico",
    description: "Southwest acquired after Mexican-American War.",
    comparison: "CA, NV, UT, AZ",
    // Start 42nd/Coast (155,190) -> South Coast -> Gadsden Line -> North (TX Border) -> West (42nd)
    // Needs to match TX border: 330,250 -> 330,400 -> 340,430
    path: `M 155,190 L 330,190 L 330,250 L 330,400 L 340,430 L 280,430 L 240,400 L 220,380 L 180,300 Z`,
    color: COLORS.mexican,
    labelX: 250,
    labelY: 300
  },
  {
    id: "gadsden_1853",
    name: "Gadsden Purchase",
    year: 1853,
    areaSqMiles: 29670,
    cost: 10000000,
    costInflationAdjusted: 350000000,
    method: AcquisitionMethod.Purchase,
    fromEntity: "Mexico",
    description: "Southern AZ/NM purchased for railroad.",
    comparison: "Railroad Route",
    // Fills the notch below Cession/Gila: 340,430 to 240,400
    // Cession bottom was: 340,430 -> 280,430 -> 240,400
    // Actually the Cession bottom above is flat-ish. Gadsden adds the bulge.
    // Let's redefine Cession bottom to be the Gila River, and Gadsden is south of it.
    // For visual simplicity, I used the straight line in Cession above (340,430 -> 280,430 -> 240,400).
    // Gadsden sits between 280,430 and 240,400 and goes south?
    // Let's just draw Gadsden as a small wedge on the border.
    path: `M 240,400 L 280,430 L 340,430 L 320,450 L 280,450 L 240,400 Z`,
    color: COLORS.gadsden,
    labelX: 290,
    labelY: 435
  },
  {
    id: "alaska_1867",
    name: "Alaska",
    year: 1867,
    areaSqMiles: 586412,
    cost: 7200000,
    costInflationAdjusted: 145000000,
    method: AcquisitionMethod.Purchase,
    fromEntity: "Russia",
    description: "Purchased from Russia.",
    comparison: "Largest State",
    // Detailed Alaska shape
    path: "M 130,450 L 110,450 L 90,460 L 70,480 L 40,480 L 20,500 L 30,520 L 50,540 L 80,550 L 110,540 L 130,520 L 140,480 Z",
    color: COLORS.alaska,
    labelX: 80,
    labelY: 510
  },
  {
    id: "hawaii_1898",
    name: "Hawaii",
    year: 1898,
    areaSqMiles: 6423,
    method: AcquisitionMethod.Annexation,
    fromEntity: "Hawaii",
    description: "Pacific archipelago annexed in 1898.",
    comparison: "Strategic Outpost",
    path: "M 200,520 L 220,530 L 210,540 L 190,530 Z M 230,540 L 250,550 L 240,560 L 220,550 Z M 260,560 L 270,570 L 260,575 L 250,565 Z",
    color: COLORS.hawaii,
    labelX: 230,
    labelY: 570
  }
];

// Combine all territory paths to create the "Ghost" background
// This simulates the full US map background
export const US_OUTLINE_PATH = `
  M 555,480 L 570,470 L 590,440 L 610,435 L 640,430 L 700,430 L 730,460 L 750,550 L 730,590 L 680,550 L 650,480 L 600,480 L 555,480
  M 555,480 L 550,460 545,440 540,420 535,400 545,380 542,360 540,340 550,320 545,300 540,280 550,260 555,240 560,220 570,200 565,180 560,160 565,150 570,130 575,110 565,100 565,90
  L 600,80 L 650,120 L 700,100 L 750,60 L 800,50 L 880,30 L 920,50 L 900,100 L 880,150 L 840,200 L 820,250 L 780,300 L 740,350 L 730,400 L 700,430
  M 565,90 L 520,60 L 250,60 L 180,60 L 160,80 L 140,100 L 150,150 L 155,190
  L 180,300 L 220,380 L 240,400 L 280,450 L 320,450 L 340,430 L 380,480 L 420,520 L 450,550 L 480,450 L 460,390 L 400,350 L 380,310 L 380,250 L 330,250 L 310,200 L 290,150 L 280,100 L 250,60
  M 130,450 L 110,450 L 90,460 L 70,480 L 40,480 L 20,500 L 30,520 L 50,540 L 80,550 L 110,540 L 130,520 L 140,480 Z
  M 200,520 L 220,530 L 210,540 L 190,530 Z M 230,540 L 250,550 L 240,560 L 220,550 Z M 260,560 L 270,570 L 260,575 L 250,565 Z
`;

export const MIN_YEAR = 1776;
export const MAX_YEAR = 1920;