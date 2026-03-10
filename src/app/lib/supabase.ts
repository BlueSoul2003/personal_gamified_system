import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Only create a real client if both env vars are properly configured
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("http")) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    // Create a dummy client that won't crash the app
    // The GameContext checks isSupabaseConfigured() before any calls
    supabase = createClient("https://placeholder.supabase.co", "placeholder");
}

export { supabase };
