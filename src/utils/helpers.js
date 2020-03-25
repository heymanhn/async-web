import camelCase from 'camelcase';

export const isDiscussionOpen = id => {
  const { href } = window.location;
  return href.includes(id);
};

// Neat trick to support modular arithmetic for negative numbers
// https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
export const mod = (x, n) => ((x % n) + n) % n;

export const titleize = str => str.charAt(0).toUpperCase() + str.slice(1);

// https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
  let timeout;
  return (...args) => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const compare = (a, b) => {
  if (a < b) {
    return 1;
  }

  if (a > b) {
    return -1;
  }

  return 0;
};

export const compareOnProperty = propertyLookup => (a, b) =>
  compare(propertyLookup(a), propertyLookup(b));

export const isResourceUnread = tags => {
  return (
    tags.includes('new_messages') ||
    tags.includes('new_discussions') ||
    tags.includes('new_document') ||
    tags.includes('new_discussion')
  );
};

export const camelCaseObjString = str => {
  const obj = JSON.parse(str);
  const camelCaseObj = {};
  Object.keys(obj).forEach(key => {
    camelCaseObj[camelCase(key)] = obj[key];
  });

  return camelCaseObj;
};
