import "es6-promise";

export interface IType<T> { new (...args: any[]): T; }

export interface ICaseResult<R> {
    success: boolean;
    result: R;
}

export type CaseFn<R> = (value: any) => ICaseResult<R>;

export function NumberCase<R>(p: (n: number) => R): CaseFn<R> {
    return (a) => {
        const success = !!a && (typeof a === "number");
        const result = success && p(a);
        return { success, result };
    };
}

export function StringCase<R>(p: (s: string) => R): CaseFn<R> {
    return (a) => {
        const success = !!a && (typeof a === "string");
        const result = success && p(a);
        return { success, result };
    };
}

export function Case<R>(t: number, p: (n: number) => R): CaseFn<R>;
export function Case<R>(t: string, p: (s: string) => R): CaseFn<R>;
export function Case<T, R>(t: IType<T>, p: (t: T) => R): CaseFn<R>;
export function Case<R>(t: boolean, p: () => R): CaseFn<R>;
export function Case<R>(type: any, project: (t: any) => R): CaseFn<R> {
    return (a) => {
        const success = !!a && (
            typeof type === "function" && a instanceof type ||
            typeof type === "boolean" && type ||
            typeof type === typeof a && type === a
        );

        const result = success && project(a);
        return { success, result };
    };
}

export type TypeGuard<T> = (x: any) => x is T;
export function TypeCase<T, R>(type: TypeGuard<T>, project: (t: T) => R): CaseFn<R> {
    return (a) => {
        const success = !!a && (typeof type === "function" && !!type(a));

        const result = success && project(a);
        return { success, result };
    };
}

export function DefaultCase<R>(value: R): CaseFn<R> {
    return (_) => ({ success: true, result: value });
}

export function match<A, R>(a: A, ...cases: Array<CaseFn<R>>): R {
    for (const c of cases) {
        const r = c(a);
        if (r.success) {
            return r.result;
        }
    }
    return undefined;
}

// Will wrap all return values in a Promise, so the whole matcher can be safely handled as a promise
export function matchAsync<A, R>(a: A, ...cases: Array<CaseFn<Promise<R> | R>>): Promise<R> {
    for (const c of cases) {
        const r = c(a);
        if (r.success) {
            return Promise.resolve(r.result);
        }
    }
    return undefined;
}

function isPromise(obj: any) {
    return !!obj.then && typeof obj.then === "function";
}
