# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.13.0](https://github.com/nandorojo/moti/compare/v0.12.3...v0.13.0) (2021-09-02)


### Bug Fixes

* typeof null === object fix for sequences ([80f7092](https://github.com/nandorojo/moti/commit/80f70928e92d36918247804e9a0189c34cf07eb5))


### Features

* transform support, with sequences ([665bdf6](https://github.com/nandorojo/moti/commit/665bdf6df362d05b5bff2bd1ec12b36a69d84118))





## [0.12.3](https://github.com/nandorojo/moti/compare/v0.12.2...v0.12.3) (2021-09-01)


### Bug Fixes

* exit over-memoized on native ([2f717df](https://github.com/nandorojo/moti/commit/2f717df0dd7d986b6a13c2c8209e17b6e782160d))


### Reverts

* removing useValue hack, as order is not preserved. only solution is transform array ([42dd3c9](https://github.com/nandorojo/moti/commit/42dd3c969c61a52efc6a13d2b3c28d3d86bea153))
* removing useValue hack, as order is not preserved. only solution is transform array ([034c8dc](https://github.com/nandorojo/moti/commit/034c8dc5d03d65e335258c8cef3a534cb99ea4ae))





## [0.12.2](https://github.com/nandorojo/moti/compare/v0.12.1...v0.12.2) (2021-09-01)


### Bug Fixes

* closes [#104](https://github.com/nandorojo/moti/issues/104), where exit completion never fired ([da4eafa](https://github.com/nandorojo/moti/commit/da4eafa66476c7d32a1fc5f0a1c925c3a8bc3786))





## [0.12.1](https://github.com/nandorojo/moti/compare/v0.12.0...v0.12.1) (2021-09-01)


### Bug Fixes

* closes [#103](https://github.com/nandorojo/moti/issues/103), which broke web ([c917b73](https://github.com/nandorojo/moti/commit/c917b733f2efcce0a37c64bf2b385975eed56c8d))





# [0.12.0](https://github.com/nandorojo/moti/compare/v0.11.0...v0.12.0) (2021-09-01)


### Bug Fixes

* transform errors from [#85](https://github.com/nandorojo/moti/issues/85), [#83](https://github.com/nandorojo/moti/issues/83), [#76](https://github.com/nandorojo/moti/issues/76), [#65](https://github.com/nandorojo/moti/issues/65) ([fef3ad0](https://github.com/nandorojo/moti/commit/fef3ad0e593b56ef4477ccdc8488625fd331a282))


### Features

* add custom & initial props to animate-presence ([7fafc30](https://github.com/nandorojo/moti/commit/7fafc3065b51f210ffa934eb41dfd656e27c08bb))
* progress bar, transform does not work? ([9823cd1](https://github.com/nandorojo/moti/commit/9823cd1a22dfd98fdf7fb776ec3e1cb7593ff7b0))





# [0.11.0](https://github.com/nandorojo/moti/compare/v0.10.1...v0.11.0) (2021-05-17)


### Features

* add onDidAnimate callback 4th arg w/ attemptedValue; docs ([66dfa76](https://github.com/nandorojo/moti/commit/66dfa766fccf6b35606d61b9e262a2d90b35dde7))





## [0.10.1](https://github.com/nandorojo/moti/compare/v0.10.0...v0.10.1) (2021-04-27)

**Note:** Version bump only for package moti





# [0.10.0](https://github.com/nandorojo/moti/compare/v0.9.0...v0.10.0) (2021-04-21)


### Features

* add `exitTransition` support & docs! ([26a55ac](https://github.com/nandorojo/moti/commit/26a55acbfc66e29db9eee24fe1adeec923226acd))





# [0.9.0](https://github.com/nandorojo/moti/compare/v0.8.2...v0.9.0) (2021-04-21)


### Features

* upgrade reanimated, add custom sequence transitions! ([8e64014](https://github.com/nandorojo/moti/commit/8e640149b187c4e253746c2d80d1a5c2b2749d55))





## [0.8.2](https://github.com/nandorojo/moti/compare/v0.8.1...v0.8.2) (2021-04-02)


### Bug Fixes

* [#48](https://github.com/nandorojo/moti/issues/48) Solve broken Skeleton, AnimatePresence ([080b7c9](https://github.com/nandorojo/moti/commit/080b7c9427e293d6b3201fd0b8bb16ecf6dd3370))





## [0.8.1](https://github.com/nandorojo/moti/compare/v0.8.0...v0.8.1) (2021-04-01)

**Note:** Version bump only for package moti





# [0.8.0](https://github.com/nandorojo/moti/compare/v0.7.7...v0.8.0) (2021-04-01)


### Features

* turn useDynamicAnimation().animateTo into a worklet` ([ebd2830](https://github.com/nandorojo/moti/commit/ebd2830c757427474c48c4cf0a5faf862c59c4c4))





## [0.7.7](https://github.com/nandorojo/moti/compare/v0.7.6...v0.7.7) (2021-04-01)


### Bug Fixes

* initial bounce from spring ([9783548](https://github.com/nandorojo/moti/commit/97835481a63f4789bf3bab1cbd8313e2362b0ecf))
* v2 stable spring support ([b9fad59](https://github.com/nandorojo/moti/commit/b9fad5970fb7427aaca7d8fdd9aa9bc895c84bb5))





## [0.7.6](https://github.com/nandorojo/moti/compare/v0.7.5...v0.7.6) (2021-04-01)


### Bug Fixes

* un-workletize ([0c34a71](https://github.com/nandorojo/moti/commit/0c34a715242e5f474e65f26e74a1c4e303858bda))





## [0.7.5](https://github.com/nandorojo/moti/compare/v0.7.4...v0.7.5) (2021-04-01)


### Bug Fixes

* workletize hooks ([9eeff15](https://github.com/nandorojo/moti/commit/9eeff15797bae42bbc3e03f05d6d229a1b6b0f14))





## [0.7.4](https://github.com/nandorojo/moti/compare/v0.7.3...v0.7.4) (2021-04-01)


### Bug Fixes

* deprecated react native types message ([6cc94f9](https://github.com/nandorojo/moti/commit/6cc94f9cfeaf57c6215f50265d950ba2ef31afd2))





## [0.7.3](https://github.com/nandorojo/moti/compare/v0.7.2...v0.7.3) (2021-03-30)

**Note:** Version bump only for package moti





## [0.7.2](https://github.com/nandorojo/moti/compare/v0.7.1...v0.7.2) (2021-03-28)


### Bug Fixes

* animate presence callback ([8bde766](https://github.com/nandorojo/moti/commit/8bde766a64d8aebc81c0fa6ecbea5d9e59bab99b))





## [0.7.1](https://github.com/nandorojo/moti/compare/v0.7.0...v0.7.1) (2021-03-23)


### Bug Fixes

* [#38](https://github.com/nandorojo/moti/issues/38) skeleton web bug ([e66b7a6](https://github.com/nandorojo/moti/commit/e66b7a6f1318c337daaaa0783a2c4295f573565c))
* nullable loop, allows false ([f65ae59](https://github.com/nandorojo/moti/commit/f65ae5920f2c9a9bc372ca196ed4f50b7c5d53c0))





# [0.7.0](https://github.com/nandorojo/moti/compare/v0.6.5...v0.7.0) (2021-03-22)


### Features

* performant, dynamic-animation hook ([8f65da7](https://github.com/nandorojo/moti/commit/8f65da78fd913f87e089ddbc3c402fc42e41d9d2))





## [0.6.5](https://github.com/nandorojo/moti/compare/v0.6.4...v0.6.5) (2021-03-19)


### Bug Fixes

* config fixes ([160fd67](https://github.com/nandorojo/moti/commit/160fd677604a8a97980a6878b17a0be92688cdc1))





## [0.6.4](https://github.com/nandorojo/moti/compare/v0.6.3...v0.6.4) (2021-03-13)

**Note:** Version bump only for package moti





## [0.6.3](https://github.com/nandorojo/moti/compare/v0.6.2...v0.6.3) (2021-03-13)

**Note:** Version bump only for package moti





## [0.6.2](https://github.com/nandorojo/moti/compare/v0.6.1...v0.6.2) (2021-03-13)

**Note:** Version bump only for package moti





## [0.6.1](https://github.com/nandorojo/moti/compare/v0.6.0...v0.6.1) (2021-03-13)


### Bug Fixes

* reanimated v2 compat ([b4ef4f2](https://github.com/nandorojo/moti/commit/b4ef4f2d30158c3ef0ef618a01fc1e773d4c2342))





# [0.6.0](https://github.com/nandorojo/moti/compare/v0.5.8...v0.6.0) (2021-03-04)


### Features

* [skeleton] custom transition, fade in ([1f42d28](https://github.com/nandorojo/moti/commit/1f42d28405abaaa7ae59e89b29a7bd486847bb7a))





## [0.5.8](https://github.com/nandorojo/moti/compare/v0.5.7...v0.5.8) (2021-03-04)


### Bug Fixes

* spread -> assign ([8d0f89a](https://github.com/nandorojo/moti/commit/8d0f89a899e0c6e3e2b7285d98831addef48dd6c))





## [0.5.7](https://github.com/nandorojo/moti/compare/v0.5.6...v0.5.7) (2021-03-02)

**Note:** Version bump only for package moti





## [0.5.6](https://github.com/nandorojo/moti/compare/v0.5.5...v0.5.6) (2021-03-02)


### Features

* defaults for skeleton ([f8f5b67](https://github.com/nandorojo/moti/commit/f8f5b6759dd964d4ed30b0c415babef8b0503552))





## [0.5.5](https://github.com/nandorojo/moti/compare/v0.5.4...v0.5.5) (2021-03-02)


### Bug Fixes

* broken types ([320f66f](https://github.com/nandorojo/moti/commit/320f66f1c0861e9ab3f47a06289183745e958d59))
* broken types tsconfig ([01a06e6](https://github.com/nandorojo/moti/commit/01a06e65ca4b98d47588f581c37ecf7350c4976d))
* dev type errors w paths ([0815f29](https://github.com/nandorojo/moti/commit/0815f29c2ce71b39150b0c0b8f7d2a3497b2541b))
* main lib types ([65c1a32](https://github.com/nandorojo/moti/commit/65c1a3298ca374dcaeca22b7783d99ecc4c62d72))





## [0.5.4](https://github.com/nandorojo/moti/compare/v0.5.3...v0.5.4) (2021-03-02)

**Note:** Version bump only for package moti





## [0.5.3](https://github.com/nandorojo/moti/compare/v0.5.2...v0.5.3) (2021-03-02)

**Note:** Version bump only for package moti





## [0.5.2](https://github.com/nandorojo/moti/compare/v0.5.1...v0.5.2) (2021-03-02)

**Note:** Version bump only for package moti





## [0.5.1](https://github.com/nandorojo/moti/compare/v0.5.0...v0.5.1) (2021-03-02)

**Note:** Version bump only for package moti





# [0.5.0](https://github.com/nandorojo/moti/compare/v0.4.1...v0.5.0) (2021-03-02)


### Features

* skeleton ([eba0e5c](https://github.com/nandorojo/moti/commit/eba0e5cf13a4bbf4f0d4e99f2aa073d1e71d6488))
* skeleton basic ([f4d86dc](https://github.com/nandorojo/moti/commit/f4d86dc751fbe142cd8db0229db8a8aa8cf6127e))
* skeleton code ([69c478d](https://github.com/nandorojo/moti/commit/69c478de4eb1204cf3cc639c7326c7d6a3bad42d))
* skeleton color modes ([7205bbc](https://github.com/nandorojo/moti/commit/7205bbc552c18a18cf1358b04caf247e8ddae0d6))
* skeleton props ([7547b69](https://github.com/nandorojo/moti/commit/7547b69683bd9375bc97645598b05fabb9741bed))





## [0.4.1](https://github.com/nandorojo/moti/compare/v0.4.0...v0.4.1) (2021-02-07)

**Note:** Version bump only for package moti





# [0.4.0](https://github.com/nandorojo/moti/compare/v0.3.1...v0.4.0) (2021-02-07)


### Features

* fix potential circular type dep? ([9d8ca81](https://github.com/nandorojo/moti/commit/9d8ca815574467200c6b28bf05cb61d18aa031a8))





## [0.3.1](https://github.com/nandorojo/moti/compare/v0.3.0...v0.3.1) (2021-02-07)

**Note:** Version bump only for package moti





# [0.3.0](https://github.com/nandorojo/moti/compare/v0.2.2...v0.3.0) (2021-02-07)


### Features

* add types for variants, many examples ([99b0675](https://github.com/nandorojo/moti/commit/99b0675f0895b35a018176cccf1506372142ac47))





## [0.2.2](https://github.com/nandorojo/moti/compare/v0.2.0...v0.2.2) (2021-02-06)

**Note:** Version bump only for package moti





# [0.2.0](https://github.com/nandorojo/moti/compare/v0.0.6...v0.2.0) (2021-02-05)


### Features

* next js, unfinished ([6d78cb6](https://github.com/nandorojo/moti/commit/6d78cb6ef8a56736e43f7dcf536f501853d17b09))
* nextjs support ([da3eae4](https://github.com/nandorojo/moti/commit/da3eae4b1593b409b5807baa5279f4482b998412))
