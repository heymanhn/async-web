import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useResourceDetails from 'utils/hooks/useResourceDetails';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',

  padding: '20px 0',
  width: '100%',
});

const ItemDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled.span(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
  marginBottom: '2px',

  ':hover': {
    color: colors.blue,
  },
}));

const IconContainer = styled.div({
  marginTop: '5px',
  width: '32px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  color: colors.grey2,
  fontSize: '16px',
}));

const StyledLink = styled(Link)(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'column',

  cursor: 'pointer',
  borderTop: `1px solid ${colors.borderGrey}`,
  textDecoration: 'none',

  ':last-of-type': {
    borderBottom: `1px solid ${colors.borderGrey}`,
  },

  ':hover,:active,:visited': {
    textDecoration: 'none',
  },
}));

const InboxRow = ({ item, ...props }) => {
  const { document, discussion } = item;
  const resourceType = document ? 'document' : 'discussion';
  const isDocument = resourceType === 'document';
  const resource = document || discussion;

  const ResourceDetails = useResourceDetails(resourceType, resource);
  if (!ResourceDetails) return null;

  const { id, title, topic } = resource;
  const safeTopic = topic || {};
  const titleText = isDocument ? title : safeTopic.text;

  return (
    <StyledLink to={`/${Pluralize(resourceType)}/${id}`}>
      <Container {...props}>
        <IconContainer>
          <StyledIcon icon={isDocument ? 'file-alt' : 'comments-alt'} />
        </IconContainer>
        <ItemDetails>
          <Title>{titleText || `Untitled ${resourceType}`}</Title>
          <ResourceDetails />
        </ItemDetails>
      </Container>
    </StyledLink>
  );
};

InboxRow.propTypes = {
  item: PropTypes.object.isRequired,
};

export default InboxRow;
