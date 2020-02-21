import { useState } from 'react';
import { navigate } from '@reach/router';
import { useApolloClient } from '@apollo/react-hooks';

import searchQuery from 'graphql/queries/search';

import useCommandLibrary from './useCommandLibrary';

const useCommandCenterSearch = source => {
  const client = useApolloClient();
  const commands = useCommandLibrary(source);
  const [queryString, setQueryString] = useState('');

  const filterCommands = () => {
    const sanitizedString = queryString.toLowerCase();

    return commands.filter(({ title }) =>
      title.toLowerCase().includes(sanitizedString)
    );
  };

  /* Massages the data into the object structure of a command
   * - type, icon, title, action
   *
   * Assumes that a search result must have either a document or discussion
   */
  const formatResult = item => {
    const { document, discussion } = item;
    const { id, title, topic } = document || discussion;
    const resource = document ? 'documents' : 'discussions';

    return {
      type: 'searchResult',
      title: title || topic.text,
      icon: resource === 'documents' ? 'file-alt' : 'comments-alt',

      // figure out target=_blank later
      action: () => navigate(`/${resource}/${id}`),
    };
  };

  // Calling the search API synchronously because I don't want the UI
  // to render before the search query has completed
  const executeSearch = async () => {
    const searchResults = [];
    const { data } = await client.query({
      query: searchQuery,
      variables: { queryString },
      fetchResults: queryString > 1,
    });

    if (data && data.search) {
      const { items } = data.search;
      searchResults.push(items.map(item => formatResult(item)));
    }

    return Promise.resolve(searchResults);
  };

  const getResults = () => {
    if (!queryString) return commands;

    const results = filterCommands();
    if (queryString.length > 1) results.push(executeSearch());

    return results;
  };

  return { queryString, setQueryString, results: getResults() };
};

export default useCommandCenterSearch;
