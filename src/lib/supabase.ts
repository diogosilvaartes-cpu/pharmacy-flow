import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://pkyhdtaevvyziitpbkib.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBreWhkdGFldnZ5emlpdHBia2liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2Njk2MDksImV4cCI6MjA4OTI0NTYwOX0.yPbpoWjPuz6fTAm-JpjymWzdXA8b6TbBelP1i4s1OJg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
