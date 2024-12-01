/**
 * A Gulp plugin for creating PNG QRCodes with URI
 * from source .url files.
 *
 * .url files - INI files. For example:
 *
 * ```ini
 * [{000214A0-0000-0000-C000-000000000046}]
 * Prop3=19,2
 * [InternetShortcut]
 * URL=https://github.com/IT-Service-NPM/gulp-URI-QRCode
 * ```
 *
 * @packageDocumentation
 */

import { Transform, PassThrough } from 'node:stream';
import type { TransformCallback } from 'node:stream';
import PluginError from 'plugin-error';
import GulpFile from 'vinyl';
import gulplog from 'gulplog';
import { parseIniFromString } from 'cool-ini-parser';
import * as QRCode from 'qrcode';

const PLUGIN_NAME = 'gulp-uri-qrcode';

/**
 * gulp-uri-qrcode plugin options
 *
 * @remarks
 *
 * @see {@link url2qr} for more details.
 *
 * @public
 */
export interface Options {

  /**
   * Options for generated PNG QR codes
   *
   * @see
   * {@link https://www.npmjs.com/package/qrcode| `qrcode`}
   * for more details.
   *
   * @public
   */
  qrOptions?: QRCode.QRCodeRenderersOptions;

};

/**
 * Gulp plugin stream for transformation .url files to PNG QR codes
 * @public @internal
 */
export class QRCodesFromURICreatorStream extends Transform {

  /**
   * @internal
   */
  protected readonly options: Required<Options>;

  /**
   * @internal
   */
  constructor(options?: Options) {
    super({ objectMode: true });
    const optionsDefaults: Required<Options> = {
      qrOptions: {
        scale: 1
      }
    };
    this.options = { ...optionsDefaults, ...options };
  };

  /**
   * @internal
   */
  protected getURIFromURLFile(content: string, file: GulpFile): URL {
    try {
      const iniData = parseIniFromString(content);
      const InternetShortcutSection = iniData.sections.find(
        section => section.name === 'InternetShortcut'
      );
      const URLstring = InternetShortcutSection?.entries.find(
        entry => entry.key === 'URL'
      );
      if (URLstring === undefined) {
        throw new PluginError(PLUGIN_NAME,
          `file "${file.path}" doesn't contains InternetShortcut/URL`
        );
      };
      const url = new URL(URLstring.value);
      return url;
    } catch {
      const error = new PluginError(PLUGIN_NAME,
        `Error ini file "${file.path}" content parsing`
      );
      this.emit('error', error);
      throw error;
    };
  };

  /**
   * @internal
   */
  protected getURIFromBuffer(buffer: Buffer, file: GulpFile): URL {
    const content: string = buffer.toString('utf8');
    const urlForQRCode = this.getURIFromURLFile(content, file);
    gulplog.debug(`URL: ${urlForQRCode.toString()}`);
    return urlForQRCode;
  };

  /**
   * @internal
   */
  override _transform(
    file: GulpFile,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (file.isNull()) {
      callback(null, file);
      return;
    };
    file.extname = '.png';
    try {
      if (file.isStream()) {
        const chunks: Buffer[] = [];
        file.contents
          .on('data', (chunk: string) => chunks.push(Buffer.from(chunk)))
          .on('end', () => {
            const fileContents = Buffer.concat(chunks);
            const urlForQRCode = this.getURIFromBuffer(fileContents, file);

            const PNGStream = new PassThrough;
            file.contents = PNGStream;
            QRCode.toFileStream(
              PNGStream,
              urlForQRCode.toString(),
              this.options.qrOptions,
              (err?: Error | null): void => {
                return;
              }
            );
            callback(null, file);
          });
      } else if (file.isBuffer()) {
        const urlForQRCode = this.getURIFromBuffer(file.contents, file);
        QRCode.toBuffer(
          urlForQRCode.toString(),
          this.options.qrOptions,
          (error: Error | null | undefined, buffer: Buffer): void => {
            file.contents = buffer;
            callback(error, file);
          }
        );
      };
    } catch (error) {
      callback(
        error instanceof PluginError ? error as PluginError :
          error instanceof Error ? new PluginError(PLUGIN_NAME, error) :
            new PluginError(PLUGIN_NAME, error as string)
      );
    };
  };

}

/**
 * Plugin fabric function.
 *
 * Returns Gulp plugin stream for transformation
 * .url files to PNG QR codes.
 *
 * .url files - INI files. For example:
 *
 * ```ini
 * [{000214A0-0000-0000-C000-000000000046}]
 * Prop3=19,2
 * [InternetShortcut]
 * URL=https://github.com/IT-Service-NPM/gulp-URI-QRCode
 * ```
 *
 * @param options - {@link Options} for QRCode generator
 *
 * @public
 */
export function url2qr(options?: Options): QRCodesFromURICreatorStream {
  return new QRCodesFromURICreatorStream(options);
};
