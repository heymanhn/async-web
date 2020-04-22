import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import inboxQuery from 'graphql/queries/inbox';
import createDocumentMutation from 'graphql/mutations/createDocument';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import deleteDocumentMutation from 'graphql/mutations/deleteDocument';
import { DocumentContext } from 'utils/contexts';
import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

import { toPlainText } from 'components/editor/utils';

const useDocumentMutations = () => {
  const { documentId, afterUpdate, afterUpdateTitle, afterDelete } = useContext(
    DocumentContext
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = getLocalUser();

  const [createDocument] = useMutation(createDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const [deleteDocument] = useMutation(deleteDocumentMutation, {
    variables: { documentId },
  });

  const handleCreate = async () => {
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

  const handleUpdate = async ({ content }) => {
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
      afterUpdate();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update document'));
  };

  const handleUpdateTitle = async title => {
    const { data } = await updateDocument({
      variables: { documentId, input: { title } },
    });

    if (data.updateDocument) {
      track('Document title updated', { documentId });
      afterUpdateTitle(title);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update document title'));
  };

  const handleDelete = async () => {
    const { data } = await deleteDocument();

    if (data.deleteDocument) {
      afterDelete();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete document'));
  };

  return {
    isSubmitting,

    handleCreate,
    handleUpdate,
    handleUpdateTitle,
    handleDelete,
  };
};

export default useDocumentMutations;
