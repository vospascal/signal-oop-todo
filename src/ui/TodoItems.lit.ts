import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css, nothing } from "lit";
import { ITodoItemModel } from "../model/TodoItem.model";
import { property } from "lit/decorators.js";
import { TodoItem } from "./TodoItem.lit";
import { ITodoItemsModel } from "../model/TodoItems.model";
import { SignalWatcher } from "../signal-watcher";


export class TodoItems extends ScopedRegistryHost(SignalWatcher(LitElement)) {
  static elementDefinitions = {
    'todo-item': TodoItem,
  };

  @property({ type: Object })
  todos!: ITodoItemsModel;

  render() {
    return html`
      <h2>Todo Items</h2>
      ${this.renderItems(this.todos)}
    `;
  }

  renderItems(todos: ITodoItemsModel) {
    if (!todos.items) return nothing
    const filteredItems = todos.filtered();
    return filteredItems.map((item: ITodoItemModel) => html`
        <todo-item .todo=${item}></item>
    `)
  }

  static styles = css``
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-items': TodoItems
  }
}
