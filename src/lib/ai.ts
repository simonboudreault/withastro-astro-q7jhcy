import Anthropic from '@anthropic-ai/sdk';
const apiKey = import.meta.env.ANTHROPIC_KEY;

const anthropic = new Anthropic({
  apiKey,
});
export async function useAnthropicApi(messages) {
  const completion = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    temperature: 0,
    // system: 'Respond only with short poems.',
    messages,
  });
  const contentBlock = completion.content[0] as any;
  return { result: contentBlock.text };
}
