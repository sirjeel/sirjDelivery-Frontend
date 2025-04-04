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
  time: string;
};

// Other types
export type FetchOptions = {
  token?: string;
  method?: string;
  bodyData?: any;
};

export type UseMutateResult<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fetchQuery: (url: string, options: FetchOptions) => Promise<void>;
};

export type Predictions = {
  description: string;
  place_id: string;
};
export type Metrics = {
  travelDistance: number,
  travelDuration: number,
};

export type UpdateStatusPayload = {
  index: number;
  status: "failed" | "completed";
}

// Define the props type
export type StopBarProps = {
  mode?: 'start' | 'end' | 'stops';
  data: Stop;
};


export type StopsFirebase = {
  routeId: string;
  stops: Stop;
};

[
  {
      "stops": [],
      "createdAt": "Timestamp(seconds=1743667709, nanoseconds=240000000)",
      "ends": [
          {
              "place_id": "ChIJD_Um9I3BeUgR_Rdv3iNQz4A",
              "id": "18a5d283-5f0b-8fd2-ef3f-75ef69d50d2a",
              "status": "pending",
              "name": "Medina Chemist",
              "lng": -1.1702097999999999,
              "lat": 52.9648722,
              "description": "85-87 Radford Rd, Radford, Nottingham NG7 5DR, UK"
          }
      ],
      "starts": [
          {
              "lng": -1.1878356,
              "name": "12 Grace Dr",
              "place_id": "ChIJ2xLjfe_BeUgRuY7eW2LbeRc",
              "lat": 52.9679309,
              "description": "12 Grace Dr, Nottingham NG8 5AG, UK",
              "status": "pending",
              "id": "962d157a-6651-aefc-b259-faf9302d0e07"
          }
      ],
      "updatedAt": {
          "seconds": 1743711157,
          "nanoseconds": 805000000
      }
  },
  {
      "createdAt": "Timestamp(seconds=1743713020, nanoseconds=851000000)",
      "stops": [],
      "updatedAt": {
          "seconds": 1743713059,
          "nanoseconds": 955000000
      },
      "ends": [],
      "starts": []
  },
  {
      "updatedAt": {
          "seconds": 1743713211,
          "nanoseconds": 342000000
      },
      "starts": [],
      "ends": [],
      "stops": [
          {
              "name": "124 Bobbers Mill Rd",
              "time": "2025-04-03T20:45:58.706Z",
              "lng": -1.1780972,
              "status": "completed",
              "id": "0032e2fb-dcc8-c869-5dfc-fe9fafabf4bc",
              "place_id": "ChIJ8YACBu3BeUgRZWfa8aXjl8Y",
              "description": "124 Bobbers Mill Rd, Nottingham NG7 5JT, UK",
              "lat": 52.9668959
          }
      ],
      "createdAt": "Timestamp(seconds=1743713155, nanoseconds=173000000)"
  },
  {
      "stops": [
          {
              "time": "2025-04-03T21:15:44.084Z",
              "lng": -1.175901,
              "place_id": "ChIJqUuwnh_CeUgRZysS3Rgie70",
              "id": "e1d1a322-2dbd-6cdb-0efd-5c1d5ea09ba5",
              "lat": 52.9517839,
              "status": "failed",
              "name": "11 Dunlop Ave",
              "description": "11 Dunlop Ave, Lenton, Nottingham NG7 2BW, UK"
          },
          {
              "name": "32 Auckland Cl",
              "lng": -1.1809649,
              "id": "c75a2b84-7325-e3e1-498c-a51b6c55c55a",
              "time": "2025-04-03T21:15:45.108Z",
              "status": "failed",
              "description": "32 Auckland Cl, Nottingham NG7 3DX, UK",
              "place_id": "ChIJlY4M2fXBeUgRRAom6aKnYR4",
              "lat": 52.9559437
          },
          {
              "lat": 52.96778949999999,
              "lng": -1.1977259,
              "place_id": "EiJDaGVycnkgV29vZCBEciwgTm90dGluZ2hhbSBORzgsIFVLIi4qLAoUChIJZ7WDVOLBeUgRqRSz5RaXrL8SFAoSCdN36QmPxnlIEQ3BhHPcd8vM",
              "time": "2025-04-03T21:15:40.321Z",
              "description": "Cherry Wood Dr, Nottingham NG8, UK",
              "name": "Cherry Wood Drive",
              "status": "failed",
              "id": "a138ba46-fe16-5d52-09a4-db1ca0fa3c96"
          }
      ],
      "updatedAt": {
          "seconds": 1743714981,
          "nanoseconds": 274000000
      },
      "createdAt": "Timestamp(seconds=1743714921, nanoseconds=274000000)",
      "starts": [
          {
              "status": "pending",
              "description": "85-87 Radford Rd, Radford, Nottingham NG7 5DR, UK",
              "place_id": "ChIJD_Um9I3BeUgR_Rdv3iNQz4A",
              "id": "5103ec36-db6e-58d8-a1b2-bac770f85c34",
              "lng": -1.1702097999999999,
              "lat": 52.9648722,
              "time": "2025-04-03T21:13:35.878Z",
              "name": "Medina Chemist"
          }
      ],
      "ends": [
          {
              "lng": -1.1702097999999999,
              "name": "Medina Chemist",
              "time": "2025-04-03T20:49:15.445Z",
              "lat": 52.9648722,
              "description": "85-87 Radford Rd, Radford, Nottingham NG7 5DR, UK",
              "id": "6f40d71c-c502-2b5c-b694-56e9a41d19b1",
              "place_id": "ChIJD_Um9I3BeUgR_Rdv3iNQz4A",
              "status": "pending"
          }
      ]
  },
  {
      "starts": [],
      "updatedAt": {
          "seconds": 1743715100,
          "nanoseconds": 415000000
      },
      "ends": [],
      "createdAt": "Timestamp(seconds=1743715079, nanoseconds=361000000)",
      "stops": [
          {
              "status": "failed",
              "place_id": "ChIJUcjlDu3BeUgRn3CivfKG6Pw",
              "time": "2025-04-03T21:18:01.001Z",
              "id": "892fed9a-ff6c-e8f3-ed44-0bf8d559f916",
              "description": "123 Bobbers Mill Rd, Nottingham NG7 5JS, UK",
              "lng": -1.1778959,
              "lat": 52.9667047,
              "name": "123 Bobbers Mill Rd"
          },
          {
              "place_id": "ChIJMdpcPu3BeUgR9FMF5XvfmH4",
              "lng": -1.1767024,
              "status": "failed",
              "time": "2025-04-03T21:18:02.065Z",
              "id": "f026b0bb-6219-38cf-ba6c-290714ad96cb",
              "description": "96 Hazelwood Rd, Nottingham NG7 5LB, UK",
              "lat": 52.966488899999995,
              "name": "96 Hazelwood Rd"
          },
          {
              "description": "20 Selston Dr, Nottingham NG8 1DE, UK",
              "lng": -1.193573,
              "id": "0c54b28b-b6f2-4b40-da5c-e44dec7bbe10",
              "lat": 52.94968309999999,
              "place_id": "ChIJ9xJFXwHCeUgRyu5HId-MbMU",
              "status": "failed",
              "time": "2025-04-03T21:18:06.084Z",
              "name": "20 Selston Dr"
          }
      ]
  }
]