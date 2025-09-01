import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0"

serve(async (req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Authorization header required', { status: 401 })
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
      return new Response('Unauthorized', { status: 401 })
    }

    // Delete user's palettes and associated images first
    const { data: palettes } = await supabaseAdmin
      .from('palettes')
      .select('image_url')
      .eq('user_id', user.id)

    // Delete images from storage if they exist
    if (palettes) {
      for (const palette of palettes) {
        if (palette.image_url) {
          const imagePath = palette.image_url.split('/').pop()
          if (imagePath) {
            await supabaseAdmin.storage
              .from('palette-images')
              .remove([imagePath])
          }
        }
      }
    }

    // Delete user's palettes
    await supabaseAdmin
      .from('palettes')
      .delete()
      .eq('user_id', user.id)

    // Delete user's profile
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('user_id', user.id)

    // Finally delete the auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

    if (deleteError) {
      throw deleteError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Delete account error:', error)
    return new Response(JSON.stringify({ error: 'Failed to delete account' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})