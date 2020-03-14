import React from 'react';
import PropTypes from 'prop-types';
import { ReactEditor, useFocused, useSelected, useSlate } from 'slate-react';
import styled from '@emotion/styled';

import LoadingIndicator from 'components/shared/LoadingIndicator';

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

const StyledImageLoadingIndicator = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '1em auto',
});

const StyledIndicator = styled(LoadingIndicator)({
  width: '30px',
  height: '30px',
});

const ImageElement = ({ attributes, children, element }) => {
  const editor = useSlate();
  const isSelected = useSelected();
  const isFocused = useFocused();
  const isReadOnly = ReactEditor.isReadOnly(editor);
  const { src } = element;

  const image = (
    <div contentEditable={false}>
      <StyledImage
        src={src}
        isFocused={isSelected && isFocused}
        readOnly={isReadOnly}
      />
    </div>
  );

  const loadingIndicator = (
    <StyledImageLoadingIndicator>
      <StyledIndicator />
    </StyledImageLoadingIndicator>
  );

  return (
    <div {...attributes}>
      {src ? image : loadingIndicator}
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