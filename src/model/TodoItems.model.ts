import { IBaseModel, BaseModel } from "./BaseModel";
import { ITodoItemModel } from "./TodoItem.model";
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
}

// Define an enum for the filter states
export enum TodoFilter {
    All = 'all',
    Active = 'active',
    Completed = 'completed'
}

// Todo List representing a collection of todos
export class TodoItemsModel extends BaseModel implements ITodoItemsModel {
    items: ITodoItemModel[] = new SignalArray([]);
    filter: Signal.State<TodoFilter> = new Signal.State(TodoFilter.All);

    constructor(items: ITodoItemModel[]) {
        super()
        this.items = items
    }

    addTodo(todo: ITodoItemModel): void {
        todo.parent = this;
        this.items.push(todo);
    }

    removeCompletedTodos(): void {
        this.items = this.items.filter(todo => !todo.completed);
    }

    getTodos(): ITodoItemModel[] {
        return this.items;
    }

    get all(): ReadonlyArray<ITodoItemModel> {
        return this.items;
    }

    get active(): ReadonlyArray<ITodoItemModel> {
        return this.items.filter((todo) => !todo.completed);
    }

    get completed(): ReadonlyArray<ITodoItemModel> {
        return this.items.filter((todo) => todo.completed);
    }

    get allCompleted(): boolean {
        return this.items.every((todo) => todo.completed);
    }

    filtered(): ReadonlyArray<ITodoItemModel> {
        switch (this.filter.get()) {
            case TodoFilter.Active:
                return this.active;
            case TodoFilter.Completed:
                return this.completed;
            default:
                return this.all;
        }
    }

    setFilter(filter: TodoFilter): void {
        this.filter.set(filter);
    }

    protected toJsonData(): object {
        return {
            todos: this.items.map(todo => todo.toJSON())
        };
    }

    static parse(items: any) {
        return new TodoItemsModel(items)
    }
}
