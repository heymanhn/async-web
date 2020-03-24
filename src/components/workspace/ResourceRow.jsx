import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useHover from 'utils/hooks/useHover';
// import { getLocalUser } from 'utils/auth';
// import { isResourceUnread } from 'utils/helpers';

const Container = styled.div({
  display: 'flex',

  padding: '20px 0',
  width: '100%',
});

const DetailsContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  flexGrow: 1,
});

const ItemDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled.span(({ hover, isUnread, theme: { colors } }) => ({
  color: hover ? colors.blue : colors.mainText,
  fontSize: '16px',
  fontWeight: isUnread ? 600 : 400,
  letterSpacing: '-0.011em',
  marginBottom: '2px',
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

  ':first-of-type': {
    borderTop: 'none',
  },

  ':hover,:active,:visited': {
    textDecoration: 'none',
  },
}));

const ResourceRow = ({ item, ...props }) => {
  const { hover, ...hoverProps } = useHover();
  const { document, discussion } = item;
  const resourceType = document ? 'document' : 'discussion';
  const isDocument = resourceType === 'document';
  const resource = document || discussion;

  const { id, title, topic } = resource;
  const safeTopic = topic || {};
  const titleText = isDocument ? title : safeTopic.text;

  // const { userId } = getLocalUser();
  // const { id: authorId } = author || owner;
  // const isAuthor = userId === authorId;

  return (
    <StyledLink to={`/${Pluralize(resourceType)}/${id}`}>
      <Container {...hoverProps} {...props}>
        <IconContainer>
          <StyledIcon icon={isDocument ? 'file-alt' : 'comments-alt'} />
        </IconContainer>
        <DetailsContainer>
          <ItemDetails>
            <Title hover={hover} isUnread={false}>
              {titleText || `Untitled ${resourceType}`}
            </Title>
          </ItemDetails>
        </DetailsContainer>
      </Container>
    </StyledLink>
  );
};

ResourceRow.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ResourceRow;
