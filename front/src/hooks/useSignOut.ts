import { signOut } from 'next-auth/react';

export const useSignOut = () => {
  const handleSignOut = () => {
    signOut({ callbackUrl: window.location.origin });
  };

  return { handleSignOut };
};
