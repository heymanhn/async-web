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
  // modalTopic: styled.div({ }),
  // modalReply: styled.div({

  // }),
};

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.formGrey,
  color: colors.grey3,

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
}), ({ contentType, theme: { colors } }) => layouts[contentType]({ colors }));

const ButtonContainer = styled.div(({ contentType, isDisabled, theme: { colors }, type }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',

  background: type === 'save' ? colors.white : 'initial',
  borderBottomLeftRadius:
    contentType.toLowerCase().includes('topic') && type === 'save' ? '5px' : 'initial',
  color: type === 'save' ? colors.blue : colors.grey3,
  cursor: isDisabled ? 'default' : 'pointer',
  fontSize: 14,
  fontWeight: 500,
  height: heights[contentType],
  padding: '0px 30px',

  div: {
    opacity: isDisabled ? 0.5 : 1,
  },
}));

const PlusSign = styled.div({
  fontSize: '18px',
  marginRight: '8px',
  position: 'relative',
  top: '-1px',
});

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
        <PlusSign>+</PlusSign>
        <div>{generateSaveButtonText()}</div>
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
        Cancel
      </ButtonContainer>
      <VerticalDivider contentType={contentType} />
    </React.Fragment>
  );

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
