import React, { useState, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import CommandCenterModal from './CommandCenterModal';

const COMMAND_CENTER_HOTKEY = 'cmd+k';

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey2,
  cursor: 'pointer',
  fontSize: '20px',
  margin: '0 15px',
}));

/*
 * COMMAND CENTER TODO: Clsoe modal on Escape key, if no search query
 */

const CommandCenter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = event => {
      if (isHotkey(COMMAND_CENTER_HOTKEY, event)) {
        event.preventDefault();
        setIsModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

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
