/* eslint react/no-find-dom-node: 0 */
/* eslint no-mixed-operators: 0 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';
import useMountEffect from 'utils/hooks/useMountEffect';

import optionsList from './optionsList';
import MenuSection from './MenuSection';

const Container = styled.div(({ isOpen, theme: { colors } }) => ({
  display: isOpen ? 'block' : 'none',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '3px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  maxHeight: '260px',
  opacity: 0,
  overflow: 'auto',
  paddingBottom: '15px',
  position: 'absolute',
  top: '-10000px',
  left: '-10000px',
  width: '240px',
  zIndex: 1,
}), ({ coords, isOpen }) => {
  if (!isOpen || !coords) return {};

  const { top, left } = coords;
  return { opacity: 1, top, left };
});

const NoResults = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  marginLeft: '20px',
  marginTop: '15px',
}));

// Neat trick to support modular arithmetic for negative numbers
// https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
function mod(x, n) {
  return (x % n + n) % n;
}

const CompositionMenu = React.forwardRef(({ editor, handleClose, isOpen, ...props }, menuRef) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { value } = editor;
  const { anchorBlock, document } = value;

  const handleClickOutside = () => {
    if (!isOpen) return;
    handleClose();
  };
  useClickOutside({ handleClickOutside, isOpen, ref: menuRef });

  // Always position the menu behind the entire block, so that it doesn't move as the user types
  function calculateMenuPosition() {
    const path = document.getPath(anchorBlock.key);
    const element = editor.findDOMNode(path);
    if (!element) return {};

    const rect = element.getBoundingClientRect();

    return {
      top: `${rect.top + window.pageYOffset + 30}px`,
      left: `${rect.left + window.pageXOffset}px`,
    };
  }

  function filteredOptions() {
    if (!query) return optionsList;

    return optionsList.filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()));
  }

  /*
   * The compositionMenu plugin forwards a native keyboard event to this element
   * when the user presses the up or down arrow keys while the menu is open. React
   * doesn't listen to native events that are dispatched, so we have to add an event listener
   * to the DOM element itself instead of using the onKeyDown prop on the React element.
   *
   * https://stackoverflow.com/questions/39065010/why-react-event-handler-is-not-called-on-dispatchevent
   */
  function handleKeyDown(event) {
    if (event.key === 'ArrowUp') {
      setSelectedIndex(prevIndex => mod(prevIndex - 1, filteredOptions().length));
    }
    if (event.key === 'ArrowDown') {
      setSelectedIndex(prevIndex => mod(prevIndex + 1, filteredOptions().length));
    }
  }
  useMountEffect(() => {
    menuRef.current.addEventListener('keydown', handleKeyDown);
  });

  function setSanitizedQuery() {
    let newQuery = anchorBlock.text;
    if (newQuery.startsWith('/')) newQuery = newQuery.substring(1);
    if (newQuery !== query) setQuery(newQuery);
  }
  if (isOpen) setSanitizedQuery();
  if (!isOpen) {
    if (query) setQuery('');
    if (selectedIndex > 0) setSelectedIndex(0);
  }

  function organizeMenuOptions(optionsToOrganize) {
    // Neat way of finding unique values in an array using ES6 Sets
    const sectionsToDisplay = [...new Set(optionsToOrganize.map(o => o.section))];

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
      {optionsToDisplay.length > 0 ? optionsToDisplay.map(o => (
        <MenuSection
          key={o.sectionTitle}
          editor={editor}
          optionsList={o.optionsList}
          sectionTitle={o.sectionTitle}
          selectedOption={optionsToSelect[selectedIndex].title}
        />
      )) : <NoResults>No results</NoResults>}
    </Container>
  );
});

CompositionMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default CompositionMenu;
