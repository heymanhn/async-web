import { useState } from 'react';
import { navigate } from '@reach/router';
import { useApolloClient } from '@apollo/react-hooks';
import Pluralize from 'pluralize';

import searchQuery from 'graphql/queries/search';

import useCommandLibrary from './useCommandLibrary';

const useCommandCenterSearch = source => {
  const client = useApolloClient();
  const commands = useCommandLibrary(source);
  const [queryString, setQueryString] = useState('');
  const [prevQueryString, setPrevQueryString] = useState(queryString);
  const [results, setResults] = useState(commands);

  const filterCommands = () => {
    if (!queryString) return commands;

    const sanitizedString = queryString.toLowerCase();

    return commands.filter(({ title }) =>
      title.toLowerCase().includes(sanitizedString)
    );
  };

  /* Massages the data into the object structure of a command
   * - type, icon, title, resource, action
   *
   * Assumes that a search result must have either a document or discussion
   */
  const formatResult = item => {
    const { document, discussion } = item;
    const resource = document || discussion;
    const { id, title, topic } = resource;
    const resourceType = document ? 'document' : 'discussion';

    return {
      type: `${resourceType}Result`,
      title: title || (topic && topic.text),
      icon: resourceType === 'document' ? 'file-alt' : 'comments-alt',
      resource,

      // figure out target=_blank later
      action: () => navigate(`/${Pluralize(resourceType)}/${id}`),
    };
  };

  // Calling the search API synchronously because I don't want the UI
  // to render before the search query has completed
  const executeSearch = async () => {
    const { data } = await client.query({
      query: searchQuery,
      variables: { queryString },
      fetchResults: queryString.length > 1,
    });

    if (data && data.search) {
      const { items } = data.search;
      const safeItems = items || [];

      const searchResults = safeItems.map(item => formatResult(item));
      return Promise.resolve(searchResults);
    }

    return Promise.reject(new Error('Failed to search in command center'));
  };

  const getResults = async () => {
    let newResults = filterCommands();

    if (queryString.length > 1) {
      const searchResults = await executeSearch();
      newResults = [...newResults, ...searchResults];
    }

    setResults(newResults);
  };

  if (queryString !== prevQueryString) {
    setPrevQueryString(queryString);
    getResults();
  }

  return { queryString, setQueryString, results };
};

export default useCommandCenterSearch;
