import { useState } from 'react';

import useCommandLibrary from './useCommandLibrary';

const useCommandCenterSearch = () => {
  const commands = useCommandLibrary('inbox');
  const [results, setResults] = useState(commands);

  return { results };
};

export default useCommandCenterSearch;
