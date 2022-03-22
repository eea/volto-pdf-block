// Adopted copy of MIT licensed
// https://github.com/mikecousins/react-pdf-js/blob/9afbc77a15105fb8b0332dc0e531e27ec049dad2/src/index.tsx

import pdfjs from '@bundled-es-modules/pdfjs-dist';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';

function isFunction(value) {
  return typeof value === 'function';
}

const Pdf = React.forwardRef(
  (
    {
      file,
      onDocumentLoadSuccess,
      onDocumentLoadFail,
      onPageLoadSuccess,
      onPageLoadFail,
      onPageRenderSuccess,
      onPageRenderFail,
      page,
      scale,
      rotate,
      cMapUrl,
      cMapPacked,
      workerSrc,
      withCredentials,
      baseWidth,
      children,
      ...canvasProps
    },
    ref,
  ) => {
    const canvasRef = useRef();
    useImperativeHandle(ref, () => canvasRef.current);

    const pdfData = usePdf({
      canvasRef,
      file,
      onDocumentLoadSuccess,
      onDocumentLoadFail,
      onPageLoadSuccess,
      onPageLoadFail,
      onPageRenderSuccess,
      onPageRenderFail,
      page,
      scale,
      rotate,
      cMapUrl,
      cMapPacked,
      workerSrc,
      withCredentials,
      baseWidth,
    });

    const canvas = <canvas {...canvasProps} ref={canvasRef} />;

    if (isFunction(children)) {
      return children({ canvas, ...pdfData });
    }

    return canvas;
  },
);

export const usePdf = ({
  canvasRef,
  file,
  onDocumentLoadSuccess,
  onDocumentLoadFail,
  onPageLoadSuccess,
  onPageLoadFail,
  onPageRenderSuccess,
  onPageRenderFail,
  scale = 1,
  rotate = 0,
  page = 1,
  cMapUrl,
  cMapPacked,
  workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`,
  withCredentials = false,
  baseWidth,
}) => {
  const [pdfDocument, setPdfDocument] = useState();
  const [pdfPage, setPdfPage] = useState();
  const renderTask = useRef(null);
  const onDocumentLoadSuccessRef = useRef(onDocumentLoadSuccess);
  const onDocumentLoadFailRef = useRef(onDocumentLoadFail);
  const onPageLoadSuccessRef = useRef(onPageLoadSuccess);
  const onPageLoadFailRef = useRef(onPageLoadFail);
  const onPageRenderSuccessRef = useRef(onPageRenderSuccess);
  const onPageRenderFailRef = useRef(onPageRenderFail);

  // assign callbacks to refs to avoid redrawing
  useEffect(() => {
    onDocumentLoadSuccessRef.current = onDocumentLoadSuccess;
  }, [onDocumentLoadSuccess]);

  useEffect(() => {
    onDocumentLoadFailRef.current = onDocumentLoadFail;
  }, [onDocumentLoadFail]);

  useEffect(() => {
    onPageLoadSuccessRef.current = onPageLoadSuccess;
  }, [onPageLoadSuccess]);

  useEffect(() => {
    onPageLoadFailRef.current = onPageLoadFail;
  }, [onPageLoadFail]);

  useEffect(() => {
    onPageRenderSuccessRef.current = onPageRenderSuccess;
  }, [onPageRenderSuccess]);

  useEffect(() => {
    onPageRenderFailRef.current = onPageRenderFail;
  }, [onPageRenderFail]);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, [workerSrc]);

  useEffect(() => {
    const config = { url: file, withCredentials };
    if (cMapUrl) {
      config.cMapUrl = cMapUrl;
      config.cMapPacked = cMapPacked;
    }
    pdfjs.getDocument(config).promise.then(
      (loadedPdfDocument) => {
        setPdfDocument(loadedPdfDocument);

        if (isFunction(onDocumentLoadSuccessRef.current)) {
          onDocumentLoadSuccessRef.current(loadedPdfDocument);
        }
      },
      () => {
        if (isFunction(onDocumentLoadFailRef.current)) {
          onDocumentLoadFailRef.current();
        }
      },
    );
  }, [file, withCredentials, cMapUrl, cMapPacked]);

  useEffect(() => {
    // draw a page of the pdf
    const drawPDF = (page) => {
      // Because this page's rotation option overwrites pdf default rotation value,
      // calculating page rotation option value from pdf default and this component prop rotate.
      const rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
      const dpRatio = window.devicePixelRatio;
      const CSS_UNITS = 96 / 72;
      let adjustedScale = scale * dpRatio;
      // debugger;
      adjustedScale = baseWidth
        ? (baseWidth / page.getViewport({ scale: 1, rotation }).width) *
          CSS_UNITS *
          1.1 // coeficient to make it look good
        : adjustedScale;
      const viewport = page.getViewport({ scale: adjustedScale, rotation });
      const canvasEl = canvasRef.current;
      if (!canvasEl) {
        return;
      }

      const canvasContext = canvasEl.getContext('2d');
      if (!canvasContext) {
        return;
      }

      canvasEl.style.width = `${viewport.width / dpRatio}px`;
      canvasEl.style.height = `${viewport.height / dpRatio}px`;
      canvasEl.height = viewport.height;
      canvasEl.width = viewport.width;

      // if previous render isn't done yet, we cancel it
      if (renderTask.current) {
        renderTask.current.cancel();
        return;
      }

      renderTask.current = page.render({
        canvasContext,
        viewport,
      });

      return renderTask.current.promise.then(
        () => {
          renderTask.current = null;

          if (isFunction(onPageRenderSuccessRef.current)) {
            onPageRenderSuccessRef.current(page);
          }
        },
        (err) => {
          renderTask.current = null;

          // @ts-ignore typings are outdated
          if (err && err.name === 'RenderingCancelledException') {
            drawPDF(page);
          } else if (isFunction(onPageRenderFailRef.current)) {
            onPageRenderFailRef.current();
          }
        },
      );
    };

    if (pdfDocument) {
      pdfDocument.getPage(page).then(
        (loadedPdfPage) => {
          setPdfPage(loadedPdfPage);

          if (isFunction(onPageLoadSuccessRef.current)) {
            onPageLoadSuccessRef.current(loadedPdfPage);
          }

          drawPDF(loadedPdfPage);
        },
        () => {
          if (isFunction(onPageLoadFailRef.current)) {
            onPageLoadFailRef.current();
          }
        },
      );
    }
  }, [canvasRef, page, pdfDocument, rotate, scale]);

  return { pdfDocument, pdfPage };
};

export default Pdf;
