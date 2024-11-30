import { url2qr } from '#gulp-uri-qrcode';
import GulpClient from 'gulp';

function task1() {
  return GulpClient.src('fixtures/*.url')
    .pipe(url2qr())
    .pipe(GulpClient.dest('output'));
};
task1.description = 'Test gulp task for creating PNG QR codes';
GulpClient.task(task1);
