/**
 * entry file for build
 */
import { Demo } from "@pg-kit/components";
import Components from "./components";
import { App } from "vue";
import "./styles/index.scss";

const Installer = {
  install(app: App) {
    Components.forEach((c) => {
      app.use(c);
    });
  },
};

export default Installer;
export { Demo };
