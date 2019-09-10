import { useApolloClient } from 'react-apollo';

import localStateQuery from 'graphql/queries/localState';

const useSelectedMeeting = () => {
  const client = useApolloClient();

  function checkSelectedMeeting(meetingId) {
    const { selectedMeetingId } = client.readQuery({ query: localStateQuery });
    if (selectedMeetingId !== meetingId) {
      client.writeData({ data: { selectedMeetingId: meetingId } });
    }
  }

  return checkSelectedMeeting;
};

export default useSelectedMeeting;
