import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import usePendingMessages from 'hooks/resources/usePendingMessages';
import { DEBOUNCE_INTERVAL } from 'utils/constants';
import { ThreadContext } from 'utils/contexts';
import { debounce } from 'utils/helpers';

const Container = styled.div(({ isVisible, theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 13, weight: 500 }),

  display: 'flex',
  alignItems: 'center',
  alignSelf: 'center',

  background: colors.grey1,
  borderRadius: '5px',
  boxShadow: '0px 0px 8px rgba(0,0,0,0.1)',
  color: colors.white,
  cursor: 'pointer',
  height: '28px',
  opacity: isVisible ? 1 : 0,
  padding: '0 10px',
  position: 'fixed',
  transition: 'opacity 0.1s',
  zIndex: 3,
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

const NewMessagesIndicator = ({
  bottomRef,
  composerRef,
  dividerRef,
  afterClick,
  ...props
}) => {
  const client = useApolloClient();
  const { modalRef } = useContext(ThreadContext);
  const [isVisible, setIsVisible] = useState(false);
  const pendingMessages = usePendingMessages();

  const checkShowIndicator = () => {
    if (!pendingMessages.length) {
      if (isVisible) setIsVisible(false);
      return;
    }

    const { current: divider } = dividerRef;
    if (!divider) return;

    const { current: composer } = composerRef;
    if (!composer) return;

    // Only show the indicator if the new messages divider is positioned above
    // the message composer.
    const { top: dividerYOffset } = divider.getBoundingClientRect();
    const { top: composerYOffset } = composer.getBoundingClientRect();

    const showIndicator = dividerYOffset > composerYOffset - 10; // Add some buffer
    if (isVisible !== showIndicator) setIsVisible(showIndicator);
  };

  useEffect(() => {
    checkShowIndicator();

    const { current: modal } = modalRef || {};
    const target = modal || window;

    const debouncedScroll = debounce(checkShowIndicator, DEBOUNCE_INTERVAL);
    target.addEventListener('scroll', debouncedScroll);

    return () => {
      target.removeEventListener('scroll', debouncedScroll);
    };
  });

  const handleClearPendingMessages = event => {
    event.stopPropagation();
    setIsVisible(false);
    client.writeData({ data: { pendingMessages: [] } });
  };

  const handleClick = event => {
    handleClearPendingMessages(event);
    afterClick();

    const { current: bottomOfPage } = bottomRef;
    if (bottomOfPage) bottomOfPage.scrollIntoView();
  };

  const count = pendingMessages.length;
  return (
    <Container isVisible={isVisible} onClick={handleClick} {...props}>
      <StyledArrowIcon icon="long-arrow-down" />
      <Label>{`show ${count} new ${Pluralize('message', count, false)}`}</Label>
      <CloseButton onClick={handleClearPendingMessages}>
        <StyledCloseIcon icon={['far', 'times']} />
      </CloseButton>
    </Container>
  );
};

NewMessagesIndicator.propTypes = {
  bottomRef: PropTypes.object,
  composerRef: PropTypes.object,
  dividerRef: PropTypes.object,
  afterClick: PropTypes.func.isRequired,
};

NewMessagesIndicator.defaultProps = {
  bottomRef: {},
  composerRef: {},
  dividerRef: {},
};

export default NewMessagesIndicator;
