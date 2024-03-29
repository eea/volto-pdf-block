import React from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';
import { Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers';

import NavigationToolbar from './PDFNavigation';

import { urlToCorsProxy } from '../../helpers';

import downloadSVG from '@plone/volto/icons/move-down.svg';

import './pdf-styling.css';

const LoadablePDFViewer = loadable(() => import('./PDFViewer'), {
  fallback: () => <div>Loading PDF file...</div>,
  ssr: false,
});
const CSS_UNITS = 96 / 72;

const downloadUrl = (url) =>
  url.indexOf('@@download') === -1
    ? `${flattenToAppURL(url)}/@@download/file`
    : url;

const DownloadOverlay = ({ url, size }) => {
  return (
    <div
      className="pdf-block-download-overlay"
      style={{
        width: size[0],
        height: size[1],
        position: 'absolute',
        background: 'rgb(204, 204, 204, 0.5)',
        zIndex: 2,
      }}
    >
      <div className="icon-wrapper">
        <span className="btn-icon">
          <Button circular compact primary as="a" href={url} alt="Download">
            <Icon name={downloadSVG} size="18px" />
          </Button>
        </span>
      </div>
    </div>
  );
};

const PDFBlockView = ({ data }) => {
  const dataUrl =
    (data.url &&
      (data.url.includes(config.settings.apiPath) || data.url.startsWith('/')
        ? downloadUrl(data.url)
        : urlToCorsProxy(data.url))) ||
    null;
  const [size, setSize] = React.useState();

  return (
    <div className="pdf-viewer-block">
      {data.clickToDownload && size && (
        <DownloadOverlay url={dataUrl} size={size} />
      )}
      {dataUrl && (
        <LoadablePDFViewer
          document={{
            url: dataUrl,
          }}
          css="pdf-viewer"
          navigation={NavigationToolbar}
          showToolbar={!data.hideToolbar}
          showNavbar={!data.hideNavbar}
          showPagesPreview={data.showPagesPreview}
          page={parseInt(data.initialPage || 1)}
          initial_scale={data.initial_scale}
          initial_scale_ratio={data.initial_scale_ratio}
          enableScroll={!data.disableScroll}
          fitPageWidth={data.fitPageWidth}
          onPageRenderSuccess={(page, canvasEl, viewport) => {
            setSize([
              `${Math.round(viewport.width / CSS_UNITS)}px`,
              `${Math.round(viewport.height / CSS_UNITS)}px`,
            ]);
          }}
        />
      )}
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
PDFBlockView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PDFBlockView;
