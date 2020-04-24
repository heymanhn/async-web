import uploadFileMutation from 'graphql/mutations/uploadFile';
import { IMAGE } from 'utils/editor/constants';

import Editor from 'components/editor/Editor';

const uploadImage = async (editor, resourceId, image) => {
  // Using a global variable until I find a better way
  const client = window.Roval.apolloClient;

  const { id } = Editor.insertImage(editor); // empty image
  const { data } = await client.mutate({
    mutation: uploadFileMutation,
    variables: { resourceId, input: { file: image } },
  });

  if (data.uploadFile) {
    const { url } = data.uploadFile;
    return Editor.updateImage(editor, id, { src: url });
  }

  return Editor.removeNodeByTypeAndId(editor, IMAGE, id);
};

export default uploadImage;
