# volto-pdf-block

[![Releases](https://img.shields.io/github/v/release/eea/volto-pdf-block)](https://github.com/eea/volto-pdf-block/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-pdf-block%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-pdf-block/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-pdf-block%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-pdf-block/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&branch=develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block&branch=develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&branch=develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block&branch=develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&branch=develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block&branch=develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-pdf-block&branch=develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-pdf-block&branch=develop)

[Volto](https://github.com/plone/volto) add-on

## Features

- Flexible PDF integration in Volto.

NOTE: this addon assumes that, if you're trying to load external hosted PDF
files, you will be using
[@eeacms/volto-corsproxy](https://github.com/eea/volto-corsproxy)

[PDF Block](https://raw.githubusercontent.com/eea/volto-pdf-block/master/docs/volto-pdf-block.png)

## Getting started

### Try volto-pdf-block with Docker

      git clone https://github.com/eea/volto-pdf-block.git
      cd volto-pdf-block
      make
      make start

Go to http://localhost:3000

### Add volto-pdf-block to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "addons": [
      "@eeacms/volto-pdf-block"
  ],

  "dependencies": {
      "@eeacms/volto-pdf-block": "*"
  }
  ```

- If not, create one:

  ```
  npm install -g yo @plone/generator-volto
  yo @plone/volto my-volto-project --canary --addon @eeacms/volto-pdf-block
  cd my-volto-project
  ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Internal use of PDF library

```JS
import config from '@plone/volto/registry';
import PDF from '@mikecousins/react-pdf';


export const PdfViwer = (props) => {

return (
  <PDF
    file={source.file || source.url}
    content={source.base64}
    binaryContent={source.binary}
    documentInitParameters={source.connection}
    page={page}
    scale={scale}
    onPageRenderSuccess={onPageRenderSuccess}
    onPageRenderFail={onPageRenderFail}
    workerSrc={config.settings.pdfWorkerSrc}
    onDocumentLoadSuccess={onDocumentComplete}
  >
    {({ pdfDocument, pdfPage, canvas }) => (
    <>
      {!pdfDocument && loaderComponent(canvas)}
      {pdfDocument && canvas}
    </>
    )}
  </PDF>
)}
```

## workerSrc

Allows you to specify your own url for the pdf worker.
Default is set by the library to:

```
"//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js"
```

For cases where it is needed to have the library on a different CDN this can be configured on `config.settings.pdfWorkerSrc` the way it is done on [volto-ims-policy](https://github.com/eea/volto-ims-policy/blob/master/src/index.js) which is an add-on that centrilazes configurations for Volto for different add-ons.

```JS
const applyConfig = (config) => {
  ...
  // PDF worker url
  config.settings.pdfWorkerSrc = '//www.eea.europa.eu/pdfjs/pdf.worker.min.js';
  return config;
};
```

## Release

See [RELEASE.md](https://github.com/eea/volto-pdf-block/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-pdf-block/blob/master/DEVELOP.md).

## Secret Scanning

This repository uses the Betterleaks GitHub Action to scan the current
repository content on every push and pull request. The scan uses the rules in
`.gitleaks.toml` and uploads a `betterleaks-report` artifact when a finding is
detected.

If the optional SMTP secrets are configured, failed scans also send an email to
the last commit committer. The workflow expects these repository or
organization secrets:

- `SMTP_URL`
- `SMTP_PORT` (optional, defaults to `25`)
- `SMTP_EMAIL`
- `SMTP_PASSWORD` (optional if the SMTP server does not require authentication)

Port `465` is sent with direct TLS; other ports use the default SMTP handshake.
The email includes a short finding summary from the redacted Betterleaks report,
including the redacted matched line from each finding.

There are three common outcomes:

1. **Everything is OK.** The `Betterleaks / Scan for secrets` check is green and
   no action is needed. Regular references to runtime values are OK, for example:

   ```js
   const tokenFromCookie = req.universalCookies.get('auth_token');
   ```

2. **A real secret was found.** The check is red and the workflow log asks you to
   download the `betterleaks-report` artifact. Open the artifact from the GitHub
   Actions run and check the reported file, line and rule. Remove the committed
   value, move it to the proper secret store, and rotate it if it was exposed.
   A report entry looks like this:

   ```json
   {
     "RuleID": "secret-literal-assignment",
     "File": "src/config.js",
     "StartLine": 12,
     "Secret": "[REDACTED]"
   }
   ```

3. **The finding is a false positive.** Keep the value only if it is clearly not
   sensitive, such as a test fixture, placeholder, or public example. Add
   `betterleaks:allow` on the same line and include a short explanation in the
   pull request.

   ```js
   const testPassword = 'admin'; //betterleaks:allow
   ```

   ```yaml
   password: "admin" #betterleaks:allow
   ```

Do not add `betterleaks:allow` to real credentials.

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-pdf-block/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
