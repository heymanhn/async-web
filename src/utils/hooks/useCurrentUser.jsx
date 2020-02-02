import { useQuery } from 'react-apollo';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';

const useCurrentUser = () => {
  const { userId } = getLocalUser();
  const { loading, data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  if (loading || !data.user) return {};
  return data.user;
};

export default useCurrentUser;
