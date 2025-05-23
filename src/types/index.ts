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
  stopId: string;
  time?: string;
};

export type Predictions = {
    description: string;
    place_id: string;
  };




export type StopsFirebase = {
  routeId: string;
  stops: Stop;
};

// Define the props type
export type StartStopBarProps = {
  mode?: 'start' | 'end';
  data: Stop;
};

/*
below geolocation user live data strucuture 
{
    "timestamp": 1744135585022,
    "coords": {
        "accuracy": 14.146,
        "latitude": 41.3613924,
        "longitude": 2.0786438,
        "altitude": null,
        "altitudeAccuracy": null,
        "heading": null,
        "speed": null
    }
}
}

*/

