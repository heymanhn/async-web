import { useQuery } from '@apollo/react-hooks';

import currentUserQuery from 'graphql/queries/currentUser';
import { getLocalUser } from 'utils/auth';

const useCurrentUser = () => {
  const { userId } = getLocalUser();
  const { data } = useQuery(currentUserQuery, {
    variables: { userId },
  });

  return data ? data.user : {};
};

export default useCurrentUser;
