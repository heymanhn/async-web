const useHeadTags = () => {
  const setHeadingTitle = title => {
    const suffix = 'Roval';

    document.title = `${title || 'Untitled'} - ${suffix}`;
  };

  return { setHeadingTitle };
};

export default useHeadTags;
