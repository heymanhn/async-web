import React, { useContext, useMemo, useState } from 'react';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import { DiscussionContext } from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

import useContextEditorProps from 'components/editor/useContextEditorProps';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withVoidElements from 'components/editor/withVoidElements';
import useContextGenerator from './useContextGenerator';

const Container = styled.div(({ theme: { colors } }) => ({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',

  ':after': {
    background: colors.grey7,
  },
}));

const ContextEditable = styled(Editable)(({ theme: { colors } }) => ({
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
  lineHeight: '26px',
  padding: '10px 30px 0px',
  marginBottom: '25px',

  span: {
    color: `${colors.grey3} !important`,
  },
}));

const ContextComposer = props => {
  const { context, setContext } = useContext(DiscussionContext);

  const contextEditor = useMemo(
    () =>
      compose(
        withInlineDiscussions,
        withVoidElements,
        withReact
      )(createEditor()),
    []
  );
  const editorProps = useContextEditorProps();
  const [content, setContent] = useState(context || []);
  const generateContext = useContextGenerator(contextEditor);
  useMountEffect(() => !context && generateContext());

  if (!context && content.length) setContext(content);

  return (
    <Container>
      <Slate
        editor={contextEditor}
        value={content}
        onChange={v => setContent(v)}
      >
        <ContextEditable readOnly {...props} {...editorProps} />
      </Slate>
    </Container>
  );
};

export default ContextComposer;
