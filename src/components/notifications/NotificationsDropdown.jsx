import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';
import NotificationRow from './NotificationRow';

const Container = styled.div(({ iconWidth, isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  alignSelf: 'flex-start',
  position: 'absolute',
  overflow: 'scroll',

  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.05)',
  marginLeft: iconWidth ? `${-350 + iconWidth}px` : '0',
  marginTop: '10px',
  maxHeight: `${window.innerHeight - 80}px`,
  width: '350px',
  zIndex: 1000,
}));

const TitleSection = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.white,
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '15px',
  position: 'sticky',
  top: '0px',
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  fontWeight: 500,
}));

const UnreadCountBadge = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  borderRadius: '5px',
  color: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  marginLeft: '8px',
  padding: '0px 8px',
}));

const NotificationsDropdown = ({
  iconWidth,
  isOpen,
  notifications,
  handleCloseDropdown,
}) => {
  const selector = useRef();

  function handleClickOutside() {
    if (!isOpen) return;
    handleCloseDropdown();
  }

  useClickOutside({ handleClickOutside, isOpen, ref: selector });

  return (
    <Container iconWidth={iconWidth} isOpen={isOpen} ref={selector}>
      <TitleSection>
        <Title>NOTIFICATIONS</Title>
        <UnreadCountBadge>{notifications.length}</UnreadCountBadge>
      </TitleSection>
      {notifications &&
        notifications.map(n => (
          <NotificationRow
            key={n.updatedAt}
            notification={n}
            handleCloseDropdown={handleCloseDropdown}
          />
        ))}
    </Container>
  );
};

NotificationsDropdown.propTypes = {
  iconWidth: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  notifications: PropTypes.array,
  handleCloseDropdown: PropTypes.func.isRequired,
};

NotificationsDropdown.defaultProps = {
  iconWidth: null,
  notifications: null,
};

export default NotificationsDropdown;
