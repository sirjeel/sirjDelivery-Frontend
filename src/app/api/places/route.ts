import { NextResponse } from 'next/server';
import { fetchAutocomplete, optimizeRequest, fetchPlaceDetails } from './helpers';

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (!type) {
    return NextResponse.json({ error: "Missing 'type' param" }, { status: 400 });
  }

  try {
    switch (type) {
      case "autocomplete": {
        const input = searchParams.get("input");
        if (!input) {
          return NextResponse.json({ error: "Missing input" }, { status: 400 });
        }

        const data = await fetchAutocomplete(input, apiKey!);
        return NextResponse.json(data);
      }

      case "details": {
        const placeId = searchParams.get("placeId");
        if (!placeId) {
          return NextResponse.json({ error: "Missing placeId" }, { status: 400 });
        }

        const place = await fetchPlaceDetails(placeId, apiKey!);
        return NextResponse.json(place);
      }

      default:
        return NextResponse.json({ error: "Invalid 'type' param" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Places API Error:", err.message);
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}



export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Google Maps API key' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { type, payload } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing 'type' field in POST body" }, { status: 400 });
    }

    switch (type) {
      case 'optimize': {
        const response = await optimizeRequest(payload);
        const data = await response.json(); // 🔥 Important
        console.log("OPTIMIZED ROUTES", data);
        return NextResponse.json(data);
      }

      // Add more POST types here below

      default:
        return NextResponse.json({ error: "Invalid 'type' in POST body" }, { status: 400 });
    }
  } catch (err: any) {
    console.error('POST /api/places error:', err.message);
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 });
  }
}