// With `output: 'hybrid'` configured:
export const prerender = false;
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import { useAnthropicApi } from '../../../lib/ai';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (request.headers.get('Content-Type') === 'application/json') {
    const session = await request.json();
    const label = session.label;

    if (label === 'New Session') {
      const firstMessage = session.conversation.find((message) => message.role === 'user');
      firstMessage.content = firstMessage.content
        .map((part) => part.content)
        .join('\n')
        .trim();
      const formatForLAbelGeneration = [
        {
          role: 'assistant',
          content:
            'answer with only the title, no prequel, no explanation no white space, only the generated title. Create a title in maximum 5 words of the following : ',
        },
        firstMessage,
      ];
      const { result: generatedLabel } = await useAnthropicApi(formatForLAbelGeneration);
      session.label = generatedLabel;
    }
    const upsertResponse = await upsert('sessions', session);
    return new Response(JSON.stringify(upsertResponse), {
      status: 200,
    });
  }
  return new Response(null, { status: 400 });

  // let { data: sessions, error } = await supabase.from('sessions').select('*');
};

async function upsert(table: string, rowData: Record<string, any>) {
  try {
    const { data, error } = await supabase.from(table).upsert(rowData).select();

    if (error) {
      console.error('Error inserting data:', error);
      return { success: false, error };
    }

    console.log('Data inserted successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { success: false, error };
  }
}
