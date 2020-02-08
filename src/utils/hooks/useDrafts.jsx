import { useContext } from 'react';
import useAutoSave from 'utils/hooks/useAutoSave';
import { MessageContext } from 'utils/contexts';

import useDraftMutations from 'components/discussion/useDraftMutations';

const useDrafts = (message, editor, isSubmitting) => {
  const { mode } = useContext(MessageContext);
  const { handleSaveDraft } = useDraftMutations(editor);

  const isDisabled = mode !== 'compose' || isSubmitting;
  useAutoSave(message, handleSaveDraft, isDisabled);
};

export default useDrafts;
