// HN: Future me, please find a way to DRY this up with <ContentToolbar />
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const heights = {
  topic: '52px',
  modalTopic: '52px',
  modalReply: '32px',
};

const layouts = {
  topic: ({ colors }) => ({
    borderRadius: '0 0 5px 5px',
    borderTop: `1px solid ${colors.borderGrey}`,
    margin: '20px -17px 0 -69px',
    minHeight: heights.topic,
    position: 'relative',
    left: '3px',
  }),
  modalTopic: ({ colors }) => ({
    borderTop: `1px solid ${colors.borderGrey}`,
    margin: '25px -27px -25px -33px',
    minHeight: heights.modalTopic,
    position: 'relative',
    left: '3px',
  }),
  modalReply: () => ({
    background: 'none',
    minHeight: heights.modalReply,
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

// Only for modal reply UIs
const InnerContainer = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: colors.formGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  minHeight: heights.modalReply,
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
  padding: contentType === 'modalReply' ? '0px 15px' : '0px 30px',

  div: {
    opacity: isDisabled ? 0.5 : 1,
  },
}), ({ contentType, type }) => {
  if (type !== 'save') return {};
  if (contentType === 'modalReply') return { borderRadius: '5px 0 0 5px' };
  if (contentType === 'topic') return { borderRadius: '0 0 0 5px' };
  return {};
});

const PlusSign = styled.div({
  fontSize: '18px',
  marginRight: '8px',
  position: 'relative',
  top: '-1px',
});

const ButtonText = styled.div(({ contentType }) => ({
  fontSize: contentType === 'modalReply' ? '13px' : '14px',
}));

const VerticalDivider = styled.div(({ contentType, theme: { colors } }) => ({
  borderRight: `1px solid ${colors.borderGrey}`,
  height: heights[contentType],
  margin: 0,
}));

const EditorActions = ({ contentType, isSubmitDisabled, mode, onCancel, onSubmit }) => {
  const generateSaveButtonText = () => {
    const subject = contentType === 'modalReply' ? 'Reply' : 'Topic';
    const verb = mode === 'compose' ? 'Post' : 'Save';

    return `${verb} ${subject}`;
  };

  const saveButton = (
    <React.Fragment>
      <ButtonContainer
        contentType={contentType}
        isDisabled={isSubmitDisabled}
        onClick={isSubmitDisabled ? () => { } : onSubmit}
        type="save"
      >
        {mode === 'compose' && <PlusSign>+</PlusSign>}
        <ButtonText contentType={contentType}>{generateSaveButtonText()}</ButtonText>
      </ButtonContainer>
      <VerticalDivider contentType={contentType} />
    </React.Fragment>
  );

  const cancelButton = (
    <React.Fragment>
      <ButtonContainer
        contentType={contentType}
        onClick={onCancel}
        type="cancel"
      >
        <ButtonText contentType={contentType}>Cancel</ButtonText>
      </ButtonContainer>
      {contentType !== 'modalReply' && <VerticalDivider contentType={contentType} />}
    </React.Fragment>
  );

  if (contentType === 'modalReply') {
    return (
      <Container contentType={contentType}>
        <InnerContainer>
          {saveButton}
          {cancelButton}
        </InnerContainer>
      </Container>
    );
  }

  return (
    <Container contentType={contentType}>
      {saveButton}
      {cancelButton}
    </Container>
  );
};

EditorActions.propTypes = {
  contentType: PropTypes.oneOf(['topic', 'modalTopic', 'modalReply']).isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default EditorActions;
