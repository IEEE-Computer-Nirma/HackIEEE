import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';

export const showKiroCollaboration = flag({
  key: 'showKiroCollaboration',
  adapter: vercelAdapter(),
});
