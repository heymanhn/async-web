export default function fileSerializer(data, headers) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });

  /*
   * apollo-link-rest sets the content type to application/json by default, before passing
   * execution onto the browser's default fetch() library to send the request. In order to use a
   * different content type, we must pass something else into the header.
   *
   * However, in our case of file uploads, setting it to multipart/form-data manually will not
   * work. That content type also requires a boundary param, which isn't generated until the
   * fetch() library prepares the request for sending.
   *
   * The trick, however unintuitive, is to remove the content-type from the headers. The fetch()
   * library will set it for us if it doesn't detect a content-type. Morover, it's set with the
   * correct boundary param.
   *
   * https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
   */
  headers.delete('Content-Type');

  return { body: formData, headers };
}
