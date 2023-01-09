import React, { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import config from '@plone/volto/registry';
import PDF from './react-pdf';
import cx from 'classnames';

import { Icon } from '@plone/volto/components';
import zoomInSVG from '@plone/volto/icons/add.svg';
import zoomOutSVG from '@plone/volto/icons/remove.svg';
import downloadSVG from '@plone/volto/icons/move-down.svg';
import './pdf-styling.css';

// Based on
// https://raw.githubusercontent.com/MGrin/mgr-pdf-viewer-react/master/src/index.js

const mgrpdfStyles = {};

mgrpdfStyles.wrapper = {
  textAlign: 'center',
  width: '100%',
};

const PagesPreview = ({ pdfDocument, handlePageClick, currentPage }) => {
  const [id] = useState(uuid());
  const renderTasks = useRef([]);
  const ratio = useRef(0);
  const pages = useRef([]);
  const pagesNode = useRef(null);
  const [pagesIndexes, setPagesIndexes] = useState([]);
  const [startRender, setStartRender] = useState(false);
  const height = 160;

  // draw a page of the pdf
  const drawPDF = useCallback(
    (page, canvasRef) => {
      const { pageIndex } = page;
      let renderTask = renderTasks.current[pageIndex];

      const baseViewport = page.getViewport({
        scale: 1,
      });

      const dpRatio = window.devicePixelRatio;
      let adjustedScale = 1 * dpRatio;
      adjustedScale = height ? height / baseViewport.height : adjustedScale;
      const viewport = page.getViewport({ scale: adjustedScale });
      const canvasEl = canvasRef.current;

      if (!canvasEl) {
        return;
      }

      const canvasContext = canvasEl.getContext('2d');
      if (!canvasContext) {
        return;
      }

      canvasEl.style.width = `${height * ratio.current}px`;
      canvasEl.style.height = `${height}px`;
      canvasEl.height = height;
      canvasEl.width = height * ratio.current;

      // if previous render isn't done yet, we cancel it
      if (renderTask) {
        renderTask.cancel();
        return;
      }

      renderTask = page.render({
        canvasContext,
        viewport,
      });

      renderTasks.current[pageIndex] = renderTask;

      return renderTask.promise.then(
        () => {
          renderTasks.current[pageIndex] = null;
        },
        (err) => {
          renderTasks.current[pageIndex] = null;

          // @ts-ignore typings are outdated
          if (err && err.name === 'RenderingCancelledException') {
            drawPDF(page, canvasRef);
          }
        },
      );
    },
    [ratio],
  );

  useEffect(() => {
    if (pdfDocument && pdfDocument.numPages !== pagesIndexes.length) {
      setPagesIndexes([...Array(pdfDocument.numPages).keys()]);
    }
    if (pdfDocument && pages.current.length === 0 && pagesIndexes.length > 0) {
      pagesIndexes.forEach((pageIndex) => {
        pdfDocument.getPage(pageIndex + 1).then((page) => {
          pages.current[page.pageIndex] = page;
          if (page.pageIndex === pagesIndexes.length - 1) {
            pages.current.forEach((page) => {
              const baseViewport = page.getViewport({
                scale: 1,
                rotation: page.rotate,
              });
              const baseRatio = baseViewport.width / baseViewport.height;

              if (baseRatio > ratio.current) {
                ratio.current = baseRatio;
              }
            });

            setStartRender(true);
          }
        });
      });
    }
  }, [pdfDocument, pagesIndexes]);

  useEffect(() => {
    if (startRender && ratio.current) {
      pages.current.forEach((page) => {
        const pageIndex = page.pageIndex;
        const canvasRef = {
          current: document.getElementById(
            `pdf-preview-${pageIndex + 1}-${id}`,
          ),
        };
        drawPDF(page, canvasRef);
      });
    }
  }, [startRender, drawPDF, id]);

  useEffect(() => {
    // Get DOM elements
    const pagesContainerEl = pagesNode.current;
    const pagePreviewEl = document.getElementById(
      `pdf-preview-${currentPage}-${id}`,
    );
    if (!pagesContainerEl || !pagePreviewEl) return;
    // Get dimensions
    const pagesContainerBox = pagesContainerEl.getBoundingClientRect();
    const pagePreviewBox = pagePreviewEl.getBoundingClientRect();
    const top = pagePreviewBox.y - pagesContainerBox.y;
    const direction = top > 0 ? 'down' : 'up';
    const offset = pagePreviewBox.height + 48;
    const inView =
      direction === 'down'
        ? Math.abs(top + offset) <= pagesContainerBox.height
        : Math.abs(top - offset) < 0;
    const yScroll =
      direction === 'down' ? top + offset - pagesContainerBox.height : top - 30;

    if (!inView) {
      pagesContainerEl.scrollBy(0, yScroll);
    }
  }, [currentPage, id]);

  return (
    <div ref={pagesNode} className="pdf-pages-preview">
      {pagesIndexes.map((page) => (
        <div key={`pdf-preview-${page + 1}-${id}`}>
          <canvas
            className={
              page === currentPage - 1 ? 'highlight-page' : 'page-wrapper'
            }
            onClick={() => {
              handlePageClick(page + 1);
            }}
            id={`pdf-preview-${page + 1}-${id}`}
          />
        </div>
      ))}
    </div>
  );
};

const LoaderComponent = ({ children }) => (
  <div
    className="block pdf_viewer selected"
    tabindex="-1"
    style={{ outline: 'none', height: '100%' }}
  >
    <div className="ui message">
      <div
        className="ui active transition visible dimmer"
        style={{ display: 'flex !important;' }}
      ></div>
      <div
        className="ui active transition visible dimmer"
        style={{ display: 'flex !important;' }}
      >
        <div className="content">
          <div className="ui indeterminate text loader"></div>
        </div>
      </div>
      {children}
    </div>
  </div>
);

const PDFToolbar = ({ downloadUrl, onScaleUp, onScaleDown, scale_ratio }) => (
  <div className="pdf-toolbar pdf-toolbar-top">
    <div>
      <button className="pdf-toolbar-btn" title="Zoom In" onClick={onScaleUp}>
        <Icon name={zoomInSVG} size="15px" />
      </button>
      <div className="scale-separator" />
      <button
        className="pdf-toolbar-btn"
        title="Zoom Out"
        onClick={onScaleDown}
      >
        <Icon name={zoomOutSVG} size="15px" />
      </button>
      <p className="scale-ratio">{scale_ratio + '%'}</p>
    </div>
    <div>
      <a href={downloadUrl}>
        <button className="pdf-toolbar-btn" title="Download">
          <Icon name={downloadSVG} size="20px" />
        </button>
      </a>
    </div>
  </div>
);

function PDFViewer({
  page = 1,
  initialScale = 1.0,
  initial_scale_ratio = 100,
  loader,
  navigation: NavigationToolbar,
  css,
  document: source,
  showNavbar = true,
  showToolbar = true,
  enableScroll = true,
  showPagesPreview = false,
  fitPageWidth = false,
  onPageRenderSuccess,
}) {
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(page);

  const [loading, setLoading] = React.useState(true);
  const [loaded, setLoaded] = React.useState(false);

  const nodeRef = React.useRef();
  const [scale_ratio, setScale_ratio] = React.useState(initial_scale_ratio);
  const [scale, setScale] = React.useState(initialScale);
  const [baseWidth, setBaseWidth] = React.useState();

  React.useLayoutEffect(() => {
    setBaseWidth(nodeRef.current.clientWidth);
  }, []);

  React.useEffect(() => {
    setCurrentPage(page || 1);
  }, [page]);

  const increaseScale = () => {
    setScale(scale + 0.1);
    setScale_ratio(scale_ratio + 10);
  };
  const decreaseScale = () => {
    setScale(scale - 0.1);
    setScale_ratio(scale_ratio - 10);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePrevClick = () => {
    if (currentPage === 1) return;
    setCurrentPage(currentPage - 1);
  };

  const handleNextClick = () => {
    if (currentPage === totalPages) return;
    setCurrentPage(currentPage + 1);
  };

  React.useLayoutEffect(() => {
    if (!enableScroll) return;

    function handleWheel(event) {
      if (event.deltaY < 0) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      } else if (event.deltaY > 0) {
        setCurrentPage(Math.min(currentPage + 1, totalPages));
      }

      event.preventDefault();
    }

    const isPdfWrapper = nodeRef.current?.classList?.contains('pdf-wrapper');
    const pdfWrapper = isPdfWrapper ? nodeRef.current : null;

    if (pdfWrapper) {
      pdfWrapper.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (pdfWrapper) {
        pdfWrapper.removeEventListener('wheel', handleWheel);
      }
    };
  }, [currentPage, totalPages, enableScroll]);

  return (
    <div
      ref={nodeRef}
      className={
        !loading && css
          ? cx(css, 'pdf-wrapper')
          : cx('mgrpdf__wrapper', 'pdf-wrapper')
      }
      style={mgrpdfStyles.wrapper}
    >
      {showToolbar && (
        <PDFToolbar
          onScaleUp={increaseScale}
          onScaleDown={decreaseScale}
          downloadUrl={source.url}
          scale_ratio={scale_ratio}
        />
      )}
      {baseWidth && (
        <PDF
          baseWidth={fitPageWidth ? baseWidth : undefined}
          file={source.file || source.url}
          content={source.base64}
          binaryContent={source.binary}
          documentInitParameters={source.connection}
          loading={loader || loading}
          page={currentPage}
          scale={scale}
          onPageRenderSuccess={(page, canvasEl, viewport) => {
            setLoading(false);
            setLoaded(true);
            onPageRenderSuccess &&
              onPageRenderSuccess(page, canvasEl, viewport);
          }}
          onPageRenderFail={() => {
            setLoading(false);
            setLoaded(false);
          }}
          workerSrc={config.settings.pdfWorkerSrc}
          onDocumentLoadSuccess={(pdfDoc) => {
            setLoaded(true);
            setTotalPages(pdfDoc.numPages);
          }}
        >
          {({ pdfDocument, pdfPage, canvas }) => {
            return loaded ? (
              <div className="pdf-main">
                {showPagesPreview && (
                  <PagesPreview
                    currentPage={currentPage}
                    pdfDocument={pdfDocument}
                    handlePageClick={handlePageClick}
                  />
                )}
                <div className="pdf"> {canvas}</div>
              </div>
            ) : (
              <LoaderComponent>{canvas}</LoaderComponent>
            );
          }}
        </PDF>
      )}

      {showNavbar && !loading && totalPages > 1 ? (
        <NavigationToolbar
          page={currentPage}
          pages={totalPages}
          handleNextClick={handleNextClick}
          handlePrevClick={handlePrevClick}
        />
      ) : null}
    </div>
  );
}

PDFViewer.propTypes = {
  document: PropTypes.shape({
    file: PropTypes.any, // File object,
    url: PropTypes.string,
    connection: PropTypes.shape({
      url: PropTypes.string.isRequired, // URL to fetch the pdf
    }),
    base64: PropTypes.string, // PDF file encoded in base64
    binary: PropTypes.shape({
      // UInt8Array
      data: PropTypes.any,
    }),
  }).isRequired,

  loader: PropTypes.node,
  page: PropTypes.number,
  scale: PropTypes.number,
  css: PropTypes.string,
  // onDocumentClick: PropTypes.func,
  // onDocumentComplete: PropTypes.func,

  hideNavbar: PropTypes.bool,
  navigation: PropTypes.oneOfType([
    // Can be an object with css classes or react elements to be rendered
    PropTypes.shape({
      css: PropTypes.shape({
        previousPageBtn: PropTypes.string,
        nextPageBtn: PropTypes.string,
        pages: PropTypes.string,
        wrapper: PropTypes.string,
      }),
      elements: PropTypes.shape({
        previousPageBtn: PropTypes.any,
        nextPageBtn: PropTypes.any,
        pages: PropTypes.any,
      }),
    }),
    // Or a full navigation component
    PropTypes.any,
  ]),
};

PDFViewer.defaultProps = {
  scale: 1,
};

export default PDFViewer;
