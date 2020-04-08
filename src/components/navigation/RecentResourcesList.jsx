import React, { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from '@emotion/styled';

import { getLocalUser } from 'utils/auth';
import resourcesQuery from 'graphql/queries/resources';
import { RESOURCES_QUERY_SIZE } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';
import { snakedQueryParams } from 'utils/queryParams';

import ResourceRow from './ResourceRow';

const Container = styled.div({
  margin: '25px 20px 0',
});

const HeadingSection = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
});

const Heading = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '12px',
  fontWeight: 500,
}));

const RecentResourcesList = () => {
  const { selectedResourceId } = useContext(NavigationContext);
  const { userId } = getLocalUser();

  // TODO (HN): Use paginated resource when we figure out how to paginate
  // workspaces and recent items in the sidebar
  const { loading, data } = useQuery(resourcesQuery, {
    variables: {
      userId,
      queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
    },
  });

  if (loading || !data.resources) return null;

  const { items } = data.resources;
  const isResourceSelected = id => id === selectedResourceId;

  return (
    <Container>
      <HeadingSection>
        <Heading>RECENT</Heading>
      </HeadingSection>
      {(items || []).map(item => {
        const { document, discussion, badgeCount } = item;
        const resource = document || discussion;
        const resourceType = document ? 'document' : 'discussion';
        return (
          <ResourceRow
            key={resource.id}
            resourceType={resourceType}
            resource={resource}
            isUnread={badgeCount > 0}
            isSelected={isResourceSelected(resource.id)}
          />
        );
      })}
    </Container>
  );
};

export default RecentResourcesList;
