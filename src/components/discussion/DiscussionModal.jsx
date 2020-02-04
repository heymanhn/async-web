import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import { track } from 'utils/analytics';
import { DiscussionContext, DocumentContext } from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

// import { CONTEXT_HIGHLIGHT } from 'components/editor/plugins/inlineDiscussion';
import Modal from 'components/shared/Modal';
import DiscussionThread from './DiscussionThread';
import DiscussionMessage from './DiscussionMessage';
import ModalAddReplyBox from './ModalAddReplyBox';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

const StyledDiscussionMessage = styled(DiscussionMessage)({
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
});

/*
 * SLATE UPGRADE TODO:
 * - Create the discussion context properly with the new Slate API
 * - Pass discussion context into DocumentContext for child components
 * - Create annotation in the document after discussion created
 */

const DiscussionModal = ({
  // createAnnotation,
  // documentEditor,
  isOpen,
  handleClose,
  // selection,
  ...props
}) => {
  const { documentId, modalDiscussionId, handleShowDiscussion } = useContext(
    DocumentContext
  );
  const [isComposing, setIsComposing] = useState(!modalDiscussionId);
  // const [context, setContext] = useState(null);
  // const [draft, setDraft] = useState(null);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => setIsComposing(false);

  useMountEffect(() => {
    const title = modalDiscussionId ? 'Discussion' : 'New discussion';
    const properties = {};
    if (modalDiscussionId) properties.discussionId = modalDiscussionId;
    if (documentId) properties.documentId = documentId;

    track(`${title} viewed`, properties);
  });

  const { loading, data } = useQuery(discussionQuery, {
    variables: { discussionId: modalDiscussionId, queryParams: {} },
    skip: !modalDiscussionId,
  });

  if (loading) return null;

  let draft;
  let context; // SLATE UPGRADE TODO: later this may need to be state instead
  if (data && data.discussion) {
    const { discussion } = data;
    ({ draft, topic: context } = discussion);
  }

  // if (!!draft && !isComposing) startComposing();
  // if (!discussionId && !context) extractContext();

  // createAnnotation(value);

  // Update the URL in the address bar to reflect the new discussion
  // TODO (HN): Fix this implementation this later.
  //
  // const { origin } = window.location;
  // const url = `${origin}/discussions/${value}`;
  // return window.history.replaceState({}, `discussion: ${value}`, url);
  // }

  function handleCancelCompose() {
    stopComposing();
    // SLATE UPGRADE TODO: close the modal when canceling on compose
  }

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  }

  const value = {
    discussionId: modalDiscussionId,
    context,
    draft,

    afterCreate: id => handleShowDiscussion(id),
  };

  return (
    <StyledModal handleClose={handleClose} isOpen={isOpen} {...props}>
      <DiscussionContext.Provider value={value}>
        {/* {context && (
          <ContextEditor
            contentType="discussionContext"
            readOnly
            initialValue={context}
            mode="display"
          />
        )} */}
        {modalDiscussionId && <DiscussionThread isUnread={isUnread()} />}
        {isComposing ? (
          <StyledDiscussionMessage
            mode="compose"
            afterCreate={stopComposing}
            handleCancel={handleCancelCompose}
            {...props}
          />
        ) : (
          <ModalAddReplyBox
            handleClickReply={startComposing}
            isComposing={isComposing}
          />
        )}
      </DiscussionContext.Provider>
    </StyledModal>
  );
};

DiscussionModal.propTypes = {
  // createAnnotation: PropTypes.func,
  // documentEditor: PropTypes.object, // HN: do we still need this?
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // selection: PropTypes.object,
};

export default DiscussionModal;

/* HN: Is this still needed?
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
