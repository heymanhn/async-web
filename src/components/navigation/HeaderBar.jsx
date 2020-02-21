import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import {
  DocumentContext,
  ResourceAccessContext,
  DEFAULT_RESOURCE_ACCESS_CONTEXT,
} from 'utils/contexts';
import ResourceAccessContainer from 'components/participants/ResourceAccessContainer';
import VerticalDivider from 'components/shared/VerticalDivider';
import OrganizationSettings from 'components/navigation/OrganizationSettings';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const value = {
    ...DEFAULT_RESOURCE_ACCESS_CONTEXT,
    isModalOpen,
    setIsModalOpen,
  };

  return (
    <ResourceAccessContext.Provider value={value}>
      <Container {...props}>
        <MenuSection>
          <OrganizationSettings />
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
    </ResourceAccessContext.Provider>
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
