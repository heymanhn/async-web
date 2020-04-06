const useHeadTags = () => {
  const setHeadingTitle = title => {
    const suffix = 'Roval';

    document.title = `${title} - ${suffix}`;
  };

  return { setHeadingTitle };
};

export default useHeadTags;
