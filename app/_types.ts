export interface Villager {
  id: string;
  name: string;
  image_url: string;
  quote: string;
}

export const MUSEUM_CATEGORIES = [
  { id: 'fish', label: 'Fish 🐟' },
  { id: 'sea', label: 'Sea 🤿' },
  { id: 'bugs', label: 'Bugs 🦋' },
  { id: 'art', label: 'Art 🎨' },
];

export interface MuseumItem {
  id: string | number; 
  name: string;
  image_url: string;
}