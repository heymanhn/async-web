import { useApolloClient } from '@apollo/react-hooks';

import mediaBreakpointQuery from 'graphql/queries/mediaBreakpoint';
import getBreakpoint from 'utils/mediaQuery';
import useMountEffect from 'utils/hooks/useMountEffect';

const useMediaQuery = () => {
  const client = useApolloClient();

  useMountEffect(() => {
    function handleWindowSizeChange() {
      const { mediaBreakpoint } = client.readQuery({
        query: mediaBreakpointQuery,
      });

      const newBreakpoint = getBreakpoint();
      if (newBreakpoint !== mediaBreakpoint) {
        client.writeData({ data: { mediaBreakpoint: newBreakpoint } });
      }
    }

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  });
};

export default useMediaQuery;
