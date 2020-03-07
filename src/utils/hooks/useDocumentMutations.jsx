import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import createDocumentMutation from 'graphql/mutations/createDocument';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import deleteDocumentMutation from 'graphql/mutations/deleteDocument';
import { DocumentContext } from 'utils/contexts';
import { track } from 'utils/analytics';

import { toPlainText } from 'components/editor/utils';

const useDocumentMutations = (editor = null) => {
  const { documentId, afterUpdate, afterDelete } = useContext(DocumentContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDocument] = useMutation(createDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const [deleteDocument] = useMutation(deleteDocumentMutation);

  const handleCreate = async () => {
    setIsSubmitting(true);

    const { data } = await createDocument({ variables: { input: {} } });

    if (data.createDocument) {
      const { id: newDocumentId } = data.createDocument;
      track('New document created', { documentId: newDocumentId });

      setIsSubmitting(false);
      return Promise.resolve({ documentId: newDocumentId });
    }

    return Promise.reject(new Error('Failed to create new document'));
  };

  const handleUpdate = async () => {
    const { children } = editor;
    const { data } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(children),
            payload: JSON.stringify(children),
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
      afterUpdate();
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
