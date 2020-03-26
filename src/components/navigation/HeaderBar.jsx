import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {
  DocumentContext,
  NavigationContext,
  DEFAULT_NAVIGATION_CONTEXT,
} from 'utils/contexts';
import ResourceAccessContainer from 'components/participants/ResourceAccessContainer';
import VerticalDivider from 'components/shared/VerticalDivider';
import NotificationsBell from 'components/notifications/NotificationsBell';
import DocumentViewMode from 'components/document/DocumentViewMode';
import DocumentTitle from 'components/document/DocumentTitle';
import DiscussionTitle from 'components/discussion/DiscussionTitle';
import CommandCenter from 'components/commandCenter/CommandCenter';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',

  background: colors.bgGrey,
  borderBottom: `1px solid ${colors.borderGrey}`,
  height: '54px',
  position: 'sticky',
  top: '0px',
  width: '100%',
  zIndex: 1,
}));

const MenuSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  marginLeft: '30px',
  height: '100%',
});

const NavigationSection = styled.div({
  display: 'flex',
  alignItems: 'center',

  height: '100%',
  marginRight: '15px',
});

const HeaderBar = ({ setViewMode, viewMode, ...props }) => {
  const { documentId } = useContext(DocumentContext);

  // For the Resource Access modal. Storing state here so that the context can
  // be shared with the Command Center as well as the modal
  const [isResourceAccessModalOpen, setIsResourceAccessModalOpen] = useState(
    false
  );
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const value = {
    ...DEFAULT_NAVIGATION_CONTEXT,
    isResourceAccessModalOpen,
    isInviteModalOpen,
    setIsResourceAccessModalOpen,
    setIsInviteModalOpen,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Container {...props}>
        <MenuSection>
          {documentId ? <DocumentTitle /> : <DiscussionTitle />}
          {documentId && (
            <DocumentViewMode viewMode={viewMode} setViewMode={setViewMode} />
          )}
          <VerticalDivider />
          <ResourceAccessContainer />
        </MenuSection>
        <NavigationSection>
          <NotificationsBell />
          <CommandCenter source={documentId ? 'document' : 'discussion'} />
        </NavigationSection>
      </Container>
    </NavigationContext.Provider>
  );
};

HeaderBar.propTypes = {
  setViewMode: PropTypes.func,
  viewMode: PropTypes.oneOf(['', 'content', 'discussions']),
};

HeaderBar.defaultProps = {
  setViewMode: () => {},
  viewMode: '',
};

export default HeaderBar;
