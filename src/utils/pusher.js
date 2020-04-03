import Pusher from 'pusher-js';

import { getLocalUser } from 'utils/auth';

const {
  REACT_APP_ASYNC_API_URL,
  REACT_APP_PUSHER_APP_KEY,
  REACT_APP_PUSHER_APP_CLUSTER,
} = process.env;

const initPusher = () => {
  const { userId } = getLocalUser();

  const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
    authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
    cluster: REACT_APP_PUSHER_APP_CLUSTER,
    useTLS: true,
  });

  const channelName = `private-channel-${userId}`;
  const channel = pusher.subscribe(channelName);

  return { pusher, channel };
};

export default initPusher;
