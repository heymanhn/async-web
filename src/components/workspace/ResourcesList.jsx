import React, { useContext, useRef } from 'react';
import styled from '@emotion/styled';

import workspaceResourcesQuery from 'graphql/queries/workspaceResources';
import usePrefetchQueries from 'utils/hooks/usePrefetchQueries';
import usePaginatedResource from 'utils/hooks/usePaginatedResource';
import { VIEW_MODES } from 'utils/constants';
import { WorkspaceContext } from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import ResourceRow from './ResourceRow';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '20px 0',
});

const ResourcesList = () => {
  const listRef = useRef(null);
  const { workspaceId, viewMode } = useContext(WorkspaceContext);

  const buildQueryDetails = () =>
    VIEW_MODES.map(vm => vm.mode).map(vm => ({
      query: workspaceResourcesQuery,
      variables: { workspaceId, queryParams: { type: vm } },
    }));

  usePrefetchQueries(buildQueryDetails());

  const { loading, data } = usePaginatedResource(listRef, {
    query: workspaceResourcesQuery,
    key: 'workspaceResources',
    variables: { workspaceId, queryParams: { type: viewMode } },
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const { items } = data;

  return (
    <div ref={listRef}>
      {items.map(item => {
        const object = item.document || item.discussion;
        return <ResourceRow key={object.id} item={item} />;
      })}
    </div>
  );
};

export default ResourcesList;
