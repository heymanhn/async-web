import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import useMountEffect from 'utils/hooks/useMountEffect';
import { track } from 'utils/analytics';

import RovalEditor from 'components/editor/RovalEditor';
import NotFound from 'components/navigation/NotFound';
import InlineDiscussionThread from './InlineDiscussionThread';
import InlineDiscussionComposer from './InlineDiscussionComposer';

const ContextEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  background: colors.grey7,
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
}));

const DiscussionContainer = ({
  createAnnotation,
  discussionId: initialDiscussionId,
  documentId: initialDocumentId,
  documentEditor,
  handleCancel,
  ...props
}) => {
  const [discussionId, setDiscussionId] = useState(initialDiscussionId);
  const [documentId, setDocumentId] = useState(initialDocumentId);
  const [context, setContext] = useState(null);
  const [getDiscussion, { loading, data }] = useLazyQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
  });

  function extractContext() {
    setContext(documentEditor.value);
  }

  useMountEffect(() => {
    const title = discussionId ? 'Discussion' : 'New discussion';
    const properties = {};
    if (discussionId) properties.discussionId = discussionId;
    if (documentId) properties.documentId = documentId;

    track(`${title} viewed`, properties);

    if (documentEditor) extractContext();
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
  }

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
};

DiscussionContainer.defaultProps = {
  createAnnotation: () => {},
  discussionId: null,
  documentEditor: {},
  documentId: null,
  handleCancel: () => {},
};


export default DiscussionContainer;
