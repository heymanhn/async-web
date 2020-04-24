import { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

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
