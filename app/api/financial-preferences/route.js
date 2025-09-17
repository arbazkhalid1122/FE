import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import api from '@/lib/axios'

export async function POST(request) {
  try {
    // Get the session to verify user authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { minimumDeployAmount, monthlyInvoiceCount } = body

    // Validate required fields
    if (!minimumDeployAmount || !monthlyInvoiceCount) {
      return NextResponse.json(
        { message: 'Missing required fields: minimumDeployAmount and monthlyInvoiceCount are required' },
        { status: 400 }
      )
    }

    // Validate data types
    if (typeof minimumDeployAmount !== 'number' || typeof monthlyInvoiceCount !== 'number') {
      return NextResponse.json(
        { message: 'Invalid data types: minimumDeployAmount and monthlyInvoiceCount must be numbers' },
        { status: 400 }
      )
    }

    // Validate positive values
    if (minimumDeployAmount <= 0 || monthlyInvoiceCount <= 0) {
      return NextResponse.json(
        { message: 'Values must be positive numbers' },
        { status: 400 }
      )
    }

    // Prepare data for backend
    const financialPreferencesData = {
      minimumDeployAmount,
      monthlyInvoiceCount,
      userId: session.user.id
    }

    console.log('Saving financial preferences for user:', session.user.id, financialPreferencesData)

    // Call backend API to save financial preferences
    const response = await api.post('/financial-preferences', financialPreferencesData, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Financial preferences saved successfully:', response.data)

    return NextResponse.json({
      message: 'Financial preferences saved successfully',
      data: response.data
    }, { status: 200 })

  } catch (error) {
    console.error('Error saving financial preferences:', error)
    
    // Handle different types of errors
    if (error.response) {
      // Backend API error
      return NextResponse.json(
        { 
          message: error.response.data?.message || 'Failed to save financial preferences',
          error: error.response.data 
        },
        { status: error.response.status || 500 }
      )
    } else if (error.request) {
      // Network error
      return NextResponse.json(
        { message: 'Network error: Unable to connect to server' },
        { status: 503 }
      )
    } else {
      // Other errors
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export async function GET(request) {
  try {
    // Get the session to verify user authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Fetching financial preferences for user:', session.user.id)

    // Call backend API to get financial preferences
    const response = await api.get(`/financial-preferences/${session.user.id}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    })

    console.log('Financial preferences fetched successfully:', response.data)

    return NextResponse.json({
      message: 'Financial preferences fetched successfully',
      data: response.data
    }, { status: 200 })

  } catch (error) {
    console.error('Error fetching financial preferences:', error)
    
    // Handle different types of errors
    if (error.response) {
      // Backend API error
      if (error.response.status === 404) {
        return NextResponse.json(
          { message: 'Financial preferences not found' },
          { status: 404 }
        )
      }
      
      return NextResponse.json(
        { 
          message: error.response.data?.message || 'Failed to fetch financial preferences',
          error: error.response.data 
        },
        { status: error.response.status || 500 }
      )
    } else if (error.request) {
      // Network error
      return NextResponse.json(
        { message: 'Network error: Unable to connect to server' },
        { status: 503 }
      )
    } else {
      // Other errors
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}

export async function PUT(request) {
  try {
    // Get the session to verify user authentication
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { minimumDeployAmount, monthlyInvoiceCount } = body

    // Validate required fields
    if (!minimumDeployAmount || !monthlyInvoiceCount) {
      return NextResponse.json(
        { message: 'Missing required fields: minimumDeployAmount and monthlyInvoiceCount are required' },
        { status: 400 }
      )
    }

    // Validate data types
    if (typeof minimumDeployAmount !== 'number' || typeof monthlyInvoiceCount !== 'number') {
      return NextResponse.json(
        { message: 'Invalid data types: minimumDeployAmount and monthlyInvoiceCount must be numbers' },
        { status: 400 }
      )
    }

    // Validate positive values
    if (minimumDeployAmount <= 0 || monthlyInvoiceCount <= 0) {
      return NextResponse.json(
        { message: 'Values must be positive numbers' },
        { status: 400 }
      )
    }

    // Prepare data for backend
    const financialPreferencesData = {
      minimumDeployAmount,
      monthlyInvoiceCount
    }

    console.log('Updating financial preferences for user:', session.user.id, financialPreferencesData)

    // Call backend API to update financial preferences
    const response = await api.put(`/financial-preferences/${session.user.id}`, financialPreferencesData, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Financial preferences updated successfully:', response.data)

    return NextResponse.json({
      message: 'Financial preferences updated successfully',
      data: response.data
    }, { status: 200 })

  } catch (error) {
    console.error('Error updating financial preferences:', error)
    
    // Handle different types of errors
    if (error.response) {
      // Backend API error
      return NextResponse.json(
        { 
          message: error.response.data?.message || 'Failed to update financial preferences',
          error: error.response.data 
        },
        { status: error.response.status || 500 }
      )
    } else if (error.request) {
      // Network error
      return NextResponse.json(
        { message: 'Network error: Unable to connect to server' },
        { status: 503 }
      )
    } else {
      // Other errors
      return NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    }
  }
}
