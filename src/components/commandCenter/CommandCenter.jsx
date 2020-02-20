import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import useKeyDownHandlers from 'utils/hooks/useKeyDownHandlers';
import CommandCenterModal from './CommandCenterModal';

const COMMAND_CENTER_HOTKEY = 'cmd+k';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  cursor: 'pointer',
  fontSize: '20px',
  margin: '0 15px',
}));

const CommandCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useKeyDownHandlers([[COMMAND_CENTER_HOTKEY, () => setIsModalOpen(true)]]);

  return (
    <>
      <StyledIcon icon="terminal" onClick={() => setIsModalOpen(true)} />
      <CommandCenterModal
        isOpen={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CommandCenter;
