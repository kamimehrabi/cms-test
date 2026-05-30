import { Car } from "@/types/inventory";
const createSlug = (text?: string) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/\s+/g, "") // Remove spaces completely
    .replace(/&/g, "and") // Replace & with "and"
    .replace(/[^a-z0-9]/g, ""); // Remove any other special characters INCLUDING hyphens (no dash)
};

export default function slugGenerator (car?: Car) {
  if (!car) return '';
  return `${car.year}-${createSlug(car.make)}-${createSlug(car.model)}-${car.id}`;
}