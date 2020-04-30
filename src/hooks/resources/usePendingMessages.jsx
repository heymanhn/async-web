import { useApolloClient, useQuery } from '@apollo/react-hooks';

import localStateQuery from 'graphql/queries/localState';
import useMountEffect from 'hooks/shared/useMountEffect';

const usePendingMessages = () => {
  const client = useApolloClient();

  useMountEffect(() => {
    // In case the previous discussion/thread had pending messages
    client.writeData({ data: { pendingMessages: [] } });
  });

  const { data: localData } = useQuery(localStateQuery);
  if (localData) {
    const { pendingMessages } = localData;
    return pendingMessages;
  }

  return [];
};

export default usePendingMessages;
