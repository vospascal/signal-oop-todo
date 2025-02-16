import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ITodoItemModel } from "../model/TodoItem.model";
import { SignalWatcher } from "../signal-watcher";

export class TodoItem extends ScopedRegistryHost(SignalWatcher(LitElement)) {
  static elementDefinitions = {};

  @property({ type: Object }) todo!: ITodoItemModel;

  render() {
    return html`
      <h3>todo item</h3>
      ${this.renderItem(this.todo)}
      <button @click=${() => this.todo.toggleCompletion()}>Toggle</button>
    `
  }


  renderItem(todo: ITodoItemModel) {
    if (!todo) return nothing;
    return html`
      ${todo.id} - ${todo.title} - ${todo.completed ? 'true' : 'false'} 
    `;
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-item': TodoItem
  }
}
