import React from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import usePendingMessages from 'hooks/resources/usePendingMessages';

const Container = styled.div(({ isVisible, theme: { colors } }) => ({
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
  opacity: isVisible ? 1 : 0,
  padding: '0 10px',
  position: 'fixed',
  top: '46px', // vertically align to bottom of the nav bar (60px)
  transition: 'opacity 0.2s',
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

const NewMessagesIndicator = ({ dividerRef, handleClick, ...props }) => {
  const client = useApolloClient();
  const pendingMessages = usePendingMessages();

  const handleClearPendingMessages = event => {
    event.stopPropagation();
    client.writeData({ data: { pendingMessages: [] } });
  };

  const handleClickWrapper = event => {
    handleClick();
    handleClearPendingMessages(event);
  };

  const checkVisible = () => {
    if (!pendingMessages.length) return false;

    const { current: divider } = dividerRef;
    if (!divider) return false;

    const { offsetTop } = divider;
    return offsetTop < window.innerHeight;
  };

  const count = pendingMessages.length;
  return (
    <Container
      isVisible={checkVisible()}
      onClick={handleClickWrapper}
      {...props}
    >
      <StyledArrowIcon icon="long-arrow-down" />
      <Label>{`show ${count} new ${Pluralize('message', count, false)}`}</Label>
      <CloseButton onClick={handleClearPendingMessages}>
        <StyledCloseIcon icon={['far', 'times']} />
      </CloseButton>
    </Container>
  );
};

NewMessagesIndicator.propTypes = {
  dividerRef: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
};

NewMessagesIndicator.defaultProps = {
  dividerRef: {},
};

export default NewMessagesIndicator;
