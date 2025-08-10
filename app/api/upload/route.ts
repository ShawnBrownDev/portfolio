import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function createSupabaseClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function POST(request: Request) {
  const supabase = await createSupabaseClient();
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Determine if it's a video or image based on file type
  const isVideo = file.type.startsWith('video/');
  const bucketName = 'project-images'; // Use same bucket for now
  const folderName = isVideo ? 'project-videos' : 'project-images';
  
  const fileExt = file.name.split('.').pop();
  const filePath = `${folderName}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { upsert: false });

  if (error) {
    console.error('Storage upload error:', error);
    return NextResponse.json({ 
      error: `Upload failed: ${error.message}`,
      details: error 
    }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return NextResponse.json({ url: urlData.publicUrl });
} 