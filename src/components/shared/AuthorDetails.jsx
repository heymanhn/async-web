import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';

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

const Author = styled.div({
  fontWeight: 500,
  fontSize: '14px',
  marginRight: '15px',
});

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
}));

const EditedLabel = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
  marginLeft: '3px',
}));

const EditingLabel = styled.div(({ theme: { colors } }) => ({
  color: colors.grey4,
  fontSize: '14px',
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
              <Timestamp fromNow parse="X">
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
