import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Truncate from 'react-truncate';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  color: colors.grey6,
  fontSize: '14px',
  margin: '0 -20px',
  padding: '8px 20px',

  ':hover': {
    background: colors.darkHoverBlue,
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
  width: '23px',
  height: '19px',
  fontSize: '12px',
  fontWeight: 500,
  textAlign: 'center',
}));

const MeetingRow = ({ meeting, badgeCount }) => {
  const { id, title } = meeting;

  return (
    <StyledLink to={`/spaces/${id}`}>
      <Container>
        <Truncate width={170} trimWhitespace>{title}</Truncate>
        {badgeCount > 0 ? (
          <BadgeCountContainer>{badgeCount}</BadgeCountContainer>
        ) : undefined}
      </Container>
    </StyledLink>
  );
};

MeetingRow.propTypes = {
  meeting: PropTypes.object.isRequired,
  badgeCount: PropTypes.object.isRequired,
};

export default MeetingRow;
