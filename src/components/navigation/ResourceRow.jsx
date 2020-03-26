import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import Truncate from 'react-truncate';
import styled from '@emotion/styled';

const Container = styled.div(({ isSelected, isUnread, theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'space-between',

  background: isSelected ? colors.grey7 : 'none',
  color: colors.grey1,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  margin: '0 -20px',
  padding: '8px 20px',
  fontWeight: isUnread ? 500 : 400,

  ':hover': {
    background: colors.grey7,
  },
}));

const StyledLink = styled(Link)({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const ResourceRow = ({ isSelected, resourceType, resource, ...props }) => {
  const { id, title } = resource;

  // TODO: Read/unread state, once backend gives enough info
  return (
    <StyledLink to={`/${Pluralize(resourceType)}/${id}`}>
      <Container isSelected={isSelected} {...props}>
        <Truncate trimWhitespace>{title}</Truncate>
      </Container>
    </StyledLink>
  );
};

ResourceRow.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  resourceType: PropTypes.oneOf(['workspace', 'document', 'discussion'])
    .isRequired,
  resource: PropTypes.object.isRequired,
};

export default ResourceRow;
