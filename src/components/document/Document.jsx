import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from 'react-apollo';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import documentQuery from 'graphql/queries/document';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
// import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

import { DEFAULT_VALUE } from 'components/editor/defaults';
import NotFound from 'components/navigation/NotFound';
// import RovalEditor from 'components/editor/RovalEditor';
// import DiscussionModal from 'components/discussion/DiscussionModal';
// import DiscussionsList from './DiscussionsList';
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

const TitleEditable = styled(Editable)(({ theme: { colors } }) => ({
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

const DocumentEditable = styled(Editable)({
  fontSize: '16px',
  lineHeight: '26px',
  fontWeight: 400,
  marginBottom: '80px',
});

const Document = ({ documentId, discussionId, viewMode: initialViewMode }) => {
  const titleEditor = useMemo(() => withReact(createEditor()), []);
  const [documentTitle, setDocumentTitle] = useState(DEFAULT_VALUE);

  const documentEditor = useMemo(() => withReact(createEditor()), []);
  const [documentValue, setDocumentValue] = useState(DEFAULT_VALUE);

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

  const [updateDocument] = useMutation(updateDocumentMutation);
  const { loading, error, data } = useQuery(documentQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.document) return <NotFound />;

  const { body, title, updatedAt } = data.document;
  // const { payload: contents } = body || {};
  if (!state.updatedTimestamp && updatedAt) setUpdatedTimestamp(updatedAt * 1000);

  // TODO: This will change later, when we introduce the concept of multiple co-authors
  // const { userId } = getLocalUser();
  // const isAuthor = userId === owner.id;

  // async function handleUpdateTitle({ text }) {
  //   const { data: updateDocumentTitleData } = await updateDocument({
  //     variables: {
  //       documentId,
  //       input: {
  //         title: text,
  //       },
  //     },
  //     refetchQueries: [{
  //       query: documentQuery,
  //       variables: { id: documentId, queryParams: {} },
  //     }],
  //   });

  //   if (updateDocumentTitleData.updateDocument) {
  //     track('Document title updated', { documentId });
  //     setUpdatedTimestamp(Date.now());
  //     return Promise.resolve({});
  //   }

  //   return Promise.reject(new Error('Failed to update document title'));
  // }

  // async function handleUpdateBody({ payload, text }) {
  //   const { data: updateDocumentBodyData } = await updateDocument({
  //     variables: {
  //       documentId,
  //       input: {
  //         body: {
  //           formatter: 'slatejs',
  //           text,
  //           payload,
  //         },
  //       },
  //     },
  //   });

  //   if (updateDocumentBodyData.updateDocument) {
  //     setUpdatedTimestamp(Date.now());
  //     return Promise.resolve({});
  //   }

  //   return Promise.reject(new Error('Failed to save discussion message'));
  // }

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
      <HeaderBar documentId={documentId} setViewMode={setViewMode} viewMode={viewMode} />
      {/* {viewMode === 'discussions' && <DiscussionsList documentId={documentId} />} */}
      {viewMode === 'content' && (
        <>
          <Container>
            <Slate
              editor={titleEditor}
              value={documentTitle}
              onChange={v => setDocumentTitle(v)}
            >
              <TitleEditable />
            </Slate>
            {/*
              contentType="documentTitle"
              disableAutoFocus={!!title}
              initialValue={title}
              isPlainText
              onSubmit={handleUpdateTitle}
              saveOnBlur
            /> */}
            <Slate
              editor={documentEditor}
              value={documentValue}
              onChange={v => setDocumentValue(v)}
            >
              <DocumentEditable />
              {/* disableAutoFocus={!contents}
                documentId={documentId}
                handleShowDiscussion={handleShowDiscussion}
                initialValue={contents}
                onSubmit={handleUpdateBody}
                resourceId={documentId} */}
            </Slate>

            {updatedTimestamp && <LastUpdatedIndicator timestamp={updatedTimestamp} />}
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
