import useMountEffect from 'utils/hooks/useMountEffect';
import Pusher from 'pusher-js';

import { getLocalUser } from 'utils/auth';

const usePusher = (cb) => {
  const {
    REACT_APP_ASYNC_API_URL,
    REACT_APP_PUSHER_APP_KEY,
    REACT_APP_PUSHER_APP_CLUSTER,
  } = process.env;

  useMountEffect(() => {
    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      encrypted: true,
    });

    function eventHandler(data) {
      cb(data);
    }

    const { userId } = getLocalUser();
    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);
    channel.bind('message', eventHandler);

    return () => {
      channel.unbind('message', eventHandler);
    };
  }, []);
};

export default usePusher;
