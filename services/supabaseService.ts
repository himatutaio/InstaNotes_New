import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zvmtctpajbbxdhesolkn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2bXRjdHBhamJieGRoZXNvbGtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDY1NzEsImV4cCI6MjA4MDMyMjU3MX0.iwjiI4v_IORt53P_pYhLI4jBEZrAaH7jhoLN0a_42QM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};