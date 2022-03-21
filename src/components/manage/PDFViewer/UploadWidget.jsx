import React from 'react';
import loadable from '@loadable/component';
import { Button, Input, Message, Dimmer, Loader } from 'semantic-ui-react';
import { readAsDataURL } from 'promise-file-reader';
import { useDispatch } from 'react-redux';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';

import { createContent } from '@plone/volto/actions';
import { getBaseUrl } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';

import aheadSVG from '@plone/volto/icons/ahead.svg';
import uploadSVG from '@plone/volto/icons/upload.svg';
import navTreeSVG from '@plone/volto/icons/nav.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

const Dropzone = loadable(() => import('react-dropzone'));

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

export function usePrevious(value) {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const UploadWidget = ({
  value,
  onChange,
  onFocus,
  icon,
  pathname,
  openObjectBrowser,
  block,
  id,
  requestId,
}) => {
  const [localValue, setLocalValue] = React.useState(value);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const intl = useIntl();

  const oldValue = usePrevious(value);

  React.useEffect(() => {
    if (value !== oldValue) setLocalValue(oldValue);
  }, [value, oldValue]);

  const dispatch = useDispatch();

  const uploadFileData = React.useCallback(
    ({ filename, data }) => {
      const fields = data.match(/^data:(.*);(.*),(.*)$/);
      const action = createContent(
        getBaseUrl(pathname),
        {
          '@type': 'File',
          filename,
          file: {
            data: fields[3],
            encoding: fields[2],
            'content-type': fields[1],
            filename,
          },
        },
        block,
      );
      dispatch(action);
    },
    [dispatch, pathname, block],
  );

  const onDropFile = (file) => {
    setIsUploading(true);

    readAsDataURL(file[0]).then((data) => {
      uploadFileData({ filename: file[0].name, data });
    });
  };

  const onUploadFile = React.useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      const { target } = event;
      const file = target.files[0];
      setIsUploading(true);

      readAsDataURL(file).then((data) => {
        uploadFileData({ filename: file.name, data });
      });
    },
    [uploadFileData],
  );

  const onKeyDownVariantMenuForm = React.useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        onChange(id, localValue);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        // TODO: Do something on ESC key
      }
    },
    [id, onChange, localValue],
  );

  return (
    <div className="upload-widget">
      <Dropzone
        noClick
        onDrop={onDropFile}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        className="dropzone"
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <Message>
              {isDragging && <Dimmer active></Dimmer>}
              {isUploading && (
                <Dimmer active>
                  <Loader indeterminate>Uploading image</Loader>
                </Dimmer>
              )}
              <center>
                <img src={icon} alt="" />
                <div className="toolbar-inner">
                  <Button.Group>
                    <Button
                      basic
                      icon
                      onClick={(e) => {
                        e.stopPropagation();
                        openObjectBrowser({
                          mode: 'link',
                          onSelectItem: (url) => onChange(id, url),
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
                          onChange: onUploadFile,
                          style: { display: 'none' },
                        })}
                      />
                    </label>
                  </Button.Group>
                  <Input
                    onKeyDown={onKeyDownVariantMenuForm}
                    onChange={(event, data) => {
                      setLocalValue(data.value);
                    }}
                    value={value}
                    placeholder={intl.formatMessage(
                      messages.ImageBlockInputPlaceholder,
                    )}
                    onClick={(e) => {
                      e.target.focus();
                    }}
                    onFocus={onFocus}
                    style={{ width: '100%' }}
                  />
                  {value && (
                    <Button.Group>
                      <Button
                        basic
                        className="cancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChange(id, '');
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
                      disabled={!value}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubmitUrl();
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
  );
};

export default UploadWidget;
