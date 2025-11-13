import { ArtistAppearanceMap, ArtistName, ArtistAppearances } from "./types.js";

export interface WorkerMessage {
  data?: ArtistAppearanceMap;
  error?: string;
}
export interface Artist {
  artist: ArtistName;
}
export interface ArtistAppearance {
  artist: ArtistName;
  appearances: ArtistAppearances;
}
