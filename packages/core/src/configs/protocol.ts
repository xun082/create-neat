// 通用协议
export const commonProtocol = {
  ENTRY_FILE: [{
    pluginName: 'scss',
    version: '',
    affects: {
      template: {
        description: '影响框架入口文件配置',
        changes: {
          description: '入口引入全局scss文件',
          content:'import ./style/index.scss'
        }
      }
    }
  },
  {
    pluginName: 'element-plus',
    version: '',
    affects: {
      template: {
        description: '影响框架入口文件配置',
        changes: {
          description: '入口引入全局element-plus',
          content: "import ElementPlus from 'element-plus' import 'element-plus/dist/index.css' "
        }
      }
    }
},{
  pluginName: 'Pinia',
  version: '',
  affects: {
    template: {
      description: '影响框架入口文件配置',
      changes: [
        {
          description: '入口引入全局Pinia',
          content: "import { createPinia } from 'pinia' "
        },
        {
          description: '创建Pinia实例',
          content: "const Pinia=createPinia()"
        }
      ]
    }
  }
}]
}
// 插件对框架的协议
export const pluginToTemplateProtocol = {
  INSERT_STYLE: [{
    pluginName: 'scss',
    version: '',
    affects: {
      template: {
        description: '影响框架根组件文件配置',
        changes: {
          description: '根组件引入scss',
          content:'<style lang="scss">'
        }
      }
    }
  }],
  INSERT_ROOTFILE: [{
    pluginName: 'Pinia',
    version: '',
    affects: {
      template: {
        description: '影响框架根入口文件配置',
        changes: {
          description: '增加usePinia',
          content:'app.use(Pinia)'
        }
      }
    }
  }, {
    pluginName: 'element-plus',
    version: '',
    affects: {
      template: {
        description: '影响框架根入口文件配置',
        changes: {
          description: '增加useElementPlus',
          content:'app.use(ElementPlus)'
        }
      }
    }
  }]
  // ……
};

// 插件对构建工具的协议

// 框架对构建工具的协议
