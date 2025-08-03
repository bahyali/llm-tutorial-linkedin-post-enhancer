// src/app/api/generate/route.ts

import { NextResponse } from 'next/server';
import { PostGenerationRequest } from '@/lib/types';
import { generatePostWithAI } from '@/lib/ai';

// This function handles POST requests to /api/generate
export async function POST(request: Request) {
  try {
    // 1. Parse and Validate the Request Body
    const body = await request.json();
    const { context, idea, audience, tone, cta } = body as PostGenerationRequest;

    // Basic validation to ensure all required fields are present
    if (!context || !idea || !audience || !tone || !cta) {
      return NextResponse.json(
        { error: 'Missing required fields in request.' },
        { status: 400 } // Bad Request
      );
    }
    
    // 2. Call the AI Service
    // The actual AI call is abstracted away in the helper function
    const post = await generatePostWithAI({ context, idea, audience, tone, cta });
    
    // 3. Return a Successful Response
    return NextResponse.json({ post });

  } catch (error: any) {
    // 4. Handle Errors Gracefully
    console.error(`[API /api/generate] - ${error.message}`);
    
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred.' },
      { status: 500 } // Internal Server Error
    );
  }
}