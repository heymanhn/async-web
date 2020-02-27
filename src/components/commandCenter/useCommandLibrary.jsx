import { useContext } from 'react';
import { navigate } from '@reach/router';

import { getLocalAppState } from 'utils/auth';
import useResourceCreator from 'utils/hooks/useResourceCreator';
import { ResourceAccessContext, DocumentContext } from 'utils/contexts';

const useCommandLibrary = source => {
  const { setIsModalOpen } = useContext(ResourceAccessContext);
  const { documentId } = useContext(DocumentContext);
  const { organizationId } = getLocalAppState();
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
    action: () => window.open(`/documents/${documentId}/discussions`, '_blank'),
    shortcut: 'D',
  };

  const newDiscussionCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New discussion',
    action: handleCreateDiscussion,
    shortcut: 'D',
  };

  const invitePeopleCommand = {
    type: 'command',
    icon: ['fal', 'user-circle'],
    title: 'Invite people',
    action: () => setIsModalOpen(true),
    shortcut: 'P',
  };

  const inviteTeamCommand = {
    type: 'command',
    icon: ['fal', 'user-circle'],
    title: 'Invite your team',
    action: () => navigate(`/organizations/${organizationId}/invites`),
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
    inbox: [newDocumentCommand, newDiscussionCommand, inviteTeamCommand],
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
