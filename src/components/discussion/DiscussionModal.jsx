import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

// hwillson forgot to export useLazyQuery to the react-apollo 3.0 release
// Undo once that's fixed
// import { useLazyQuery } from '@apollo/react-hooks';

// import discussionQuery from 'graphql/queries/discussion';
// import useMountEffect from 'utils/hooks/useMountEffect';
// import { track } from 'utils/analytics';

import InlineDiscussionComposer from './InlineDiscussionComposer';
// import NotFound from 'components/navigation/NotFound';
import Modal from 'components/shared/Modal';

const StyledModal = styled(Modal)({
  alignSelf: 'center',
});

const DiscussionModal = ({
  documentId,
  editor,
  handleClose,
  isOpen,
  ...props
}) => {
  // TODO: Repurpose most of the logic in <Discussion /> here

  // const [discussionId, setDiscussionId] = useState(initialDiscussionId);
  // const [documentId, setDocumentId] = useState(initialDocumentId);
  // const [getDiscussion, { loading, data }] = useLazyQuery(discussionQuery, {
  //   variables: { id: discussionId, queryParams: {} },
  // });

  // useMountEffect(() => {
  //   const title = discussionId ? 'Discussion' : 'New discussion';
  //   const properties = {};
  //   if (discussionId) properties.discussionId = discussionId;
  //   if (documentId) properties.documentId = documentId;

  //   track(`${title} viewed`, properties);
  // });

  // HN: Should refactor this convoluted logic, meant to either fetch the details of a
  // discussion if it exists, or show the discussion composer.
  // if (discussionId && !data) {
  //   getDiscussion();
  //   return null;
  // }
  // if ((!loading && (!data || !data.discussionId)) && !documentId) return <NotFound />;

  // HN: Double check if all this logic is still needed in Roval v2
  // let discussion = null;
  // if (data && data.discussion) {
  //   ({ discussion } = data); // Weird way to do this, I know
  //   if (!documentId) setDocumentId(discussion.documentId);
  // }

  return (
    <StyledModal
      handleClose={handleClose}
      isOpen={isOpen}
      {...props}
    >
      {/* {discussionId && !loading && documentId && (
        <InlineDiscussionThread
          discussionId={discussionId}
          isUnread={isUnread()}
          meetingId={meetingId}
        />
      )} */}
      {/* {documentId && !conversation && ( */}
      <InlineDiscussionComposer documentId={documentId} handleClose={handleClose} />
      {/* )} */}
    </StyledModal>
  );
};

DiscussionModal.propTypes = {
  discussionId: PropTypes.string,
  documentId: PropTypes.string,
  editor: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

DiscussionModal.defaultProps = {
  discussionId: null,
  documentId: null,
};

export default DiscussionModal;
