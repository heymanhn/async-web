import React, { useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import resourceNotificationsQuery from 'graphql/queries/resourceNotifications';
import useClickOutside from 'utils/hooks/useClickOutside';
import { getLocalUser } from 'utils/auth';
import { NavigationContext } from 'utils/contexts';

import NotificationRow from './NotificationRow';

const Container = styled.div(
  ({ coords, isOpen, width, theme: { colors } }) => ({
    display: isOpen ? 'block' : 'none',
    position: 'absolute',
    top: coords.top,
    left: coords.left,
    overflow: 'scroll',

    background: colors.bgGrey,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    maxHeight: `${window.innerHeight - 80}px`,
    width: `${width}px`,
    zIndex: 1000,
  })
);

const TitleSection = styled.div(({ theme: { colors } }) => ({
  cursor: 'default',
  color: colors.grey0,
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '15px 20px',
}));

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
});

const NotificationsDropdown = ({ coords, isOpen, handleClose, ...props }) => {
  const selector = useRef();
  const { resource } = useContext(NavigationContext);

  const { userId } = getLocalUser();
  let { resourceType, resourceId } = resource || {};
  if (!resource) {
    resourceType = 'user';
    resourceId = userId;
  }

  useClickOutside({
    handleClickOutside: () => isOpen && handleClose(),
    isOpen,
    ref: selector,
  });

  const { data } = useQuery(resourceNotificationsQuery, {
    variables: { resourceType: Pluralize(resourceType), resourceId },
  });

  if (!data || !data.resourceNotifications) return null;

  const { notifications } = data.resourceNotifications;
  if (!notifications) return null;

  const title = resourceType === 'user' ? 'All Updates' : 'Notifications';
  const root = window.document.getElementById('root');

  return ReactDOM.createPortal(
    <Container isOpen={isOpen} coords={coords} ref={selector} {...props}>
      <TitleSection>
        <Title>{title}</Title>
      </TitleSection>
      {notifications.map(n => (
        <NotificationRow
          key={n.updatedAt}
          notification={n}
          handleClose={handleClose}
        />
      ))}
    </Container>,
    root
  );
};

NotificationsDropdown.propTypes = {
  coords: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default NotificationsDropdown;
