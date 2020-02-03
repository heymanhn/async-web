import { useQuery } from 'react-apollo';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';

const useCurrentUser = () => {
  const { userId } = getLocalUser();
  const { data } = useQuery(currentUserQuery, {
    variables: { id: userId },
  });

  return data ? data.user : {};
};

export default useCurrentUser;
