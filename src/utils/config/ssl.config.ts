import type { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const httpsOptions: HttpsOptions = {
  key: readFileSync(join(process.cwd(), 'secret', 'private-key.pem')),
  cert: readFileSync(join(process.cwd(), 'secret', 'public-certificate.pem')),
};

export default httpsOptions;
