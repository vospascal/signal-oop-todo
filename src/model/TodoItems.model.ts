import { IBaseModel, BaseModel } from "./BaseModel";
import { ITodoItemModel, TodoItemModel } from "./TodoItem.model";
import { SignalArray } from 'signal-utils/array';
import { Signal } from "signal-polyfill";

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
    items: SignalArray<ITodoItemModel>;
    filter: Signal.State<TodoFilter> = new Signal.State(TodoFilter.All);

    constructor(items: ITodoItemModel[]) {
        super()
        this.items = SignalArray.from(items)
    }

    addTodo(todo: ITodoItemModel): void {
        todo.parent = this;
        this.items.push(todo);
    }

    removeCompletedTodos(): void {
        this.items = this.items.filter(todo => !todo.completed.get());
    }

    getTodos(): ITodoItemModel[] {
        return this.items;
    }

    get all(): ITodoItemModel[] {
        return this.items;
    }

    get active(): ITodoItemModel[] {
        return this.items.filter((todo) => !todo.completed.get());
    }

    get completed(): ITodoItemModel[] {
        return this.items.filter((todo) => todo.completed.get());
    }

    get allCompleted(): boolean {
        return this.items.every((todo) => todo.completed.get());
    }

    filtered(): ITodoItemModel[] {
        switch (this.filter.get()) {
            case TodoFilter.Active:
                return this.active;
            case TodoFilter.Completed:
                return this.completed;
            default:
                return this.all;
        }
    }

    removeTodo(todo: ITodoItemModel): void {
        debugger;
        this.items.splice(this.items.indexOf(todo), 1);
    }

    setFilter(filter: TodoFilter): void {
        this.filter.set(filter);
    }

    protected toJsonData(): object {
        return {
            todos: this.items.map(todo => todo.toJSON())
        };
    }

    static parse(items: any, parent: ITodoItemsModel) {
        const todos = items.map((todo: any) => new TodoItemModel(todo.id, todo.title, todo.completed, parent));
        return new TodoItemsModel(todos);
    }
}
