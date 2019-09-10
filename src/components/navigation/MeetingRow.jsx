import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Truncate from 'react-truncate';
import styled from '@emotion/styled';

const Container = styled.div(({ isSelected, isUnread, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',

  background: isSelected ? colors.sidebarBlue : 'none',
  color: (isSelected || isUnread) ? colors.bgGrey : colors.grey6,
  fontSize: '14px',
  margin: '0 -20px',
  padding: '8px 20px',
  fontWeight: isUnread ? 600 : 400,
  ':hover': {
    background: isSelected ? colors.sidebarBlue : colors.darkHoverBlue,
  },
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const BadgeCountContainer = styled.span(({ theme: { colors } }) => ({
  color: colors.white,
  background: colors.yellow,
  borderRadius: '10px',
  fontSize: '12px',
  height: '20px',
  padding: '1px 8px',
  fontWeight: 500,
}));

const MeetingRow = ({ badgeCount, isSelected, meeting, ...props }) => {
  const { id, title } = meeting;

  return (
    <StyledLink to={`/spaces/${id}`}>
      <Container isSelected={isSelected} isUnread={badgeCount > 0} {...props}>
        <Truncate width={170} trimWhitespace>{title}</Truncate>
        {badgeCount > 0 && (
          <BadgeCountContainer>{badgeCount}</BadgeCountContainer>
        )}
      </Container>
    </StyledLink>
  );
};

MeetingRow.propTypes = {
  badgeCount: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  meeting: PropTypes.object.isRequired,
};

export default MeetingRow;
