import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import useHover from 'hooks/shared/useHover';
import { titleize } from 'utils/helpers';

import UnreadIndicator from 'components/shared/UnreadIndicator';
import LastUpdate from './LastUpdate';

const Container = styled.div({
  display: 'flex',

  padding: '20px 0',
  width: '100%',
});

const DetailsContainer = styled.div({
  flexGrow: 1,
});

const ItemDetails = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Title = styled.span(
  ({ hover, isUnread, theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 16, weight: isUnread ? 600 : 400 }),
    color: hover ? colors.blue : colors.grey0,
  })
);

const IconContainer = styled.div({
  marginTop: '5px',
  width: '32px',
  flexShrink: 0,
});

const StyledIcon = styled(FontAwesomeIcon)(
  ({ isunread, theme: { colors } }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    color: isunread === 'true' ? colors.grey0 : colors.grey3,
    fontSize: '16px',
  })
);

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

const StyledIndicator = styled(UnreadIndicator)({
  marginRight: '5px',
  marginTop: '1px',
});

const TimestampContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

const Timestamp = styled(Moment)(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 13 }),
  color: colors.grey2,
  cursor: 'default',
}));

const ResourceRow = ({ item, ...props }) => {
  const { hover, ...hoverProps } = useHover();
  const { document, discussion, lastUpdate } = item;
  const resourceType = document ? 'document' : 'discussion';
  const isDocument = resourceType === 'document';
  const resource = document || discussion;

  const { id, title } = resource;
  const { readAt, updatedAt } = lastUpdate;
  const isUnread = readAt === -1;

  return (
    <StyledLink to={`/${Pluralize(resourceType)}/${id}`}>
      <Container {...hoverProps} {...props}>
        <IconContainer>
          <StyledIcon
            icon={isDocument ? 'file-alt' : 'comments-alt'}
            isunread={isUnread.toString()}
          />
        </IconContainer>
        <DetailsContainer>
          <ItemDetails>
            <Title hover={hover} isUnread={isUnread}>
              {title || `Untitled ${resourceType}`}
            </Title>
            <TimestampContainer>
              {isUnread && <StyledIndicator diameter={6} />}
              <Timestamp fromNow parse="X" filter={t => titleize(t)}>
                {updatedAt}
              </Timestamp>
            </TimestampContainer>
          </ItemDetails>
          <LastUpdate notification={lastUpdate} resourceType={resourceType} />
        </DetailsContainer>
      </Container>
    </StyledLink>
  );
};

ResourceRow.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ResourceRow;
