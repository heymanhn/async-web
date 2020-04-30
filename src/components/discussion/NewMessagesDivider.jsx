import React from 'react';
import styled from '@emotion/styled';

import UnreadIndicator from 'components/shared/UnreadIndicator';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',

  marginTop: '-5px',
  marginBottom: '-5px',
  width: '100%',
});

const Divider = styled.hr(({ theme: { colors } }) => ({
  flexGrow: 1,
  borderTop: `1px solid ${colors.altBlue}`,
  margin: 0,
}));

const StyledIndicator = styled(UnreadIndicator)({
  marginRight: '10px',
});

const NewMessagesLabel = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  color: colors.grey1,
  fontSize: '14px',
  fontWeight: 500,
  margin: '0 30px 0 10px',
}));

const LabelText = styled.div({
  marginTop: '-2px',
});

const NewMessagesDivider = () => (
  <Container>
    <Divider />
    <NewMessagesLabel>
      <StyledIndicator diameter={6} />
      <LabelText>new messages</LabelText>
    </NewMessagesLabel>
  </Container>
);

export default NewMessagesDivider;
