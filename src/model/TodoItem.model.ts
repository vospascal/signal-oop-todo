import { IBaseModel, BaseModel } from "./BaseModel";
import { Signal } from "signal-polyfill";
// Interface for a single todo item
export interface ITodoItemModel extends IBaseModel {
    id: number;
    title: string;
    completed: boolean;
    toggleCompletion(): void;
}

// Todo Model representing a single todo item
export class TodoItemModel extends BaseModel implements ITodoItemModel {
    id: Signal.State<number> = new Signal.State(0);
    title: Signal.State<string> = new Signal.State('');
    completed: Signal.State<boolean> = new Signal.State(false); // Use Signal for reactivity

    get id(): number {
        return this.id.get();
    }

    get title(): string {
        return this.title.get();
    }

    get completed(): boolean {
        return this.completed.get();
    }

    constructor(id: number, title: string, completed: boolean = false) {
        super();
        this.id.set(id);
        this.title.set(title);
        this.completed.set(completed);
    }

    toggleCompletion(): void {
        debugger;
        this.completed.set(!this.completed.get());
    }

    protected toJsonData(): object {
        return {
            id: this.id,
            title: this.title,
            completed: this.completed.get()
        };
    }
}
