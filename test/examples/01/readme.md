### Create PNG QRCode from .url files with default settings

`url2qr` can create PNG QRCodes from .url files:

```typescript file=./gulpfile.ts
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

[![QRCode](./output/test-file.png)](./output/test-file.png)
