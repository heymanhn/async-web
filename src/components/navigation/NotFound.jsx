/* eslint jsx-a11y/accessible-emoji: 0 */
import React from 'react';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: discussionViewport,
  minHeight: '100vh',
  padding: '0 30px',
}));

const TitleSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
  marginBottom: '15px',
  marginTop: '-5vh',
});

const Icon = styled.span({
  fontSize: '36px',
  fontWeight: 500,
  marginRight: '15px',
  position: 'relative',
  top: '2px',
});

const Title = styled.h1({
  fontSize: '36px',
  fontWeight: 600,
});

const Message = styled.div({
  fontSize: '20px',
  lineHeight: '30px',
});

const NotFound = () => (
  <Container>
    <TitleSection>
      <Icon role="img" aria-label="pensive">😔</Icon>
      <Title>Uh oh!</Title>
    </TitleSection>
    <Message>
      We couldn&#39;t find what you are looking for. Can you double check your URL?
    </Message>
  </Container>
);

export default NotFound;
