### Create QRCode in streaming mode with scale

Read .url files in streaming mode
and create PNG QRCodes with `scale = 10`:

```typescript file=./gulpfile.ts
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

[![QRCode](./output/test-file.png)](./output/test-file.png)
