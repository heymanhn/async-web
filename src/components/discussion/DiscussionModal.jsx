import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { track } from 'utils/analytics';
import { DiscussionContext } from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

import Modal from 'components/shared/Modal';
import DiscussionThread from './DiscussionThread';
import MessageComposer from './MessageComposer';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

/*
 * SLATE UPGRADE TODO:
 * - Create the discussion context properly with the new Slate API
 */

const DiscussionModal = ({
  createAnnotation,
  discussionId,
  documentId,
  documentEditor,
  handleClose,
  isOpen,
  selection,
  ...props
}) => {
  useMountEffect(() => {
    const title = discussionId ? 'Discussion' : 'New discussion';
    const properties = {};
    if (discussionId) properties.discussionId = discussionId;
    if (documentId) properties.documentId = documentId;

    track(`${title} viewed`, properties);
  });

  const contextValue = {
    documentId,
    discussionId,
    // context,
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen} {...props}>
      <DiscussionContext.Provider value={contextValue}>
        {/* {context && (
          <ContextEditor
            contentType="discussionContext"
            readOnly
            documentId={documentId}
            initialValue={context}
            mode="display"
          />
        )} */}
        {discussionId && documentId && (
          <DiscussionThread isUnread={isUnread()} />
        )}
        <MessageComposer
          afterDiscussionCreate={afterDiscussionCreate}
          // context={context}
          draft={draft}
          handleClose={handleClose}
          source="discussionContainer"
        />
      </DiscussionContext.Provider>
    </StyledModal>
  );
};

DiscussionModal.propTypes = {
  createAnnotation: PropTypes.func,
  discussionId: PropTypes.string,
  documentEditor: PropTypes.object,
  documentId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selection: PropTypes.object,
};

DiscussionModal.defaultProps = {
  createAnnotation: () => {},
  discussionId: null,
  documentEditor: {},
  documentId: null,
  selection: {},
};

export default DiscussionModal;

/* HN: Is this still needed?
function isUnread() {
  const { tags } = data.discussion;
  const safeTags = tags || [];
  return (
    safeTags.includes('new_messages') || safeTags.includes('new_discussion')
  );
}

function draftHasChanged(newDraft) {
    const { body } = draft || {};
    const { text } = body || {};

    const { body: newBody } = newDraft || {};
    const { text: newText } = newBody || {};

    return text !== newText;
  }
*/

/*
// HN: I know this is a long-winded way to extract the inline discussion context. But we're
// limited by what the Slate API gives us. There must be a better way.
// FUTURE: Use the immutable APIs to dynamically create the context block
function extractContext() {
  const { start, end } = selection;

  // Step 1: Delete everything before the highlight, factoring in some buffer space
  // for the rest of the current block
  documentEditor
    .moveToStartOfDocument()
    .moveEndToStartOfParentBlock(start)
    .delete();

  // Step 2: Delete everything after the highlight, similar to step 2
  documentEditor
    .moveToEndOfDocument()
    .moveStartToEndOfParentBlock(end)
    .delete();

  // Step 3: Create the highlight within the current content
  documentEditor
    .moveStartTo(start.key, start.offset)
    .moveEndTo(end.key, end.offset)
    .wrapInline(CONTEXT_HIGHLIGHT);

  const { value } = documentEditor;
  const initialContext = JSON.stringify(value.toJSON());
  setContext(initialContext);

  // 1. Undo the highlight
  // 2. Undo the end of document delete
  // 3. Undo the beginning of document delete
  documentEditor
    .undo()
    .undo()
    .undo();
}
*/
