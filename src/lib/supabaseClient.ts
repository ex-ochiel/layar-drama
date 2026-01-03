import { createClient } from '@supabase/supabase-js'

// EMERGENCY FIX: Hardcoded credentials because Vercel Env Vars are not being read.
const supabaseUrl = "https://bozlkhqnjaizqtkmmdsh.supabase.co";
const supabaseAnonKey = "sb_publishable_EtEOgiPYhPV7GS9S9_fBiA_QZt_T8x-";

// Cleaned up debug logs
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ SUPABASE CREDENTIALS MISSING!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
