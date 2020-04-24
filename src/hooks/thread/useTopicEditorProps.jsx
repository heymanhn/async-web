import React, { useCallback } from 'react';

import Leaf from 'components/editor/Leaf';
import ContextElement from 'components/editor/ContextElement';

const useTopicEditorProps = () => {
  const renderLeaf = useCallback(props => <Leaf {...props} />, []);
  const renderElement = useCallback(props => <ContextElement {...props} />, []);

  return {
    renderElement,
    renderLeaf,
  };
};

export default useTopicEditorProps;
