import { useApolloClient } from 'react-apollo';
import Pusher from 'pusher-js';

import meetingsQuery from 'graphql/queries/meetings';
import { MEETINGS_QUERY_SIZE } from 'graphql/constants';
import { snakedQueryParams } from 'utils/queryParams';
import { getLocalUser } from 'utils/auth';
import useMountEffect from 'utils/hooks/useMountEffect';

const NEW_MESSAGE_EVENT = 'new_message';
const NEW_MEETING_EVENT = 'new_meeting';
const EDIT_MESSAGE_EVENT = 'edit_message';
// const EDIT_MEETING_EVENT = 'edit_meeting'; TODO later, no one can update a meeting yet

const usePusher = () => {
  const {
    REACT_APP_ASYNC_API_URL,
    REACT_APP_PUSHER_APP_KEY,
    REACT_APP_PUSHER_APP_CLUSTER,
  } = process.env;
  const client = useApolloClient();

  function handleNewMessage(pusherData) {
    const data = client.readQuery({
      query: meetingsQuery,
      variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
    });

    if (!data) return;
    const { meetings: { items, pageToken, __typename } } = data;
    const { meeting_id, message } = pusherData;
    const { conversation_id } = message;

    const index = items
      .map(i => i.meeting)
      .findIndex(m => m.id === meeting_id);
    const meetingItem = items[index];

    const { unreadConversationIds } = meetingItem;
    if (unreadConversationIds && unreadConversationIds.includes(conversation_id)) return;

    const newUnreadConvos = [...(unreadConversationIds || []), conversation_id];

    client.writeQuery({
      query: meetingsQuery,
      variables: { queryParams: snakedQueryParams({ size: MEETINGS_QUERY_SIZE }) },
      data: {
        meetings: {
          pageToken,
          items: [
            ...items.slice(0, index),
            {
              ...meetingItem,
              unreadConversationIds: newUnreadConvos,
            },
            ...items.slice(index + 1),
          ],
          __typename,
        },
      },
    });
  }

  function handleNewMeeting(data) {
    console.log('TODO: handle new meeting');
    console.dir(data);
  }

  function handleEditMessage(data) {
    console.log('TODO: handle edit message');
    console.dir(data);
  }

  useMountEffect(() => {
    Pusher.logToConsole = true; // Disable before committing
    const pusher = new Pusher(REACT_APP_PUSHER_APP_KEY, {
      authEndpoint: `${REACT_APP_ASYNC_API_URL}/pusher/auth`,
      cluster: REACT_APP_PUSHER_APP_CLUSTER,
      useTLS: true,
    });

    const { userId } = getLocalUser();
    const channelName = `private-channel-${userId}`;
    const channel = pusher.subscribe(channelName);

    channel.bind(NEW_MESSAGE_EVENT, handleNewMessage);
    channel.bind(NEW_MEETING_EVENT, handleNewMeeting);
    channel.bind(EDIT_MESSAGE_EVENT, handleEditMessage);

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT, handleNewMessage);
      channel.unbind(NEW_MEETING_EVENT, handleNewMeeting);
      channel.unbind(EDIT_MESSAGE_EVENT, handleEditMessage);
    };
  }, []);
};

export default usePusher;
