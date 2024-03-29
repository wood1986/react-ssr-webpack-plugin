# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.2.1](https://github.com/wood1986/react-ssr-webpack-plugin/compare/v2.2.0...v2.2.1) (2022-01-30)


### Bug Fixes

* add css modules example ([#23](https://github.com/wood1986/react-ssr-webpack-plugin/issues/23)) ([5b10fcf](https://github.com/wood1986/react-ssr-webpack-plugin/commit/5b10fcfabf0cc13b6bd7121bf94563b21c3f91c6))
* fix stylelint-webpack-plugin error ([#25](https://github.com/wood1986/react-ssr-webpack-plugin/issues/25)) ([8009978](https://github.com/wood1986/react-ssr-webpack-plugin/commit/8009978e6a16639b8f5ff1d6ef9fa6e447ae1dd0))
* remove ReactSSRResponse ([#19](https://github.com/wood1986/react-ssr-webpack-plugin/issues/19)) ([7e918f1](https://github.com/wood1986/react-ssr-webpack-plugin/commit/7e918f1e5bcdd87ab55acd3a1de43af22ec4d41d))
* update `<Code />` and fix null querystring in app/2.0 ([#21](https://github.com/wood1986/react-ssr-webpack-plugin/issues/21)) ([ee27251](https://github.com/wood1986/react-ssr-webpack-plugin/commit/ee2725117b541c8819b740d0b1ff9c218e8985f1))
* update release.yml ([#26](https://github.com/wood1986/react-ssr-webpack-plugin/issues/26)) ([6c792b8](https://github.com/wood1986/react-ssr-webpack-plugin/commit/6c792b8b8f23b10538c7c9dfbc3c83aabfebf1b8))

## [2.2.0](https://github.com/wood1986/react-ssr-webpack-plugin/compare/v2.1.0...v2.2.0) (2021-12-27)


### Features

* support setupMiddlewares ([#18](https://github.com/wood1986/react-ssr-webpack-plugin/issues/18)) ([8ce9dc5](https://github.com/wood1986/react-ssr-webpack-plugin/commit/8ce9dc58fa7aadc1582fee753cc5a19de1bb2e75))


### Bug Fixes

* fix ReactSSRMiddleware not to register the route ([#16](https://github.com/wood1986/react-ssr-webpack-plugin/issues/16)) ([bb2b95e](https://github.com/wood1986/react-ssr-webpack-plugin/commit/bb2b95ef186f2a574526a6da936c4967de22210f))
* fix the depth in the release workflow for generating all commit logs and correct CHANGELOG.md ([#15](https://github.com/wood1986/react-ssr-webpack-plugin/issues/15)) ([1d4e491](https://github.com/wood1986/react-ssr-webpack-plugin/commit/1d4e491faad47aa1369b6a0b7fc661fed8f87e36))

## [2.1.0](https://github.com/wood1986/react-ssr-webpack-plugin/compare/v2.0.0...v2.1.0) (2021-12-26)


### Features

* add a boolean config var for applying NodeTargetPlugin ([#14](https://github.com/wood1986/react-ssr-webpack-plugin/issues/14)) ([08fcfab](https://github.com/wood1986/react-ssr-webpack-plugin/commit/08fcfab55ba3ff3c38d6d884bca4685891a52612))
* move fetch out of app and add patchGlobal option ([#13](https://github.com/wood1986/react-ssr-webpack-plugin/issues/13)) ([3d15daf](https://github.com/wood1986/react-ssr-webpack-plugin/commit/3d15daf869320fea4c3ecb13a63492bec970b985))
* support customizing the response and replace react-router with path-to-regexp ([#8](https://github.com/wood1986/react-ssr-webpack-plugin/issues/8)) ([1da34d0](https://github.com/wood1986/react-ssr-webpack-plugin/commit/1da34d09e3107319222da8fe72622c80b7fa5d4d))


### Bug Fixes

* remove path and add version invalidation ([#12](https://github.com/wood1986/react-ssr-webpack-plugin/issues/12)) ([f6ef600](https://github.com/wood1986/react-ssr-webpack-plugin/commit/f6ef600a156d2f0d61785166109d6ed7e32fc990))
* remove unnecessary plugins and show child compilation error ([#9](https://github.com/wood1986/react-ssr-webpack-plugin/issues/9)) ([44fc498](https://github.com/wood1986/react-ssr-webpack-plugin/commit/44fc498a3fd38810bb7533012709fb469de7d3b2))
* replace ReactSSRCommonMiddleware with ReactSSREntry ([#10](https://github.com/wood1986/react-ssr-webpack-plugin/issues/10)) ([134b0fa](https://github.com/wood1986/react-ssr-webpack-plugin/commit/134b0fab9c623acb9304c59f84bc70b7fa1dbf18))
* update examples/app to support cloudflare worker ([#11](https://github.com/wood1986/react-ssr-webpack-plugin/issues/11)) ([004a7a8](https://github.com/wood1986/react-ssr-webpack-plugin/commit/004a7a80f01a0c5341e94385111650581f28a944))

## [2.0.0](https://github.com/wood1986/react-ssr-webpack-plugin/compare/v1.0.1...v2.0.0) (2021-12-06)


### ⚠ BREAKING CHANGES

* add react-route support with http status code and example (#6)

### Features

* add react-route support with http status code and example ([#6](https://github.com/wood1986/react-ssr-webpack-plugin/issues/6)) ([72baf1b](https://github.com/wood1986/react-ssr-webpack-plugin/commit/72baf1bf99a2eef9e2081e0a5bd38ce33dc327bb))


### Bug Fixes

* fix commitlint workflow ([#4](https://github.com/wood1986/react-ssr-webpack-plugin/issues/4)) ([a860a9c](https://github.com/wood1986/react-ssr-webpack-plugin/commit/a860a9c31b0a3560096117550c99bc4426f66bfb))

### [1.0.1](https://github.com/wood1986/react-ssr-webpack-plugin/compare/v1.0.0...v1.0.1) (2021-11-12)


### Bug Fixes

* fix postinstall issue ([#2](https://github.com/wood1986/react-ssr-webpack-plugin/issues/2)) ([4d655e6](https://github.com/wood1986/react-ssr-webpack-plugin/commit/4d655e63dd6c52d342a5008c3f1682440a17578e))
* update pull_request branches for the workflows ([#1](https://github.com/wood1986/react-ssr-webpack-plugin/issues/1)) ([297e91f](https://github.com/wood1986/react-ssr-webpack-plugin/commit/297e91fcbb862e042d7cb4a045ae0cfc8ba39c6c))

## 1.0.0 (2021-11-12)


### Features

* initial commit ([6984925](https://github.com/wood1986/react-ssr-webpack-plugin/commit/6984925b5c52d30755211e44ac2d74145dd163bb))
