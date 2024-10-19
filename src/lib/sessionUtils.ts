import type { Part } from '@/store/session';

export const sessionContentPartsToString = (content: Part[]): string => {
  return content
    .map((part) => part.content)
    .join('\n')
    .trim();
};

export const sessionContentStringToParts = (content: string): Part[] => {
  return content.split('\n').map((content) => ({ type: 'text', content }));
};
