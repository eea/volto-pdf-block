export const downloadEvent = (url) => {
  const event = new CustomEvent('pdfDownloadEvent', { detail: url });
  document.body.dispatchEvent(event);
};
