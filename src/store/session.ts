// store/users.ts
import { atom } from 'nanostores';

export interface Part {
  type: string;
  content: string;
}

export interface Message {
  id: number;
  role: string;
  content: Part[];
}

export interface Session {
  id: number;
  label: string;
  conversation: Message[];
}
const newSession: Session = {
  id: 0,
  label: 'New Session',
  conversation: [
    {
      id: 0,
      role: 'user',
      content: [
        {
          type: 'text',
          content: 'Hello, I am a user',
        },
      ],
    },
  ],
};
export const $sessions = atom<Session[]>([newSession]);
export const $currentSession = atom<Session | null>($sessions.get()[0]); // todo create a new session on load

export function addSession(session: Session) {
  $sessions.set([...$sessions.get(), session]);
}
export function getSessions() {
  return $sessions.get();
}
export function setCurrentSession(session: Session) {
  console.log('setting current session', session);
  $currentSession.set(session);
}
export function setSessions(sessions: Session[]) {
  $sessions.set(sessions);
}
// export function addMessage(sessionId: number, message: Message) {
//   const session = $sessions.get().find((s) => s.id === sessionId);
//   if (!session) return;
//   session.conversation.push(message);
//   $sessions.set([...$sessions.get()]);
// }
// export function addPart(sessionId: number, messageId: number, part: Part) {
//   const session = $sessions.get().find((s) => s.id === sessionId);
//   if (!session) return;
//   const message = session.conversation.find((m) => m.id === messageId);
//   if (!message) return;
//   message.content.push(part);
//   $sessions.set([...$sessions.get()]);
// }
// export function removeSession(sessionId: number) {
//   $sessions.set($sessions.get().filter((s) => s.id !== sessionId));
// }
// export function removeMessage(sessionId: number, messageId: number) {
//   const session = $sessions.get().find((s) => s.id === sessionId);
//   if (!session) return;
//   session.conversation = session.conversation.filter((m) => m.id !== messageId);
//   $sessions.set([...$sessions.get()]);
// }
// export function removePart(sessionId: number, messageId: number, partId: number) {
//   const session = $sessions.get().find((s) => s.id === sessionId);
//   if (!session) return;
//   const message = session.conversation.find((m) => m.id === messageId);
//   if (!message) return;
//   message.content = message.content.filter((p) => p.id !== partId);
//   $sessions.set([...$sessions.get()]);
// }
