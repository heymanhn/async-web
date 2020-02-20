import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import styled from '@emotion/styled';

import { track } from 'utils/analytics';
import { mod } from 'utils/helpers';

import Modal from 'components/shared/Modal';

const StyledModal = styled(Modal)({
  alignSelf: 'flex-start',

  border: 'none',
  boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.08)',
  marginTop: '150px',
  width: '600px',
});

const customBackdropStyle = {
  background: 'black',
  opacity: 0.5,
};

const Header = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '15px 30px 0',
}));

const Title = styled.div({
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
});

const SearchInput = styled.input(({ theme: { colors } }) => ({
  // Remove all default styles for an input element
  WebkitAppearance: 'none',

  background: 'none',
  border: 'none',
  color: colors.grey1,
  fontSize: '16px',
  fontWeight: 400,
  outline: 'none',
  margin: '20px 0',
  letterSpacing: '-0.011em',
  width: '100%',

  '::placeholder': {
    color: colors.grey4,
    opacity: 1, // Firefox
  },
}));

const CommandCenterModal = ({ isOpen, handleClose, ...props }) => {
  const inputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Customize sources later
    track('Command Center launched', { source: 'inbox' });

    if (inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const handleChange = event => {
    const currentQuery = event.target.value;
    setSearchQuery(currentQuery);
    setSelectedIndex(0);
  };

  const handleKeyDown = event => {
    // if (!results.length) return null;

    // if (isHotkey('ArrowDown', event)) {
    //   return setSelectedIndex(prevIndex => mod(prevIndex + 1, results.length));
    // }
    // if (isHotkey('ArrowUp', event)) {
    //   return setSelectedIndex(prevIndex => mod(prevIndex - 1, results.length));
    // }

    if (isHotkey('Escape', event)) {
      return searchQuery ? setSearchQuery('') : handleClose();
    }

    return null;
  };

  return (
    <StyledModal
      backdropStyle={customBackdropStyle}
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      <Header>
        <Title>Inbox</Title>
        <SearchInput
          ref={inputRef}
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or search"
          spellCheck="false"
          type="text"
          value={searchQuery}
        />
      </Header>
    </StyledModal>
  );
};

CommandCenterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CommandCenterModal;
