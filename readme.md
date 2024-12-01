# gulp-uri-qrcode

[![GitHub release](https://img.shields.io/github/v/release/IT-Service-NPM/gulp-uri-qrcode.svg?sort=semver\&logo=github)](https://github.com/IT-Service-NPM/gulp-uri-qrcode/releases)
[![NPM release](https://img.shields.io/npm/v/gulp-uri-qrcode.svg?logo=npm)](https://www.npmjs.com/package/gulp-uri-qrcode)

[![CI Status](https://github.com/IT-Service-NPM/gulp-uri-qrcode/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/IT-Service-NPM/gulp-uri-qrcode/actions/workflows/ci.yml)
[![Tests Results](https://gist.githubusercontent.com/sergey-s-betke/d70e4de09a490afc9fb7a737363b231a/raw/gulp-uri-qrcode-tests.svg)](https://github.com/IT-Service-NPM/gulp-uri-qrcode/actions/workflows/ci.yml)
[![Coverage](https://gist.githubusercontent.com/sergey-s-betke/d70e4de09a490afc9fb7a737363b231a/raw/gulp-uri-qrcode-coverage.svg)](https://github.com/IT-Service-NPM/gulp-uri-qrcode/actions/workflows/ci.yml)

[![Semantic Versioning](https://img.shields.io/badge/Semantic%20Versioning-v2.0.0-green.svg?logo=semver)](https://semver.org/lang/ru/spec/v2.0.0.html)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-v1.0.0-yellow.svg?logo=git)](https://conventionalcommits.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

[![VS Code](https://img.shields.io/badge/Visual_Studio_Code-0078D4?logo=visual%20studio%20code)](https://code.visualstudio.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-333333.svg?logo=typescript)](http://www.typescriptlang.org/)
[![EditorConfig](https://img.shields.io/badge/EditorConfig-333333.svg?logo=editorconfig)](https://editorconfig.org)
[![ESLint](https://img.shields.io/badge/ESLint-3A33D1?logo=eslint)](https://eslint.org)

This Gulp plugin build QRCode from URL in source .url files.

.url files — INI files. For example:

```ini
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,2
[InternetShortcut]
URL=https://github.com/IT-Service-NPM/gulp-URI-QRCode
```

## Contents

* [Install](#install)
* [Examples](#examples)
  * [Create PNG QRCode from .url files with default settings](#create-png-qrcode-from-url-files-with-defaultsettings)
  * [Create QRCode in streaming mode with scale](#create-qrcode-in-streaming-mode-withscale)
* [API](#api)
* [License](#license)

## Install

```sh
npm install --save-dev gulp-uri-qrcode
```

## Examples

### Create PNG QRCode from .url files with default settings

`url2qr` can create PNG QRCodes from .url files:

```typescript file=test/examples/01/gulpfile.ts
import { url2qr } from '#gulp-uri-qrcode';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.url')
    .pipe(url2qr())
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for creating PNG QR codes';
GulpClient.task(task1);
```

QRCode:

[![QRCode](./test/examples/01/output/test-file.png)](./test/examples/01/output/test-file.png)

### Create QRCode in streaming mode with scale

Read .url files in streaming mode
and create PNG QRCodes with `scale = 10`:

```typescript file=test/examples/02/gulpfile.ts
import { url2qr } from '#gulp-uri-qrcode';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.url', { buffer: false })
    .pipe(url2qr({ qrOptions: { scale: 10 } }))
    .pipe(GulpClient.dest('output', { encoding: false }));
};
task1.description = 'Test gulp task for creating PNG QR codes';
GulpClient.task(task1);
```

QRCode:

[![QRCode](./test/examples/02/output/test-file.png)](./test/examples/02/output/test-file.png)

## API

Please, read the [API reference](/docs/index.md).

## License

[MIT](LICENSE) © [Sergei S. Betke](https://github.com/sergey-s-betke)
