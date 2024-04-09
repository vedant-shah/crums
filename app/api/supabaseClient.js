import { createClient, raw } from "@supabase/supabase-js";

const supabaseUrl = "https://zazftfazitjscambfsei.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Access auth admin api
const adminAuthClient = supabase.auth.admin;
export default supabase;
