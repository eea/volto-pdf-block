import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@plone/volto/components';
import config from '@plone/volto/registry';
import { flattenToAppURL } from '@plone/volto/helpers';
import loadable from '@loadable/component';

import CustomNavigation from './PDFNavigation';
import './pdf-styling.css';

import zoomInSVG from '@plone/volto/icons/add.svg';
import zoomOutSVG from '@plone/volto/icons/remove.svg';
import downloadSVG from '@plone/volto/icons/move-down.svg';
import { Corsproxy } from '../../helpers';

const LoadablePDFViewer = loadable(() => import('./PDFViewer'), {
  fallback: () => <div>Loading PDF file...</div>,
});

class PDFView extends Component {
  state = {
    scale: 1.0,
    scale_ratio: 100,
    currentPage: 1,
    pageCount: 0,
  };

  increaseScale = () =>
    this.setState(({ scale, scale_ratio }) => ({
      scale: scale + 0.1,
      scale_ratio: scale_ratio + 10,
    }));
  decreaseScale = () =>
    this.setState(({ scale, scale_ratio }) => ({
      scale: scale - 0.1,
      scale_ratio: scale_ratio - 10,
    }));

  componentDidMount() {
    const pdfWrapper = document.querySelector('.pdf-wrapper');
    if (pdfWrapper) {
      pdfWrapper.addEventListener('wheel', this.handleWheel);
    }
  }

  componentWillUnmount() {
    const pdfWrapper = document.querySelector('.pdf-wrapper');
    if (pdfWrapper) {
      pdfWrapper.addEventListener('wheel', this.handleWheel);
    }
  }

  handleWheel = (event) => {
    let page;
    if (event.deltaY < 0) {
      page = Math.max(this.state.currentPage - 1, 1);
      this.setState({
        currentPage: page,
      });
    } else if (event.deltaY > 0) {
      page = Math.min(this.state.currentPage + 1, this.state.pageCount);
      this.setState({
        currentPage: page,
      });
    }

    event.preventDefault();
  };

  onDocumentComplete = ({ page, pages }) => {
    this.setState({
      currentPage: page,
      pageCount: pages,
    });
  };

  render() {
    const { data } = this.props;
    const dataUrl =
      (data.url &&
        (data.url.includes(config.settings.apiPath)
          ? `${flattenToAppURL(data.url)}/@@download/file`
          : Corsproxy(data.url))) ||
      null;

    return (
      <div className="pdf-viewer-block">
        {data.url && (
          <div className="pdf-wrapper">
            <div className="pdf-toolbar pdf-toolbar-top">
              <div>
                <button
                  className="pdf-toolbar-btn"
                  title="Zoom In"
                  onClick={this.increaseScale}
                >
                  <Icon name={zoomInSVG} size="15px" />
                </button>
                <div className="scale-separator" />
                <button
                  className="pdf-toolbar-btn"
                  title="Zoom Out"
                  onClick={this.decreaseScale}
                >
                  <Icon name={zoomOutSVG} size="15px" />
                </button>
                <p className="scale-ratio">{this.state.scale_ratio + '%'}</p>
              </div>
              <div>
                <a href={dataUrl}>
                  <button className="pdf-toolbar-btn" title="Download">
                    <Icon name={downloadSVG} size="15px" />
                  </button>
                </a>
              </div>
            </div>

            <LoadablePDFViewer
              document={{
                url: dataUrl,
              }}
              scale={this.state.scale}
              css="pdf-viewer"
              navigation={CustomNavigation}
              page={this.state.currentPage}
              onDocumentComplete={this.onDocumentComplete}
            />
          </div>
        )}
      </div>
    );
  }
}

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
PDFView.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PDFView;
