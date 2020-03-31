import React, { useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { NavigationContext } from 'utils/contexts';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';

import ResourceCreationModal from 'components/shared/ResourceCreationModal';
import CommandCenterModal from './CommandCenterModal';

const COMMAND_CENTER_HOTKEY = 'cmd+k';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  cursor: 'pointer',
  fontSize: '20px',
  margin: '0 15px',
}));

const CommandCenter = props => {
  const navigationContext = useContext(NavigationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceCreationModalMode, setResourceCreationModalMode] = useState(
    null
  );

  useKeyDownHandler([COMMAND_CENTER_HOTKEY, () => setIsModalOpen(true)]);

  const value = {
    ...navigationContext,
    resourceCreationModalMode,
    setResourceCreationModalMode,
  };

  return (
    <NavigationContext.Provider value={value}>
      <StyledIcon icon="terminal" onClick={() => setIsModalOpen(true)} />
      <CommandCenterModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        {...props}
      />
      <ResourceCreationModal />
    </NavigationContext.Provider>
  );
};

export default CommandCenter;
