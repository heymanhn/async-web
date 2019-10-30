import { useEffect } from 'react';
import { useApolloClient, useQuery } from 'react-apollo';
import Pusher from 'pusher-js';
import camelcaseKeys from 'camelcase-keys';

import { MEETINGS_QUERY_SIZE } from 'graphql/constants';
import isLoggedInQuery from 'graphql/queries/isLoggedIn';
import meetingsQuery from 'graphql/queries/meetings';
import addNewPendingMessage from 'graphql/mutations/local/addNewPendingMessage';
import addNewMessageToMeetingSpaceMtn from 'graphql/mutations/local/addNewMessageToMeetingSpace';
import addNewMessageToConversationMtn from 'graphql/mutations/local/addNewMessageToConversation';
import addNewMeetingToMeetingsMtn from 'graphql/mutations/local/addNewMeetingToMeetings';
import updateMeetingBadgeCountMutation from 'graphql/mutations/local/updateMeetingBadgeCount';
import updateMeetingInMeetingsMtn from 'graphql/mutations/local/updateMeetingInMeetings';
import { getLocalUser } from 'utils/auth';
import { isDiscussionOpen } from 'utils/navigation';
import { snakedQueryParams } from 'utils/queryParams';

const NEW_MESSAGE_EVENT = 'new_message';
const EDIT_MEETING_EVENT = 'edit_meeting';
const BADGE_COUNT_EVENT = 'badge_count';
// const NEW_MEETING_EVENT = 'new_meeting'; TODO later
// const EDIT_MESSAGE_EVENT = 'edit_message'; TODO later

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

    function handleNewMessage(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { message } = camelData;
      const { conversationId } = message;

      client.mutate({
        mutation: addNewMessageToMeetingSpaceMtn,
        variables: camelData,
      });

      if (isDiscussionOpen(conversationId)) {
        client.mutate({
          mutation: addNewPendingMessage,
          variables: { message },
        });
      } else {
        client.mutate({
          mutation: addNewMessageToConversationMtn,
          variables: {
            isUnread: true,
            message,
          },
        });
      }
    }

    function handleEditMeeting(pusherData) {
      const meeting = camelcaseKeys(pusherData, { deep: true });

      const data = client.readQuery({
        query: meetingsQuery,
        variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
      });
      if (!data) return null;

      const { meetings: { items } } = data;
      const index = items
        .map(i => i.meeting)
        .findIndex(m => m.id === meeting.id);

      if (index < 0) {
        return client.mutate({
          mutation: addNewMeetingToMeetingsMtn,
          variables: { meeting },
        });
      }

      return client.mutate({
        mutation: updateMeetingInMeetingsMtn,
        variables: { meeting },
      });
    }

    function handleBadgeCount(pusherData) {
      const camelData = camelcaseKeys(pusherData, { deep: true });
      const { meetingId, badgeCount } = camelData;

      client.mutate({
        mutation: updateMeetingBadgeCountMutation,
        variables: { meetingId, badgeCount },
      });
    }

    channel.bind(NEW_MESSAGE_EVENT, handleNewMessage);
    channel.bind(EDIT_MEETING_EVENT, handleEditMeeting);
    channel.bind(BADGE_COUNT_EVENT, handleBadgeCount);

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT, handleNewMessage);
      channel.unbind(EDIT_MEETING_EVENT, handleEditMeeting);
      channel.unbind(BADGE_COUNT_EVENT, handleBadgeCount);
    };
  }, [isLoggedInData, client]);
};

export default usePusher;
