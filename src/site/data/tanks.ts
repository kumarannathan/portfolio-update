/**
 * The tanks, as specs.
 *
 * Anything I don't actually know is left null and renders as "—" rather than a
 * made-up number. Fill a field in and it shows up; no component changes needed.
 * Photos go in public/tanks/<id>/ and are listed per tank below.
 */

export interface TankStat {
  label: string;
  /** The number itself, e.g. "20" — null until it's known. */
  value: string | null;
  /** Small unit printed after the number, e.g. "gal". */
  unit?: string;
  /** One line under the stat. */
  note?: string;
}

export interface TankEntry {
  name: string;
  /** Latin name or variety, printed under the common name. */
  detail?: string;
  /** How many, where that's a thing worth saying. */
  count?: string;
}

export interface TankPhoto {
  src: string;
  caption?: string;
  /** The lead shot, printed wide above the rest. */
  main?: boolean;
}

export interface Tank {
  id: string;
  /** What I call it. */
  name: string;
  /** One line on what this tank is. */
  blurb: string;
  /** When it was set up. */
  started: string | null;
  /** The big numbers across the top. */
  stats: TankStat[];
  plants: TankEntry[];
  livestock: TankEntry[];
  /** Hardscape, filtration, substrate — the build. */
  hardware: TankEntry[];
  /** Light, feeding, water changes, dosing: the recurring schedule. */
  schedule: { label: string; value: string | null }[];
  photos: TankPhoto[];
}

export const TANKS: Tank[] = [
  {
    id: 'shallow-long',
    name: '6.7 Planted Shallow Long',
    blurb: 'goal is eventually to get the rasbora to breed.',
    started: null,
    stats: [
      { label: 'Volume', value: '6.7', unit: 'gal' },
      { label: 'Light', value: '6', unit: 'hrs', note: 'sunlight, per day' },
      { label: 'Fish', value: '7', note: 'dwarf rasbora' },
      { label: 'Feeding', value: '1', unit: '×', note: 'per day' }
    ],
    plants: [
      { name: 'Anubias' },
      { name: 'Taiwan moss' },
      { name: 'Tiger lotus' },
      { name: 'Peace lily' },
      { name: 'Duckweed' }
    ],
    livestock: [
      { name: 'Dwarf rasbora', count: '7' },
      { name: 'Cherry shrimp' },
      { name: 'Ramshorn snail' }
    ],
    hardware: [
      { name: 'Fluval substrate', detail: 'capped with bioactive sand' },
      { name: 'Bubbler' },
      { name: 'CO2', detail: 'occasional, to help with plant melt' },
      { name: 'Indian almond leaves', detail: 'and other botanicals' }
    ],
    schedule: [
      { label: 'Light', value: '6 hrs of sunlight a day' },
      { label: 'Feeding', value: "Hikari First Bites, once a day" },
      { label: 'CO2', value: 'occasional' }
    ],
    photos: [
      { src: '/tanks/shallow-long/01.jpg', main: true },
      { src: '/tanks/shallow-long/02.jpg' },
      { src: '/tanks/shallow-long/03.jpg' },
      { src: '/tanks/shallow-long/04.jpg' }
    ]
  },
  {
    id: 'shrimp-cube',
    name: '6 Gallon Shrimp Cube',
    blurb: '',
    started: null,
    stats: [
      { label: 'Volume', value: '6', unit: 'gal' },
      { label: 'Light', value: '8', unit: 'hrs', note: 'per day' },
      { label: 'Shrimp', value: '50', unit: '+' },
      { label: 'Generations', value: '3' }
    ],
    plants: [
      { name: 'Anubias' },
      { name: 'Taiwan moss' },
      { name: 'Christmas moss' },
      { name: 'Tiger lotus' },
      { name: 'Peace lily' },
      { name: 'Helanthium tenellum' },
      { name: 'Monte Carlo' },
      { name: 'Dwarf hairgrass' },
      { name: 'Basil' },
      { name: 'Golden talk grass' },
      { name: 'Duckweed' }
    ],
    livestock: [
      { name: 'Halfmoon copper betta', count: '1' },
      { name: 'Cherry shrimp', count: '50+' },
      { name: 'Nerite snail', count: '1' }
    ],
    hardware: [
      { name: 'Fluval Stratum', detail: 'capped with inert sand' },
      { name: 'Heater' },
      { name: 'Bubbler' },
      { name: 'Driftwood' },
      { name: 'Botanicals' }
    ],
    schedule: [
      { label: 'Light', value: '8 hrs a day' },
      { label: 'Feeding', value: 'a few pellets a day for the betta, nothing for the shrimp' },
      { label: 'CO2', value: 'none' }
    ],
    photos: []
  },
  {
    id: 'rice-fish',
    name: '10 Gallon Rice Fish',
    blurb: 'trying to get them to spawn.',
    started: null,
    stats: [
      { label: 'Volume', value: '10', unit: 'gal' },
      { label: 'Light', value: null, unit: 'hrs', note: 'per day' },
      { label: 'Fish', value: '6', note: 'rice fish' },
      { label: 'Feeding', value: '3', unit: '×', note: 'per day' }
    ],
    plants: [
      { name: 'Amazon sword' },
      { name: 'Taiwan moss' },
      { name: 'Red root floaters' },
      { name: 'Duckweed' }
    ],
    livestock: [
      { name: 'Rice fish', count: '6' },
      { name: 'Ramshorn snails' }
    ],
    hardware: [{ name: 'Heater' }, { name: 'Driftwood' }, { name: 'Botanicals' }],
    schedule: [
      { label: 'Feeding', value: 'Hikari pellets, 3× a day' }
    ],
    photos: []
  }
];
