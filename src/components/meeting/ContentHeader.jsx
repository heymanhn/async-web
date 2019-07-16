import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import styled from '@emotion/styled';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'baseline',
});

const Timestamp = styled(Moment)(({ theme: { colors } }) => ({
  color: colors.grey2,
  cursor: 'default',
  fontSize: '14px',
}));

const Separator = styled.span(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  margin: '0 10px',
}));

const EditedLabel = styled.span(({ theme: { colors } }) => ({
  color: colors.grey5,
  cursor: 'default',
  fontSize: '14px',
}));

const EditButton = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',

  ':hover': {
    textDecoration: 'underline',
  },
}));

const separator = <Separator>&#8226;</Separator>;
const editedLabel = <EditedLabel>Edited</EditedLabel>;

const ContentHeader = ({ createdAt, isEditable, isEdited, onEdit }) => (
  <Container>
    <Timestamp fromNow parse="X">{createdAt}</Timestamp>
    {isEdited && separator}
    {isEdited && editedLabel}
    {isEditable && separator}
    {isEditable && <EditButton onClick={onEdit}>Edit</EditButton>}
  </Container>
);

ContentHeader.propTypes = {
  createdAt: PropTypes.number.isRequired,
  isEditable: PropTypes.bool.isRequired,
  isEdited: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ContentHeader;
