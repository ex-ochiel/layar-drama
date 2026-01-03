import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "";

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ SUPABASE ENV VARS MISSING IN BUILD!");
    console.error("URL:", supabaseUrl ? "Set" : "Missing");
    console.error("KEY:", supabaseAnonKey ? "Set" : "Missing");
} else {
    console.log("✅ Supabase Config Loaded.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
