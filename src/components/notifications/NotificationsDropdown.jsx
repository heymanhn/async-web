import React, { useContext, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';

import usePaginatedResource from 'utils/hooks/usePaginatedResource';
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

const Results = styled.div({});

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
  const dropdownRef = useRef();
  const resultsRef = useRef(null);
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
    ref: dropdownRef,
  });

  const { loading, data } = usePaginatedResource(
    dropdownRef,
    {
      query: resourceNotificationsQuery,
      key: 'resourceNotifications',
      variables: { resourceType: Pluralize(resourceType), resourceId },
    },
    80,
    resultsRef
  );

  if (loading || !data) return null;

  const { notifications } = data;
  if (!notifications) return null;

  const title = resourceType === 'user' ? 'All Updates' : 'Notifications';
  const root = window.document.getElementById('root');

  return ReactDOM.createPortal(
    <Container isOpen={isOpen} coords={coords} ref={dropdownRef} {...props}>
      <TitleSection>
        <Title>{title}</Title>
      </TitleSection>
      <Results ref={resultsRef}>
        {notifications.map(n => (
          <NotificationRow
            key={n.updatedAt}
            notification={n}
            handleClose={handleClose}
          />
        ))}
      </Results>
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
