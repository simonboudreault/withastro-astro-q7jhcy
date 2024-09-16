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
  id?: number;
  label: string;
  conversation: Message[];
}
const defaultSession: Session = {
  // id: 0, //  ! should be uniqueand determined by the server
  label: 'New Session',
  conversation: [],
};
const newSession = { ...defaultSession };
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
async function saveSession(session: Session) {
  try {
    const res = await fetch('http://localhost:4321/api/session/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    const data = await res.json();
    console.log('data', data);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
export function addMessageToCurrentSession(message: Message) {
  const session = $currentSession.get();
  if (session) {
    session.conversation.push(message);
    $currentSession.set(session);
  }
  saveSession(session);

  // call the api to save the message
}
