import { useEffect } from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import Pusher from 'pusher-js';
import camelcaseKeys from 'camelcase-keys';

import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import addNewMessageToMeetingSpaceMtn from 'graphql/mutations/local/addNewMessageToMeetingSpace';
import updateMeetingBadgeCountMutation from 'graphql/mutations/local/updateMeetingBadgeCount';
import { getLocalUser } from 'utils/auth';

const NEW_MESSAGE_EVENT = 'new_message';
const NEW_MEETING_EVENT = 'new_meeting';
const EDIT_MESSAGE_EVENT = 'edit_message';
const BADGE_COUNT_EVENT = 'badge_count';
// const EDIT_MEETING_EVENT = 'edit_meeting'; TODO later, no one can update a meeting yet

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

    Pusher.logToConsole = true; // Disable before committing
    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);

    function handleNewMessage(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });

      client.mutate({
        mutation: addNewMessageToMeetingSpaceMtn,
        variables: camelData,
      });

      // client.mutate({
      //   mutation:
      // })
    }

    function handleNewMeeting(data) {
      console.log('TODO: handle new meeting');
      console.dir(data);
    }

    function handleEditMessage(data) {
      console.log('TODO: handle edit message');
      console.dir(data);
    }

    function handleBadgeCount(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { meeting, badgeCount } = camelData;
      const { id: meetingId } = meeting;

      return client.mutate({
        mutation: updateMeetingBadgeCountMutation,
        variables: { meetingId, badgeCount },
      });
    }

    channel.bind(NEW_MESSAGE_EVENT, handleNewMessage);
    channel.bind(NEW_MEETING_EVENT, handleNewMeeting);
    channel.bind(EDIT_MESSAGE_EVENT, handleEditMessage);
    channel.bind(BADGE_COUNT_EVENT, handleBadgeCount);

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT, handleNewMessage);
      channel.unbind(NEW_MEETING_EVENT, handleNewMeeting);
      channel.unbind(EDIT_MESSAGE_EVENT, handleEditMessage);
      channel.unbind(BADGE_COUNT_EVENT, handleBadgeCount);
    };
  }, [isLoggedInData, client]);
};

export default usePusher;
