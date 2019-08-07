/*
 * Experimenting with React Hooks to create stateful function components:
 * https://reactjs.org/docs/hooks-overview.html
 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Layout from 'components/Layout';

const Container = styled.div(({ theme: { wideViewport } }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',

  maxHeight: 'calc(100vh - 70px)',
  margin: '0 auto',
  maxWidth: wideViewport,
  overflow: 'hidden',
  padding: '50px 0',
}));

const DiscussionFeed = () => {
  return (
    <Layout hideFooter>
      <Container>
        <div>Hello</div>
      </Container>
    </Layout>
  );
};

DiscussionFeed.propTypes = {

};

export default DiscussionFeed;
