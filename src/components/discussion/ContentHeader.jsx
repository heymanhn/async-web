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

const separator = <Separator>&#8226;</Separator>;
const editedLabel = <EditedLabel>Edited</EditedLabel>;

const ContentHeader = ({ createdAt, isEdited }) => (
  <Container>
    <Timestamp fromNow parse="X">{createdAt}</Timestamp>
    {isEdited && separator}
    {isEdited && editedLabel}
  </Container>
);

ContentHeader.propTypes = {
  createdAt: PropTypes.number.isRequired,
  isEdited: PropTypes.bool.isRequired,
};

export default ContentHeader;
