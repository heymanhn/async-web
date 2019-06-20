import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: '30px',
  width: '100%',
});

const InfoSection = styled.div({
  flexGrow: 1,
});

const SectionTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
  marginBottom: '10px',
}));

const StyledAvatar = styled(Avatar)({
  display: 'inline-block',
  marginRight: '5px',
});

const MeetingInfo = ({ participants }) => (
  <Container>
    <InfoSection>
      <SectionTitle>PARTICIPANTS</SectionTitle>
      {participants.map(p => (
        <StyledAvatar key={p.id} src={p.profilePictureUrl} size={30} alt={p.fullName} />
      ))}
    </InfoSection>
    <InfoSection>
      <SectionTitle>DUE DATE</SectionTitle>
      None
    </InfoSection>
  </Container>
);

MeetingInfo.propTypes = {
  participants: PropTypes.array,
};

MeetingInfo.defaultProps = {
  participants: [],
};

export default MeetingInfo;
