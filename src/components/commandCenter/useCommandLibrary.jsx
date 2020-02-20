import useResourceCreator from 'utils/hooks/useResourceCreator';

const useCommandLibrary = source => {
  const { handleCreateResource: handleCreateDocument } = useResourceCreator(
    'documents'
  );
  const { handleCreateResource: handleCreateDiscussion } = useResourceCreator(
    'discussions'
  );

  const newDocumentCommand = {
    icon: ['fal', 'plus-circle'],
    title: 'New document',
    action: handleCreateDocument,
    shortcut: 'N',
  };

  const newDiscussionCommand = {
    icon: ['fal', 'plus-circle'],
    title: 'New discussion',
    action: handleCreateDiscussion,
    shortcut: 'D',
  };

  const invitePeopleCommand = {
    icon: ['fal', 'user-circle'],
    title: 'Invite people',
    action: () => {},
    shortcut: 'P',
  };

  const inviteTeamCommand = {
    icon: ['fal', 'user-circle'],
    title: 'Invite your team',
    action: () => {},
    shortcut: 'T',
  };

  const goToInboxCommand = {
    icon: ['fal', 'arrow-circle-right'],
    title: 'Go to Inbox',
    action: () => {},
    shortcut: 'I',
  };

  const commands = {
    inbox: [newDocumentCommand, newDiscussionCommand, inviteTeamCommand],
    document: [
      newDocumentCommand,
      newDiscussionCommand,
      invitePeopleCommand,
      goToInboxCommand,
    ],
    discussion: [
      newDiscussionCommand,
      newDocumentCommand,
      invitePeopleCommand,
      goToInboxCommand,
    ],
  };

  return commands[source];
};

export default useCommandLibrary;