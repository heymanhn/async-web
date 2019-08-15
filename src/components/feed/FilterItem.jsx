import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
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
  padding: '15px 20px',

  ':last-of-type': {
    borderRadius: '5px',
  },
}));

const CheckboxContainer = styled.div(({ isSelected, theme: { colors } }) => ({
  flexShrink: 0,
  background: colors.white,
  border: isSelected ? 'none' : `1px solid ${colors.grey4}`,
  borderRadius: '25px',
  marginRight: '12px',
  width: '20px',
  height: '20px',
}));

const StyledCheckboxIcon = styled(FontAwesomeIcon)(({ isselected, theme: { colors } }) => ({
  display: isselected === 'true' ? 'block' : 'none',
  color: colors.blue,
  fontSize: '20px',
}));

const MainContainer = styled.div({});

const FilterTitle = styled.div({
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '24px',
});

const UnreadLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  marginTop: '5px',
}));

const FilterItem = ({ isSelected, meeting, onSelectFilter, unreadCount }) => {
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
      <MainContainer>
        <FilterTitle>{title}</FilterTitle>
        {unreadCount ? (
          <UnreadLabel>{Pluralize('unread discussion', unreadCount, true)}</UnreadLabel>
        ) : undefined}
      </MainContainer>
    </Container>
  );
};

FilterItem.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  meeting: PropTypes.object,
  onSelectFilter: PropTypes.func.isRequired,
  unreadCount: PropTypes.number,
};

FilterItem.defaultProps = {
  meeting: null,
  unreadCount: null,
};

export default FilterItem;
