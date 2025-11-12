export interface WorkerMessage {
  data?: ArtistAppearance[];
  error?: string;
}
export type ArtistName = string;
export type ArtistAppearances = number;
export type ArtistAppearanceMap = Record<string, number>;
export interface Artist {
  artist: ArtistName;
}
export interface ArtistAppearance {
  artist: ArtistName;
  appearances: ArtistAppearances;
}

