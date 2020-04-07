import { useContext } from 'react';
import useAutoSave from 'utils/hooks/useAutoSave';
import { MessageContext } from 'utils/contexts';

import useDraftMutations from 'utils/hooks/useDraftMutations';

const useDrafts = (message, editor, isSubmitting) => {
  const { mode } = useContext(MessageContext);
  const { handleSaveDraft } = useDraftMutations(editor);

  const isDisabled = mode !== 'compose' || isSubmitting;
  useAutoSave({ content: message, handleSave: handleSaveDraft, isDisabled });
};

export default useDrafts;
