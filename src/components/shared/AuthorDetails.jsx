import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styled from '@emotion/styled';

import Avatar from './Avatar';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarWithMargin = styled(Avatar)({
  flexShrink: 0,
  marginRight: '10px',
});

const Details = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
});

const Author = styled.div(({ size }) => ({
  fontWeight: 500,
  fontSize: size === 'large' ? '14px' : '12px',
  marginRight: '15px',
}));

const Timestamp = styled(Moment)(({ size, theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: size === 'large' ? '14px' : '12px',
}));

const Separator = styled.span(({ size, theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: size === 'large' ? '14px' : '12px',
  margin: '0 10px',
}));

const EditedLabel = styled.span(({ size, theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: size === 'large' ? '14px' : '12px',
}));

const AuthorDetails = ({ author, createdAt, isEdited, mode, size }) => {
  const separator = <Separator size={size}>&#8226;</Separator>;
  const editedLabel = <EditedLabel size={size}>Edited</EditedLabel>;

  return (
    <Container>
      <AvatarWithMargin
        avatarUrl={author.profilePictureUrl}
        size={size === 'large' ? 32 : 24}
      />
      <Details>
        <Author size={size}>{author.fullName}</Author>
        {mode === 'display' && (
          <React.Fragment>
            <Timestamp fromNow parse="X" size={size}>{createdAt}</Timestamp>
            {isEdited && separator}
            {isEdited && editedLabel}
          </React.Fragment>
        )}
      </Details>
    </Container>
  );
};

AuthorDetails.propTypes = {
  author: PropTypes.object.isRequired,
  createdAt: PropTypes.number,
  isEdited: PropTypes.bool,
  mode: PropTypes.oneOf(['compose', 'display', 'edit']).isRequired,
  size: PropTypes.oneOf(['large', 'small']),
};

AuthorDetails.defaultProps = {
  createdAt: null,
  isEdited: false,
  size: 'large',
};

export default AuthorDetails;
