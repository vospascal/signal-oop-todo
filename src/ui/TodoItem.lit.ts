import { ScopedRegistryHost } from "@lit-labs/scoped-registry-mixin";
import { LitElement, html, css, nothing } from "lit";
import { property } from "lit/decorators.js";
import { ITodoItemModel } from "../model/TodoItem.model";
import { SignalWatcher } from "../signal-watcher";

export class TodoItem extends ScopedRegistryHost(SignalWatcher(LitElement)) {
  static elementDefinitions = {};

  @property({ type: Object }) todo!: ITodoItemModel;

  private _internals = this.attachInternals();

  connectedCallback() {
    super.connectedCallback();
    this.updateCompletionState();
  }

  handleToggleCompletion() {
    this.todo.toggleCompletion();
    this.updateCompletionState();
  }

  handleRemove() {
    console.log('handleRemove', this.todo.parent);
    this.todo.parent?.removeTodo(this.todo);
  }

  updateCompletionState() {
    if (this.todo.completed.get()) {
      this._internals.states.add("completed");
    } else {
      this._internals.states.delete("completed");
    }
  }

  render() {
    return html`
      ${this.renderItem(this.todo)}
      <button @click=${this.handleToggleCompletion}>Toggle</button>
      <button @click=${this.handleRemove}>Remove</button>
    `
  }


  renderItem(todo: ITodoItemModel) {
    if (!todo) return nothing;
    return html`
      ${todo.id} - ${todo.title} - ${todo.completed.get() ? 'true' : 'false'} 
    `;
  }

  static styles = css`
    :host(:state(completed)) {
      text-decoration: line-through;
      color: gray;
    }
    :host(:not(:state(completed))) {
      text-decoration: none;
      color: black;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-item': TodoItem
  }
}
