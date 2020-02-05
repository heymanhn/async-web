import { useContext, useState } from 'react';
import { useMutation } from 'react-apollo';

import createDocumentMutation from 'graphql/mutations/createDocument';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import { DocumentContext } from 'utils/contexts';
import { track } from 'utils/analytics';

import { toPlainText } from 'components/editor/utils';

const useDocumentMutations = (editor = null) => {
  const { documentId } = useContext(DocumentContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDocument] = useMutation(createDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);

  async function handleCreate() {
    setIsSubmitting(true);

    const { data } = await createDocument({ variables: { input: {} } });

    if (data.createDocument) {
      const { id: newDocumentId } = data.createDocument;
      track('New document created', { documentId: newDocumentId });

      setIsSubmitting(false);
      return Promise.resolve({ documentId: newDocumentId });
    }

    return Promise.reject(new Error('Failed to create new document'));
  }
  async function handleUpdate() {
    const { children } = editor;
    const { data: updateDocumentBodyData } = await updateDocument({
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

    if (updateDocumentBodyData.updateDocument) {
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update document'));
  }

  return {
    isSubmitting,

    handleCreate,
    handleUpdate,
  };
};

export default useDocumentMutations;
