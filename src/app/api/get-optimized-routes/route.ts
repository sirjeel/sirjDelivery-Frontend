// app/api/get-optimized-routes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v1 } from '@googlemaps/routeoptimization';

const { RouteOptimizationClient } = v1;
const routeoptimizationClient = new RouteOptimizationClient();

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { model } = body;
  
      if (!model) {
        return NextResponse.json({ error: 'Model data is required' }, { status: 400 });
      }
  
      const request = {
        parent: 'projects/sirjdelivery',
        model,
      };
  
      const response = await routeoptimizationClient.optimizeTours(request);
  
      return NextResponse.json({ response });
    } catch (error: any) {
      console.error('Error fetching optimized routes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }