import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import workspaceResourcesQuery from 'graphql/queries/workspaceResources';
import usePrefetchQueries from 'utils/hooks/usePrefetchQueries';
import usePaginatedResource from 'utils/hooks/usePaginatedResource';
import { VIEW_MODES } from 'utils/constants';
import { WorkspaceContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import NewDocumentButton from 'components/document/NewDocumentButton';
import NewDiscussionButton from 'components/discussion/NewDiscussionButton';
import ResourceFilters from './ResourceFilters';
import ResourceRow from './ResourceRow';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '20px 0',
});

const WelcomeMessage = styled.div(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '16px',
  letterSpacing: '-0.011em',
  marginBottom: '20px',
}));

const ButtonsContainer = styled.div({
  display: 'flex',
});

const ResourcesList = ({ shouldRefetch }) => {
  const listRef = useRef(null);
  const { workspaceId, viewMode } = useContext(WorkspaceContext);

  const buildQueryDetails = () =>
    VIEW_MODES.map(vm => vm.mode).map(vm => ({
      query: workspaceResourcesQuery,
      variables: { workspaceId, queryParams: { type: vm } },
    }));

  usePrefetchQueries(buildQueryDetails());

  const { loading, data, refetch } = usePaginatedResource(listRef, {
    query: workspaceResourcesQuery,
    key: 'workspaceResources',
    variables: { workspaceId, queryParams: { type: viewMode } },
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;
  if (shouldRefetch) refetch();

  const { items } = data;

  const renderWelcomeMessage = () => (
    <div>
      <WelcomeMessage>
        Welcome to the workspace! Get started by creating a document or
        discussion.
      </WelcomeMessage>
      <ButtonsContainer>
        <NewDocumentButton />
        <NewDiscussionButton />
      </ButtonsContainer>
    </div>
  );

  const renderResourceList = () => (
    <div ref={listRef}>
      <ResourceFilters />
      {items.map(item => {
        const object = item.document || item.discussion;
        return <ResourceRow key={object.id} item={item} />;
      })}
    </div>
  );

  return <div>{items ? renderResourceList() : renderWelcomeMessage()}</div>;
};

ResourcesList.propTypes = {
  shouldRefetch: PropTypes.bool.isRequired,
};

export default ResourcesList;
