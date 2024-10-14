export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import Anthropic from '@anthropic-ai/sdk';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const completionEndpoint = '/api/ai/completion';
  const body = await request.json();
  const firstMessage = body.messages[0];

  return new Response(JSON.stringify({ firstMessage }), {});
};
