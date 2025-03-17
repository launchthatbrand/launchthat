// packages/payload-cms/src/payload.config.ts
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";

import { createBaseConfig } from "./config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig(
  createBaseConfig({
    dirname,
    typescript: {
      outputFile: path.resolve(dirname, "payload-types.ts"),
    },
  }),
);
