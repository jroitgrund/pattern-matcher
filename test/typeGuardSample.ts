export interface IQux { q: number; }

export function isQux(obj: any): obj is IQux {
    return !!obj && typeof obj === "object" && "q" in obj && typeof obj.q === "number";
}
