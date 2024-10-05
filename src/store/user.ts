// store/users.ts
import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
export interface User {
  id?: string;
  email?: string;
}

// export const $user = persistentAtom<User>('$user', { id: '', email: '' })
// export const $user = persistentAtom<User>('$user', { id: '', email: '' }, {
//   encode: JSON.stringify,
//   decode: JSON.parse,
// })

export const $persistentUser = persistentAtom<User>(
  '$persistentUser',
  { id: 'p', email: 'ersistent' },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  }
);

export const setPersistentUser = (user: User) => {
  console.log('SETTING PERSISTENT USER user', user);
  $persistentUser.set(user);
};

export const $user = atom<User>({ id: '', email: '' });

export function setUser(user: User) {
  // $users.set([...$users.get(), user]);
  $user.set({
    id: user.id,
    email: user.email,
  });
  console.log('SETTING USER user', user);
}
$user.subscribe((value) => {
  console.log('User store updated:', value);
});