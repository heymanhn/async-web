import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useClickOutside from 'utils/hooks/useClickOutside';

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

const CompositionMenu = ({ editor, handleClose, isOpen, ...props }) => {
  const menu = useRef();
  const [query, setQuery] = useState('');
  const { value } = editor;
  const { anchorBlock } = value;

  const handleClickOutside = () => {
    if (!isOpen) return;
    handleClose();
  };
  useClickOutside({ handleClickOutside, isOpen, ref: menu });

  function calculateMenuPosition() {
    const native = window.getSelection();
    const range = native.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      top: `${rect.top + window.pageYOffset + 30}px`,
      left: `${rect.left + window.pageXOffset}px`,
    };
  }

  function setSanitizedQuery() {
    let newQuery = anchorBlock.text;
    if (newQuery.startsWith('/')) newQuery = newQuery.substring(1);
    if (newQuery !== query) setQuery(newQuery);
  }
  if (isOpen) setSanitizedQuery();
  if (!isOpen && query) setQuery('');

  function filteredOptions() {
    return optionsList.filter(({ title }) => title.toLowerCase().includes(query.toLowerCase()));
  }
  function organizeMenuOptions() {
    const optionsToOrganize = query ? filteredOptions() : optionsList;

    // Neat way of finding unique values in an array using ES6 Sets
    const sectionsToDisplay = [...new Set(optionsToOrganize.map(o => o.section))];

    return sectionsToDisplay.map(s => ({
      sectionTitle: s,
      optionsList: optionsToOrganize.filter(o => o.section === s),
    }));
  }

  const optionsToDisplay = organizeMenuOptions();
  // TODO: No results UI

  return (
    <Container
      coords={calculateMenuPosition()}
      isOpen={isOpen}
      onClick={handleClose}
      ref={menu}
      {...props}
    >
      {optionsToDisplay.map(o => (
        <MenuSection
          key={o.sectionTitle}
          editor={editor}
          optionsList={o.optionsList}
          sectionTitle={o.sectionTitle}
        />
      ))}
    </Container>
  );
};

CompositionMenu.propTypes = {
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default CompositionMenu;