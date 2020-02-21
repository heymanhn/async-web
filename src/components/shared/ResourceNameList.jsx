import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import resourceMembersQuery from 'graphql/queries/resourceMembers';

const Container = styled.div({
  display: 'inline',
});

const ResourceNameList = ({ type, id, ...props }) => {
  const { loading, data } = useQuery(resourceMembersQuery, {
    variables: { id, resourceType: Pluralize(type) },
  });

  if (loading) return null;

  const { resourceMembers } = data;
  const { members } = resourceMembers;
  const fullNames = (members || []).map(m => m.user.fullName);

  const uniqueNames = [...new Set(fullNames)];
  const firstNames = uniqueNames.map(fullName => fullName.split(' ')[0]);
  const displayNames = firstNames.slice(0, 2);
  const overflowCount = uniqueNames.length - displayNames.length;

  return (
    <Container {...props}>
      {displayNames.join(', ')}
      {overflowCount > 0 && `, and ${overflowCount} others`}
    </Container>
  );
};

ResourceNameList.propTypes = {
  type: PropTypes.oneOf(['document', 'discussion']).isRequired,
  id: PropTypes.string.isRequired,
};

export default ResourceNameList;
