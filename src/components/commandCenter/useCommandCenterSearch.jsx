import { useState } from 'react';

import useCommandLibrary from './useCommandLibrary';

const useCommandCenterSearch = source => {
  const commands = useCommandLibrary(source);
  // HN: Use this state later for search results
  // const [results, setResults] = useState(commands);
  const [searchQuery, setSearchQuery] = useState('');

  const commandSearch = () => {
    if (!searchQuery) return commands;

    return commands.filter(({ title }) => {
      const sanitizedQuery = searchQuery.toLowerCase();

      return title.toLowerCase().includes(sanitizedQuery);
    });
  };

  return { searchQuery, setSearchQuery, results: commandSearch() };
};

export default useCommandCenterSearch;
