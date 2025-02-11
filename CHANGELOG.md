### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

Generated by [`auto-changelog`](https://github.com/CookPete/auto-changelog).

### [1.0.12](https://github.com/eea/volto-pdf-block/compare/1.0.11...1.0.12) - 31 January 2025

#### :rocket: New Features

- feat: Volto 17 support - refs #264527 [EEA Jenkins - [`f77ef73`](https://github.com/eea/volto-pdf-block/commit/f77ef731d5a73885a20dece08c0eef938c879601)]

#### :house: Internal changes

- chore: [JENKINS] Refactor automated testing [valentinab25 - [`535e539`](https://github.com/eea/volto-pdf-block/commit/535e539cc9953e91fec1eaf9d725635b8b2a085e)]
- chore: husky, lint-staged use fixed versions [valentinab25 - [`c89433e`](https://github.com/eea/volto-pdf-block/commit/c89433efc23871f17f4523dc36c0232be6209a14)]
- chore:volto 16 in tests, update docs, fix stylelint overrides [valentinab25 - [`b69f6ff`](https://github.com/eea/volto-pdf-block/commit/b69f6ff01ea954c6ad3f6f5638b83a4c4cfd03e2)]
- chore: [JENKINS] Remove alpha testing version [valentinab25 - [`c68f232`](https://github.com/eea/volto-pdf-block/commit/c68f232ff2e54cacc49620a0fc19ce6999e2cc84)]

#### :house: Documentation changes

- docs: Cleanup Makefile, update DEVELOP documentation, i18n - refs #254894 [valentinab25 - [`bd71607`](https://github.com/eea/volto-pdf-block/commit/bd71607b54b4c66d6c83e373310a6443cf2c0876)]

#### :hammer_and_wrench: Others

- test: [JENKINS] Use java17 for sonarqube scanner [valentinab25 - [`a4dfc38`](https://github.com/eea/volto-pdf-block/commit/a4dfc380db111e8f94b787b655f204a41885e031)]
- test: [JENKINS] Run cypress in started frontend container [valentinab25 - [`15febf3`](https://github.com/eea/volto-pdf-block/commit/15febf38aef6e263eb9b0d5e9c699610d4c71bb7)]
- test: [JENKINS] Add cpu limit on cypress docker [valentinab25 - [`f70f087`](https://github.com/eea/volto-pdf-block/commit/f70f087e4dc887bf10b9d6fbbd4702701871458b)]
- test: [JENKINS] Increase shm-size to cypress docker [valentinab25 - [`1ea2bab`](https://github.com/eea/volto-pdf-block/commit/1ea2bab7589007e0ff9e7af7116343792fc408b6)]
- test: [JENKINS] Improve cypress time [valentinab25 - [`3b44afa`](https://github.com/eea/volto-pdf-block/commit/3b44afa44d2a9a2ebf84aeb8503c90ac1d200a73)]
- test: EN locales, pre-commit fix, feature PRs checks Refs #257193 [valentinab25 - [`a65881d`](https://github.com/eea/volto-pdf-block/commit/a65881d55f87309c49c16dcd72ceb3fd1c6bbc4c)]
- test: Update Makefile and docker-compose to align it with Jenkinsfile [valentinab25 - [`dea19a7`](https://github.com/eea/volto-pdf-block/commit/dea19a7f416b0cb36474efd75786c8496e0814a9)]
- Add Sonarqube tag using climate-energy-frontend addons list [EEA Jenkins - [`fade7ff`](https://github.com/eea/volto-pdf-block/commit/fade7ff4c5548773a61f23f816c8864d874a44e0)]
- test: jest should look for addons in node_modules Refs #253277 [valentinab25 - [`f2b1901`](https://github.com/eea/volto-pdf-block/commit/f2b19014229c52cb98d9e02271ccdf394249ceef)]
- test: Fix test config, coverage Refs #253277 [valentinab25 - [`4ea798f`](https://github.com/eea/volto-pdf-block/commit/4ea798f2a077ef6de1c79dc1520435e191c520c4)]
### [1.0.11](https://github.com/eea/volto-pdf-block/compare/1.0.10...1.0.11) - 9 January 2023

#### :rocket: New Features

- feat: scroll page preview when next or prev button is pressed [tedw87 - [`11ea17b`](https://github.com/eea/volto-pdf-block/commit/11ea17ba8a9f4d832a786b1c44711206ca860448)]
- feat: add pages preview sidebar [tedw87 - [`0654c89`](https://github.com/eea/volto-pdf-block/commit/0654c8954e3b39eb187a9bc2294d0d4a203b0b22)]

#### :hammer_and_wrench: Others

- update readme [Miu Razvan - [`a6bdbd7`](https://github.com/eea/volto-pdf-block/commit/a6bdbd75fc9954e77a527bd2c7b62e43e2dcecca)]
- update Jenkins [Miu Razvan - [`1574595`](https://github.com/eea/volto-pdf-block/commit/1574595eaddb083f9175d4a553f41c6004660f54)]
- changed files accordingly with latest volto version [tedw87 - [`3a8d78f`](https://github.com/eea/volto-pdf-block/commit/3a8d78ff300ff6e47205e4c00fd03d097ca35325)]
- Update jest-addon.config.js [Claudia Ifrim - [`90ed779`](https://github.com/eea/volto-pdf-block/commit/90ed7799e173fa5c2fa7f39764fc33688d700c9e)]
- Update .gitignore [Claudia Ifrim - [`7e93ddf`](https://github.com/eea/volto-pdf-block/commit/7e93ddf1072752f1084ad4cf2c91416c1b3c4d67)]
- Update .coverage.babel.config.js [Claudia Ifrim - [`d297d18`](https://github.com/eea/volto-pdf-block/commit/d297d18a43847b2b23fbb11e109c6dbd7dbe1c49)]
- for lower resolution pages preview is not displayed [tedw87 - [`718499a`](https://github.com/eea/volto-pdf-block/commit/718499a6fc90c5c32503bd4571fcde7a7fba11ab)]
- remove uneeded css file [Miu Razvan - [`5c49d0f`](https://github.com/eea/volto-pdf-block/commit/5c49d0f0dade5593dc4d2e9c7c3e65b3b48e244d)]
- Stylelint fix [Miu Razvan - [`6ca9101`](https://github.com/eea/volto-pdf-block/commit/6ca9101766087a00804fb1e3daced76438743450)]
- fixed the scroll feature for pages preview [tedw87 - [`6827b02`](https://github.com/eea/volto-pdf-block/commit/6827b020fbfcb2b56063afa0a12c82ae17fb852f)]
- cleanup [Miu Razvan - [`3de42e0`](https://github.com/eea/volto-pdf-block/commit/3de42e0d0bd0cb34031ae50dc6a1e41e13eaba9e)]
- removed scroll function to switch pages for the main pdf view [tedw87 - [`8f2dfe3`](https://github.com/eea/volto-pdf-block/commit/8f2dfe38645ef793f3fe0d17a7cf71fce989daa7)]
### [1.0.10](https://github.com/eea/volto-pdf-block/compare/1.0.9...1.0.10) - 23 March 2022

#### :hammer_and_wrench: Others

- More configuration for pdf block, modernize block internals [Tiberiu Ichim - [`c537b4d`](https://github.com/eea/volto-pdf-block/commit/c537b4d4d214ae4f021d1a52220043dc862cd561)]
- No need to show bottom navbar if single page [Tiberiu Ichim - [`ceb1a87`](https://github.com/eea/volto-pdf-block/commit/ceb1a871b9f0784770860639b2f80c81e56e170d)]
- Adjust size of download button [Tiberiu Ichim - [`d6b7f51`](https://github.com/eea/volto-pdf-block/commit/d6b7f51436f9746c2014a9e8267f53ef4ad3c519)]
- Add download configuration [Tiberiu Ichim - [`dae42ed`](https://github.com/eea/volto-pdf-block/commit/dae42ed9ec7aa6217f4066696df318efb2c1856e)]
- Add fork of react-pdf to allow fit to width configuration [Tiberiu Ichim - [`15bd70b`](https://github.com/eea/volto-pdf-block/commit/15bd70b6bfc51fa5ac8331be5358201768b41784)]
- Fix pdf download for anons [Tiberiu Ichim - [`e8eab4b`](https://github.com/eea/volto-pdf-block/commit/e8eab4b77eb7f36df7b778325b7e4a51c05a103d)]
- More customization possibilities [Tiberiu Ichim - [`473a6a6`](https://github.com/eea/volto-pdf-block/commit/473a6a679046f7bec1aad1a6645a67ea935f8d3a)]
- Add hide toolbar option [Tiberiu Ichim - [`f75bd29`](https://github.com/eea/volto-pdf-block/commit/f75bd296dd0438008a62d1302325ed24746e0c27)]
- Bring back secondary actions [Tiberiu Ichim - [`7aa7508`](https://github.com/eea/volto-pdf-block/commit/7aa7508675786f2ec0331543c55600d932546e3b)]
- Remove secondary actions; reuse block view in edit [Tiberiu Ichim - [`58cc65b`](https://github.com/eea/volto-pdf-block/commit/58cc65b08db27ac82e20125c45bb8b79206c231c)]
- Change BlockEdit to functional component [Tiberiu Ichim - [`00488a2`](https://github.com/eea/volto-pdf-block/commit/00488a252bac18fe39ca7814642cafa7e0edbe64)]
- Cleanup [Tiberiu Ichim - [`5f0db85`](https://github.com/eea/volto-pdf-block/commit/5f0db852d9c8c6ac155eaa0c0f2aaea352de24d6)]
- Refactor some components [Tiberiu Ichim - [`ea2e465`](https://github.com/eea/volto-pdf-block/commit/ea2e465401bfe9b040c077bcb8415cfc904f3875)]
### [1.0.9](https://github.com/eea/volto-pdf-block/compare/1.0.8...1.0.9) - 21 March 2022

#### :hammer_and_wrench: Others

- No need for unlockContent [Tiberiu Ichim - [`e6e394e`](https://github.com/eea/volto-pdf-block/commit/e6e394e05000b320d7ce1475140806b43c2dab22)]
- Don't upload two files when picking files with file picker input [Tiberiu Ichim - [`7746d3e`](https://github.com/eea/volto-pdf-block/commit/7746d3e6dc91fff9001b8dc2279049cd78459477)]
- Allow proper selection of pdf file [Tiberiu Ichim - [`500bc8e`](https://github.com/eea/volto-pdf-block/commit/500bc8e4b1f4ef81143886c279ba2409d399a60a)]
### [1.0.8](https://github.com/eea/volto-pdf-block/compare/1.0.7...1.0.8) - 21 January 2022

#### :hammer_and_wrench: Others

- remove borders around toolbar-btns [nileshgulia1 - [`10fb8a0`](https://github.com/eea/volto-pdf-block/commit/10fb8a010e78f2f1d92a7446d1d585f0e6d18021)]
### [1.0.7](https://github.com/eea/volto-pdf-block/compare/1.0.6...1.0.7) - 14 December 2021

#### :hammer_and_wrench: Others

- Typo [Miu Razvan - [`8f17ec8`](https://github.com/eea/volto-pdf-block/commit/8f17ec861f1ee72433ee6d76f5a870832db69cba)]
- Refs #142010 - Optimize Volto-addons gitflow pipelines [valentinab25 - [`fb26947`](https://github.com/eea/volto-pdf-block/commit/fb26947b662e097b642bf68c73651c0ab0be544e)]
### [1.0.6](https://github.com/eea/volto-pdf-block/compare/1.0.5...1.0.6) - 4 November 2021

#### :hammer_and_wrench: Others

- Add Sonarqube tag using frontend addons list [EEA Jenkins - [`5a2adfc`](https://github.com/eea/volto-pdf-block/commit/5a2adfc5bdfda9191f46a37862b11e0daa8c53cb)]
### [1.0.5](https://github.com/eea/volto-pdf-block/compare/1.0.4...1.0.5) - 27 May 2021

#### :hammer_and_wrench: Others

- Fix comma [valentinab25 - [`9975b38`](https://github.com/eea/volto-pdf-block/commit/9975b3849012fb9653f6a22a5a3d53c223d858bd)]
- Cypress coverage [valentinab25 - [`b89d8f0`](https://github.com/eea/volto-pdf-block/commit/b89d8f0ce0e480246bb31dde66f99ea1b776d914)]
### [1.0.4](https://github.com/eea/volto-pdf-block/compare/1.0.3...1.0.4) - 26 May 2021

#### :hammer_and_wrench: Others

- message not to enter @'s included urls [nileshgulia1 - [`f6acbe8`](https://github.com/eea/volto-pdf-block/commit/f6acbe80de36ccbd7f2809aad74264b935fb726a)]
### [1.0.3](https://github.com/eea/volto-pdf-block/compare/1.0.2...1.0.3) - 19 May 2021

### [1.0.2](https://github.com/eea/volto-pdf-block/compare/1.0.1...1.0.2) - 6 May 2021

#### :hammer_and_wrench: Others

- load only on client [nileshgulia1 - [`26f5f33`](https://github.com/eea/volto-pdf-block/commit/26f5f33b04d0e5c6fe36ea236a485fc3e027ae31)]
### [1.0.1](https://github.com/eea/volto-pdf-block/compare/1.0.0...1.0.1) - 6 May 2021

### 1.0.0 - 5 May 2021

#### :hammer_and_wrench: Others

- cosmetics [Alexandru Ghica - [`421f6a8`](https://github.com/eea/volto-pdf-block/commit/421f6a8870b989c21e42c05cad43e1d557991b50)]
- Update README.md [Nilesh - [`b228ee3`](https://github.com/eea/volto-pdf-block/commit/b228ee370a327e3b9ee42bd17eae73522b95576e)]
- add helper corsproxy,lint,prettier [nileshgulia1 - [`8d92841`](https://github.com/eea/volto-pdf-block/commit/8d92841b6f236866b7be8e765b318145002b0ed0)]
- volto-pdf-block [nileshgulia1 - [`7956483`](https://github.com/eea/volto-pdf-block/commit/79564831a09561ef86d039991d24203cc3806b5d)]
- Initial commit [Nilesh - [`bfe4ddc`](https://github.com/eea/volto-pdf-block/commit/bfe4ddcefec32aec26664c96ff625942c91284ca)]
