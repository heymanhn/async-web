import React, { useContext, useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { NavigationContext } from 'utils/contexts';

import NotificationsDropdown from './NotificationsDropdown';

const Container = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

const IconContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  cursor: 'pointer',
  margin: '0 15px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ isopen, theme: { colors } }) => ({
  color: isopen === 'true' ? colors.grey1 : colors.grey2,
  fontSize: '20px',

  ':hover': {
    color: colors.grey1,
  },
}));

const UnreadBadge = styled.div(({ theme: { colors } }) => ({
  background: colors.blue,
  borderRadius: '10px',
  marginTop: '-12px',
  marginLeft: '-10px',
  width: '12px',
  height: '12px',
}));

const StyledNotificationsDropdown = styled(NotificationsDropdown)({
  position: 'fixed',
  top: '52px',
  right: '30px',
});

const NotificationsBell = () => {
  const iconRef = useRef(null);
  const {
    resource: { resourceType, resourceId },
  } = useContext(NavigationContext);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const handleShowDropdown = () => setIsDropdownVisible(true);
  const handleCloseDropdown = () => setIsDropdownVisible(false);

  const [coords, setCoords] = useState({});
  const calculatePosition = () => {
    if (!isDropdownVisible || !iconRef.current) {
      if (Object.keys(coords).length) setCoords({});
      return;
    }

    const {
      offsetHeight,
      offsetLeft,
      offsetTop,
      offsetWidth,
    } = iconRef.current;

    const newCoords = {
      top: `${offsetTop + offsetHeight + 15}px`,
      left: `${offsetLeft + 240 + offsetWidth + 10 - 350}px`, // 240px sidebar width, 10px extra buffer
    };

    if (coords.top === newCoords.top && coords.left === newCoords.left) return;
    setCoords(newCoords);
  };

  useEffect(() => {
    calculatePosition();

    window.addEventListener('resize', calculatePosition);
    return () => {
      window.removeEventListener('resize', calculatePosition);
    };
  });

  const { data } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: Pluralize(resourceType), resourceId },
  });

  if (!data || !data.resourceNotifications) return null;

  const { notifications } = data.resourceNotifications;
  const unreadNotifications = (notifications || []).filter(n => n.readAt < 0);

  return (
    <Container>
      <IconContainer onClick={handleShowDropdown} ref={iconRef}>
        <StyledIcon isopen={isDropdownVisible.toString()} icon="bell" />
        {unreadNotifications.length ? <UnreadBadge /> : undefined}
      </IconContainer>
      {notifications && (
        <StyledNotificationsDropdown
          coords={coords}
          isOpen={isDropdownVisible}
          handleClose={handleCloseDropdown}
        />
      )}
    </Container>
  );
};

export default NotificationsBell;
