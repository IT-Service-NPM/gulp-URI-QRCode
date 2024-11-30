import { describe, expect, it, beforeEach } from 'vitest';
import { promisify } from 'node:util';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { readIniFile } from 'read-ini-file';
/* eslint-disable-next-line
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-require-imports
*/
const QrCode = require('qrcode-reader');
import { Jimp } from 'jimp';
import GulpClient from 'gulp';
import './gulpfile.ts';

const testSrcFilesPath: string = path.join(__dirname, 'fixtures');
const testDestFilesPath: string = path.join(__dirname, 'output');

describe('url2qr', () => {

  beforeEach(() => {
    fs.rmSync(testDestFilesPath, { force: true, recursive: true });
  });

  it('must generate PNG QR code from .url files', async () => {

    const _cwd = process.cwd();
    try {
      process.chdir(__dirname);
      /* eslint-disable-next-line @typescript-eslint/no-misused-promises */
      await promisify(GulpClient.series('task1'))();
    } finally {
      process.chdir(_cwd);
    };

    expect(
      fs.existsSync(testDestFilesPath),
      'Output directory must be exists'
    ).toBeTruthy();

    const urlFilePath = path.join(testSrcFilesPath, 'test-file.url');
    const urlFileData = await readIniFile(urlFilePath) as {
      InternetShortcut?: {
        URL?: string
      }
    };
    const urlFromQR = urlFileData.InternetShortcut?.URL;

    const QRCodePath = path.join(testDestFilesPath, 'test-file.png');
    const QRCodeBuffer = fs.readFileSync(QRCodePath);
    const QRCodeImage = await Jimp.read(QRCodeBuffer);
    const QRCodeData = await new Promise<string>((resolve, reject) => {
      /* eslint-disable-next-line
          @typescript-eslint/no-unsafe-assignment,
          @typescript-eslint/no-unsafe-call
      */
      const qr = new QrCode();
      /* eslint-disable-next-line
          @typescript-eslint/no-unsafe-member-access,
          @typescript-eslint/no-explicit-any
      */
      qr.callback = function (error: Error | null, value: any) {
        if (error) {
          reject(error);
        } else {
          /* eslint-disable-next-line
              @typescript-eslint/no-unsafe-member-access
          */
          resolve(value.result as string);
        };
      };
      /* eslint-disable-next-line
          @typescript-eslint/no-unsafe-member-access,
          @typescript-eslint/no-unsafe-call
      */
      qr.decode(QRCodeImage.bitmap);
    });

    expect(QRCodeData).to.be
      .equals(urlFromQR);

  });

});
