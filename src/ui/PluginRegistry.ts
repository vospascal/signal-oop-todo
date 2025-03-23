// File: src/ui/plugins/PluginRegistry.ts
export interface PluginInfo {
    tagName: string;
    moduleUrl: string;
  }
  
  export class PluginRegistry {
    // Mapping: key = pluginPath; value = PluginInfo.
    private static pluginMapping: Record<string, PluginInfo> = {
      // For example, if the pluginPath "renderpluginhere" should use a custom TodoItem plugin.
      // this is normaly based on server data like annotation in the json
      // we now take the 3e index..
      '3': {
        tagName: 'todo-item-overwrite',
        moduleUrl: '/src/ui/plugin/customPlugin.lit.ts' // the URL from which to load the plugin module.
      }
    };
  
    public static async getPluginForPath(path: string): Promise<PluginInfo | undefined> {
      const pluginInfo = PluginRegistry.pluginMapping[path];
      if (!pluginInfo) return undefined;
      try {
        // Dynamically import the plugin module.
        const module = await import(pluginInfo.moduleUrl).then(module => module.default);
        // We assume that the imported module registers the custom element (e.g. via customElements.define).
        return {
            ...pluginInfo,
            module
        };
      } catch (e) {
        console.error("Failed to load plugin module for path", path, e);
        return undefined;
      }
    }
  }
  