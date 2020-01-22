import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import useMountEffect from 'utils/hooks/useMountEffect';
import { track } from 'utils/analytics';

import { CONTEXT_HIGHLIGHT } from 'components/editor/plugins/inlineDiscussion';
import RovalEditor from 'components/editor/RovalEditor';
import NotFound from 'components/navigation/NotFound';
import DiscussionThread from './DiscussionThread';
import ReplyComposer from './ReplyComposer';

const ContextEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  background: colors.grey7,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  padding: '10px 30px 5px',
}));

const DiscussionContainer = ({
  createAnnotation,
  discussionId: initialDiscussionId,
  documentId: initialDocumentId,
  documentEditor,
  handleCancel,
  selection,
  ...props
}) => {
  const [discussionId, setDiscussionId] = useState(initialDiscussionId);
  const [documentId, setDocumentId] = useState(initialDocumentId);
  const [context, setContext] = useState(null);
  const [draft, setDraft] = useState(null);
  const [getDiscussion, { loading, data }] = useLazyQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
  });

  function draftHasChanged(newDraft) {
    const { body } = draft || {};
    const { text } = body || {};

    const { body: newBody } = newDraft || {};
    const { text: newText } = newBody || {};

    return text !== newText;
  }

  useMountEffect(() => {
    const title = discussionId ? 'Discussion' : 'New discussion';
    const properties = {};
    if (discussionId) properties.discussionId = discussionId;
    if (documentId) properties.documentId = documentId;

    track(`${title} viewed`, properties);
  });

  // HN: Should refactor this convoluted logic, meant to either fetch the details of a
  // discussion if it exists, or show the discussion composer.
  if (!discussionId && initialDiscussionId) setDiscussionId(initialDiscussionId);
  if (discussionId && !data) {
    getDiscussion();
    return null;
  }
  if (loading) return null;
  if ((!loading && (!data || !data.discussion)) && !documentId) return <NotFound />;

  // HN: Double check if all this logic is still needed in Roval v2
  let discussion = null;
  if (data && data.discussion) {
    ({ discussion } = data); // Weird way to do this, I know
    if (!documentId) setDocumentId(discussion.documentId);

    const { draft: newDraft, topic } = discussion;
    if (topic && !context) setContext(topic.payload);
    if (draftHasChanged(newDraft)) setDraft(newDraft);
  }

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
    documentEditor.undo().undo().undo();
  }

  if (!discussionId && !context) extractContext();

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return safeTags.includes('new_replies') || safeTags.includes('new_discussion');
  }

  function afterDiscussionCreate(value) {
    setDiscussionId(value);

    track('New discussion created', { discussionId: value, documentId });
    createAnnotation(value);

    // Update the URL in the address bar to reflect the new discussion
    // TODO (HN): Fix this implementation this later.
    //
    // const { origin } = window.location;
    // const url = `${origin}/discussions/${value}`;
    // return window.history.replaceState({}, `discussion: ${value}`, url);
  }

  function handleClose() {
    setDiscussionId(null);

    handleCancel();
  }

  return (
    <div {...props}>
      {context && (
        <ContextEditor
          contentType="discussionContext"
          readOnly
          documentId={documentId}
          initialValue={context}
          mode="display"
        />
      )}
      {discussionId && documentId && (
        <DiscussionThread
          discussionId={discussionId}
          documentId={documentId}
          isUnread={isUnread()}
        />
      )}
      <ReplyComposer
        afterDiscussionCreate={afterDiscussionCreate}
        context={context}
        discussionId={discussionId}
        draft={draft}
        documentId={documentId}
        handleClose={handleClose}
        source="discussionContainer"
      />
    </div>
  );
};

DiscussionContainer.propTypes = {
  createAnnotation: PropTypes.func,
  discussionId: PropTypes.string,
  documentEditor: PropTypes.object,
  documentId: PropTypes.string,
  handleCancel: PropTypes.func,
  selection: PropTypes.object,
};

DiscussionContainer.defaultProps = {
  createAnnotation: () => {},
  discussionId: null,
  documentEditor: {},
  documentId: null,
  handleCancel: () => {},
  selection: {},
};


export default DiscussionContainer;
