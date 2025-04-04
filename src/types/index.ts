// Base type for common properties
export type BasePlace = {
  description: string;
  lat: number;
  lng: number;
  place_id: string;
  name: string;
};

// PlaceDetails type extending BasePlace
export type PlaceDetails = BasePlace;

// stop type extending BasePlace and adding additional properties
export type Stop = BasePlace & {
  status: string;
  id: string;
  time?: string;
};






export type StopsFirebase = {
  routeId: string;
  stops: Stop;
};

