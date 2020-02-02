import { useEffect } from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import Pusher from 'pusher-js';
import camelcaseKeys from 'camelcase-keys';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import updateBadgeCountMutation from 'graphql/mutations/local/updateBadgeCount';
import { getLocalUser } from 'utils/auth';

const NEW_MESSAGE_EVENT = 'new_message';
const DOCUMENT_ACCESS_EVENT = 'document_access';

const {
  REACT_APP_ASYNC_API_URL,
  REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_APP_CLUSTER,
} = process.env;

const usePusher = () => {
  const client = useApolloClient(); // Workaround for the exhaustive-deps warnings
  const { data: isLoggedInData } = useQuery(isLoggedInQuery);

  useEffect(() => {
    if (!isLoggedInData || !isLoggedInData.isLoggedIn) return undefined;
    const { userId } = getLocalUser();

    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);

    function handleBadgeCount(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { notification } = camelData;

      client.mutate({
        mutation: updateBadgeCountMutation,
        variables: { userId, notification },
      });
    }

    channel.bind(NEW_MESSAGE_EVENT, handleBadgeCount);
    channel.bind(DOCUMENT_ACCESS_EVENT, handleBadgeCount);

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT, handleBadgeCount);
      channel.bind(DOCUMENT_ACCESS_EVENT, handleBadgeCount);
    };
  }, [isLoggedInData, client]);
};

export default usePusher;
