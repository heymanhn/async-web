/* eslint react/no-find-dom-node: 0 */
/* eslint no-mixed-operators: 0 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useSlate } from 'slate-react';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';
import useKeyDownHandler from 'utils/hooks/useKeyDownHandler';
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

const CompositionMenu = ({ handleClose, isModal, isOpen, ...props }) => {
  const menuRef = useRef(null);
  const editor = useSlate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [optionToInvoke, setOptionToInvoke] = useState(null);

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
  const calculateMenuPosition = () => {
    if (!isOpen) return {};
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
  };

  const handlers = [
    [
      UP_KEY,
      () =>
        setSelectedIndex(prevIndex =>
          mod(prevIndex - 1, filteredOptions().length)
        ),
    ],
    [
      DOWN_KEY,
      () =>
        setSelectedIndex(prevIndex =>
          mod(prevIndex + 1, filteredOptions().length)
        ),
    ],
    [
      ENTER_KEY,
      () => {
        const optionsToSelect = filteredOptions();
        if (!optionsToSelect.length) return;

        const option = optionsToSelect[selectedIndex];
        setOptionToInvoke(option.title);
      },
    ],
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
  isModal: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
};

CompositionMenu.defaultProps = {
  isModal: false,
};

export default CompositionMenu;
