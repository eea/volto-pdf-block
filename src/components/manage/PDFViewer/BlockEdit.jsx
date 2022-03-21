/**
 * Edit block.
 * @module components/manage/PDFViewer/BlockEdit
 */

import React from 'react';
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

import UploadWidget, { usePrevious } from './UploadWidget';
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

function Edit(props) {
  const {
    onSelectBlock,
    data = {},
    onChangeBlock,
    block,
    selected,
    appendActions = null,
    appendSecondaryActions = null,
    detached,
    pathname,
    openObjectBrowser,
    intl,
    request,
    content,
  } = props;

  const prevRequest = usePrevious(request) || {};
  const id = content['@id'];

  React.useEffect(() => {
    if (prevRequest.loading && request.loaded) {
      onChangeBlock(block, {
        ...data,
        url: id,
      });
    }
  }, [prevRequest.loading, request.loaded, id, block, data, onChangeBlock]);

  const dataUrl =
    (data.url &&
      (data.url.includes(config.settings.apiPath) || data.url.startsWith('/')
        ? `${flattenToAppURL(data.url)}/@@download/file`
        : urlToCorsProxy(data.url))) ||
    null;

  const onSelectItem = React.useCallback(
    (url) => {
      onChangeBlock(block, {
        ...data,
        url,
      });
    },
    [block, data, onChangeBlock],
  );

  return (
    <div>
      {selected && !!data.url && (
        <div className="toolbar">
          {appendActions}
          {detached && appendActions && <div className="separator" />}
          <Button.Group>
            <Button
              icon
              basic
              onClick={() =>
                onChangeBlock(block, {
                  ...data,
                  url: '',
                })
              }
            >
              <Icon name={clearSVG} size="24px" color="#e40166" />
            </Button>
          </Button.Group>
          {appendSecondaryActions}
        </div>
      )}
      {selected && !data.url && appendSecondaryActions && (
        <div className="toolbar">{appendSecondaryActions}</div>
      )}
      {data.url ? (
        <div>
          <LoadablePDFViewer
            document={{
              url: dataUrl,
            }}
            css="pdf-viewer"
            navigation={CustomNavigation}
            initial_page={1}
          />
        </div>
      ) : (
        <UploadWidget
          block={block}
          id={`upload-widget-${block}`}
          value={data?.url}
          onChange={(id, value) => onSelectItem(value)}
          onFocus={() => onSelectBlock(block)}
          icon={pdfSVG}
          pathname={pathname}
          openObjectBrowser={openObjectBrowser}
        />
      )}

      <SidebarPortal selected={selected}>
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
                    title={intl.formatMessage(messages.Origin)}
                    required={false}
                    value={data.url.split('/').slice(-1)[0]}
                    icon={navTreeSVG}
                    iconAction={() =>
                      openObjectBrowser({
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
                    title={intl.formatMessage(messages.externalURL)}
                    required={false}
                    value={data.url}
                    icon={clearSVG}
                    iconAction={() =>
                      onChangeBlock(block, {
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

Edit.propTypes = {
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

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      request: state.content.subrequests[props.block] || {},
      content: state.content.subrequests[props.block]?.data || {},
    }),
    { createContent },
  ),
)(Edit);
