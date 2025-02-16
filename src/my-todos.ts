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
      <h1>todos</h1>
      <section>
        <header>
          <input type="text" placeholder="add a todo" @blur=${this.addTodo} @keyup=${this.addTodo} />
        </header>
        <main>
          <todo-items .todos=${this.todos}></todo-items>
        </main>
        <footer>
          <div class="filters">
            <div>
              ${this.todos.active.length ? this.todos.active.length : 'no'} items left
          </div>
          <div class="filter-buttons">
            <button class="filter ${this.todos.activeFilter.get() === TodoFilter.All ? 'active' : ''}" @click=${() => this.setFilter(TodoFilter.All)}>All</button>
            <button class="filter ${this.todos.activeFilter.get() === TodoFilter.Active ? 'active' : ''}" @click=${() => this.setFilter(TodoFilter.Active)}>Active</button>
            <button class="filter ${this.todos.activeFilter.get() === TodoFilter.Completed ? 'active' : ''}" @click=${() => this.setFilter(TodoFilter.Completed)}>Completed</button>
          </div>
          <div>
            <button class="filter" @click=${() => this.todos.removeCompletedTodos()}>Remove Completed</button>
          </div>
          </div>
        </footer>
      </section>
    `;
  }

  static styles = css`

  h1 {
    text-align: center;
    color: #3f51b5;
  }

  section {
    display: block;
    background: rgb(255, 255, 255);
    margin: 10 0px 40px;
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 25px 50px 0px;
  }

  header {
    padding: 10px;
  }

  header input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    box-sizing: border-box;
    position: relative;
    margin: 0px;
    width: 100%;
    overflow-clip-margin: 0px !important;
    overflow: clip !important;
  }

  header input:focus {
    outline: none;
    border-color: #3f51b5;
  }

  main {
    padding: 0 10px;
  }

  .filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #e6e6e6;
  }

  .filter-buttons {
    display: flex;
    gap: 5px;
  }

  .filter {
    padding: 5px 10px;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 3px;
    transition: border-color 0.3s;
  }

  .filter.active {
    border-color:#1a2877;
    background-color: #3f51b5;
    color: white;
  }

  .filter:hover {
    border-color: #d9d9d9;
  }


`
}

declare global {
  interface HTMLElementTagNameMap {
    'my-todos': MyTodos;
  }
}
