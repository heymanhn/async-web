import React from 'react';
import { Query } from 'react-apollo';
import styled from '@emotion/styled';

import dummyParticipantsQuery from 'graphql/dummyParticipantsQuery';

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

const MeetingInfo = () => (
  <Query query={dummyParticipantsQuery}>
    {({ loading, data }) => {
      if (loading) return null;

      return (
        <Container>
          <InfoSection>
            <SectionTitle>PARTICIPANTS</SectionTitle>
            {data.participants.map(p => (
              <StyledAvatar key={p.id} src={p.profilePictureUrl} size={30} alt={p.fullName} />
            ))}
          </InfoSection>
          <InfoSection>
            <SectionTitle>DUE DATE</SectionTitle>
            None
          </InfoSection>
        </Container>
      );
    }}
  </Query>

);

export default MeetingInfo;
