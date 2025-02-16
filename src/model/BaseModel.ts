import { IMyTodos } from "../my-todos";

// Base interface for all models
export interface IBaseModel {
    parent: IBaseModel | null;
    toJSON(): object;
}

// Base class for all models
export abstract class BaseModel implements IBaseModel {
    private _parent: IBaseModel | null = null;

    get parent(): IBaseModel | null {
        // if the parent is to place where the model is created, return the parent.todos (assuming the todos is a TodoItemsModel)
        if (this._parent && (this._parent as IMyTodos)?.todos) {
            return (this._parent as IMyTodos)?.todos;
        }
        return this._parent;
    }

    set parent(value: IBaseModel | null) {
        this._parent = value;
    }

    toJSON(): object {
        return this.toJsonData();
    }

    protected abstract toJsonData(): object;
}