import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useDiscussionMutations from 'hooks/discussion/useDiscussionMutations';
import { DiscussionContext } from 'utils/contexts';

import TitleEditable from 'components/shared/TitleEditable';

const StyledTitleEditable = styled(TitleEditable)(
  ({ theme: { fontProps } }) => ({
    ...fontProps({ size: 24 }),
    margin: '15px auto 5px',
    padding: '0 30px',
  })
);

const Divider = styled.div(({ theme: { discussionViewport } }) => ({
  margin: '0 auto',
  padding: '0 30px',
  width: discussionViewport,
}));

const DividerLine = styled.div(({ theme: { colors } }) => ({
  borderBottom: `1px solid ${colors.borderGrey}`,
  width: '100%',
}));

const TitleEditor = ({ initialTitle, ...props }) => {
  const { handleUpdateDiscussionTitle } = useDiscussionMutations();
  const { readOnly } = useContext(DiscussionContext);

  return (
    <>
      <StyledTitleEditable
        initialTitle={initialTitle}
        readOnly={readOnly}
        handleUpdateTitle={handleUpdateDiscussionTitle}
        {...props}
      />
      <Divider>
        <DividerLine />
      </Divider>
    </>
  );
};

TitleEditor.propTypes = {
  initialTitle: PropTypes.string,
};

TitleEditor.defaultProps = {
  initialTitle: '',
};

export default TitleEditor;
