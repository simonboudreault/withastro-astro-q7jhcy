// store/users.ts
import { atom } from 'nanostores';

export interface User {
  id: number;
  name: string;
}
export const $users = atom<User[]>([]);

export function addUser(user: User) {
  $users.set([...$users.get(), user]);
}
