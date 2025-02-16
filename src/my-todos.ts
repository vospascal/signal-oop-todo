import '@webcomponents/scoped-custom-element-registry'
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { type ITodoItemsModel, TodoItemsModel } from "./model/TodoItems.model";
import { TodoItems } from "./ui/TodoItems.lit";
import { SignalWatcher } from './signal-watcher';

@customElement('my-todos')
export class MyTodos extends ScopedRegistryHost(SignalWatcher(LitElement)) {
  static elementDefinitions = {
    'todo-items': TodoItems,
  };

  todos!: ITodoItemsModel;

  constructor() {
    super()
    this.todos = TodoItemsModel.parse([
      { id: 1, title: 'create a todo', completed: false },
      { id: 1, title: 'create a list of todos', completed: true }
    ])
  }

  addTodo(event: Event) {
    const input = event.target as HTMLInputElement;
    const title = input.value;
    this.todos.addTodo({ id: this.todos.items.length + 1, title, completed: false });
    input.value = '';
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.todos.setFilter(filter);
  }

  render() {
    return html`
      <h1>Todo Lit</h1>
      <input type="text" placeholder="add a todo" @blur=${this.addTodo} />
      <todo-items .todos=${this.todos}></todo-items>
      <div>
        <button @click=${() => this.setFilter('all')}>All</button>
        <button @click=${() => this.setFilter('active')}>Active</button>
        <button @click=${() => this.setFilter('completed')}>Completed</button>
      </div>
      <button @click=${() => this.todos.removeCompletedTodos()}>Remove Completed</button>
    `;
  }

  static styles = css``;
}

declare global {
  interface HTMLElementTagNameMap {
    'my-todos': MyTodos;
  }
}
