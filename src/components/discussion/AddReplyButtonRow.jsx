import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Container = styled.div(({ roundedCorner, theme: { colors } }) => ({
  borderRadius: roundedCorner ? '0 0 5px 5px' : 'none',
  borderTop: `1px solid ${colors.borderGrey}`,
}));

const Button = styled.div(({ theme: { colors } }) => ({
  alignSelf: 'center',
  color: colors.grey3,
  cursor: 'pointer',
  margin: '15px 30px 20px',
}));

const PlusSign = styled.span(({ theme: { colors } }) => ({
  fontSize: '20px',
  fontWeight: 400,
  paddingRight: '5px',
  position: 'relative',
  top: '1px',

  ':hover': {
    color: colors.grey2,
  },
}));

const ButtonText = styled.span(({ theme: { colors } }) => ({
  fontSize: '14px',
  fontWeight: 500,

  ':hover': {
    color: colors.grey2,
    textDecoration: 'underline',
  },
}));

const AddReplyButtonRow = ({ onClickReply, ...props }) => (
  <Container {...props}>
    <Button onClick={onClickReply}>
      <PlusSign>+</PlusSign>
      <ButtonText>ADD A REPLY</ButtonText>
    </Button>
  </Container>
);

AddReplyButtonRow.propTypes = {
  onClickReply: PropTypes.func.isRequired,
  roundedCorner: PropTypes.bool,
};

AddReplyButtonRow.defaultProps = {
  roundedCorner: false,
};

export default AddReplyButtonRow;
