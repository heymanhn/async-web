import { useContext } from 'react';

import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import { useQuery } from '@apollo/react-hooks';

const useCommandCenterTitle = () => {
  const {
    resource: { resourceType, resourceId, resourceQuery, createVariables },
  } = useContext(NavigationContext);

  const { data } = useQuery(resourceQuery, {
    variables: createVariables(resourceId),
    skip: !resourceId,
  });

  if (data && data[resourceType]) {
    const { title, topic } = data[resourceType];
    return (
      title || (topic && topic.text) || `Untitled ${titleize(resourceType)}`
    );
  }

  return titleize(resourceType);
};

export default useCommandCenterTitle;
