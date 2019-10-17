/*
 * These calls seem redundant for now, but will be valuable when we need to do extra
 * processing for some/all of them
 */

export function page(pageTitle, properties) {
  window.analytics.page(pageTitle, properties);
}

export function track(event, properties) {
  window.analytics.track(event, properties);
}

export function identify(userId, properties) {
  window.analytics.identify(userId, properties);
}
