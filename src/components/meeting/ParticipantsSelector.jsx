import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import organizationMembersQuery from 'graphql/organizationMembersQuery';
import ParticipantAvatars from 'components/shared/ParticipantAvatars';
import Member from './Member';

const Container = styled.div(({ theme: { colors } }) => ({
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '-15px',
  marginRight: '20px',
  outline: 'none',
  padding: '15px',
  width: '320px',
  zIndex: 1000,

  ':hover,:focus': {
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    padding: '14px',
  },

  ':focus': {
    borderBottom: 'none',
    borderRadius: '5px 5px 0 0',
  },
}), ({ alwaysOpen, theme: { colors } }) => {
  if (!alwaysOpen) return {};
  return {
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
    padding: '14px',
  };
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const MembersList = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '0 0 5px 5px',
  borderTop: 'none',
  boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.05)',
  marginLeft: '-15px',
  marginTop: '10px',
  position: 'absolute',
  width: '320px',
  zIndex: 1,
}));

const WhiteSeparator = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  height: '10px',
  marginTop: '-2px',
}));

// Needed for a CSS trick to hide the box shadow at the top of the absolute positioned element
const InnerMembersContainer = styled.div(({ theme: { colors } }) => ({
  background: colors.bgGrey,
  borderRadius: '0 0 5px 5px',
  padding: '10px 0',
  marginTop: '-2px',
}));

const ParticipantsSelector = ({
  alwaysOpen,
  authorId,
  organizationId,
  onAddParticipant,
  onRemoveParticipant,
  participantIds,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(alwaysOpen);
  function handleOpen() {
    if (isOpen || alwaysOpen) return;
    setIsOpen(true);
  }
  function handleClose() {
    if (!isOpen || alwaysOpen) return;
    setIsOpen(false);
  }

  const { data } = useQuery(organizationMembersQuery, {
    variables: { id: organizationId },
  });
  if (!data.organizationMembers) return null;
  let members = data.organizationMembers || [];
  const organizer = members.find(l => l.id === authorId);
  const others = members.filter(l => l.id !== authorId);
  members = [organizer, ...others];

  function isParticipant(id) {
    return participantIds.indexOf(id) >= 0;
  }

  function handleAction(id) {
    return isParticipant(id) ? onRemoveParticipant(id) : onAddParticipant(id);
  }

  return (
    <Container
      alwaysOpen={alwaysOpen}
      isOpen={isOpen}
      onBlur={handleClose}
      onClick={handleOpen}
      onFocus={handleOpen}
      tabIndex={0}
      {...props}
    >
      <div>
        <Title>PARTICIPANTS</Title>
        <ParticipantAvatars
          authorId={authorId}
          members={members}
          participantIds={participantIds}
        />
      </div>
      {!!members.length && (
        <MembersList isOpen={isOpen}>
          <WhiteSeparator />
          <InnerMembersContainer>
            {members.map(member => (
              <Member
                key={member.id}
                fullName={member.fullName}
                id={member.id}
                isOrganizer={member.id === authorId}
                isParticipant={isParticipant(member.id)}
                handleAction={handleAction}
                profilePictureUrl={member.profilePictureUrl}
                tabIndex={0}
              />
            ))}
          </InnerMembersContainer>
        </MembersList>
      )}
    </Container>
  );
};

ParticipantsSelector.propTypes = {
  alwaysOpen: PropTypes.bool,
  authorId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  onAddParticipant: PropTypes.func.isRequired,
  onRemoveParticipant: PropTypes.func.isRequired,
  participantIds: PropTypes.array.isRequired,
};

ParticipantsSelector.defaultProps = {
  alwaysOpen: false,
};

export default ParticipantsSelector;
