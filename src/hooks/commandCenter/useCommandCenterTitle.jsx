import { useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { NavigationContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

const PREFIXES = {
  addResource: 'Add to',
};

const useCommandCenterTitle = () => {
  const {
    resource: {
      customMode,
      resourceType,
      resourceId,
      resourceQuery,
      variables,
    },
  } = useContext(NavigationContext);

  const { data } = useQuery(resourceQuery, {
    variables,
    skip: !resourceId,
  });

  if (data && data[resourceType]) {
    const { title } = data[resourceType];
    const prefix = customMode ? PREFIXES[customMode] : '';
    const safeTitle = title || `Untitled ${titleize(resourceType)}`;

    return `${prefix} ${safeTitle}`;
  }

  return titleize(resourceType);
};

export default useCommandCenterTitle;
