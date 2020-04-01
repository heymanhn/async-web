import { useContext } from 'react';

import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';
import { useQuery } from '@apollo/react-hooks';

const useCommandCenterTitle = () => {
  const {
    resource: { resourceType, resourceId, resourceQuery, variables },
  } = useContext(NavigationContext);

  const { data } = useQuery(resourceQuery, {
    variables,
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
