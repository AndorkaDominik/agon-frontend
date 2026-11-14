import type { AnimalTier } from "@/app/types/AnimalTier";
import { ANIMAL_TIERS } from "@/app/constants/AnimalTiers";

export function getAnimalTierForLevel(level: number): AnimalTier {
  const safeLevel = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;
  return ANIMAL_TIERS[Math.min(safeLevel, ANIMAL_TIERS.length) - 1];
}

export function getAnimalImagePath(imageName: string): string {
  return `/animals/${imageName}.png`;
}
