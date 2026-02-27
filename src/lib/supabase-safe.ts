// Safe Supabase wrapper that prevents app crash if client fails to initialize
import type { SupabaseClient } from "@supabase/supabase-js";

let safeClient: SupabaseClient | null = null;

try {
  // Dynamic import would be async, so we try the static import
  const { supabase } = await import("@/integrations/supabase/client");
  safeClient = supabase;
} catch (e) {
  console.warn("Supabase client failed to initialize:", e);
}

export const getSupabase = () => safeClient;

export async function fetchShowDetails(): Promise<boolean> {
  try {
    const client = getSupabase();
    if (!client) return true;
    
    const { data, error } = await client
      .from("vehicle_settings")
      .select("show_details")
      .eq("id", 1)
      .maybeSingle();
    
    if (error || !data) return true;
    return data.show_details;
  } catch {
    return true;
  }
}

export async function updateShowDetails(newState: boolean): Promise<void> {
  try {
    const client = getSupabase();
    if (!client) return;
    
    await client
      .from("vehicle_settings")
      .update({ show_details: newState, updated_at: new Date().toISOString() })
      .eq("id", 1);
  } catch (err) {
    console.error("Failed to save settings:", err);
  }
}
