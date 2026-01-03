import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || "https://site-url-missing.com";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || "missing-key";

if (supabaseUrl === "https://site-url-missing.com") {
    console.error("❌ SUPABASE ENV VARS MISSING IN BUILD! Using placeholder to prevent crash.");
    // We let it proceed so the build finishes, but API calls will fail (and fallback to mock).
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
