# 🛠️ Setting Up Video Storage

## Quick Fix (Immediate Solution)

The video upload should now work using the existing `project-images` bucket. Videos will be stored in a `project-videos/` folder within that bucket.

## Steps to Test:

1. **Try uploading a video now** - it should work with the existing bucket
2. **Check the browser console** for any detailed error messages
3. **Verify the file size** is under 50MB

## Creating a Dedicated Video Bucket (Optional)

If you want a separate bucket for videos, follow these steps in your Supabase dashboard:

### 1. Create Storage Bucket
```sql
-- Go to Supabase Dashboard > Storage > Create Bucket
Bucket Name: project-videos
Public: true (for public access to videos)
```

### 2. Set Bucket Policies
```sql
-- Allow public access to read videos
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'project-videos');

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-videos' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their videos
CREATE POLICY "Authenticated Delete" ON storage.objects FOR DELETE USING (bucket_id = 'project-videos' AND auth.role() = 'authenticated');
```

### 3. Update Upload API (after bucket creation)
```typescript
// In app/api/upload/route.ts, change this line:
const bucketName = 'project-images'; // Use same bucket for now

// To this:
const bucketName = isVideo ? 'project-videos' : 'project-images';
```

## Troubleshooting

### If you still get 500 errors:

1. **Check browser console** for detailed error messages
2. **Verify Supabase connection** - try uploading an image first
3. **Check file format** - ensure it's MP4, WebM, or OGG
4. **Check file size** - must be under 50MB
5. **Check network** - ensure stable internet connection

### Common Issues:

- **File too large**: Compress video or reduce quality
- **Wrong format**: Convert to MP4, WebM, or OGG
- **Network timeout**: Try smaller file or better connection
- **Storage full**: Check Supabase storage limits

## Testing Steps:

1. Try uploading a small video file (under 10MB)
2. Check if it appears in Supabase Storage
3. Verify the video plays in the project modal
4. Test on different browsers/devices