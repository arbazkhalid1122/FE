import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Forward the request to the backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/user/email/confirm`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error confirming email update:', error);
    
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

