import { useCallback, useContext, useEffect } from 'react';

import { NavigationContext } from 'utils/contexts';

const useUpdateSelectedResource = resourceId => {
  const { selectedResourceId, setSelectedResourceId } = useContext(
    NavigationContext
  );

  const setSelectedResourceIdCb = useCallback(setSelectedResourceId, []);
  useEffect(() => {
    if (resourceId !== selectedResourceId) setSelectedResourceIdCb(resourceId);
  }, [resourceId, selectedResourceId, setSelectedResourceIdCb]);
};

export default useUpdateSelectedResource;
