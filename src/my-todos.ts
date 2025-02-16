import '@webcomponents/scoped-custom-element-registry'
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { type ITodoItemsModel, TodoItemsModel } from "./model/TodoItems.model";
import { TodoItems } from "./ui/TodoItems.lit";

@customElement('my-todos')
export class MyTodos extends ScopedRegistryHost(LitElement) {
  static elementDefinitions = {
    'todo-items': TodoItems,
  };
  
  todos!:ITodoItemsModel;

  constructor(){
    super()
    this.todos = TodoItemsModel.parse([
      {id: 1, title: 'create a todo', complete: false}
    ])
  }

  render() {
    return html`
      <h1>Todo Lit</h1>
      <todo-items .todos=${this.todos}></todo-items>
    `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-todos': MyTodos;
  }
}
