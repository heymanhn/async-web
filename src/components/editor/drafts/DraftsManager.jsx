import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Label = styled.div(({ theme: { colors } }) => ({
  position: 'absolute',
  color: colors.grey5,
  fontSize: '14px',
  fontWeight: 500,
}));

const DraftsManager = ({ editor }) => {
  console.dir(editor);

  return <Label>Draft saved</Label>;
};

DraftsManager.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default DraftsManager;
