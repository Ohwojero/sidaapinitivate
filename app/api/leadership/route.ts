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
      return NextResponse.json({ error: 'Supabase credentials not configured on server' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('leadership')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error('[api/leadership:GET] Supabase select error:', error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    const members = (data ?? []).map((item: any) => {
      let body = item.body
      let description = item.description || ''
      if (!body) {
        const bodyMatch = description.match(/<!--body:(.*?)-->/) || description.match(/^\[Body:\s*(.*?)\]/)
        if (bodyMatch) {
          body = bodyMatch[1].trim()
          description = description.replace(/<!--body:.*?-->/, '').replace(/^\[Body:\s*.*?\]\s*/, '').trim()
        } else {
          body = 'Board of Trustees'
        }
      }
      return {
        id: item.id,
        name: item.name,
        role: item.role,
        body: body || 'Board of Trustees',
        description,
        image: item.image ?? '',
        initials: item.initials || item.name.split(/\s+/).map((p: string) => p[0]).join('').slice(0, 2).toUpperCase(),
        created_at: item.created_at,
      }
    })

    return NextResponse.json({ leadership: members }, { status: 200 })
  } catch (err) {
    console.error('[api/leadership:GET] Unexpected error:', err)
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
      return NextResponse.json({ error: 'Supabase credentials not configured on server' }, { status: 500 })
    }

    const payload = await request.json()
    if (!payload || !payload.name) {
      return NextResponse.json({ error: 'Member name is required' }, { status: 400 })
    }

    const id = payload.id || `leader-${Date.now()}`
    const name = payload.name.trim()
    const role = (payload.role || 'Trustee').trim()
    const body = (payload.body || 'Board of Trustees').trim()
    const description = (payload.description || '').trim()
    const image = payload.image || null
    const initials =
      payload.initials ||
      name
        .split(/\s+/)
        .map((p: string) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    // 1. Try upserting with body column
    let { data, error } = await supabase
      .from('leadership')
      .upsert({
        id,
        name,
        role,
        body,
        description,
        image,
        initials,
      }, { onConflict: 'id' })
      .select()

    // 2. If body column does not exist yet in the database, embed in description
    if (error && (error.message?.includes('body') || (error as any).code === 'PGRST204')) {
      const embeddedDescription = body && body !== 'Board of Trustees'
        ? `<!--body:${body}-->${description}`
        : description

      const retry = await supabase
        .from('leadership')
        .upsert({
          id,
          name,
          role,
          description: embeddedDescription,
          image,
          initials,
        }, { onConflict: 'id' })
        .select()

      error = retry.error
      data = retry.data
    }

    if (error) {
      console.error('[api/leadership:POST] Supabase upsert error:', error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      member: {
        id,
        name,
        role,
        body,
        description,
        image: image || '',
        initials,
      },
    }, { status: 200 })
  } catch (err) {
    console.error('[api/leadership:POST] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save leadership member' },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase credentials not configured on server' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Member id is required' }, { status: 400 })
    }

    const { error } = await supabase.from('leadership').delete().eq('id', id)
    if (error) {
      console.error('[api/leadership:DELETE] Supabase delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, deletedId: id }, { status: 200 })
  } catch (err) {
    console.error('[api/leadership:DELETE] Unexpected error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to delete member' },
      { status: 500 },
    )
  }
}
