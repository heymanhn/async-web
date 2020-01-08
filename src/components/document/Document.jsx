import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
// import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

import NotFound from 'components/navigation/NotFound';
import RovalEditor from 'components/editor/RovalEditor';
import DiscussionModal from 'components/discussion/DiscussionModal';
import DiscussionsList from './DiscussionsList';
import HeaderBar from './HeaderBar';
import LastUpdatedIndicator from './LastUpdatedIndicator';


const Container = styled.div(({ theme: { documentViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: '0 auto',
  maxWidth: documentViewport,
  minHeight: 'calc(100vh - 54px)', // Header is 54px tall
  padding: '0 30px',
}));

const TitleEditor = styled(RovalEditor)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  lineHeight: '54px',
  marginTop: '60px',
  marginBottom: '15px',
  width: '100%',
  outline: 'none',
}));

const DocumentEditor = styled(RovalEditor)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginBottom: '80px',
});

const Document = ({ documentId, viewMode: initialViewMode }) => {
  const [state, setState] = useState({
    isModalOpen: false,
    documentEditor: null,
    selection: null,
    discussionId: null,
    updatedTimestamp: null,
    viewMode: initialViewMode,
  });

  function handleShowDiscussion(newDiscussionId, newSelection, editor) {
    const newState = { discussionId: newDiscussionId, isModalOpen: true };

    if (newSelection) newState.selection = newSelection;
    if (editor) newState.documentEditor = editor;

    setState(oldState => ({ ...oldState, ...newState }));
  }
  function handleCloseDiscussion() {
    setState(oldState => ({
      ...oldState,
      discussionId: null,
      documentEditor: null,
      isModalOpen: false,
      selection: null,
    }));
  }

  function setUpdatedTimestamp(timestamp) {
    setState(oldState => ({ ...oldState, updatedTimestamp: timestamp }));
  }

  function setViewMode(newMode) {
    setState(oldState => ({ ...oldState, viewMode: newMode }));
  }

  const [updateDocument] = useMutation(updateDocumentMutation);
  const { loading, error, data } = useQuery(documentQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, title, updatedAt } = data.document;
  const { payload: contents } = body || {};
  if (!state.updatedTimestamp && updatedAt) setUpdatedTimestamp(updatedAt * 1000);

  // TODO: This will change later, when we introduce the concept of multiple co-authors
  // const { userId } = getLocalUser();
  // const isAuthor = userId === owner.id;

  async function handleUpdateTitle({ text }) {
    const { data: updateDocumentTitleData } = await updateDocument({
      variables: {
        documentId,
        input: {
          title: text,
        },
      },
      refetchQueries: [{
        query: documentQuery,
        variables: { id: documentId, queryParams: {} },
      }],
    });

    if (updateDocumentTitleData.updateDocument) {
      track('Document title updated', { documentId });
      setUpdatedTimestamp(Date.now());
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to update document title'));
  }

  async function handleUpdateBody({ payload, text }) {
    const { data: updateDocumentBodyData } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text,
            payload,
          },
        },
      },
    });

    if (updateDocumentBodyData.updateDocument) {
      setUpdatedTimestamp(Date.now());
      return Promise.resolve({});
    }

    return Promise.reject(new Error('Failed to save discussion message'));
  }

  function createAnnotation(value, authorId) {
    const { documentEditor, selection } = state;
    const { start, end } = selection;

    documentEditor.withoutSaving(() => {
      documentEditor
        .moveTo(start.key, start.offset)
        .moveEndTo(end.key, end.offset)
        .addMark({
          type: 'inline-discussion',
          data: {
            discussionId: value,
            authorId,
          },
        });
    });
    track('New discussion created', { discussionId: value, documentId });

    // Update the URL in the address bar to reflect the new discussion
    // TODO (HN): Fix this implementation this later.
    //
    // const { origin } = window.location;
    // const url = `${origin}/discussions/${value}`;
    // return window.history.replaceState({}, `discussion: ${value}`, url);
  }

  const {
    discussionId,
    documentEditor,
    isModalOpen,
    selection,
    updatedTimestamp,
    viewMode,
  } = state;
  return (
    <>
      <HeaderBar documentId={documentId} setViewMode={setViewMode} viewMode={viewMode} />
      {viewMode === 'discussions' && <DiscussionsList documentId={documentId} />}
      {viewMode === 'content' && (
        <>
          <Container>
            <TitleEditor
              contentType="documentTitle"
              disableAutoFocus={!!title}
              initialValue={title}
              isPlainText
              mode="compose" // Allowing anyone to compose a document for now
              onSubmit={handleUpdateTitle}
              saveOnBlur
            />
            <DocumentEditor
              contentType="document"
              disableAutoFocus={!contents}
              documentId={documentId}
              handleShowDiscussion={handleShowDiscussion}
              initialValue={contents}
              isAuthor // Allowing anyone to compose a document for now
              mode="compose" // Allowing anyone to compose a document for now
              onSubmit={handleUpdateBody}
              resourceId={documentId}
            />
            {updatedTimestamp && <LastUpdatedIndicator timestamp={updatedTimestamp} />}
          </Container>
          <DiscussionModal
            createAnnotation={createAnnotation}
            discussionId={discussionId}
            documentEditor={documentEditor}
            documentId={documentId}
            handleClose={handleCloseDiscussion}
            isOpen={isModalOpen}
            selection={selection}
          />
        </>
      )}
    </>
  );
};

Document.propTypes = {
  documentId: PropTypes.string.isRequired,
  viewMode: PropTypes.oneOf(['content', 'discussions']),
};

Document.defaultProps = {
  viewMode: 'content',
};

export default Document;
