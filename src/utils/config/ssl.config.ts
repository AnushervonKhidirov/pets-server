import type { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function getHttpsOptions(
  path: string,
  files: { privateKey: string; publicCert: string },
): HttpsOptions | undefined {
  if (
    existsSync(join(path, files.privateKey)) &&
    existsSync(join(path, files.publicCert))
  ) {
    return {
      key: readFileSync(join(path, files.privateKey)),
      cert: readFileSync(join(path, files.publicCert)),
    };
  }
}

const httpsOptions = getHttpsOptions(join(process.cwd(), 'secret'), {
  privateKey: 'private-key.pem',
  publicCert: 'public-certificate.pem',
});

export default httpsOptions;
