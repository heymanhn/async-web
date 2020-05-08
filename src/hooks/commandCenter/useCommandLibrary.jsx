import React, { useContext } from 'react';
import { navigate } from '@reach/router';
import styled from '@emotion/styled';

import useCurrentUser from 'hooks/shared/useCurrentUser';
import useResourceCreator from 'hooks/resources/useResourceCreator';
import {
  NavigationContext,
  DocumentContext,
  WorkspaceContext,
} from 'utils/contexts';

import Avatar from 'components/shared/Avatar';

const Title = styled.span(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  color: colors.grey0,
}));

const WorkspaceTitle = styled.span({
  fontWeight: 600,
  marginLeft: '4px',
});

const StyledAvatar = styled(Avatar)({
  marginRight: '12px',
});

const useCommandLibrary = ({ source, setSource, title }) => {
  const {
    setIsResourceAccessModalOpen,
    setIsInviteModalOpen,
    setResourceCreationModalMode,
  } = useContext(NavigationContext);
  const { documentId } = useContext(DocumentContext);
  const { workspaceId } = useContext(WorkspaceContext);

  const { handleCreateResource: handleCreateDocument } = useResourceCreator(
    'document'
  );
  const { handleCreateResource: handleCreateDiscussion } = useResourceCreator(
    'discussion'
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

  const newDocumentThreadCommand = {
    type: 'command',
    icon: ['fal', 'plus-circle'],
    title: 'Start a thread',
    action: () => navigate(`/documents/${documentId}/threads`),
    shortcut: 'T',
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
    fontSize: '16px',
    title: `Share with ${title}`,
    titleComponent: (
      <Title>
        Share with
        <WorkspaceTitle>{title}</WorkspaceTitle>
      </Title>
    ),
    action: () => handleCreateDocument({ parentWorkspaceId: workspaceId }),
    shortcut: 'S',
  };

  const privateDocumentCommand = {
    type: 'command',
    avatar: (
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
    fontSize: '16px',
    title: `Discuss in ${title}`,
    titleComponent: (
      <Title>
        Discuss in
        <WorkspaceTitle>{title}</WorkspaceTitle>
      </Title>
    ),
    action: () => handleCreateDiscussion({ parentWorkspaceId: workspaceId }),
    shortcut: 'D',
  };

  const customAudienceDiscussionCommand = {
    type: 'command',
    icon: 'users',
    fontSize: '16px',
    title: 'Start with custom audience',
    action: () => setResourceCreationModalMode('discussion'),
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
      newDocumentThreadCommand,
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
