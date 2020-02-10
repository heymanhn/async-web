/* eslint react/no-find-dom-node: 0 */
/* eslint no-mixed-operators: 0 */
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';

import Editor from 'components/editor/Editor';
import optionsList from './optionsList';
import MenuSection from './MenuSection';

const MAX_MENU_HEIGHT = 260;

const Container = styled.div(
  ({ isOpen, theme: { colors } }) => ({
    display: isOpen ? 'block' : 'none',
    background: colors.bgGrey,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '3px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    maxHeight: `${MAX_MENU_HEIGHT}px`,
    opacity: 0,
    overflow: 'auto',
    paddingBottom: '15px',
    position: 'absolute',
    top: '-10000px',
    left: '-10000px',
    width: '240px',
    zIndex: 1,
  }),
  ({ coords, isOpen }) => {
    if (!isOpen || !coords) return {};

    const { top, left } = coords;
    return { opacity: 1, top, left };
  }
);

const NoResults = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  marginLeft: '20px',
  marginTop: '15px',
}));

// Neat trick to support modular arithmetic for negative numbers
// https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
function mod(x, n) {
  return ((x % n) + n) % n;
}

const CompositionMenu = ({ handleClose, isModal, isOpen, ...props }) => {
  const menuRef = useRef(null);
  const editor = useSlate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [optionToInvoke, setOptionToInvoke] = useState(null);

  const handleClickOutside = () => isOpen && handleClose();
  useClickOutside({ handleClickOutside, isOpen, ref: menuRef });

  function filteredOptions() {
    if (!query) return optionsList;

    return optionsList.filter(({ title }) =>
      title.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Displays the menu either above or below the current block, based on the block's
  // relative position on the page
  function calculateMenuPosition() {
    const [block] = Editor.getParentBlock(editor);
    const element = ReactEditor.toDOMNode(editor, block);
    if (!element) return {};

    const rect = element.getBoundingClientRect();

    const windowYOffset = isModal ? 0 : window.pageYOffset;
    const windowXOffset = isModal ? 0 : window.pageXOffset;
    const elemYOffset = rect.top + windowYOffset;
    const elemXOffset = rect.left + windowXOffset;
    const BLOCK_HEIGHT = 30;

    if (rect.top > window.innerHeight / 2) {
      const options = filteredOptions();
      const sectionCount = [...new Set(options.map(o => o.section))].length;
      const optionCount = options.length;

      // TODO(HN): not the best way to implement this. Improve later
      const SECTION_HEIGHT = 43;
      const OPTION_HEIGHT = 32;
      const NO_RESULTS_HEIGHT = 53;
      const calculatedHeight = optionCount
        ? sectionCount * SECTION_HEIGHT + optionCount * OPTION_HEIGHT + 15 // bottom padding
        : NO_RESULTS_HEIGHT;
      const offsetHeight = Math.min(calculatedHeight, MAX_MENU_HEIGHT);

      return {
        top: `${elemYOffset - offsetHeight - 5}px`,
        left: `${elemXOffset}px`,
      };
    }

    return {
      top: `${elemYOffset + BLOCK_HEIGHT}px`,
      left: `${elemXOffset}px`,
    };
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const optionsToSelect = filteredOptions();

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prevIndex =>
          mod(prevIndex - 1, optionsToSelect.length)
        );
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prevIndex =>
          mod(prevIndex + 1, optionsToSelect.length)
        );
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        if (!optionsToSelect.length) return;

        const option = optionsToSelect[selectedIndex];
        setOptionToInvoke(option.title);
      }

      if (event.key === 'Esc') {
        event.preventDefault();
        handleClose();
      }
    }

    if (!isOpen) return () => {};
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  function setSanitizedQuery() {
    let newQuery = Editor.getCurrentText(editor);
    if (newQuery.startsWith('/')) newQuery = newQuery.substring(1);
    if (newQuery !== query) {
      setQuery(newQuery);
      setSelectedIndex(0);
    }
  }
  if (isOpen) setSanitizedQuery();
  if (!isOpen) {
    if (query) setQuery('');
    if (selectedIndex > 0) setSelectedIndex(0);
  }

  function organizeMenuOptions(optionsToOrganize) {
    // Neat way of finding unique values in an array using ES6 Sets
    const sectionsToDisplay = [
      ...new Set(optionsToOrganize.map(o => o.section)),
    ];

    return sectionsToDisplay.map(s => ({
      sectionTitle: s,
      optionsList: optionsToOrganize.filter(o => o.section === s),
    }));
  }

  const optionsToSelect = filteredOptions();
  const optionsToDisplay = organizeMenuOptions(optionsToSelect);

  return (
    <Container
      coords={calculateMenuPosition()}
      isOpen={isOpen}
      onClick={handleClose}
      ref={menuRef}
      {...props}
    >
      {optionsToDisplay.length > 0 ? (
        optionsToDisplay.map(o => (
          <MenuSection
            key={o.sectionTitle}
            editor={editor}
            afterOptionInvoked={() => setOptionToInvoke(null)}
            optionsList={o.optionsList}
            optionToInvoke={optionToInvoke}
            sectionTitle={o.sectionTitle}
            selectedOption={optionsToSelect[selectedIndex].title}
          />
        ))
      ) : (
        <NoResults>No results</NoResults>
      )}
    </Container>
  );
};

CompositionMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isModal: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
};

CompositionMenu.defaultProps = {
  isModal: false,
};

export default CompositionMenu;
