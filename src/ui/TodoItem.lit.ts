import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ITodoItemModel } from "../model/TodoItem.model";
import { SignalWatcher } from "../signal-watcher";

export class TodoItem extends ScopedRegistryHost(SignalWatcher(LitElement)) {
  static elementDefinitions = {};

  @property({ type: Object }) todo!: ITodoItemModel;
  @property({ type: Boolean }) isEditingTitle = false;

  private _internals = this.attachInternals();

  handleToggleCompletion() {
    this.todo.toggleCompletion();
    this.updateCompletionState();
  }

  handleRemove() {
    this.todo.parent?.removeTodo(this.todo);
  }

  updateCompletionState() {
    if (this.todo.completed.get()) {
      this._internals.states.add("completed");
    } else {
      this._internals.states.delete("completed");
    }
  }

  updateEditingState() {
    if (this.isEditingTitle) {
      this._internals.states.add("editing");
    } else {
      this._internals.states.delete("editing");
    }
  }

  render() {
    this.updateCompletionState();
    this.updateEditingState();
    return html`
      <div class="todo-item" data-completed=${this.todo?.completed.get() ? 'true' : 'false'} data-editing=${this.isEditingTitle ? 'true' : 'false'}>
        ${this.renderItem(this.todo)}
      </div>
    `
  }


  handleEditTitle() {
    this.isEditingTitle = true;
  }

  saveTitle(newTitle: string) {
    this.todo.title.set(newTitle);
    this.isEditingTitle = false;
  }

  renderItem(todo: ITodoItemModel) {
    if (!todo) return nothing;
    return html`
      <button class="toggle-button" @click=${this.handleToggleCompletion}>
        <span class="circle"></span>
      </button>
      <div class="todo-title-container" @dblclick=${this.handleEditTitle}>
        ${this.isEditingTitle ? html`
            <input
              type="text"
              .value=${todo.title.get()}
              @blur=${(e: Event) => this.saveTitle((e.target as HTMLInputElement).value)}
              autofocus
            />
          ` : html`<span class="todo-title" >${todo.title.get()}</span>`}
      </div>
      &nbsp;
      <button class="delete-button" @click=${this.handleRemove} aria-label="remove todo" title="remove todo">x</button>
    `;
  }

  static styles = css`
    :host(:state(completed):not(:state(editing))) {
      text-decoration: line-through;
      color: gray;
    }
    :host(:not(:state(completed)):not(:state(editing))) {
      text-decoration: none;
      color: black;
    }

    .todo-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #e6e6e6;
      position: relative;
    }

    .todo-item:hover {
      background-color: #f0f0f0;
    }

    .toggle-button {
      border: none;
      background: none;
      cursor: pointer;
      padding: 0;
      margin-right: 10px;
    }

    .circle {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #ccc;
      position: relative;
      box-sizing: border-box;
    }

    .todo-item[data-completed="true"] .circle {
      background-color: green;
      border: 2px solid green;
    }

    .todo-item[data-completed="true"] .circle::after {
      content: '✔';
      color: white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
    }

 

    .delete-button {
      opacity: 0;
      transition: opacity 0.3s;
      position: absolute;
      right: 10px;
      border: none;
      background: none;
      cursor: pointer;
    }

    .todo-item:hover .delete-button {
      opacity: 1;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-item': TodoItem
  }
}
