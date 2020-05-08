import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

const OuterContainer = styled.div({
  display: 'flex',
});

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
  marginBottom: '20px',
  padding: '0 15px',

  ':hover': {
    background: colors.white,
  },
}));

const Label = styled.div(({ theme: { fontProps } }) => ({
  ...fontProps({ size: 13, weight: 500 }),
  marginLeft: '10px',
  marginTop: '-2px',
}));

const StyledIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '18px',
}));

const ViewMessageThreadButton = ({ threadId, handleShowThread }) => {
  return (
    <OuterContainer>
      <Container onClick={() => handleShowThread({ threadId })}>
        <StyledIcon icon={['fas', 'comment-lines']} />
        <Label>View replies</Label>
      </Container>
    </OuterContainer>
  );
};

ViewMessageThreadButton.propTypes = {
  handleShowThread: PropTypes.func.isRequired,
  threadId: PropTypes.string.isRequired,
};

export default ViewMessageThreadButton;
