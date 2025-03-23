import { html, LitElement, TemplateResult } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import { PluginRegistry, PluginInfo } from './PluginRegistry';

export interface PluginOverridable {
  pluginPath: string;
  defaultRender(): TemplateResult;
  pluginTag?: string;
  module?: any;
}

// Mixin to handle plugin loading
export const PluginOverridableMixinDynamic = <T extends new (...args: any[]) => LitElement>(superClass: T) => {
  console.log(superClass)

  return class extends superClass {
    pluginPath: string = ''; // Path for loading plugin
    pluginTag?: string; // The tag name of the plugin
    module?: any; // The module for the plugin
    pluginLoaded: boolean = false; // Flag to track if the plugin is loaded

    // Load the plugin asynchronously
    async loadPlugin() {
      const pluginInfo: PluginInfo | undefined = await PluginRegistry.getPluginForPath(this.pluginPath);
      if (pluginInfo) {
        this.pluginTag = pluginInfo.tagName;
        this.module = pluginInfo.module;
        // Define the plugin element if not already registered
        if (!customElements.get(this.pluginTag)) {
          customElements.define(this.pluginTag, this.module);
        }
      }
      this.pluginLoaded = true;
      this.requestUpdate(); // Trigger a re-render once the plugin is loaded
    }


    connectedCallback() {
      super.connectedCallback();
      this.loadPlugin(); // Load the plugin when the component is connected
    }

    // Render the plugin directly once it's loaded
    render(): TemplateResult {
      if (!this.pluginLoaded) {
        return html`<p>Loading plugin...</p>`; // Show loading message until plugin is loaded
      }

      // Once the plugin is loaded, render it using its tag
      // TODO: should pass down propertys dynamicly... 
      if (this.pluginTag) {
        return staticHtml`
          <${unsafeStatic(this.pluginTag)} .todo=${this.todo}></${unsafeStatic(this.pluginTag)}> <!-- Render the dynamically loaded plugin -->
        `;
      }

      return this.renderDefault()
    }
  };
};