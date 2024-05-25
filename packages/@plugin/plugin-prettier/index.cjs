
const PluginConfig = require('./generator/index.cjs')


const pluginPrettier = (buildTool)=>{


  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);

}


module.exports = {
    pluginPrettier
}