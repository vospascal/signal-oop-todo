import { Signal } from "signal-polyfill";
import { IBaseModel, BaseModel } from "./BaseModel";
import { ITodoItemsModel } from "./TodoItems.model";
// Interface for a single todo item
export interface ITodoItemModel extends IBaseModel {
    id: number;
    title: string;
    completed: Signal.State<boolean>;
    toggleCompletion(): void;
}

// Todo Model representing a single todo item
export class TodoItemModel extends BaseModel implements ITodoItemModel {
    id: number = 0;
    title: string = '';
    completed: Signal.State<boolean> = new Signal.State(false);

    constructor(id: number, title: string, completed: boolean = false, parent: ITodoItemsModel) {
        super();
        this.id = id;
        this.title = title;
        this.completed = new Signal.State(completed);
        this.parent = parent;
    }

    toggleCompletion(): void {
        this.completed.set(!this.completed.get());
    }

    protected toJsonData(): object {
        return {
            id: this.id,
            title: this.title,
            completed: this.completed.get()
        };
    }

    static parse(item: any, parent: ITodoItemsModel): TodoItemModel {
        console.log('parse', item, parent);
        return new TodoItemModel(item.id, item.title, item.completed, parent);
    }
}
