export interface LocationMarker {
  _id?: string;
  name?: string;
  latitude: number;
  longitude: number;
  description?: string;
  confirmed?: boolean;
  icon?: string;
  color?: string;
}