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
import InlineDiscussionThread from './InlineDiscussionThread';
import InlineDiscussionComposer from './InlineDiscussionComposer';

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
  const [getDiscussion, { loading, data }] = useLazyQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
  });

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
  if ((!loading && (!data || !data.discussionId)) && !documentId) return <NotFound />;

  // HN: Double check if all this logic is still needed in Roval v2
  let discussion = null;
  if (data && data.discussion) {
    ({ discussion } = data); // Weird way to do this, I know
    if (!documentId) setDocumentId(discussion.documentId);

    const { topic } = discussion;
    if (topic && !context) setContext(topic.payload);
  }

  // HN: I know this is a long-winded way to prepare the inline discussion context. But we're
  // limited by what the Slate API gives us. There must be a better way.
  // FUTURE: Use the immutable APIs to dynamically create the context block
  function prepareInitialContext() {
    const { start, end } = selection;

    documentEditor
      // Step 1: Create the highlight within the current content
      .moveStartTo(start.key, start.offset)
      .moveEndTo(end.key, end.offset)
      .wrapInline(CONTEXT_HIGHLIGHT)

      // Step 2: Delete everything before the highlight, factoring in some buffer space
      // for the rest of the current block
      .moveToStartOfDocument()
      .moveEndToStartOfParentBlock(start)
      .delete()

      // Step 3: Delete everything after the highlight, similar to step 2
      .moveToEndOfDocument()
      .moveStartToEndOfParentBlock(end)
      .delete();

    const { value } = documentEditor;
    const initialContext = JSON.stringify(value.toJSON());
    setContext(initialContext);

    // 1. Undo the end of document delete
    // 2. Undo the beginning of document delete
    // 3. Undo the highlight
    documentEditor.undo().undo().undo();
  }

  if (!discussionId && !context) prepareInitialContext();

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return safeTags.includes('new_replies') || safeTags.includes('new_discussion');
  }

  function afterCreate(value, authorId, isDraft) {
    setDiscussionId(value);

    track('New discussion created', { discussionId: value, documentId });
    createAnnotation(value, authorId, isDraft);

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
      {discussionId && !loading && documentId && (
        <InlineDiscussionThread
          discussionId={discussionId}
          documentId={documentId}
          isUnread={isUnread()}
          handleClose={handleClose}
        />
      )}
      {documentId && !discussion && (
        <InlineDiscussionComposer
          afterCreate={afterCreate}
          context={context}
          documentId={documentId}
          handleClose={handleClose}
        />
      )}
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