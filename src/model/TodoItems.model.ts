import { IBaseModel, BaseModel } from "./BaseModel";
import { ITodoItemModel } from "./TodoItem.model";

// Interface for a collection of todos
export interface ITodoItemsModel extends IBaseModel {
    items: ITodoItemModel[] 
    addTodo(todo: ITodoItemModel): void;
    removeTodo(id: number): void;
    getTodos(): ITodoItemModel[];
}

// Todo List representing a collection of todos
export class TodoItemsModel extends BaseModel implements ITodoItemsModel {
    items: ITodoItemModel[] = [];

    constructor(items: ITodoItemModel[]){
        super()
        this.items = items
    }

    addTodo(todo: ITodoItemModel): void {
        todo.parent = this;
        this.items.push(todo);
    }
    
    removeTodo(id: number): void {
        this.items = this.items.filter(todo => todo.id !== id);
    }
    
    getTodos(): ITodoItemModel[] {
        return this.items;
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
