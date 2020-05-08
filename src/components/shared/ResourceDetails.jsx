import React from 'react';
import PropTypes from 'prop-types';
import Pluralize from 'pluralize';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import { isResourceUnread, titleize } from 'utils/helpers';

import NameList from 'components/shared/NameList';

const Container = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 13 }),
  color: colors.grey2,
  cursor: 'default',
}));

const Separator = styled.span(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 10 }),
  color: colors.grey3,
  margin: '0 8px',
  position: 'relative',
  top: '-1px',
}));

const Tag = styled.span(({ isUnread, theme: { colors } }) => ({
  color: isUnread ? colors.blue : colors.grey2,
}));

const Timestamp = styled(Moment)(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 13 }),
  cursor: 'default',
}));

// Resource is either a document or a discussion
const ResourceDetails = ({ type, resource, names, ...props }) => {
  const { updatedAt, tags, messageCount, discussionCount } = resource;

  const itemTag = () => {
    const count = type === 'document' ? discussionCount : messageCount;
    const label = type === 'document' ? 'discussion' : 'message';

    return tags.includes('no_updates')
      ? Pluralize(label, count, true)
      : tags[0].replace('_', ' ');
  };

  const separator = <Separator>&#8226;</Separator>;
  const tagText = titleize(itemTag());

  return (
    <Container {...props}>
      <Tag isUnread={isResourceUnread(tags)}>{tagText}</Tag>
      {separator}
      <NameList names={names} />
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
  names: PropTypes.array.isRequired,
};

export default ResourceDetails;
