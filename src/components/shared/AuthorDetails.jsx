import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';
import { titleize } from 'utils/helpers';

import Avatar from './Avatar';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '12px',
});

const Details = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
});

const Author = styled.div(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 14, weight: 500 }),
  marginRight: '15px',
}));

const Timestamp = styled(Moment)(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey3,
  cursor: 'default',
}));

const EditedLabel = styled.span(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey3,
  cursor: 'default',
  marginLeft: '3px',
}));

const EditingLabel = styled.div(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),
  color: colors.grey4,
}));

const AuthorDetails = ({ author, createdAt, isEdited }) => {
  const { mode } = useContext(MessageContext);
  const editedLabel = <EditedLabel>(edited)</EditedLabel>;

  return (
    <Container>
      <AvatarWithMargin avatarUrl={author.profilePictureUrl} size={24} />
      <Details>
        <Author>{author.fullName}</Author>
        {mode === 'display' && (
          <>
            {createdAt && (
              <Timestamp fromNow parse="X" filter={t => titleize(t)}>
                {createdAt}
              </Timestamp>
            )}
            {isEdited && editedLabel}
          </>
        )}
        {mode === 'edit' && <EditingLabel>Editing</EditingLabel>}
      </Details>
    </Container>
  );
};

AuthorDetails.propTypes = {
  author: PropTypes.object.isRequired,
  createdAt: PropTypes.number,
  isEdited: PropTypes.bool,
};

AuthorDetails.defaultProps = {
  createdAt: null,
  isEdited: false,
};

export default AuthorDetails;
