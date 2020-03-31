import { useContext } from 'react';
import { navigate } from '@reach/router';

import useResourceCreator from 'utils/hooks/useResourceCreator';
import { NavigationContext, DocumentContext } from 'utils/contexts';

const useCommandLibrary = source => {
  const {
    setIsResourceAccessModalOpen,
    setIsInviteModalOpen,
    setResourceCreationModalMode,
  } = useContext(NavigationContext);
  const { documentId } = useContext(DocumentContext);
  const { handleCreateResource: handleCreateDocument } = useResourceCreator(
    'documents'
  );
  const { handleCreateResource: handleCreateDiscussion } = useResourceCreator(
    'discussions'
  );

  const newDocumentCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New document',
    action: handleCreateDocument,
    shortcut: 'N',
  };

  const newDocumentDiscussionCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'Start a discussion',
    action: () => navigate(`/documents/${documentId}/discussions`),
    shortcut: 'D',
  };

  const newDiscussionCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New discussion',
    action: handleCreateDiscussion,
    shortcut: 'D',
  };

  const newWorkspaceCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New workspace',
    action: () => setResourceCreationModalMode('workspace'),
    shortcut: 'W',
  };

  const invitePeopleCommand = {
    type: 'command',
    icon: ['fal', 'user-circle'],
    title: 'Invite people',
    action: () => setIsResourceAccessModalOpen(true),
    shortcut: 'P',
  };

  const inviteTeamCommand = {
    type: 'command',
    icon: ['fal', 'user-circle'],
    title: 'Invite your team',
    action: () => setIsInviteModalOpen(true),
    shortcut: 'T',
  };

  const goToInboxCommand = {
    type: 'command',
    icon: ['fal', 'arrow-circle-right'],
    title: 'Go to Inbox',
    action: () => navigate('/inbox'),
    shortcut: 'I',
  };

  const commands = {
    inbox: [
      newDocumentCommand,
      newDiscussionCommand,
      newWorkspaceCommand,
      inviteTeamCommand,
    ],
    document: [
      newDocumentCommand,
      newDocumentDiscussionCommand,
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
