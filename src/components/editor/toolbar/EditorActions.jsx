import React from 'react';
import PropTypes from 'prop-types';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';


const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  color: colors.grey3,

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}));

const ButtonContainer = styled.div({ });

const SmallContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '10px',
});

const LargeContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  borderRadius: '0 0 5px 5px',
  margin: '20px -17px 0 -68px',
  minHeight: '56px',
  paddingLeft: '65px',
  paddingRight: '20px',
  position: 'relative',
  left: '3px',
}));

// For the small version only
const SaveLink = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: colors.blue,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  marginRight: '20px',
  opacity: isDisabled ? 0.5 : 1,
}));

// For the small version only
const CancelLink = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
}));

const layouts = {
  topic: styled.div(({ theme: { colors } }) => ({
    borderRadius: '0 0 5px 5px',
    minHeight: '56px',
    paddingLeft: '68px',
    paddingRight: '20px',
  })),
  // modalTopic: styled.div({ }),
  // modalReply: styled.div({

  // }),
};


// TODO (HN): Pass the action buttons' text into the component in the future
const ContentToolbar = ({ contentType, isSubmitDisabled, onCancel, onSubmit }) => {
  // const buttons = {
  //   save: {
  //     small: (
  //       <SaveLink onClick={isSubmitDisabled ? () => { } : onSubmit} isDisabled={isSubmitDisabled}>
  //         {mode === 'edit' ? 'Update' : 'Reply'}
  //       </SaveLink>
  //     ),
  //     large: (
  //       <StyledButton
  //         title={mode === 'compose' ? 'Add Topic' : 'Save'}
  //         onClick={onSubmit}
  //         isDisabled={isSubmitDisabled}
  //       />
  //     ),
  //   },
  //   cancel: {
  //     small: <CancelLink onClick={onCancel}>Cancel</CancelLink>,
  //     large: <StyledButton type="light" title="Cancel" onClick={onCancel} />,
  //   },
  // };

  // const buttonsToDisplay = (
  //   <React.Fragment>
  //     {buttons.save[size]}
  //     {buttons.cancel[size]}
  //   </React.Fragment>
  // );

  const repliesButton = (
    <ButtonContainer value={0}>
    </ButtonContainer>
  );

  return (
    <Container>
      {repliesButton}
    </Container>
  );

  // return <LargeContainer>{buttonsToDisplay}</LargeContainer>;
};

ContentToolbar.propTypes = {
  contentType: PropTypes.oneOf(['topic', 'modalTopic', 'modalReply']).isRequired,
  mode: PropTypes.oneOf(['display', 'compose', 'edit']).isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  replyCount: PropTypes.number.isRequired,
};

export default ContentToolbar;
