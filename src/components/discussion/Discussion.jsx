import React from 'react';
import styled from '@emotion/styled';

import RovalEditor from 'components/editor/RovalEditor';

const Container = styled.div({
  height: '100vh',
});

const DiscussionContainer = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  height: '100%',
  margin: '0 auto',
  maxWidth: discussionViewport,
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.contentText,
  fontSize: '36px',
  fontWeight: 500,
  marginBottom: '40px',
  width: '100%',
  outline: 'none',
}));

const Discussion = () => {
  return (
    <Container>
      <DiscussionContainer>
        <TitleEditor
          contentType="discussionTitle"
          initialValue="Untitled Discussion"
          isPlainText
          onSubmit={() => {}}
          saveOnBlur
        />
      </DiscussionContainer>
    </Container>
  );
};

export default Discussion;
