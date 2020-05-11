import React from 'react';
import Pluralize from 'pluralize';
import { useQuery } from '@apollo/react-hooks';

import resourceMembersQuery from 'graphql/queries/resourceMembers';

import ResourceDetails from 'components/shared/ResourceDetails';

// This technique allows us to return ResourceDetails only when the names of
// the resource's members are all fetched.
const useResourceDetails = (type, resource) => {
  const { id } = resource;

  const { loading, data } = useQuery(resourceMembersQuery, {
    variables: { resourceType: Pluralize(type), resourceId: id },
    skip: type === 'workspace',
  });

  if (loading || type === 'workspace') return null;

  const { resourceMembers } = data;
  const { members } = resourceMembers;
  const names = (members || []).map(m => m.user.firstName);

  return props => (
    <ResourceDetails type={type} resource={resource} names={names} {...props} />
  );
};

export default useResourceDetails;
