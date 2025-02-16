import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css, nothing } from "lit";
import { ITodoItemModel, TodoItemModel } from "../model/TodoItem.model";
import { property } from "lit/decorators.js";
import { TodoItem } from "./TodoItem.lit";
import { ITodoItemsModel } from "../model/TodoItems.model";


export class TodoItems extends ScopedRegistryHost(LitElement) {
  static elementDefinitions = {
    'todo-item': TodoItem,
  };

  @property() todos!: ITodoItemsModel
  
  render() {
    return html`
      <h2>todo items</h2>
      ${this.renderItems(this.todos)}
    `
  }

  renderItems(todos: ITodoItemsModel) {
    if(!todos) return nothing
    return todos.items.map((item: ITodoItemModel) => html`
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
