import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

const ContextEditable = styled(Editable)(({ theme: { colors } }) => ({
  background: colors.grey7,
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
  lineHeight: '26px',
  opacity: 0.6,
  padding: '10px 30px 5px',
}));

const ContextEditor = ({ context, ...props }) => {
  const contextEditor = useMemo(() => withReact(createEditor()), []);

  return (
    <Slate editor={contextEditor} value={JSON.parse(context)}>
      <ContextEditable readOnly {...props} />
    </Slate>
  );
};

ContextEditor.propTypes = {
  context: PropTypes.string.isRequired,
};

export default ContextEditor;
