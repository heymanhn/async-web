import React, { useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';

import workspaceResourcesQuery from 'graphql/queries/workspaceResources';
import usePaginatedResource from 'hooks/resources/usePaginatedResource';
import usePrefetchQueries from 'hooks/shared/usePrefetchQueries';
import { VIEW_MODES } from 'utils/constants';
import { WorkspaceContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import NewDocumentButton from 'components/document/NewDocumentButton';
import NewDiscussionButton from 'components/discussion/NewDiscussionButton';

import ResourceFilters from './ResourceFilters';
import ResourceRow from './ResourceRow';

const Container = styled.div({
  marginBottom: '150px',
  padding: '0 30px',
});

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '20px 0',
});

const WelcomeMessage = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 16 }),
  color: colors.grey1,
  marginBottom: '20px',
}));

const ButtonsContainer = styled.div({
  display: 'flex',
});

const ResourcesList = () => {
  const listRef = useRef(null);
  const { workspaceId, viewMode } = useContext(WorkspaceContext);
  const [hasItems, setHasItems] = useState(false);

  const buildQueryDetails = () =>
    VIEW_MODES.map(vm => vm.mode).map(vm => ({
      query: workspaceResourcesQuery,
      variables: { workspaceId, queryParams: { type: vm } },
    }));

  usePrefetchQueries(buildQueryDetails());

  const { loading, data } = usePaginatedResource({
    queryDetails: {
      query: workspaceResourcesQuery,
      key: 'workspaceResources',
      variables: { workspaceId, queryParams: { type: viewMode } },
    },
    containerRef: listRef,
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const items = data.items || [];
  if (viewMode === 'all' && !!items.length !== hasItems) {
    setHasItems(!!items.length);
  }

  const renderWelcomeMessage = () => (
    <Container>
      <WelcomeMessage>
        Welcome to the workspace! Get started by creating a document or
        discussion.
      </WelcomeMessage>
      <ButtonsContainer>
        <NewDocumentButton />
        <NewDiscussionButton />
      </ButtonsContainer>
    </Container>
  );

  const renderResourceList = () => (
    <Container ref={listRef}>
      <ResourceFilters />
      {(items || []).map(item => {
        const object = item.document || item.discussion;
        return <ResourceRow key={object.id} item={item} />;
      })}
    </Container>
  );

  return <div>{hasItems ? renderResourceList() : renderWelcomeMessage()}</div>;
};

export default ResourcesList;
