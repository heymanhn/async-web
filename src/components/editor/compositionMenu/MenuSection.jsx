import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const SectionTitle = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontWeight: 500,
  fontSize: '12px',
  margin: '15px 0 8px 20px',
}));

const MenuSection = ({
  optionsList,
  sectionTitle,
  ...props
}) => (
  <>
    <SectionTitle>{sectionTitle}</SectionTitle>
    {optionsList.map(({ title, Component }) => <Component key={title} {...props} />)}
  </>
);

MenuSection.propTypes = {
  optionsList: PropTypes.array.isRequired,
  sectionTitle: PropTypes.string.isRequired,
};

export default MenuSection;
