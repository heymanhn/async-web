import { useContext } from 'react';
import useAutoSave from 'utils/hooks/useAutoSave';
import { MessageContext } from 'utils/contexts';

import useMessageDraftMutations from './useMessageDraftMutations';

const useDrafts = (message, isSubmitting) => {
  const { mode } = useContext(MessageContext);
  const { handleSaveDraft } = useMessageDraftMutations();

  const isDisabled = mode !== 'compose' || isSubmitting;
  useAutoSave({ content: message, handleSave: handleSaveDraft, isDisabled });
};

export default useDrafts;
