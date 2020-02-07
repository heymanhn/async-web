import { useContext } from 'react';
import useAutoSave from 'utils/hooks/useAutoSave';
import { MessageContext } from 'utils/contexts';

import useDraftMutations from 'components/discussion/useDraftMutations';

const useDrafts = (message, editor, isSubmitting) => {
  const { mode } = useContext(MessageContext);
  const { handleSaveDraft } = useDraftMutations(editor);

  useAutoSave(message, handleSaveDraft, mode !== 'compose' || isSubmitting);
};

export default useDrafts;
