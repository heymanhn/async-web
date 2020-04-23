import { useContext, useEffect } from 'react';

import { NavigationContext } from 'utils/contexts';

const useUpdateSelectedResource = resourceId => {
  const { selectedResourceId, setSelectedResourceId } = useContext(
    NavigationContext
  );

  useEffect(() => {
    if (resourceId !== selectedResourceId) setSelectedResourceId(resourceId);
  }, [resourceId, selectedResourceId, setSelectedResourceId]);
};

export default useUpdateSelectedResource;
