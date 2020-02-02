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
  createAnnotation,
  discussionId: initialDiscussionId,
  documentEditor,
  isOpen,
  selection,
  ...props
}) => {
  const { documentId } = useContext(DocumentContext);
  const [discussionId, setDiscussionId] = useState(initialDiscussionId);
  const [isComposing, setIsComposing] = useState(!discussionId);
  // const [context, setContext] = useState(null);
  // const [draft, setDraft] = useState(null);

  useMountEffect(() => {
    const title = discussionId ? 'Discussion' : 'New discussion';
    const properties = {};
    if (discussionId) properties.discussionId = discussionId;
    if (documentId) properties.documentId = documentId;

    track(`${title} viewed`, properties);
  });

  const { loading, data } = useQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
    skip: !discussionId,
  });

  // Need to show the correct discussion that the user selected
  if (!discussionId && initialDiscussionId)
    setDiscussionId(initialDiscussionId);

  if (loading) return null;

  // HN: Double check if all this logic is still needed in Roval v2
  // let discussion = null;
  // if (data && data.discussion) {
  //   ({ discussion } = data);
  //
  //   const { draft: newDraft, topic } = discussion;
  //   if (topic && !context) setContext(topic.payload);
  //   if (draftHasChanged(newDraft)) setDraft(newDraft);
  // }

  // if (!!draft && !isComposing) startComposing();
  // if (!discussionId && !context) extractContext();

  function afterDiscussionCreate(value) {
    setDiscussionId(value);

    createAnnotation(value);

    // Update the URL in the address bar to reflect the new discussion
    // TODO (HN): Fix this implementation this later.
    //
    // const { origin } = window.location;
    // const url = `${origin}/discussions/${value}`;
    // return window.history.replaceState({}, `discussion: ${value}`, url);
  }

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return (
      safeTags.includes('new_messages') || safeTags.includes('new_discussion')
    );
  }

  const value = {
    discussionId,
    // context,
    // draft,
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
        {discussionId && <DiscussionThread isUnread={isUnread()} />}
        {/* afterDiscussionCreate={afterDiscussionCreate}
        context={context}
        draft={draft}
        source="discussionContainer" */}
        {isComposing ? (
          <StyledDiscussionMessage
            afterCreate={afterCreate}
            initialMode="compose"
            // onCancel={handleCancel}
            // onCreateDiscussion={handleCreateDiscussion}
            {...props}
          />
        ) : (
          <ModalAddReplyBox
            handleClickReply={startComposing}
            noHover={isComposing}
          />
        )}
      </DiscussionContext.Provider>
    </StyledModal>
  );
};

DiscussionModal.propTypes = {
  createAnnotation: PropTypes.func,
  discussionId: PropTypes.string,
  documentEditor: PropTypes.object, // HN: do we still need this?
  isOpen: PropTypes.bool.isRequired,
  selection: PropTypes.object,
};

DiscussionModal.defaultProps = {
  createAnnotation: () => {},
  discussionId: null,
  documentEditor: {},
  selection: {},
};

export default DiscussionModal;

/* HN: Is this still needed?

function handleClose() {
  setDiscussionId(null);

  handleCancel();
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
