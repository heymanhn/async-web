import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
import { useLazyQuery } from '@apollo/react-hooks';

import discussionQuery from 'graphql/queries/discussion';
import useMountEffect from 'utils/hooks/useMountEffect';
import { track } from 'utils/analytics';

import Modal from 'components/shared/Modal';
import NotFound from 'components/navigation/NotFound';
import InlineDiscussionThread from './InlineDiscussionThread';
import InlineDiscussionComposer from './InlineDiscussionComposer';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

const DiscussionModal = ({
  discussionId: initialDiscussionId,
  documentId: initialDocumentId,
  documentEditor,
  handleClose,
  isOpen,
  selection,
  ...props
}) => {
  const [discussionId, setDiscussionId] = useState(initialDiscussionId);
  const [documentId, setDocumentId] = useState(initialDocumentId);
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
  }

  function isUnread() {
    const { tags } = data.discussion;
    const safeTags = tags || [];
    return safeTags.includes('new_replies') || safeTags.includes('new_discussion');
  }

  function afterCreate(value) {
    const { start, end } = selection;

    setDiscussionId(value);
    documentEditor.withoutSaving(() => {
      documentEditor
        .moveStartTo(start.key, start.offset)
        .moveEndTo(end.key, end.offset)
        .addMark({
          type: 'inline-discussion',
          data: {
            discussionId: value,
          },
        });
    });
    track('New discussion created', { discussionId: value, documentId });

    // Update the URL in the address bar to reflect the new discussion
    // const { origin } = window.location;
    // const url = `${origin}/discussions/${value}`;
    // return window.history.replaceState({}, `discussion: ${value}`, url);
  }

  function handleCloseModal() {
    setDiscussionId(null);

    handleClose();
  }

  return (
    <StyledModal
      handleClose={handleCloseModal}
      isOpen={isOpen}
      {...props}
    >
      {discussionId && !loading && documentId && (
        <InlineDiscussionThread
          discussionId={discussionId}
          isUnread={isUnread()}
          documentId={documentId}
        />
      )}
      {documentId && !discussion && (
        <InlineDiscussionComposer
          afterCreate={afterCreate}
          documentId={documentId}
          handleClose={handleCloseModal}
        />
      )}
    </StyledModal>
  );
};

DiscussionModal.propTypes = {
  discussionId: PropTypes.string,
  documentEditor: PropTypes.object,
  documentId: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selection: PropTypes.object,
};

DiscussionModal.defaultProps = {
  discussionId: null,
  documentEditor: {},
  documentId: null,
  selection: {},
};

export default DiscussionModal;
