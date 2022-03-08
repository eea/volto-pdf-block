/**
 * Edit block.
 * @module components/manage/PDFViewer/BlockEdit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { readAsDataURL } from 'promise-file-reader';
import {
  Button,
  Input,
  Message,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import loadable from '@loadable/component';

import config from '@plone/volto/registry';

import { Icon, SidebarPortal, TextWidget } from '@plone/volto/components';
import { createContent, unlockContent } from '@plone/volto/actions';
import { flattenToAppURL, getBaseUrl } from '@plone/volto/helpers';

import CustomNavigation from './PDFNavigation';
import { urlToCorsProxy } from '../../helpers';

import pdfSVG from './pdf-icon.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';

import './pdf-styling.css';

const Dropzone = loadable(() => import('react-dropzone'));
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
    uploading: false,
    url: '',
    currentPage: 1,
    pageCount: 0,
    dragging: false,
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

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (
      this.props.request.loading &&
      nextProps.request.loaded &&
      this.state.uploading
    ) {
      this.setState({
        uploading: false,
        dragging: false,
      });
      const id = nextProps.content['@id'];
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        url: id,
      });
    }
  }

  /**
   * Upload image handler (not used), but useful in case that we want a button
   * not powered by react-dropzone
   * @method onUploadImage
   * @returns {undefined}
   */
  onUploadImage = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const { target } = event;
    const file = target.files[0];
    this.setState({
      uploading: true,
    });
    readAsDataURL(file).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(
        getBaseUrl(this.props.pathname),
        {
          '@type': 'File',
          title: file.name,
          file: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename: file.name,
          },
        },
        this.props.block,
      );
    });
  };

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

  /**
   * Submit url handler
   * @method onSubmitUrl
   * @param {object} e Event
   * @returns {undefined}
   */
  onSubmitUrl = () => {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      url: this.state.url,
    });
  };

  /**
   * Drop handler
   * @method onDrop
   * @param {array} files File objects
   * @returns {undefined}
   */
  onDrop = (file) => {
    this.setState({
      uploading: true,
    });

    readAsDataURL(file[0]).then((data) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      this.props.createContent(getBaseUrl(this.props.pathname), {
        '@type': 'File',
        title: file[0].name,
        file: {
          data: fields[3],
          encoding: fields[2],
          'content-type': fields[1],
          filename: file[0].name,
        },
      });
    });
  };

  /**
   * Keydown handler on Variant Menu Form
   * This is required since the ENTER key is already mapped to a onKeyDown
   * event and needs to be overriden with a child onKeyDown.
   * @method onKeyDownVariantMenuForm
   * @param {Object} e Event object
   * @returns {undefined}
   */
  onKeyDownVariantMenuForm = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      this.onSubmitUrl();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      // TODO: Do something on ESC key
    }
  };

  onDragEnter = () => {
    this.setState({ dragging: true });
  };
  onDragLeave = () => {
    this.setState({ dragging: false });
  };

  node = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const dataUrl =
      (this.props.data.url &&
        (this.props.data.url.includes(config.settings.apiPath)
          ? `${flattenToAppURL(this.props.data.url)}/@@download/file`
          : urlToCorsProxy(this.props.data.url))) ||
      null;
    const data = {
      ...this.props.data,
    };
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
          !this.props.data.url &&
          this.props.appendSecondaryActions && (
            <div className="toolbar">{this.props.appendSecondaryActions}</div>
          )}
        {this.props.data.url ? (
          <div>
            <div className="pdf-toolbar pdf-toolbar-top" />
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
          <div>
            <Dropzone
              noClick
              onDrop={this.onDrop}
              onDragEnter={this.onDragEnter}
              onDragLeave={this.onDragLeave}
              className="dropzone"
            >
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()}>
                  <Message>
                    {this.state.dragging && <Dimmer active></Dimmer>}
                    {this.state.uploading && (
                      <Dimmer active>
                        <Loader indeterminate>Uploading image</Loader>
                      </Dimmer>
                    )}
                    <center>
                      <img src={pdfSVG} alt="" />
                      <div className="toolbar-inner">
                        <Button.Group>
                          <Button
                            basic
                            icon
                            onClick={(e) => {
                              e.stopPropagation();
                              this.props.openObjectBrowser({
                                mode: 'link',
                                onSelectItem,
                              });
                            }}
                          >
                            <Icon name={navTreeSVG} size="24px" />
                          </Button>
                        </Button.Group>
                        <Button.Group>
                          <label className="ui button basic icon">
                            <Icon name={uploadSVG} size="24px" />
                            <input
                              {...getInputProps({
                                type: 'file',
                                onChange: this.onUploadImage,
                                style: { display: 'none' },
                              })}
                            />
                          </label>
                        </Button.Group>
                        <Input
                          onKeyDown={this.onKeyDownVariantMenuForm}
                          onChange={this.onChangeUrl}
                          value={this.state.url}
                          placeholder={this.props.intl.formatMessage(
                            messages.ImageBlockInputPlaceholder,
                          )}
                          onClick={(e) => {
                            e.target.focus();
                          }}
                          onFocus={(e) => {
                            this.props.onSelectBlock(this.props.id);
                          }}
                          style={{ width: '100%' }}
                        />
                        {this.state.url && (
                          <Button.Group>
                            <Button
                              basic
                              className="cancel"
                              onClick={(e) => {
                                e.stopPropagation();
                                this.setState({ url: '' });
                              }}
                            >
                              <Icon name={clearSVG} size="30px" />
                            </Button>
                          </Button.Group>
                        )}
                        <Button.Group>
                          <Button
                            basic
                            primary
                            disabled={!this.state.url}
                            onClick={(e) => {
                              e.stopPropagation();
                              this.onSubmitUrl();
                            }}
                          >
                            <Icon name={aheadSVG} size="30px" />
                          </Button>
                        </Button.Group>
                      </div>
                      <div className="message-text">
                        <FormattedMessage
                          id="Please remove all @'s in pdf direct download url."
                          defaultMessage="Please remove all @'s in pdf direct download url."
                        />
                      </div>
                    </center>
                  </Message>
                </div>
              )}
            </Dropzone>
          </div>
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
    { createContent, unlockContent },
  ),
)(Edit);
