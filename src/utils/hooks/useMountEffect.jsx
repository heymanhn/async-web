// Inspired by Ben Carp's answer in https://stackoverflow.com/questions/53120972/how-to-call-loading-function-with-react-useeffect-only-once
import { useEffect } from 'react';

const useMountEffect = cb => useEffect(cb, []);

export default useMountEffect;
