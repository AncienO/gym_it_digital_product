# CRITICAL: Add Service Role Key to Environment Variables

## Where to Find Your Service Role Key:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your gym-it project
3. Click "Settings" (gear icon) in the left sidebar
4. Click "API" under Project Settings
5. Scroll down to "Project API keys"
6. Find **"service_role"** key (NOT anon key!)
7. Click "Reveal" and copy the key

## Add to Your Environment:

### Local Development (.env.local):
Add this line:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Render Deployment:
1. Go to Render Dashboard
2. Click on your gym-it service
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Key: `SUPABASE_SERVICE_ROLE_KEY`
6. Value: Paste the service role key
7. Click "Save Changes"
8. Render will automatically redeploy

## Security Warning:
⚠️ NEVER commit the service role key to GitHub!
⚠️ NEVER expose it to the client-side!
⚠️ Only use in API routes/server-side code!

The service role key bypasses ALL RLS policies - use with caution!
