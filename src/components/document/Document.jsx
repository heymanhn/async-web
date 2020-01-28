import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import styled from '@emotion/styled';

// import { getLocalUser } from 'utils/auth';
import documentQuery from 'graphql/queries/document';

import NotFound from 'components/navigation/NotFound';
// import RovalEditor from 'components/editor/RovalEditor';
// import DiscussionModal from 'components/discussion/DiscussionModal';
// import DiscussionsList from './DiscussionsList';
import HeaderBar from './HeaderBar';
import LastUpdatedIndicator from './LastUpdatedIndicator';
import TitleEditor from './TitleEditor';
import ContentEditor from './ContentEditor';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: documentViewport,
  minHeight: 'calc(100vh - 54px)', // Header is 54px tall
  padding: '0 30px',
}));

const Document = ({ documentId, discussionId, viewMode: initialViewMode }) => {
  const [state, setState] = useState({
    discussionId,
    updatedTimestamp: null,
    viewMode: initialViewMode,
  });

  function setUpdatedTimestamp(timestamp) {
    setState(oldState => ({ ...oldState, updatedTimestamp: timestamp }));
  }

  function setViewMode(newMode) {
    setState(oldState => ({ ...oldState, viewMode: newMode }));
  }

  const { loading, error, data } = useQuery(documentQuery, {
    variables: { documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, title, updatedAt } = data.document;
  const { payload: content } = body || {};

  if (!state.updatedTimestamp && updatedAt)
    setUpdatedTimestamp(updatedAt * 1000);

  // TODO: This will change later, when we introduce the concept of multiple co-authors
  // const { userId } = getLocalUser();
  // const isAuthor = userId === owner.id;

  function setUpdatedTimestampToNow() {
    setUpdatedTimestamp(Date.now());
  }

  // function createAnnotation(value, authorId) {
  //   const { documentEditor, selection } = state;
  //   const { start, end } = selection;

  //   documentEditor.withoutSaving(() => {
  //     documentEditor
  //       .moveTo(start.key, start.offset)
  //       .moveEndTo(end.key, end.offset)
  //       .addMark({
  //         type: 'inline-discussion',
  //         data: {
  //           discussionId: value,
  //           authorId,
  //         },
  //       });
  //   });
  //   track('New discussion created', { discussionId: value, documentId });

  //   // Update the URL in the address bar to reflect the new discussion
  //   // TODO (HN): Fix this implementation this later.
  //   //
  //   // const { origin } = window.location;
  //   // const url = `${origin}/discussions/${value}`;
  //   // return window.history.replaceState({}, `discussion: ${value}`, url);
  // }

  const {
    // discussionId: dId,
    // documentEditor,
    // isModalOpen,
    // selection,
    updatedTimestamp,
    viewMode,
  } = state;
  return (
    <>
      <HeaderBar
        documentId={documentId}
        setViewMode={setViewMode}
        viewMode={viewMode}
      />
      {/* {viewMode === 'discussions' && <DiscussionsList documentId={documentId} />} */}
      {viewMode === 'content' && (
        <>
          <Container>
            <TitleEditor
              afterUpdate={setUpdatedTimestampToNow}
              autoFocus={!title && !content}
              documentId={documentId}
              initialTitle={title}
            />
            <ContentEditor
              afterUpdate={setUpdatedTimestampToNow}
              autoFocus={title || content}
              documentId={documentId}
              initialContent={content}
            />
            {updatedTimestamp && (
              <LastUpdatedIndicator timestamp={updatedTimestamp} />
            )}
          </Container>
          {/* <DiscussionModal
            createAnnotation={createAnnotation}
            discussionId={dId}
            documentEditor={documentEditor}
            documentId={documentId}
            handleClose={handleCloseDiscussion}
            isOpen={isModalOpen}
            selection={selection}
          /> */}
        </>
      )}
    </>
  );
};

Document.propTypes = {
  documentId: PropTypes.string.isRequired,
  discussionId: PropTypes.string,
  viewMode: PropTypes.oneOf(['content', 'discussions']),
};

Document.defaultProps = {
  viewMode: 'content',
  discussionId: null,
};

export default Document;
