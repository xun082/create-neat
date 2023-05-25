/// <reference types="node" />
declare const devServerConfig: {
    host: string;
    hot: boolean;
    compress: boolean;
    historyApiFallback: boolean;
    client: {
        webSocketURL: {
            hostname: string;
            pathname: string;
            port: string;
        };
        logging: string;
        overlay: {
            errors: boolean;
            warnings: boolean;
        };
    };
    headers: {
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Methods": string;
        "Access-Control-Allow-Headers": string;
    };
    https: boolean | {
        cert: Buffer;
        key: Buffer;
    };
    static: {
        watch: {
            ignored: string;
        };
    };
};
export default devServerConfig;
