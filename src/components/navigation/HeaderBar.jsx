import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { DocumentContext } from 'utils/contexts';
import ResourceAccessContainer from 'components/participants/ResourceAccessContainer';
import VerticalDivider from 'components/shared/VerticalDivider';
import OrganizationSettings from 'components/navigation/OrganizationSettings';
import NotificationsBell from 'components/notifications/NotificationsBell';
import DocumentViewMode from 'components/document/DocumentViewMode';
import DocumentTitle from 'components/document/DocumentTitle';
import DiscussionTitle from 'components/discussion/DiscussionTitle';

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
});

const HeaderBar = ({ setViewMode, viewMode, ...props }) => {
  const { documentId } = useContext(DocumentContext);

  return (
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
      </NavigationSection>
    </Container>
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
