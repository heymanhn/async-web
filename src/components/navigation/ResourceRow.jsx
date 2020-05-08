import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

import { titleize } from 'utils/helpers';
import UnreadIndicator from 'components/shared/UnreadIndicator';

const ICONS = {
  discussion: 'comments-alt',
  document: 'file-alt',
};

const Container = styled.div(
  ({ isSelected, isUnread, theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 14, weight: isUnread ? 500 : 400 }),

    display: 'flex',
    alignItems: 'center',

    background: isSelected ? colors.grey7 : 'none',
    color: colors.grey1,
    margin: '0 -20px',
    padding: '8px 20px',

    ':hover': {
      background: colors.grey7,
    },
  })
);

const TruncatedText = styled.div({
  // reference: https://css-tricks.com/flexbox-truncated-text/
  '&, & > *': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const StyledLink = styled(Link)({
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'none',
  },
});

const IconContainer = styled.div({
  width: '24px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
}));

const StyledIndicator = styled(UnreadIndicator)({
  marginRight: '5px',
});

const ResourceRow = ({
  isSelected,
  resourceType,
  resource,
  isUnread,
  ...props
}) => {
  const { id, title, topic } = resource;
  const resourceTitle = title || (topic && topic.text);

  return (
    <StyledLink to={`/${Pluralize(resourceType)}/${id}`}>
      <Container isSelected={isSelected} isUnread={isUnread} {...props}>
        {isUnread && <StyledIndicator diameter={6} />}
        {resourceType !== 'workspace' && (
          <IconContainer>
            <StyledIcon icon={ICONS[resourceType]} />
          </IconContainer>
        )}
        <TruncatedText>
          {resourceTitle || `Untitled ${titleize(resourceType)}`}
        </TruncatedText>
      </Container>
    </StyledLink>
  );
};

ResourceRow.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  resourceType: PropTypes.oneOf(['workspace', 'document', 'discussion'])
    .isRequired,
  resource: PropTypes.object.isRequired,
  isUnread: PropTypes.bool.isRequired,
};

export default ResourceRow;
