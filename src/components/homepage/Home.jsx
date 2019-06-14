import React from 'react';

import withPageTracking from 'utils/withPageTracking';

const Home = () => (
  <div>Hello. It&rsquo;s an asynchronous world.</div>
);

export default withPageTracking(Home, 'Logged Out Home');
