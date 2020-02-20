import { useState } from 'react';

import commands from './commands';

const useCommandCenterSearch = () => {
  const [results, setResults] = useState(commands.inbox);

  return { results };
};

export default useCommandCenterSearch;
