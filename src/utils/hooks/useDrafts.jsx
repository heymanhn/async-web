import { useContext } from 'react';
import useAutoSave from 'utils/hooks/useAutoSave';
import { MessageContext } from 'utils/contexts';

import useMessageMutations from 'components/discussion/useMessageMutations';

const useDrafts = message => {
  const { mode } = useContext(MessageContext);
  const { handleSaveDraft } = useMessageMutations({ message });

  useAutoSave(message, handleSaveDraft, mode !== 'compose');
};

export default useDrafts;
