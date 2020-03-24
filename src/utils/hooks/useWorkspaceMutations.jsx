import { useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';

import updateWorkspaceMtn from 'graphql/mutations/updateWorkspace';
import { WorkspaceContext } from 'utils/contexts';
// import { getLocalUser } from 'utils/auth';
import { track } from 'utils/analytics';

const useWorkspaceMutations = () => {
  const { workspaceId } = useContext(WorkspaceContext);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const { userId } = getLocalUser();

  const [updateWorkspace] = useMutation(updateWorkspaceMtn);

  // const handleCreate = async () => {
  //   setIsSubmitting(true);

  //   const { data } = await createDocument({
  //     variables: { input: {} },
  //     refetchQueries: [
  //       {
  //         query: inboxQuery,
  //         variables: { userId, queryParams: { type: 'all' } },
  //       },
  //       {
  //         query: inboxQuery,
  //         variables: { userId, queryParams: { type: 'document' } },
  //       },
  //     ],
  //   });

  //   if (data.createDocument) {
  //     const { id: newDocumentId } = data.createDocument;
  //     track('New document created', { documentId: newDocumentId });

  //     setIsSubmitting(false);
  //     return Promise.resolve({ documentId: newDocumentId });
  //   }

  //   return Promise.reject(new Error('Failed to create new document'));
  // };

  // const handleUpdate = async () => {
  //   const { children } = editor;
  //   const { data } = await updateDocument({
  //     variables: {
  //       documentId,
  //       input: {
  //         body: {
  //           formatter: 'slatejs',
  //           text: toPlainText(children),
  //           payload: JSON.stringify(children),
  //         },
  //       },
  //     },
  //   });

  //   if (data.updateDocument) {
  //     afterUpdate();
  //     return Promise.resolve();
  //   }

  //   return Promise.reject(new Error('Failed to update document'));
  // };

  const handleUpdateTitle = async title => {
    const { data } = await updateWorkspace({
      variables: { workspaceId, input: { title } },
    });

    if (data.updateWorkspace) {
      track('Workspace title updated', { workspaceId });
      // afterUpdate();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update workspace title'));
  };

  // const handleDelete = async () => {
  //   const { data } = await deleteDocument();

  //   if (data.deleteDocument) {
  //     afterDelete();
  //     return Promise.resolve();
  //   }

  //   return Promise.reject(new Error('Failed to delete document'));
  // };

  return {
    // isSubmitting,

    handleUpdateTitle,
  };
};

export default useWorkspaceMutations;
