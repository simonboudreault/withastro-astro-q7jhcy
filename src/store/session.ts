// store/users.ts
import { atom } from 'nanostores';
import { v4 as uuidv4 } from 'uuid';

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
  id?: uuidv4;
  label: string;
  conversation: Message[];
  user?: uuidv4;
}

// const {
//   data: { user },
// } = await supabase.auth.getUser();
// console.log('user', user);

const defaultSession: Session = {
  // id: 0, //  ! should be uniqueand determined by the server
  id: uuidv4(), // ! this is a fake id that will be replaced by the server
  // user: uuidv4(),
  label: 'New Session',
  conversation: [],
};
const newSession = { ...defaultSession };
export const $sessions = atom<Session[]>([newSession]);
export const $currentSession = atom<Session | null>($sessions.get()[0]); // todo create a new session on load

export function addSession(session: Session) {
  $sessions.set([...$sessions.get(), session]);
}
export function setSessionUser(user: uuidv4) {
  const currentSession = $currentSession.get();
  if (!currentSession.user) {
    currentSession.user = user;
    const currentSessionIndex = $sessions
      .get()
      .findIndex((session) => session.id === currentSession.id);
    const sessions = $sessions.get();
    sessions[currentSessionIndex] = currentSession;
    $sessions.set(sessions);
  }
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
function getSessionById(id: number) {
  return $sessions.get().find((session) => session.id === id);
}
function updateSession(session: Session) {
  const sessions = $sessions.get();
  const index = sessions.findIndex((s) => s.id === session.id);
  console.log('index', index);
  sessions[index] = session;
  $sessions.set(sessions); // ? est-ce que ca remplace toutes les sessions à chaque fois ?
}
async function saveSession(session: Session) {
  try {
    const res = await fetch('/api/session/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    const afterData = await res.json();
    console.log('afterData', afterData);
    updateSession(afterData);
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}
export function addMessageToCurrentSession(message: Message, omitSave = false) {
  const session = $currentSession.get();
  const sessionData = JSON.parse(JSON.stringify(session));
  if (sessionData) {
    const updatedConversation = [...sessionData.conversation, message];
    sessionData.conversation = updatedConversation;
    updateSession(sessionData);
    $currentSession.set(sessionData);
    !omitSave && saveSession(sessionData);
  }

  // call the api to save the message
}
