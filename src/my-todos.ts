import '@webcomponents/scoped-custom-element-registry'
import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { type ITodoItemsModel, TodoFilter, TodoItemsModel } from "./model/TodoItems.model";
import { TodoItems } from "./ui/TodoItems.lit";
import { SignalWatcher } from './signal-watcher';
import { TodoItemModel } from './model/TodoItem.model';



export interface IMyTodos extends ITodoItemsModel {
  todos: ITodoItemsModel;
}

@customElement('my-todos')
export class MyTodos extends ScopedRegistryHost(SignalWatcher(LitElement)) {
  static elementDefinitions = {
    'todo-items': TodoItems,
  };

  todos!: ITodoItemsModel;

  constructor() {
    super()
    this.todos = TodoItemsModel.parse([
      { title: 'create a todo', completed: false },
      { title: 'create a list of todos', completed: true },
      { title: 'get milk', completed: false },
      { title: 'get bread', completed: false },
      { title: 'get eggs', completed: false },
      { title: 'walk the dog', completed: false }
    ], this as any);
  }

  addTodo(event: Event) {
    if (event.target && (event.target as HTMLInputElement).value.trim() === '') {
      return;
    }
    if (event.type === 'keyup' && (event as KeyboardEvent).key !== 'Enter') {
      return;
    }
    const input = event.target as HTMLInputElement;
    const title = input.value;
    const todo = TodoItemModel.parse({ title, completed: false }, this.todos);
    this.todos.addTodo(todo);
    input.value = '';
  }

  setFilter(filter: TodoFilter) {
    this.todos.setFilter(filter);
  }

  render() {
    return html`
      <h1>Todo Lit</h1>
      <input type="text" placeholder="add a todo" @blur=${this.addTodo} @keyup=${this.addTodo} />
      <todo-items .todos=${this.todos}></todo-items>
      <div>
        <button @click=${() => this.setFilter(TodoFilter.All)}>All</button>
        <button @click=${() => this.setFilter(TodoFilter.Active)}>Active</button>
        <button @click=${() => this.setFilter(TodoFilter.Completed)}>Completed</button>
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
