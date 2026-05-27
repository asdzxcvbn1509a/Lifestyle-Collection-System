import {
  Coffee,
  BookOpen,
  Dumbbell,
  Utensils,
  Plane,
  Music,
  Film,
  ShoppingBag,
  Heart,
  Camera,
  Gamepad2,
  Palette,
  Leaf,
  Bike,
  MapPin,
  Star,
  House,
  Briefcase,
  Pizza,
  Shirt,
  Folder,
} from 'lucide-react';

// Curated set of icons offered by the IconPicker (wireframe: add-category modal).
export const ICONS = {
  Coffee,
  BookOpen,
  Dumbbell,
  Utensils,
  Plane,
  Music,
  Film,
  ShoppingBag,
  Heart,
  Camera,
  Gamepad2,
  Palette,
  Leaf,
  Bike,
  MapPin,
  Star,
  House,
  Briefcase,
  Pizza,
  Shirt,
};

export const ICON_NAMES = Object.keys(ICONS);
export const DEFAULT_ICON = 'Folder';

/** Resolve a stored icon name to its lucide component (falls back to Folder). */
export function getIcon(name) {
  return ICONS[name] || Folder;
}
