import React from 'react';
import { useQuery } from 'react-apollo';
import { navigate, Redirect } from '@reach/router';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import localStateQuery from 'graphql/queries/localState';
import meetingsQuery from 'graphql/queries/meetings';
import { getLocalAppState } from 'utils/auth';
import withPageTracking from 'utils/withPageTracking';
import { site } from 'data/siteMetadata.json';
import EmailCaptureForm from './EmailCaptureForm';

const Container = styled.div(({ theme: { colors, maxViewport } }) => ({
  background: colors.white,
  margin: '0px auto',
  maxWidth: maxViewport,
}));

const Section = styled.div(({ type, theme: { colors, mq } }) => ({
  background: type === 'blue' ? colors.bgBlue : colors.bgGrey,
  margin: '0px auto',
  padding: '60px 20px 40px',
  width: '100%',

  [mq('laptopUp')]: {
    padding: '80px 20px 60px',
  },
}));

const HeadlinesContainer = styled.div(({ theme: { mq } }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  [mq('laptopUp')]: {
    flexDirection: 'row',
    margin: '40px',
  },
}));

const Headlines = styled.div(({ theme: { mq } }) => ({
  margin: 0,
  maxWidth: '600px',

  [mq('laptopUp')]: {
    margin: '0 30px',
  },
}));

const Description = styled.p({
  margin: '15px 0 30px',
  maxWidth: '550px',
});

const Home = () => {
  const { data: localStateData } = useQuery(localStateQuery);
  const [getMeetings, { data }] = useLazyQuery(meetingsQuery);

  if (!localStateData) return null;
  const { isLoggedIn, isOnboarding } = localStateData;
  const { organizationId } = getLocalAppState();

  if (!isLoggedIn) {
    return (
      <Container>
        <Section type="blue" id="headlines">
          <HeadlinesContainer>
            <Headlines>
              <h1>
                {site.tagline}
              </h1>
              <Description>
                {site.subTagline}
              </Description>
              <EmailCaptureForm />
            </Headlines>
          </HeadlinesContainer>
        </Section>
      </Container>
    );
  }

  if (isOnboarding) {
    const path = organizationId ? `/organizations/${organizationId}/invites` : '/organizations';
    return <Redirect to={path} noThrow />;
  }

  if (!data) {
    getMeetings();
    return null;
  }

  if (data && data.meetings) {
    // Assumes that an organization has at least one meeting space
    const { items } = data.meetings;
    const meetings = (items || []).map(i => i.meeting);

    if (meetings.length) {
      const targetId = meetings[0].id;

      navigate(`/spaces/${targetId}`, { replace: true });
    } else {
      return <div>You are logged in</div>;
    }
  }

  return null;
};

export default withPageTracking(Home, 'Logged Out Home');
