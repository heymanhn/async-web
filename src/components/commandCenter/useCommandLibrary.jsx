import React, { useContext } from 'react';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import useCurrentUser from 'utils/hooks/useCurrentUser';
import useResourceCreator from 'utils/hooks/useResourceCreator';
import { NavigationContext, DocumentContext } from 'utils/contexts';

import Avatar from 'components/shared/Avatar';

const Title = styled.span({
  fontWeight: 600,
  marginLeft: '4px',
});

const StyledAvatar = styled(Avatar)({
  marginRight: '12px',
});

const useCommandLibrary = (source, setSource, title) => {
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
  const currentUser = useCurrentUser();

  const newDocumentCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New document',
    action: handleCreateDocument,
    shortcut: 'N',
  };

  const newWorkspaceDocumentCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New document... ',
    action: () => setSource('workspaceDocument'),
    shortcut: 'N',
    keepOpen: true,
  };

  const newDiscussionCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New discussion',
    action: handleCreateDiscussion,
    shortcut: 'D',
  };

  const newDocumentDiscussionCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'Start a discussion',
    action: () => navigate(`/documents/${documentId}/discussions`),
    shortcut: 'D',
  };

  const newWorkspaceDiscussionCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'New discussion... ',
    action: () => setSource('workspaceDiscussion'),
    shortcut: 'D',
    keepOpen: true,
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

  const shareDocumentCommand = {
    type: 'command',
    icon: 'layer-group',
    title: (
      <span>
        Share with
        <Title>{title}</Title>
      </span>
    ),
    // TODO: create document, add workspace to it, then open it.
    action: () => {},
    shortcut: 'S',
  };

  const privateDocumentCommand = {
    type: 'command',
    Avatar: (
      <StyledAvatar
        avatarUrl={currentUser.profilePictureUrl}
        title={currentUser.fullName}
        alt={currentUser.fullName}
        size={20}
      />
    ),
    title: 'For myself only',
    action: handleCreateDocument,
    shortcut: 'M',
  };

  const shareDiscussionCommand = {
    type: 'command',
    icon: 'layer-group',
    title: (
      <span>
        Discuss in
        <Title>{title}</Title>
      </span>
    ),
    // TODO: Create discussion, add workspace to it, then open it.
    action: () => {},
    shortcut: 'D',
  };

  const customAudienceDiscussionCommand = {
    type: 'command',
    icon: 'users',
    title: 'Start with custom audience',
    // TODO: Launch resource creation modal for the discussion
    action: () => {},
    shortcut: 'C',
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
      newWorkspaceCommand,
      invitePeopleCommand,
      goToInboxCommand,
    ],
    discussion: [
      newDiscussionCommand,
      newDocumentCommand,
      newWorkspaceCommand,
      invitePeopleCommand,
      goToInboxCommand,
    ],
    workspace: [
      newWorkspaceDiscussionCommand,
      newWorkspaceDocumentCommand,
      newWorkspaceCommand,
      invitePeopleCommand,
      goToInboxCommand,
    ],
    workspaceDocument: [shareDocumentCommand, privateDocumentCommand],
    workspaceDiscussion: [
      shareDiscussionCommand,
      customAudienceDiscussionCommand,
    ],
  };

  return source ? commands[source] : [];
};

export default useCommandLibrary;
