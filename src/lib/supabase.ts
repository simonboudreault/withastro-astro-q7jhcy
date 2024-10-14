import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
);

export const testSupabase = async () => {
  return 'test supabase';
};

export const getSupabaseUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error('error getting user', error);
    return null;
  }
  return data;
};

export const isAdministrator = async () => {
  const { user } = await getSupabaseUser();

  return user?.id === '58dbfc9a-ad5d-46cc-9ccd-9efbd3b63fff';
};
