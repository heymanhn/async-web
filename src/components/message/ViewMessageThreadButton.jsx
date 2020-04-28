import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const Container = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  color: colors.grey1,
  height: '30px',
  cursor: 'pointer',
  padding: '0 15px',
  width: '145px',
}));

const Label = styled.div({
  fontSize: '13px',
  fontWeight: 500,
  letterSpacing: '-0.0025em',
  margin: '0 10px',
  marginTop: '-2px',
});

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.drakGrey,
  fontSize: '18px',
}));

const ViewMessageThreadButton = ({ threadId, handleShowThread }) => {
  return (
    <Container onClick={() => handleShowThread({ threadId })}>
      <StyledIcon icon={['fas', 'comment-lines']} />
      <Label>View replies</Label>
    </Container>
  );
};

ViewMessageThreadButton.propTypes = {
  handleShowThread: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
};

export default ViewMessageThreadButton;
