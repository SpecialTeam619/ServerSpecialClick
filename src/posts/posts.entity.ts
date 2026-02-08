export class Post {
    constructor(
        private readonly _title: string,
        private readonly _description: string,
        private readonly _price: number,
        private readonly _properties: string[],
        private readonly _authorId: number,
    ) {}

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get properties(): string[] {
        return this._properties;
    }

    get price(): number {
        return this._price;
    }

    get authorId(): number {
        return this._authorId;
    }
}
