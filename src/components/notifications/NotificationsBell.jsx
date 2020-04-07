import React, { useContext, useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import { NavigationContext } from 'utils/contexts';

import UnreadIndicator from 'components/shared/UnreadIndicator';
import NotificationsDropdown from './NotificationsDropdown';

const DROPDOWN_WIDTH = 400;

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

const StyledUnreadIndicator = styled(UnreadIndicator)({
  position: 'absolute',
  marginTop: '-10px',
  marginLeft: '10px',
});

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

      // 240px sidebar width, 10px extra buffer
      left: `${offsetLeft + 240 + offsetWidth + 10 - DROPDOWN_WIDTH}px`,
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
    variables: {
      resourceType: Pluralize(resourceType),
      resourceId,
      queryParams: {},
    },
  });

  if (!data || !data.resourceNotifications) return null;

  const { items } = data.resourceNotifications;
  const unreadNotifications = (items || []).filter(n => n.readAt < 0);

  return (
    <Container>
      <IconContainer onClick={handleShowDropdown} ref={iconRef}>
        <StyledIcon isopen={isDropdownVisible.toString()} icon="bell" />
        {unreadNotifications.length > 0 && (
          <StyledUnreadIndicator diameter={7} />
        )}
      </IconContainer>
      {items && (
        <StyledNotificationsDropdown
          coords={coords}
          isOpen={isDropdownVisible}
          handleClose={handleCloseDropdown}
          width={DROPDOWN_WIDTH}
        />
      )}
    </Container>
  );
};

export default NotificationsBell;
