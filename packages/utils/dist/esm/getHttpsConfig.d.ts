/// <reference types="node" />
declare function getHttpsConfig(): boolean | {
    cert: Buffer;
    key: Buffer;
};
export default getHttpsConfig;
