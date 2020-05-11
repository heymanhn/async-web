import { useApolloClient } from '@apollo/react-hooks';

import { clearLocalUser, clearLocalAppState } from 'utils/auth';
import { reset, track } from 'utils/analytics';

const useLogout = () => {
  const client = useApolloClient();

  const logout = async () => {
    // Clear analytics
    track('Logged out');
    reset();

    // Clear localStorage
    clearLocalUser();
    clearLocalAppState();

    // Clear apollo cache
    await client.clearStore();
  };

  return logout;
};

export default useLogout;
