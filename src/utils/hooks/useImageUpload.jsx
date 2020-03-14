import { useMutation } from '@apollo/react-hooks';
import { useEditor } from 'slate-react';

import uploadFileMutation from 'graphql/mutations/uploadFile';

import Editor from 'components/editor/Editor';

const useImageUpload = resourceId => {
  const editor = useEditor();
  const [uploadFile] = useMutation(uploadFileMutation);

  return async image => {
    const { id } = Editor.insertImage(editor); // empty image
    const { data } = await uploadFile({
      variables: { resourceId, input: { file: image } },
    });

    if (data.uploadFile) {
      const { url } = data.uploadFile;
      Editor.updateImage(editor, id, { src: url });
    } else {
      Editor.removeImage(editor, id);
    }
  };
};

export default useImageUpload;
