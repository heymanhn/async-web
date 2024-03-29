import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import isHotkey from 'is-hotkey';
import styled from '@emotion/styled';

import useCommandCenterSearch from 'hooks/commandCenter/useCommandCenterSearch';
import useCommandCenterTitle from 'hooks/commandCenter/useCommandCenterTitle';
import { track } from 'utils/analytics';
import { NavigationContext } from 'utils/contexts';
import { mod } from 'utils/helpers';

import Modal from 'components/shared/Modal';

import ResultRow from './ResultRow';

const DEFAULT_PLACEHOLDER = 'Type a command or search';
const TYPE_ONLY_PLACEHOLDER = 'Type a command';
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

const Header = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  padding: '15px 30px 0',
}));

const Title = styled.div(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
}));

const EmptyRow = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  background: colors.bgGrey,
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  color: colors.grey2,
  padding: '15px 30px',
}));

const NoResults = styled.div({
  cursor: 'default',
  marginTop: '-2px',
});

const SearchInput = styled.input(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 16, weight: 400 }),

  // Remove all default styles for an input element
  WebkitAppearance: 'none',

  background: 'none',
  border: 'none',
  color: colors.grey1,
  outline: 'none',
  margin: '20px 0',
  width: '100%',

  '::placeholder': {
    color: colors.grey4,
    opacity: 1, // Firefox
  },
}));

const CommandCenterModal = ({ isOpen, handleClose, ...props }) => {
  const inputRef = useRef(null);
  const {
    resource: { resourceType, customMode },
  } = useContext(NavigationContext);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [source, setSource] = useState(resourceType);
  const [placeholder, setPlaceholder] = useState(
    customMode ? TYPE_ONLY_PLACEHOLDER : DEFAULT_PLACEHOLDER
  );
  const title = useCommandCenterTitle();
  const { queryString, setQueryString, results } = useCommandCenterSearch({
    source,
    setSource,
    title,
    isSearchDisabled: resourceType !== source || !!customMode,
  });

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
    setPlaceholder(customMode ? TYPE_ONLY_PLACEHOLDER : DEFAULT_PLACEHOLDER);
  };

  const handleCloseWrapper = () => {
    handleClose();
    handleClearInput();
  };

  const handleAction = result => {
    const { action, keepOpen, title: resultTitle } = result;
    action();

    if (keepOpen) {
      handleClearInput();
      setPlaceholder(resultTitle);
    } else {
      handleCloseWrapper();
    }
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
      return handleAction(result);
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
          placeholder={placeholder}
          spellCheck="false"
          type="text"
          value={queryString}
        />
      </Header>
      {!results.length && (
        <EmptyRow>
          <NoResults>No results</NoResults>
        </EmptyRow>
      )}
      {results.map((r, i) => (
        <ResultRow
          key={r.title}
          data={r}
          isSelected={selectedIndex === i}
          onMouseMove={() => setSelectedIndex(i)}
          handleAction={handleAction}
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
