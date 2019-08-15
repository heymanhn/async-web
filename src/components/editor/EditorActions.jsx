// HN: Future me, please find a way to DRY this up with <ContentToolbar />
import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import styled from '@emotion/styled';

const heights = {
  discussion: '52px',
  largeReply: '52px',
  smallReply: '32px',
};

const layouts = {
  discussion: ({ colors }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    marginTop: '7px',
    minHeight: heights.discussion,
  }),
  largeReply: ({ colors }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    margin: '25px -27px -25px -33px',
    minHeight: heights.largeReply,
    position: 'relative',
    left: '3px',
  }),
  smallReply: () => ({
    background: 'none',
    minHeight: heights.smallReply,
    marginTop: '10px',
  }),
};

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  color: colors.grey3,

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}), ({ contentType, theme: { colors } }) => layouts[contentType]({ colors }));

// Only for small reply UIs
const InnerContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  minHeight: heights.smallReply,
}));

const ButtonContainer = styled.div(({ contentType, isDisabled, theme: { colors }, type }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: type === 'save' ? colors.white : 'initial',
  color: type === 'save' ? colors.blue : colors.grey3,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: 14,
  fontWeight: 500,
  height: heights[contentType],
  padding: contentType === 'smallReply' ? '0px 15px' : '0px 30px',

  div: {
    opacity: isDisabled ? 0.5 : 1,
  },
}), ({ contentType, type }) => {
  if (type !== 'save') return {};
  if (contentType === 'smallReply') return { borderRadius: '5px 0 0 5px' };
  return {};
});

const PlusSign = styled.div({
  fontSize: '18px',
  marginRight: '8px',
  position: 'relative',
  top: '-1px',
});

const StyledSpinner = styled(Spinner)(({ theme: { colors } }) => ({
  border: `.05em solid ${colors.blue}`,
  borderRightColor: 'transparent',
  width: '12px',
  height: '12px',
  marginRight: '8px',
  marginTop: '1px',
}));

const ButtonText = styled.div(({ contentType }) => ({
  fontSize: contentType === 'smallReply' ? '13px' : '14px',
}));

const VerticalDivider = styled.div(({ contentType, theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: heights[contentType],
  margin: 0,
}));

const EditorActions = ({
  contentType,
  hideCancelButton,
  isSubmitDisabled,
  isSubmitting,
  mode,
  onCancel,
  onSubmit,
}) => {
  const generateSaveButtonText = () => {
    const subject = contentType === 'smallReply' ? 'Reply' : 'Discussion';
    const verb = mode === 'compose' ? 'Post' : 'Save';

    return `${verb} ${subject}`;
  };

  const handleSubmit = (event) => {
    event.stopPropagation();
    return isSubmitDisabled ? null : onSubmit();
  };

  const handleCancel = (event) => {
    event.stopPropagation();
    return onCancel();
  };

  const saveButton = (
    <React.Fragment>
      <ButtonContainer
        contentType={contentType}
        isDisabled={isSubmitDisabled}
        onClick={handleSubmit}
        type="save"
      >
        {!isSubmitting && mode === 'compose' && <PlusSign>+</PlusSign>}
        {isSubmitting && mode === 'compose' && <StyledSpinner />}
        <ButtonText contentType={contentType}>{generateSaveButtonText()}</ButtonText>
      </ButtonContainer>
      <VerticalDivider contentType={contentType} />
    </React.Fragment>
  );

  const cancelButton = (
    <React.Fragment>
      <ButtonContainer
        contentType={contentType}
        onClick={handleCancel}
        type="cancel"
      >
        <ButtonText contentType={contentType}>Cancel</ButtonText>
      </ButtonContainer>
      {contentType !== 'smallReply' && <VerticalDivider contentType={contentType} />}
    </React.Fragment>
  );

  if (contentType === 'smallReply') {
    return (
      <Container contentType={contentType}>
        <InnerContainer>
          {saveButton}
          {!hideCancelButton ? cancelButton : undefined}
        </InnerContainer>
      </Container>
    );
  }

  return (
    <Container contentType={contentType}>
      {saveButton}
      {!hideCancelButton ? cancelButton : undefined}
    </Container>
  );
};

EditorActions.propTypes = {
  contentType: PropTypes.oneOf([
    'discussion',
    'largeReply',
    'smallReply',
  ]).isRequired,
  hideCancelButton: PropTypes.bool.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditorActions;
