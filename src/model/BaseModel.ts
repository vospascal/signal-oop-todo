// Base interface for all models
export interface IBaseModel {
    parent: IBaseModel | null;
    toJSON(): object;
}

// Base class for all models
export abstract class BaseModel implements IBaseModel {
    private _parent: IBaseModel | null = null;
    
    get parent(): IBaseModel | null {
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