import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';

import LoadingIndicator from 'components/shared/LoadingIndicator';

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '5px 10px',
});

const StyledIcon = styled(FontAwesomeIcon)({
  cursor: 'pointer',
  fontSize: '16px',
});

const StartMessageThreadButton = ({ handleShowThread }) => {
  const { handleSaveMessageDraft, isSubmitting } = useMessageDraftMutations();

  const handleClick = async () => {
    // Create an empty draft discussion
    const { discussionId: threadId } = await handleSaveMessageDraft({
      isThread: true,
    });

    handleShowThread({ threadId });
  };

  return (
    <>
      {isSubmitting && <StyledLoadingIndicator color="borderGrey" size="16" />}
      <StyledIcon icon={['far', 'comment-lines']} onClick={handleClick} />
    </>
  );
};

StartMessageThreadButton.propTypes = {
  handleShowThread: PropTypes.func.isRequired,
};

export default StartMessageThreadButton;
