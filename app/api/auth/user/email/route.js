import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import axios from 'axios';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Forward the request to the backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/auth/user/email`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error requesting email update:', error);
    
    if (error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

