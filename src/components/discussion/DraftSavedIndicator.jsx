import React, { useContext, useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { DiscussionContext } from 'utils/contexts';

const INDICATOR_DURATION = 8000;

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.grey6,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  fontWeight: 500,
}));

const DraftSavedIndicator = () => {
  const { draft } = useContext(DiscussionContext);
  const [showDraftSaved, setShowDraftSaved] = useState(false);

  useEffect(() => {
    let timer;

    const flipShowDraftSaved = () => setShowDraftSaved(prev => !prev);

    if (draft) {
      flipShowDraftSaved();
      timer = setTimeout(flipShowDraftSaved, INDICATOR_DURATION);
    }

    return () => clearTimeout(timer);
  }, [draft]);

  return showDraftSaved ? <Label>Draft saved</Label> : null;
};

export default DraftSavedIndicator;
