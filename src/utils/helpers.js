import camelCase from 'camelcase';

export const isResourceOpen = id => {
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
    tags.includes('new_edits') ||
    tags.includes('new_discussion') ||
    tags.includes('new_updates')
  );
};

export const firstNewMessageId = messages => {
  const targetMessage = messages.find(
    m => m.tags && m.tags.includes('new_message')
  );

  return targetMessage ? targetMessage.id : null;
};

export const isResourceReadOnly = tags => {
  return tags.includes('viewer');
};

export const camelCaseObjString = str => {
  const obj = JSON.parse(str);
  const camelCaseObj = {};
  Object.keys(obj).forEach(key => {
    camelCaseObj[camelCase(key)] = obj[key];
  });

  return camelCaseObj;
};

// Convenience method for rounding a number to a number of significant digits
// https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-only-if-necessary
export const roundToPrecision = (num, sigfig = 2) =>
  Math.round((num + Number.EPSILON) * 10 ** sigfig) / 10 ** sigfig;

export const scrollToBottom = ref => {
  const { current: bottomOfPage } = ref;
  if (bottomOfPage) {
    setTimeout(() => bottomOfPage.scrollIntoView(), 0);
  }
};
