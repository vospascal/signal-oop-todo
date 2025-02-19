import { Signal } from "signal-polyfill";
import { IBaseModel, BaseModel } from "./BaseModel";
import { ITodoItemsModel } from "./TodoItems.model";
// Interface for a single todo item
export interface ITodoItemModel extends IBaseModel {
    id: number;
    title: Signal.State<string>;
    completed: Signal.State<boolean>;
    toggleCompletion(): void;
}

// Todo Model representing a single todo item
export class TodoItemModel extends BaseModel implements ITodoItemModel {
    title: Signal.State<string> = new Signal.State('');
    completed: Signal.State<boolean> = new Signal.State(false);

    constructor(title: string, completed: boolean = false, parent: ITodoItemsModel) {
        super();
        this.title = new Signal.State(title);
        this.completed = new Signal.State(completed);
        this.parent = parent;
    }

    toggleCompletion(): void {
        this.completed.set(!this.completed.get());
    }

    protected toJsonData(): object {
        return {
            title: this.title.get(),
            completed: this.completed.get()
        };
    }

    static parse(item: any, parent: ITodoItemsModel): TodoItemModel {
        console.log('parse', item, parent);
        return new TodoItemModel(item.title, item.completed, parent);
    }
}
