import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import inboxQuery from 'graphql/queries/inbox';
import createDocumentMutation from 'graphql/mutations/createDocument';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import deleteDocumentMutation from 'graphql/mutations/deleteDocument';
import { track } from 'utils/analytics';
import { getLocalUser } from 'utils/auth';
import { DocumentContext } from 'utils/contexts';
import { toPlainText } from 'utils/editor/constants';

const useDocumentMutations = () => {
  const {
    documentId,
    afterUpdateDocument,
    afterUpdateDocumentTitle,
    afterDeleteDocument,
  } = useContext(DocumentContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  const [createDocument] = useMutation(createDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const [deleteDocument] = useMutation(deleteDocumentMutation, {
    variables: { documentId },
  });

  const handleCreateDocument = async () => {
    setIsSubmitting(true);

    const { data } = await createDocument({
      variables: { input: {} },
      refetchQueries: [
        {
          query: inboxQuery,
          variables: { userId, queryParams: { type: 'all' } },
        },
        {
          query: inboxQuery,
          variables: { userId, queryParams: { type: 'document' } },
        },
      ],
    });

    if (data.createDocument) {
      const { id } = data.createDocument;
      track('New document created', { documentId: id });

      setIsSubmitting(false);
      return Promise.resolve({ id });
    }

    return Promise.reject(new Error('Failed to create new document'));
  };

  const handleUpdateDocument = async ({ content }) => {
    const { data } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(content),
            payload: JSON.stringify(content),
          },
        },
      },
    });

    if (data.updateDocument) {
      afterUpdateDocument();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update document'));
  };

  const handleUpdateDocumentTitle = async title => {
    const { data } = await updateDocument({
      variables: { documentId, input: { title } },
    });

    if (data.updateDocument) {
      track('Document title updated', { documentId });
      afterUpdateDocumentTitle(title);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update document title'));
  };

  const handleDeleteDocument = async () => {
    const { data } = await deleteDocument();

    if (data.deleteDocument) {
      afterDeleteDocument();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete document'));
  };

  return {
    isSubmitting,

    handleCreateDocument,
    handleUpdateDocument,
    handleUpdateDocumentTitle,
    handleDeleteDocument,
  };
};

export default useDocumentMutations;
