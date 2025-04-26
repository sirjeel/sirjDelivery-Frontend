import { start } from "repl";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

export const formatToUKTime = (isoString) => {
    const ukFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  if (!isoString) return[];
    const date = new Date(isoString);
    const parts = ukFormatter.formatToParts(date);
  
    const getPart = (type) => parts.find(part => part.type === type)?.value || '';
  
    const weekday = getPart('weekday');
    const month = getPart('month');
    const day = getPart('day');
    const year = getPart('year');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const dayPeriod = getPart('dayPeriod');
  
    return [`${weekday} ${month} ${day} ${year}`,`${hour}:${minute} ${dayPeriod}` ];
  }
  
export const flattenStops = (data) => {
    return data.reduce((acc, item) => {
      if (Array.isArray(item.stops)) {
        acc.push(...item.stops);
      }
      return acc;
    }, []);
  }

  export const transformMarker = (data) => data.map(item => ({
    position: {
        lat: item.lat,
        lng: item.lng
    },
    title: item.name
  }));

  


  // below code is only for arrays if your data structure is not array dont use it.
// below is clean code of nested two fold if statement if window true then go inside then if local storage true then do that 
export const stopsLocalstorage = (key) => {
  try {
    if (typeof window === 'undefined') return []; // Prevent issues in non-browser environments

    const stops = JSON.parse(localStorage.getItem(`${key}`) ?? '[]');

    // Filter out null, undefined, or falsy values
    const filteredStops = Array.isArray(stops) ? stops.filter(Boolean) : [];    

    return filteredStops; // Return the cleaned array
  } catch (error) {
    console.error("Error accessing or cleaning stops in local storage:", error.message);
    return []; // Return an empty array if something goes wrong
  }
};

export const debounce = (func: (...args: string[]) => void, delay: number): ((...args: string[]) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: string[]): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};


export const uuid = () => {
  // Generate random hexadecimal digits
  const digits = "0123456789abcdef";
  const n = digits.length;

  // Generate random hexadecimal digits and concatenate them to form the UUID
  let uuid = Array.from({ length: 32 }, () =>
    digits[Math.floor(Math.random() * n)]
  ).join("");

  // Add hyphens to the UUID to separate it into groups
  uuid = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;

  return uuid;
};

export const timeStamp = () => {
  const currentTime = new Date(); // Get current time
  // Format the times as ISO 8601 strings
  const formattedTime = currentTime.toISOString();

  return formattedTime
}

const calculateTimes = () => {
  const currentTime = new Date(); // Get current time

  // Add 2 hours to the current time for startTime
  const startTime = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);

  // Add 20 hours to the startTime for endTime
  const endTime = new Date(startTime.getTime() + 20 * 60 * 60 * 1000);

  // Format the times as ISO 8601 strings
  const formattedStartTime = startTime.toISOString();
  const formattedEndTime = endTime.toISOString();

  return {
    startTime: formattedStartTime,
    endTime: formattedEndTime,
  };
}



export const reportingMetrics = (metrics, stops ) => {
  
  // Fixed adjustedHours and added adjustedDistance calculation
  const adjustedHours = (
    (metrics?.travelDuration ? JSON.parse(metrics.travelDuration) : 0) 
    + (0.0583 * (stops?.length || 0))
  );
  
  const adjustedDistance = metrics.travelDistance ? JSON.parse(metrics.travelDistance) : 0;

  // Get the current time and calculate the finish time based on adjustedHours
  const currentTime = new Date();
  const finishTime = new Date(currentTime.getTime() + adjustedHours * 60 * 60 * 1000);
  const hours = finishTime.getHours();
  const minutes = finishTime.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedTime = `${(hours % 12) || 12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  return [{
    distanceKm: adjustedDistance.toFixed(2), 
    durationHours: adjustedHours.toFixed(2), 
    finishTime: formattedTime  
  }]
}




const saveMetricsToLocalStorage = (model) => {
  const travelDistance = (model?.response[0]?.metrics?.aggregatedRouteMetrics?.travelDistanceMeters || 0) / 1000;
  const travelDuration = ((model?.response[0]?.metrics?.aggregatedRouteMetrics?.travelDuration?.seconds || 0) / 60)/60;

  const routeMetrics = {
    travelDistance: travelDistance.toFixed(2),
    travelDuration: travelDuration.toFixed(2),
  };

  const stops = stopsLocalstorage('stops').filter(item => item.status === "pending");
  const filterData = reportingMetrics(routeMetrics, stops);

  if (typeof localStorage !== 'undefined') {
     localStorage.setItem('metrics', JSON.stringify(filterData));
  }

};

export const extractWaypoints = (a) => {
  const nestedArray = a?.response[0]?.routes[0]?.visits;  

  // iterate the deeply nested object to get required data
 const transformArray = nestedArray.map(item => {
    if (!item?.isPickup) {
      return item?.shipmentIndex
    }
  });
  return transformArray;
};

export const reorderElements = (b, a) => {
  // Sort the middle elements based on the order defined in a
  const sortedStops = a.map(index => b[index]);

  // Reconstruct b with the sorted middle elements
  return sortedStops;
};
 
// below api is sync with next js backend because CORS doesnt allow to fetch directly from front end
export const fetchData = async (inputText: string) => {
  try {
    const response = await fetch(`/api/places?type=autocomplete&input=${encodeURIComponent(inputText)}`);
    const data = await response.json();
    return (data.predictions).map(({ description, place_id }: any) => ({ description, place_id,}));    
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return [];
  }
};


export async function fetchGeolocation() {
  const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
    method: 'POST',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Failed to fetch geolocation');
  }

  const data = await res.json();
  return {
    lat: data.location.lat,
    lng: data.location.lng,
  };
}

// below api is sync with next js backend because CORS doesnt allow to fetch directly from front end
export const getPlaceDetails = async (placeId: string) => {
  const apiUrl =`/api/places?type=details&placeId=${placeId}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Place details:", data);

    return data;
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};



export const addStop = async (id) => {
  const fetchstop = await getPlaceDetails(id);
  const uniqueId = uuid();
  console.log(uniqueId);

  return { ...fetchstop, status: "pending", stopId: uniqueId, time: new Date() }; 
};

// Function to create request object for directions service API waypoints
export const optimizeRequest = async (stops) => { 
  let start = {};
  let end = {};
  const startstop = stopsLocalstorage('startStop');
  const endstop = stopsLocalstorage('endStop');

  if (startstop.length > 0) {
    start = startstop[0];
  } else {
    // Get current GPS location   
    start = await fetchGeolocation();
    console.log("Start location taken:", start);
  }

  if (endstop.length > 0) {
    end = endstop[0];
  } else {
    end = start;
  }
  // Transform stops into waypoints
  const waypoints = stops.map(item => ({
    pickups: [
      {
        arrivalLocation: {
          latitude: start.lat,
          longitude: start.lng
        }
      }
    ],
    deliveries: [
      {
        arrivalLocation: {
          latitude: item.lat,
          longitude: item.lng
        }
      }
    ]
  }));

  // Ensure all required data is fully resolved before returning
  return {
    
    model: {
      populatePolylines: true,
      populateTransitionPolylines: true,
      globalStartTime: calculateTimes.startTime,
      globalEndTime: calculateTimes.endTime,
      shipments: waypoints,
      vehicles: [
        {
          startLocation: {
            latitude: start.lat,
            longitude: start.lng
          },
          endLocation: {
            latitude: end.lat,
            longitude: end.lng
          },
          costPerKilometer: 2,
          costPerHour: 50,
          costPerTraveledHour: 30
        }
      ]
    }
  };
};



export const getData = (dda) => {
  return fetch(`${process.env.NEXT_PUBLIC_OPTIMIZE_ROUTE_URL}`, {
      method: "POST",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify(dda)
      
  })
      .then(response => {
          return response.json();
      })
      .catch(err => console.log(err));
};

export const goButton = async () => { 
  const stops = stopsLocalstorage('stops').filter(item => item.status === "pending");

  try {
    // below is clean up of metrics if user reoptimize route 2nd time even current route is in progress stage
      localStorage.setItem('metrics', JSON.stringify({}));
      const model = await optimizeRequest(stops);
      console.log(model);

      // below line for deployment or production enviroment
      const modelResponse = await getData(model);
      //const modelResponse = await getOptimizedRoutes(model);
      console.log(modelResponse);
      saveMetricsToLocalStorage(modelResponse);
      const waypoints = extractWaypoints(modelResponse);

      // Ensure only valid waypoints are used
      const filteredwaypoints = Array.isArray(waypoints) 
          ? waypoints.filter(item => item !== null && item !== undefined) 
          : [];
              
      const sortedStops = reorderElements(stops, filteredwaypoints);
      const stopsB = stopsLocalstorage('stops').filter(item => item.status !== "pending");
      stopsB.push(...sortedStops);
      localStorage.setItem('stops', JSON.stringify(stopsB));
      return sortedStops;
    
  } catch (error) {
      console.error('Error in goButton:', error);
  }
};

export const completeStop = (id, status) => {

// Get and parse stops from local storage
let stops = stopsLocalstorage('stops');
const index = stops.findIndex(stop => stop.stopId === id);
if (index === -1) {
  console.warn(`Stop with id ${id} not found.`);
  return;
}

// update status of the stop at the specified index
if (status === "completed") {
  stops[index].status = "completed"; 
  stops[index].time = new Date(); 
} else if (status === "delete"){
  stops.splice(index, 1)
} else if (status === "pending"){
  stops[index].status = "pending";
  stops[index].time = new Date();
} else {
  stops[index].status = "failed";
  stops[index].time = new Date();
}

// Save the updated stops back to local storage
localStorage.setItem('stops', JSON.stringify(stops));
}


export const getRouteId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("routeid");
  }
  return null;
};



// below data migration and cleanzing using javascript
// simple Function to rename id prop in non nested data array to stopId
export const renameIdToStopId =  (array) => {
  return array.map(({ id, ...rest }) => ({
    stopId: id,
    ...rest
  }));
}

// belwo data migration and cleanzing using javascript
// docData.updatedAt.toDate()
// input Data to below algorithm is "timestampStr": "Timestamp(seconds=1743343979, nanoseconds=930000000)",
const convertFakeTimestampStringToDate = (timestampStr) => {
  if (!timestampStr) return null;
  if (typeof timestampStr !== 'string') return timestampStr.toDate?.() || timestampStr;

  const match = timestampStr.match(/seconds=(\d+), nanoseconds=(\d+)/);
  if (!match) return null;

  const seconds = Number(match[1]);
  const nanoseconds = Number(match[2]);
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1e6);

  return new Date(milliseconds);
};

const convertTimestampObjectToDate = ({ seconds, nanoseconds }) => {
  if (typeof seconds !== 'number' || typeof nanoseconds !== 'number') return null;
  return new Date(seconds * 1000 + Math.floor(nanoseconds / 1e6));
};


export const megaCleanzing = (array) => {
  return array.map(({ starts, ends, createdAt, updatedAt, stops }) => ({
    start: starts,
    end: ends,
    metrics: [],
    createdAt: convertFakeTimestampStringToDate(createdAt),
    updatedAt: convertTimestampObjectToDate(updatedAt) || updatedAt,
    stops: (stops || []).map(({ id, ...rest }) => ({
      ...rest,
      stopId: id
    }))
  }));
};




export const renameNestedStopIdKey = (data) => {
  return data.map(item => ({
    ...item,
    stops: item.stops.map(({ id, ...rest }) => ({
      ...rest,
      stopId: id
    }))
  }));
}
// below is the fetch call to migrate bulk data to backend api
/*
const sendDatatoAPI = async () => {
      const granData = stopsLocalstorage('firebaseData');
      const cleazeData = megaCleanzing(granData);
      console.log("cleazeData", cleazeData);
    
      // Option 1: Parallel API calls (with error handling)
      try {
        await Promise.all(
          cleazeData.map(async (route, i) => {
            try {
              console.log(`Submitting route #${i}`, route); // 👀 Log before sending
              await fetchQuery(`route/create`, {
                method: 'POST',
                bodyData: route,
              });
            } catch (err) {
              console.error(`Failed to submit route #${i}`, err);
            }
          })
        );
        console.log("All routes submitted successfully");
      } catch (err) {
        console.error("One or more routes failed to submit", err);
      }
    };
    */
   
  