import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Delete account function called')
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Authorization header required', { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify the user is authenticated
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      console.log('Auth error:', authError)
      return new Response('Unauthorized', { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log('Deleting account for user:', user.id)

    // Delete user's palettes and associated images first
    const { data: palettes } = await supabaseAdmin
      .from('palettes')
      .select('image_url')
      .eq('user_id', user.id)

    console.log('Found palettes:', palettes?.length)

    // Delete entire user folder from storage
    console.log('Deleting user folder from storage')
    const { data: userFiles } = await supabaseAdmin.storage
      .from('palette-images')
      .list(user.id, { limit: 1000 })

    if (userFiles && userFiles.length > 0) {
      const filePaths = userFiles.map(file => `${user.id}/${file.name}`)
      console.log('Deleting files:', filePaths)
      await supabaseAdmin.storage
        .from('palette-images')
        .remove(filePaths)
    }

    // Also delete any individual image files referenced in palettes (fallback)
    if (palettes) {
      for (const palette of palettes) {
        if (palette.image_url) {
          // Handle both full URLs and just filenames
          const imagePath = palette.image_url.includes('/') 
            ? palette.image_url.split('/').pop()
            : palette.image_url
          if (imagePath && !imagePath.startsWith(user.id)) {
            console.log('Deleting individual image:', imagePath)
            await supabaseAdmin.storage
              .from('palette-images')
              .remove([imagePath])
          }
        }
      }
    }

    // Delete user's palettes
    console.log('Deleting palettes')
    await supabaseAdmin
      .from('palettes')
      .delete()
      .eq('user_id', user.id)

    // Delete user's profile
    console.log('Deleting profile')
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', user.id)

    // Finally delete the auth user
    console.log('Deleting auth user')
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Failed to delete auth user:', deleteError)
      throw deleteError
    }

    console.log('Account deletion completed successfully')
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Delete account error:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete account' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})