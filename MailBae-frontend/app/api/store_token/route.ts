import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    user_id,
    access_token,
    refresh_token,
    expires_at,
    scope,
    token_type,
    id_token
  } = body;

  const { data, error } = await supabase
    .from('gmail_tokens')
    .upsert({
      user_id,
      access_token,
      refresh_token,
      expires_at,
      scope,
      token_type,
      id_token,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Success!' });
}
