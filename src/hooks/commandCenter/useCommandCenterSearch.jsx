import { useContext, useState } from 'react';
import { navigate } from '@reach/router';
import { useApolloClient } from '@apollo/react-hooks';
import Pluralize from 'pluralize';

import searchQuery from 'graphql/queries/search';
import useCommandLibrary from 'hooks/commandCenter/useCommandLibrary';
import { getLocalUser } from 'utils/auth';
import { RESOURCE_ICONS } from 'utils/constants';
import { NavigationContext } from 'utils/contexts';

const useCommandCenterSearch = ({
  source: newSource,
  isSearchDisabled,
  ...props
}) => {
  const client = useApolloClient();
  const { resource: resourceContext } = useContext(NavigationContext);
  const { resourceQuery, resourceType, variables } = resourceContext;

  const commands = useCommandLibrary({ source: newSource, ...props });
  const [queryString, setQueryString] = useState('');
  const [prevQueryString, setPrevQueryString] = useState(queryString);
  const [results, setResults] = useState(commands);
  const [source, setSource] = useState(newSource);

  // For certain resource commands, only allow if the current user is the author
  const allowedCommand = title => {
    if (!title.includes('Delete')) return true;

    const data = client.readQuery({ query: resourceQuery, variables });
    const { author, owner } = data[resourceType];
    const { id: authorId } = author || owner;
    const { userId } = getLocalUser();
    return userId === authorId;
  };

  const filterCommands = () => {
    const allowedCommands = commands.filter(({ title }) =>
      allowedCommand(title)
    );
    if (!queryString) return allowedCommands;

    const sanitizedString = queryString.toLowerCase();

    return allowedCommands.filter(({ title }) =>
      title.toLowerCase().includes(sanitizedString)
    );
  };

  /* Massages the data into the object structure of a command
   * - type, icon, title, resource, action
   *
   * Assumes that a search result must have either a document or discussion
   */
  const formatResult = item => {
    const resourceType = Object.keys(item).filter(
      k => ['document', 'discussion', 'workspace'].includes(k) && item[k]
    )[0];
    const resource = item[resourceType];
    const { id, title, topic } = resource;

    return {
      type: resourceType,
      title: title || (topic && topic.text), // discussion topics are different
      icon: RESOURCE_ICONS[resourceType],
      resource,

      // figure out target=_blank later
      action: () => navigate(`/${Pluralize(resourceType)}/${id}`),
    };
  };

  // Calling the search API synchronously because I don't want the UI
  // to render before the search query has completed
  const executeSearch = async () => {
    if (queryString.length <= 1) return Promise.resolve([]);

    const { data } = await client.query({
      query: searchQuery,
      variables: { queryString },
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

    if (queryString.length > 1 && !isSearchDisabled) {
      const searchResults = await executeSearch();
      newResults = [...newResults, ...searchResults];
    }

    setResults(newResults);
  };

  if (queryString !== prevQueryString || newSource !== source) {
    setPrevQueryString(queryString);
    setSource(newSource);
    getResults();
  }

  return { queryString, setQueryString, results };
};

export default useCommandCenterSearch;
