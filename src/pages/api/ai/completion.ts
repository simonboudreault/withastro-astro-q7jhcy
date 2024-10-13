export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import Anthropic from '@anthropic-ai/sdk';
// Initialize the Supabase client

const apiKey = import.meta.env.ANTHROPIC_KEY;

const anthropic = new Anthropic({
  apiKey,
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const sessionResponse = await supabase.auth.getSession();
  const user = sessionResponse?.data?.session?.user;
  console.log('user', user);
  // if (user.id !== '58dbfc9a-ad5d-46cc-9ccd-9efbd3b63ff') {
  if (user.id !== '58dbfc9a-ad5d-46cc-9ccd-9efbd3b63fff') {
    console.log('Unauthorized');
    return new Response('Unauthorized', { status: 401 });
  }
  console.log('Authorized');

  const body = await request.json();
  const messages = body.messages;

  try {
    if (false /* not implementeed */) {
    }
    const completion = await useAnthropicApi(messages);

    console.log(completion);

    return new Response(JSON.stringify(completion), {
      status: 200,
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    return new Response(null, { status: 400 });
  }

  // let { data: sessions, error } = await supabase.from('sessions').select('*');
};

async function useAnthropicApi(messages) {
  const completion = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    temperature: 0,
    // system: 'Respond only with short poems.',
    messages,
  });
  // const msg = await anthropic.messages.create({
  //   // model: 'claude-3-opus-20240229',
  //   model: 'claude-3-sonnet-20240229',
  //   max_tokens: 1024,
  //   messages:
  //     // [{ role: 'user', content: text }],
  //     [
  //       { role: 'user', content: "What's the Greek name for Sun? (A) Sol (B) Helios (C) Sun" },
  //       { role: 'assistant', content: 'The best answer is (' },
  //     ],
  // });
  const contentBlock = completion.content[0] as any;
  return { result: contentBlock.text };
}
