/**
 * Edit block.
 * @module components/manage/PDFViewer/BlockEdit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button, Segment } from 'semantic-ui-react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import loadable from '@loadable/component';

import config from '@plone/volto/registry';

import { Icon, SidebarPortal, TextWidget } from '@plone/volto/components';
import { createContent } from '@plone/volto/actions';
import { flattenToAppURL } from '@plone/volto/helpers';

import UploadWidget from './UploadWidget';
import CustomNavigation from './PDFNavigation';
import { urlToCorsProxy } from '../../helpers';

import pdfSVG from './pdf-icon.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';

import './pdf-styling.css';

const LoadablePDFViewer = loadable(() => import('./PDFViewer'), {
  fallback: () => <div>Loading PDF file...</div>,
});

const messages = defineMessages({
  ImageBlockInputPlaceholder: {
    id: 'Browse the site, drop a PDF document or type an URL',
    defaultMessage: 'Browse the site, drop a PDF document or type an URL',
  },
  Origin: {
    id: 'Origin',
    defaultMessage: 'Origin',
  },
  externalURL: {
    id: 'External URL',
    defaultMessage: 'External URL',
  },
});

/**
 * Edit image block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    content: PropTypes.objectOf(PropTypes.any).isRequired,
    request: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    createContent: PropTypes.func.isRequired,
    openObjectBrowser: PropTypes.func.isRequired,
  };

  state = {
    url: '',
    currentPage: 1,
    pageCount: 0,
  };

  componentDidMount() {
    LoadablePDFViewer.load().then(() => {
      const pdfWrapper = document.querySelector('.pdf-viewer');
      if (pdfWrapper) {
        pdfWrapper.addEventListener('wheel', this.handleWheel);
      }
    });
  }

  componentWillUnmount() {
    const pdfWrapper = document.querySelector('.pdf-viewer');
    if (pdfWrapper) {
      pdfWrapper.removeEventListener('wheel', this.handleWheel);
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

  componentDidUpdate(prevProps) {
    if (prevProps.request.loading && this.props.request.loaded) {
      const id = this.props.content['@id'];

      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url: id,
      });
    }
  }

  /**
   * Change url handler
   * @method onChangeUrl
   * @param {Object} target Target object
   * @returns {undefined}
   */
  onChangeUrl = ({ target }) => {
    this.setState({
      url: target.value,
    });
  };

  node = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { onSelectBlock, data = {} } = this.props;
    const dataUrl =
      (data.url &&
        (data.url.includes(config.settings.apiPath) || data.url.startsWith('/')
          ? `${flattenToAppURL(data.url)}/@@download/file`
          : urlToCorsProxy(data.url))) ||
      null;

    const onSelectItem = (url) => {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url,
      });
    };

    return (
      <div>
        {this.props.selected && !!this.props.data.url && (
          <div className="toolbar">
            {this.props.appendActions && <>{this.props.appendActions}</>}
            {this.props.detached && this.props.appendActions && (
              <div className="separator" />
            )}
            <Button.Group>
              <Button
                icon
                basic
                onClick={() =>
                  this.props.onChangeBlock(this.props.block, {
                    ...this.props.data,
                    url: '',
                  })
                }
              >
                <Icon name={clearSVG} size="24px" color="#e40166" />
              </Button>
            </Button.Group>
            {this.props.appendSecondaryActions && (
              <>{this.props.appendSecondaryActions}</>
            )}
          </div>
        )}
        {this.props.selected &&
          !data.url &&
          this.props.appendSecondaryActions && (
            <div className="toolbar">{this.props.appendSecondaryActions}</div>
          )}
        {data.url ? (
          <div>
            <LoadablePDFViewer
              document={{
                url: dataUrl,
              }}
              css="pdf-viewer"
              navigation={CustomNavigation}
              page={this.state.currentPage}
              onDocumentComplete={this.onDocumentComplete}
            />
          </div>
        ) : (
          <UploadWidget
            block={this.props.block}
            id={`upload-widget-${this.props.block}`}
            value={data?.url}
            onChange={(id, value) => onSelectItem(value)}
            onFocus={() => onSelectBlock(this.props.block)}
            icon={pdfSVG}
            pathname={this.props.pathname}
            openObjectBrowser={this.props.openObjectBrowser}
          />
        )}

        <SidebarPortal selected={this.props.selected}>
          <Segment.Group raised>
            <header className="header pulled">
              <h2> PDF Block </h2>
            </header>

            {!data.url && (
              <>
                <Segment className="sidebar-metadata-container" secondary>
                  <FormattedMessage
                    id="No PDF selected"
                    defaultMessage="No PDF selected"
                  />
                  <img src={pdfSVG} alt="" />
                </Segment>
              </>
            )}
            {data.url && (
              <>
                <Segment className="sidebar-metadata-container" secondary>
                  {data.url.split('/').slice(-1)[0]}
                  <img src={pdfSVG} alt="" />
                </Segment>
                <Segment className="form sidebar-image-data">
                  {data.url.includes(config.settings.apiPath) && (
                    <TextWidget
                      id="Origin"
                      title={this.props.intl.formatMessage(messages.Origin)}
                      required={false}
                      value={data.url.split('/').slice(-1)[0]}
                      icon={navTreeSVG}
                      iconAction={() =>
                        this.props.openObjectBrowser({
                          mode: 'link',
                          onSelectItem,
                        })
                      }
                      onChange={() => {}}
                    />
                  )}
                  {!data.url.includes(config.settings.apiPath) && (
                    <TextWidget
                      id="external"
                      title={this.props.intl.formatMessage(
                        messages.externalURL,
                      )}
                      required={false}
                      value={data.url}
                      icon={clearSVG}
                      iconAction={() =>
                        this.props.onChangeBlock(this.props.block, {
                          ...data,
                          url: '',
                        })
                      }
                      onChange={() => {}}
                    />
                  )}
                </Segment>
              </>
            )}
          </Segment.Group>
        </SidebarPortal>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      request: state.content.subrequests[props.block] || {},
      content: state.content.subrequests[props.block]?.data,
    }),
    { createContent },
  ),
)(Edit);
