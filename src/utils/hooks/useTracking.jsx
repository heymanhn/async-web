import useMountEffect from 'utils/hooks/useMountEffect';

// Used on any top level page that we need to run a page() Segment call on
const useTracking = ({ action, title}) => {
  useMountEffect(() => window.analytics.page(pageTitle));
};

export default useTracking;
