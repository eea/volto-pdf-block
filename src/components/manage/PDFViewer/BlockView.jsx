import React from 'react';
import PropTypes from 'prop-types';
import loadable from '@loadable/component';

import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers';

import CustomNavigation from './PDFNavigation';

import { urlToCorsProxy } from '../../helpers';

import './pdf-styling.css';

const LoadablePDFViewer = loadable(() => import('./PDFViewer'), {
  fallback: () => <div>Loading PDF file...</div>,
  ssr: false,
});

const PDFBlockView = ({ data }) => {
  const dataUrl =
    (data.url &&
      (data.url.includes(config.settings.apiPath) || data.url.startsWith('/')
        ? `${flattenToAppURL(data.url)}/@@download/file`
        : urlToCorsProxy(data.url))) ||
    null;

  return (
    <div className="pdf-viewer-block">
      {dataUrl && (
        <div className="pdf-wrapper">
          <LoadablePDFViewer
            document={{
              url: dataUrl,
            }}
            css="pdf-viewer"
            navigation={CustomNavigation}
            showToolbar={!data.hideToolbar}
            initial_page={data.initial_page}
            initial_scale={data.initial_scale}
            initial_scale_ratio={data.initial_scale_ratio}
          />
        </div>
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
