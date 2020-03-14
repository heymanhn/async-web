import React from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useFocused, useSelected, useSlate } from 'slate-react';
import styled from '@emotion/styled';

const StyledImage = styled.img(
  ({ isFocused, readOnly, theme: { colors } }) => ({
    display: 'block',
    margin: '1em auto',
    maxWidth: '100%',
    maxHeight: '20em',
    boxShadow: `${isFocused ? `0 0 0 3px ${colors.blue}` : 'none'}`,

    ':hover': {
      boxShadow: readOnly ? 'none' : `0 0 0 3px ${colors.blue}`,
    },
  })
);

const ImageElement = ({ attributes, children, element }) => {
  const editor = useSlate();
  const isSelected = useSelected();
  const isFocused = useFocused();
  const isReadOnly = ReactEditor.isReadOnly(editor);
  const { src } = element;

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <StyledImage
          src={src}
          isFocused={isSelected && isFocused}
          readOnly={isReadOnly}
        />
      </div>
      {children}
    </div>
  );
};

ImageElement.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  element: PropTypes.object.isRequired,
};

export default ImageElement;
