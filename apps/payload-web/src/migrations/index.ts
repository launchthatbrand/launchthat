import * as migration_20250311_052935 from './20250311_052935';

export const migrations = [
  {
    up: migration_20250311_052935.up,
    down: migration_20250311_052935.down,
    name: '20250311_052935'
  },
];
