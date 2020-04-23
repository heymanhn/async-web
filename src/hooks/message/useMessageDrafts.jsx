import { useContext } from 'react';

import useAutoSave from 'hooks/editor/useAutoSave';
import useMessageDraftMutations from 'hooks/message/useMessageDraftMutations';
import { MessageContext } from 'utils/contexts';

const useDrafts = (message, isSubmitting) => {
  const { mode } = useContext(MessageContext);
  const { handleSaveDraft } = useMessageDraftMutations();

  const isDisabled = mode !== 'compose' || isSubmitting;
  useAutoSave({ content: message, handleSave: handleSaveDraft, isDisabled });
};

export default useDrafts;
