import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',

  background: colors.grey1,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 8px rgba(0,0,0,0.1)',
  color: colors.white,
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
  height: '28px',
  padding: '0 10px',
  position: 'fixed',
  top: '46px', // vertically align to bottom of the nav bar (60px)
  zIndex: 1,
}));

const StyledArrowIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '14px',
}));

const Label = styled.div({
  margin: '0 10px',
});

const CloseButton = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const StyledCloseIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '12px',
}));

const NewMessagesIndicator = ({ count, ...props }) => {
  const client = useApolloClient();
  const handleClearPendingMessages = event => {
    event.stopPropagation();
    client.writeData({ data: { pendingMessages: [] } });
  };

  return (
    <Container {...props}>
      <StyledArrowIcon icon="long-arrow-down" />
      <Label>{`show ${count} new ${Pluralize('message', count, false)}`}</Label>
      <CloseButton onClick={handleClearPendingMessages}>
        <StyledCloseIcon icon={['far', 'times']} />
      </CloseButton>
    </Container>
  );
};

NewMessagesIndicator.propTypes = {
  count: PropTypes.number.isRequired,
};

export default NewMessagesIndicator;
