import React from 'react';
import styled from '@emotion/styled';

import useMountEffect from 'utils/hooks/useMountEffect';
import { track } from 'utils/analytics';
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

const LoggedOutHome = () => {
  useMountEffect(() => track('Logged out homepage viewed'));

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
};

export default LoggedOutHome;
