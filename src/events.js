export const downloadEvent = (url, file_name) => {
  const event = new CustomEvent('pdfDownloadEvent', {
    detail: { url, file_name },
  });
  document.body.dispatchEvent(event);
};
