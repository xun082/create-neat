import resolveApp from "./getPaths";
import getHttpsConfig from "./getHttpsConfig";
const host = process.env.HOST || "0.0.0.0";
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;
const devServerConfig = {
    host,
    hot: true,
    compress: true,
    historyApiFallback: true,
    client: {
        webSocketURL: {
            hostname: sockHost,
            pathname: sockPath,
            port: sockPort,
        },
        logging: "info",
        overlay: {
            errors: true,
            warnings: false,
        },
    },
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    },
    https: getHttpsConfig(),
    static: {
        watch: {
            ignored: resolveApp("src"),
        },
    },
};
export default devServerConfig;
