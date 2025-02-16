import { IBaseModel, BaseModel } from "./BaseModel";
import { ITodoItemModel, TodoItemModel } from "./TodoItem.model";
import { SignalArray } from 'signal-utils/array';
import { Signal } from "signal-polyfill";
import { SignalSet } from 'signal-utils/set';

// Interface for a collection of todos
export interface ITodoItemsModel extends IBaseModel {
    items: ITodoItemModel[]
    addTodo(todo: ITodoItemModel): void;
    removeCompletedTodos(): void;
    getTodos(): ITodoItemModel[];
    setFilter(filter: TodoFilter): void;
    filtered(): ITodoItemModel[];
    removeTodo(todo: ITodoItemModel): void;
}

// Define an enum for the filter states
export enum TodoFilter {
    All = 'all',
    Active = 'active',
    Completed = 'completed'
}

// Todo List representing a collection of todos
export class TodoItemsModel extends BaseModel implements ITodoItemsModel {
    items: SignalSet<ITodoItemModel>;
    filter: Signal.State<TodoFilter> = new Signal.State(TodoFilter.All);
    activeFilter: Signal.State<TodoFilter> = new Signal.State(TodoFilter.All);

    constructor(items: ITodoItemModel[]) {
        super()
        this.items = new SignalSet(items);
    }

    addTodo(todo: ITodoItemModel): void {
        todo.parent = this;
        this.items.add(todo);
    }

    removeCompletedTodos(): void {
        const completedTodos = Array.from(this.items).filter(todo => todo.completed.get());
        completedTodos.forEach(todo => this.items.delete(todo));
    }

    getTodos(): ITodoItemModel[] {
        return Array.from(this.items);
    }

    get all(): ITodoItemModel[] {
        return Array.from(this.items);
    }

    get active(): ITodoItemModel[] {
        return Array.from(this.items).filter((todo) => todo.completed.get() === false);
    }

    get completed(): ITodoItemModel[] {
        return Array.from(this.items).filter((todo) => todo.completed.get() === true);
    }

    get allCompleted(): boolean {
        return Array.from(this.items).every((todo) => todo.completed.get());
    }

    filtered(): ITodoItemModel[] {
        switch (this.activeFilter.get()) {
            case TodoFilter.Active:
                return this.active;
            case TodoFilter.Completed:
                return this.completed;
            default:
                return this.all;
        }
    }

    removeTodo(todo: ITodoItemModel): void {
        this.items.delete(todo);
    }

    setFilter(filter: TodoFilter): void {
        this.activeFilter.set(filter);
    }

    protected toJsonData(): object {
        return {
            todos: Array.from(this.items).map(todo => todo.toJSON())
        };
    }

    static parse(items: any, parent: ITodoItemsModel) {
        const todos = items.map((todo: any) => new TodoItemModel(todo.title, todo.completed, parent));
        return new TodoItemsModel(todos);
    }
}
