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

const Author = styled.div({
  fontWeight: 500,
  fontSize: '14px',
  marginRight: '20px',
});

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
}));

const Separator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  margin: '0 10px',
}));

const EditedLabel = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'default',
  fontSize: '14px',
}));

const separator = <Separator>&#8226;</Separator>;
const editedLabel = <EditedLabel>Edited</EditedLabel>;

const AuthorDetails = ({ author, createdAt, isEdited, mode }) => (
  <Container>
    <AvatarWithMargin src={author.profilePictureUrl} size={32} />
    <Details>
      <Author>{author.fullName}</Author>
      {mode === 'display' && (
        <React.Fragment>
          <Timestamp fromNow parse="X">{createdAt}</Timestamp>
          {isEdited && separator}
          {isEdited && editedLabel}
        </React.Fragment>
      )}
    </Details>
  </Container>
);

AuthorDetails.propTypes = {
  author: PropTypes.object.isRequired,
  createdAt: PropTypes.number.isRequired,
  isEdited: PropTypes.bool,
  mode: PropTypes.oneOf(['compose', 'display']).isRequired,
};

AuthorDetails.defaultProps = { isEdited: false };

export default AuthorDetails;
