import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const ORIGINAL_UPCOMING_EVENTS = [
  {
    date: 'Jun 15, 2025',
    day: '15',
    month: 'JUN',
    title: 'Heritage Walk & Cultural Marathon',
    subtitle: 'Hyderabad Heritage Circuit',
    description: 'A 5 km heritage trail through the walled city of Hyderabad — past Charminar, Laad Bazaar, and Salar Jung. Live classical performances at each landmark.',
    category: 'Cultural Walk',
    color: '#c8a96e',
    seats: '400 spots left',
    image: null
  },
  {
    date: 'Jul 08, 2025',
    day: '08',
    month: 'JUL',
    title: 'Sacred India Pilgrimage Yatra',
    subtitle: 'Tirupati · Varanasi · Ayodhya',
    description: 'A 12-day guided spiritual journey across India\'s most sacred dhams.Experience Ganga Aarti, temple darshan, and satsang sessions led by revered seers.',
    category: 'Pilgrimage Tour',
    color: '#335C8B',
    seats: '60 spots left',
    image: null
  },
  {
    date: 'Aug 22, 2025',
    day: '22',
    month: 'AUG',
    title: 'International Cultural Exchange Forum',
    subtitle: 'New Delhi — India Habitat Centre',
    description: 'A 2-day summit bringing together cultural attachés, artists, and diplomats from 20+ nations to foster bilateral cultural cooperation and people-to-people ties.',
    category: 'Global Summit',
    color: '#4a6fa5',
    seats: 'Registration open',
    image: null
  }
]

export async function GET() {
  try {
    // 1. Delete all existing upcoming events to start fresh
    const { error: deleteError } = await supabase
      .from('upcoming_events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Deletes all rows safely

    if (deleteError) {
      console.error('Error clearing upcoming_events:', deleteError)
      return NextResponse.json({ error: 'Failed to clear existing events' }, { status: 500 })
    }

    // 2. Insert original data
    const { error: insertError } = await supabase
      .from('upcoming_events')
      .insert(ORIGINAL_UPCOMING_EVENTS)

    if (insertError) {
      console.error('Error inserting original upcoming events:', insertError)
      return NextResponse.json({ error: 'Failed to insert original events' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Upcoming events synced successfully!' })
  } catch (error) {
    console.error('Sync API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
