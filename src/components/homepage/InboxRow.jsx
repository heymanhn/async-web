import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import styled from '@emotion/styled';
import { useQuery } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsAlt, faFileAlt } from '@fortawesome/pro-solid-svg-icons';

import objectMembersQuery from 'graphql/queries/objectMembers';
import NameList from 'components/shared/NameList';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  padding: '20px 20px 24px',
  paddingLeft: '20px',
  width: '100%',

  ':hover': {
    paddingLeft: '12px',
    borderLeft: `8px solid ${colors.hoverBlue}`,
    color: colors.grey3,
  },
}));

const ItemDetails = styled.div({
  display: 'flex',
  flexDirection: 'column',

  marginLeft: '20px',
});

const Title = styled.span(({ hover, theme: { colors } }) => ({
  color: hover ? colors.blue : colors.mainText,
  fontSize: '16px',
  fontWeight: 500,
  letterSpacing: '-0.011em',
}));

const AdditionalInfo = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',

  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
  letterSpacing: '-0.006em',
  marginTop: '3px',
}));

const Tag = styled.span(({ isUnread, theme: { colors } }) => ({
  color: isUnread ? colors.blue : colors.grey3,
  fontSize: '14px',
}));

const Separator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  margin: '0 10px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  ':hover': {
    color: colors.grey1,
  },

  color: colors.grey2,
  fontSize: '18px',
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

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
}));

const InboxRow = ({ item, ...props }) => {
  const { document, discussion } = item;
  const objectType = document ? 'document' : 'discussion';
  const isDocument = objectType === 'document';
  const object = document || discussion;
  const {
    updatedAt,
    id,
    title,
    topic,
    tags,
    messageCount,
    discussionCount,
  } = object;

  const { loading, data } = useQuery(objectMembersQuery, {
    variables: { id, objectType: Pluralize(objectType) },
  });

  if (loading) return null;

  const { objectMembers } = data;
  const safeTopic = topic || {};
  const { members } = objectMembers;
  const fullNames = (members || []).map(m => m.user.fullName);
  const titleText = isDocument ? title : safeTopic.text;

  function titleize(input) {
    return input.charAt(0).toUpperCase() + input.slice(1);
  }

  const itemTag = () => {
    const count = isDocument ? discussionCount : messageCount;
    const label = isDocument ? 'discussion' : 'message';

    return tags.includes('no_updates')
      ? Pluralize(label, count, true)
      : tags[0].replace('_', ' ');
  };

  const isUnread = () => {
    return (
      tags.includes('new_messages') ||
      tags.includes('new_discussions') ||
      tags.includes('new_document') ||
      tags.includes('new_discussion')
    );
  };

  const separator = <Separator>&#8226;</Separator>;
  const tagText = titleize(itemTag());

  return (
    <StyledLink to={`/${Pluralize(objectType)}/${id}`}>
      <Container {...props}>
        <StyledIcon icon={isDocument ? faFileAlt : faCommentsAlt} />
        <ItemDetails>
          <Title>{titleText || `Untitled ${objectType}`}</Title>
          <AdditionalInfo isUnread={isUnread()}>
            <Tag>{tagText}</Tag>
            {separator}
            <span>
              <NameList names={fullNames} />
            </span>
            {separator}
            <span>
              <Timestamp fromNow parse="X">
                {updatedAt}
              </Timestamp>
            </span>
          </AdditionalInfo>
        </ItemDetails>
      </Container>
    </StyledLink>
  );
};

InboxRow.propTypes = {
  item: PropTypes.object.isRequired,
};

export default InboxRow;
