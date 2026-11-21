import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured on server' },
        { status: 500 },
      )
    }

    const { data, error } = await supabase
      .from('program_activities')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[api/programs:GET] Supabase select error:', error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    return NextResponse.json({ programs: data ?? [] }, { status: 200 })
  } catch (err) {
    console.error('[api/programs:GET] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Server error' },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured on server' },
        { status: 500 },
      )
    }

    const body = await request.json()
    if (!body || !body.title) {
      return NextResponse.json(
        { error: 'Program title and details are required' },
        { status: 400 },
      )
    }

    const programPayload = {
      id: body.id || `prog-${Date.now()}`,
      title: body.title.trim(),
      status: body.status || 'past',
      date: body.date || new Date().toISOString().split('T')[0],
      category: body.category || 'School Outreach',
      state: body.state || 'Abuja (FCT)',
      location: body.location || `${body.state || 'Abuja (FCT)'}, Nigeria`,
      description: body.description || '',
      main_image: body.mainImage || null,
      gallery_images: Array.isArray(body.galleryImages) ? body.galleryImages : [],
      highlights: Array.isArray(body.highlights) ? body.highlights : [],
      organizer: body.organizer || 'National Executive Directorate',
      created_at: body.createdAt || new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('program_activities')
      .upsert(programPayload, { onConflict: 'id' })
      .select()

    if (error) {
      console.error('[api/programs:POST] Supabase upsert error:', error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    return NextResponse.json({ success: true, program: data?.[0] ?? programPayload }, { status: 200 })
  } catch (err) {
    console.error('[api/programs:POST] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save program' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured on server' },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Program id is required' }, { status: 400 })
    }

    const { error } = await supabase.from('program_activities').delete().eq('id', id)

    if (error) {
      console.error('[api/programs:DELETE] Supabase delete error:', error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 })
  } catch (err) {
    console.error('[api/programs:DELETE] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete program' },
      { status: 500 },
    )
  }
}
