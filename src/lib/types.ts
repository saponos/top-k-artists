import { EASY, HARD, MEDIUM } from "./const.js";

export type ArtistName = string;
export type ArtistAppearances = number;
export type ArtistAppearanceMap = Map<ArtistName, ArtistAppearances>;
export type Difficulty = typeof EASY | typeof MEDIUM | typeof HARD;
export type Level = {
  name: Difficulty;
  range: [number, number];
  files: number;
};
export type CompareFunction<T> = (a: T, b: T) => number;
export type GetKeyFunction<T> = (value: T) => string;