export const getDatabaseUrl = (deviceId: string) => {
  return `file:./${deviceId}.db`;
};
