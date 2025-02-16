import { IBaseModel, BaseModel } from "./BaseModel";

// Interface for a single todo item
export interface ITodoItemModel extends IBaseModel {
    id: number;
    title: string;
    completed: boolean;
    toggleCompletion(): void;
}

// Todo Model representing a single todo item
export class TodoItemModel extends BaseModel implements ITodoItemModel {
    id: number;
    title: string;
    completed: boolean;

    constructor(id: number, title: string, completed: boolean = false) {
        super();
        this.id = id;
        this.title = title;
        this.completed = completed;
    }
    
    toggleCompletion(): void {
        this.completed = !this.completed;
    }
    
    protected toJsonData(): object {
        return {
            id: this.id,
            title: this.title,
            completed: this.completed
        };
    }
}
