

  export async function optimizeRequest(payload: any) {
   
    const res = await fetch(`${process.env.NEXT_PUBLIC_OPTIMIZE_ROUTE_URL}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: payload }),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Failed to fetch geolocation');
    }
  
    return res;
  }

  export async function fetchPlaceDetails(placeId: string, apiKey: string) {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=place_id,name,geometry,formatted_address`;
  
    const resp = await fetch(url);
    const data = await resp.json();
  
    if (data.status !== "OK") {
      throw new Error(`Place Details error: ${data.status}`);
    }
  
    const result = data.result;
    return {
      place_id: result.place_id,
      name: result.name,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
      description: result.formatted_address,
    };
  }

  export async function fetchAutocomplete(input: string, apiKey: string) {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&components=country:gb|country:es`;
  
    const resp = await fetch(url);
    const data = await resp.json();
  
    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Autocomplete error: ${data.status}`);
    }
  
    return data;
  }
  