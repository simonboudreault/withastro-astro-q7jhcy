// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { setPersistentUser, setUser, $persistentUser } from '../../../store/user';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  console.log('signin');
  console.log(request.body);

  const { email, password } = await request.json();

  // const formData = await request.formData();
  // const email = formData.get('email')?.toString();
  // const password = formData.get('password')?.toString();

  console.log(email, password);
  if (!email || !password) {
    return new Response('Email and password are required', { status: 400 });
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const { access_token, refresh_token, user } = data.session;
  console.log('user data', data);
  cookies.set('sb-access-token', access_token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  cookies.set('sb-refresh-token', refresh_token, {
    path: '/',
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  // const testUserPersistent = {
  //   id: 'modified id',
  //   email: 'modified email',
  // };
  // console.log('before setting the p user', testUserPersistent);
  // setPersistentUser(testUserPersistent);
  // console.log('after setting the p user', $persistentUser.get());

  // return user data
  return new Response(JSON.stringify(user), {
    headers: {
      'content-type': 'application/json',
    },
  });

  return redirect('/dashboard');
};
