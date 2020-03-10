/*
 * Takes a list of query details and fetches them without caring about the
 * response value.
 */
import { useApolloClient } from '@apollo/react-hooks';

import useMountEffect from 'utils/hooks/useMountEffect';

const usePrefetchQueries = queryDetails => {
  const client = useApolloClient();

  useMountEffect(() => {
    const fetchQueries = () => {
      queryDetails.forEach(({ query, ...props }) => {
        client.query({ query, ...props });
      });
    };

    fetchQueries();
  });
};

export default usePrefetchQueries;
