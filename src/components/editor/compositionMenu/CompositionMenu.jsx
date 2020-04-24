/* eslint react/no-find-dom-node: 0 */
/* eslint no-mixed-operators: 0 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useClickOutside from 'hooks/shared/useClickOutside';
import useKeyDownHandler from 'hooks/shared/useKeyDownHandler';
import useSelectionDimensions from 'hooks/editor/useSelectionDimensions';
import { mod } from 'utils/helpers';

import Editor from 'components/editor/Editor';
import optionsList from './optionsList';
import MenuSection from './MenuSection';

const MAX_MENU_HEIGHT = 260;
const UP_KEY = 'up';
const DOWN_KEY = 'down';
const ENTER_KEY = 'enter';
const ESCAPE_KEY = 'esc';

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
  ({ isOpen, styles }) => {
    if (!isOpen || !styles) return {};

    return { opacity: 1, ...styles };
  }
);

const NoResults = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  marginLeft: '20px',
  marginTop: '15px',
}));

const CompositionMenu = ({ handleClose, isOpen, ...props }) => {
  const menuRef = useRef(null);
  const editor = useSlate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [optionToInvoke, setOptionToInvoke] = useState(null);
  const { coords, rect } = useSelectionDimensions({
    skip: !isOpen,
    source: 'block',
  });

  const handleClickOutside = () => isOpen && handleClose();
  useClickOutside({ handleClickOutside, isOpen, ref: menuRef });

  const filteredOptions = () => {
    if (!query) return optionsList;

    return optionsList.filter(({ title }) =>
      title.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Displays the menu either above or below the current block, based on the block's
  // relative position on the page
  const adjustedCoords = () => {
    if (!isOpen || !coords || !rect) return {};
    const { top, left } = coords;

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
        top: `${top - offsetHeight - 5}px`,
        left: `${left}px`,
      };
    }

    return {
      top: `${top + BLOCK_HEIGHT}px`,
      left: `${left}px`,
    };
  };

  const handleUpKey = () =>
    setSelectedIndex(prevIndex => mod(prevIndex - 1, filteredOptions().length));

  const handleDownKey = () =>
    setSelectedIndex(prevIndex => mod(prevIndex + 1, filteredOptions().length));

  const handleEnterKey = () => {
    const optionsToSelect = filteredOptions();
    if (!optionsToSelect.length) return;

    const option = optionsToSelect[selectedIndex];
    setOptionToInvoke(option.title);
  };

  const handlers = [
    [UP_KEY, handleUpKey],
    [DOWN_KEY, handleDownKey],
    [ENTER_KEY, handleEnterKey],
    [ESCAPE_KEY, handleClose],
  ];
  useKeyDownHandler(handlers, !isOpen);

  const setSanitizedQuery = () => {
    let newQuery = Editor.getCurrentText(editor);
    if (newQuery.startsWith('/')) newQuery = newQuery.substring(1);
    if (newQuery !== query) {
      setQuery(newQuery);
      setSelectedIndex(0);
    }
  };

  if (isOpen) setSanitizedQuery();
  if (!isOpen) {
    if (query) setQuery('');
    if (selectedIndex > 0) setSelectedIndex(0);
  }

  const organizeMenuOptions = optionsToOrganize => {
    // Neat way of finding unique values in an array using ES6 Sets
    const sectionsToDisplay = [
      ...new Set(optionsToOrganize.map(o => o.section)),
    ];

    return sectionsToDisplay.map(s => ({
      sectionTitle: s,
      optionsList: optionsToOrganize.filter(o => o.section === s),
    }));
  };

  const afterOptionInvoked = () => {
    setOptionToInvoke(null);
    handleClose();
  };

  const optionsToSelect = filteredOptions();
  const optionsToDisplay = organizeMenuOptions(optionsToSelect);

  return (
    <Container
      styles={adjustedCoords()}
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
            afterOptionInvoked={afterOptionInvoked}
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
  isOpen: PropTypes.bool.isRequired,
};

export default CompositionMenu;
