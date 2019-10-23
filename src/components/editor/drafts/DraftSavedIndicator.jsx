import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const Label = styled.div(({ theme: { colors } }) => ({
  position: 'absolute',
  alignSelf: 'flex-end',
  color: colors.grey6,
  fontSize: '14px',
  fontWeight: 500,
  marginTop: '-27px', // hardcoding the position for now
}));

const DraftSavedIndicator = ({ editor }) => {
  console.dir(editor);

  return <Label>Draft saved</Label>;
};

DraftSavedIndicator.propTypes = {
  editor: PropTypes.object.isRequired,
};

export default DraftSavedIndicator;
