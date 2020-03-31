import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import styled from '@emotion/styled';

import { track } from 'utils/analytics';
import { NavigationContext } from 'utils/contexts';
import { mod } from 'utils/helpers';

import Modal from 'components/shared/Modal';
import useCommandCenterTitle from './useCommandCenterTitle';
import useCommandCenterSearch from './useCommandCenterSearch';
import ResultRow from './ResultRow';

const UP_KEY = 'up';
const DOWN_KEY = 'down';
const ENTER_KEY = 'enter';
const ESCAPE_KEY = 'esc';

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

const Header = styled.div(({ resultCount, theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  borderRadius: resultCount ? '0' : '5px',
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
  const {
    resource: { resourceType },
  } = useContext(NavigationContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [source, setSource] = useState(resourceType);
  const title = useCommandCenterTitle();
  const { queryString, setQueryString, results } = useCommandCenterSearch(
    source,
    setSource,
    title
  );

  useEffect(() => {
    if (isOpen) {
      // Customize sources later
      track('Command Center launched', { source });

      if (inputRef.current) inputRef.current.focus();
      if (!source) setSource(resourceType);
    } else {
      setSource(null);
    }
  }, [isOpen, source, resourceType]);

  const handleChange = event => {
    const currentQuery = event.target.value;
    setSelectedIndex(0);
    setQueryString(currentQuery);
  };

  const handleClearInput = () => {
    setSelectedIndex(0);
    setQueryString('');
  };

  const handleCloseWrapper = () => {
    handleClose();
    handleClearInput();
  };

  const handleKeyDown = event => {
    if (isHotkey(ESCAPE_KEY, event)) {
      return queryString ? setQueryString('') : handleCloseWrapper();
    }

    if (!results.length) return null;

    if (isHotkey(DOWN_KEY, event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex + 1, results.length));
    }

    if (isHotkey(UP_KEY, event)) {
      return setSelectedIndex(prevIndex => mod(prevIndex - 1, results.length));
    }

    if (isHotkey(ENTER_KEY, event)) {
      const result = results[selectedIndex];
      result.action();
      return result.keepOpen ? handleClearInput() : handleCloseWrapper();
    }

    return null;
  };

  return (
    <StyledModal
      backdropStyle={customBackdropStyle}
      handleClose={handleCloseWrapper}
      isOpen={isOpen}
      {...props}
    >
      <Header resultCount={results.length}>
        <Title>{title}</Title>
        <SearchInput
          ref={inputRef}
          onChange={handleChange}
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          placeholder="Type a command or search"
          spellCheck="false"
          type="text"
          value={queryString}
        />
      </Header>
      {results.map((r, i) => (
        <ResultRow
          key={r.title}
          data={r}
          isSelected={selectedIndex === i}
          onMouseMove={() => setSelectedIndex(i)}
          handleClose={handleCloseWrapper}
        />
      ))}
    </StyledModal>
  );
};

CommandCenterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default CommandCenterModal;
