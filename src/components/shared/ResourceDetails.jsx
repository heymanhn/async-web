import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import { titleize } from 'utils/helpers';

import ResourceNameList from 'components/shared/ResourceNameList';

const Container = styled.div(({ theme: { colors } }) => ({
  color: colors.grey2,
  cursor: 'default',
  fontSize: '13px',
  letterSpacing: '-0.0025em',
}));

const Separator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '10px',
  margin: '-3px 8px 0',
}));

const Tag = styled.span(({ isUnread, theme: { colors } }) => ({
  color: isUnread ? colors.blue : colors.grey2,
}));

const Timestamp = styled(Moment)({
  cursor: 'default',
  fontSize: '13px',
  letterSpacing: '-0.0025em',
});

// Resource is either a document or a discussion
const ResourceDetails = ({ resource, type, ...props }) => {
  const { updatedAt, id, tags, messageCount, discussionCount } = resource;
  const isDocument = type === 'document';

  const itemTag = () => {
    const count = isDocument ? discussionCount : messageCount;

    return tags.includes('no_updates')
      ? Pluralize(type, count, true)
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
    <Container {...props}>
      <Tag isUnread={isUnread()}>{tagText}</Tag>
      {separator}
      <ResourceNameList type={type} id={id} />
      {separator}
      <span>
        <Timestamp fromNow parse="X">
          {updatedAt}
        </Timestamp>
      </span>
    </Container>
  );
};

ResourceDetails.propTypes = {
  type: PropTypes.oneOf(['document', 'discussion']).isRequired,
  resource: PropTypes.object.isRequired,
};

export default ResourceDetails;
