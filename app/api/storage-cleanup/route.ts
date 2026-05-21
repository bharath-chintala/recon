import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const shouldClean = searchParams.get('clean') === 'true'

    // 1. Get all events
    const { data: events, error: eventsError } = await supabase.from('events').select('image')
    if (eventsError) throw eventsError

    // 2. Get all upcoming events
    const { data: upcoming, error: upcomingError } = await supabase.from('upcoming_events').select('image')
    if (upcomingError) throw upcomingError

    // 3. Extract filenames from URLs used in DB
    const activeImages = new Set<string>()

    const extractFilename = (url: string | null) => {
      if (!url) return null
      const parts = url.split('/')
      return parts[parts.length - 1]
    }

    const addImageAndThumb = (url: string | null) => {
      const filename = extractFilename(url)
      if (filename) {
        activeImages.add(filename)
        // Also add the potential thumbnail
        if (filename.includes('.webp') && !filename.includes('-thumb')) {
          activeImages.add(filename.replace('.webp', '-thumb.webp'))
        }
      }
    }

    events?.forEach(e => addImageAndThumb(e.image))
    upcoming?.forEach(e => addImageAndThumb(e.image))

    // 4. List all files in the bucket
    const { data: storageFiles, error: storageError } = await supabase.storage.from('event-images').list()
    if (storageError) throw storageError

    const orphans = storageFiles
      .map(file => file.name)
      .filter(name => !activeImages.has(name) && name !== '.emptyFolderPlaceholder')

    let deletedCount = 0

    // 5. If clean=true, delete them
    if (shouldClean && orphans.length > 0) {
      const { error: deleteError } = await supabase.storage.from('event-images').remove(orphans)
      if (deleteError) throw deleteError
      deletedCount = orphans.length
    }

    return NextResponse.json({
      success: true,
      total_files: storageFiles.length,
      active_database_images: activeImages.size,
      orphans_found: orphans.length,
      orphans_deleted: deletedCount,
      orphan_list: orphans
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
