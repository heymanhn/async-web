import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import styled from '@emotion/styled';

const Container = styled.div(({ isSelected, theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: isSelected ? colors.lightestBlue : 'initial',
  borderTop: `1px solid ${isSelected ? colors.borderGrey : colors.white}`,
  borderBottom: `1px solid ${isSelected ? colors.borderGrey : colors.white}`,
  cursor: 'pointer',
  padding: '18px 20px',
}));

const CheckboxContainer = styled.div(({ isSelected, theme: { colors } }) => ({
  flexShrink: 0,
  background: colors.white,
  border: isSelected ? 'none' : `1px solid ${colors.grey4}`,
  borderRadius: '25px',
  marginRight: '12px',
  width: '24px',
  height: '24px',
}));

const StyledCheckboxIcon = styled(FontAwesomeIcon)(({ isselected, theme: { colors } }) => ({
  display: isselected === 'true' ? 'block' : 'none',
  color: colors.blue,
  fontSize: '24px',
}));

const FilterTitle = styled.div({
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
});

const FilterItem = ({ isSelected, meeting, onSelectFilter }) => {
  const title = meeting ? (meeting.title || 'Untitled Meeting') : 'All Discussions';
  const meetingId = meeting ? meeting.id : null;

  function selectFilterItem() {
    onSelectFilter(meetingId);
  }

  return (
    <Container isSelected={isSelected} onClick={selectFilterItem}>
      <CheckboxContainer isSelected={isSelected}>
        <StyledCheckboxIcon icon={faCheckCircle} isselected={isSelected.toString()} />
      </CheckboxContainer>
      <FilterTitle>{title}</FilterTitle>
    </Container>
  );
};

FilterItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  meeting: PropTypes.object,
  onSelectFilter: PropTypes.func.isRequired,
};

FilterItem.defaultProps = {
  meeting: null,
};

export default FilterItem;
