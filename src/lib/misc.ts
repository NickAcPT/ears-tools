type EnumKeys<Enum> = Exclude<keyof Enum, number>

const enumObject = <Enum extends Record<string, number | string>>(e: Enum) => {
    if (e["__count_value"] !== undefined) {
        const copy = {...e} as { [K in EnumKeys<Enum>]: Enum[K] };
        delete copy["__count_value"];
        return copy;
    }
    
    const copy = {...e} as { [K in EnumKeys<Enum>]: Enum[K] };
    Object.values(e).forEach(value => typeof value === 'number' && delete copy[value]);
    return copy;
};

export function enumKeys<Enum extends Record<string, number | string>>(e: Enum): EnumKeys<Enum>[] {
    return Object.keys(enumObject(e)) as EnumKeys<Enum>[];
}

export function countValue(start: number, end: number): Record<string, number> {
    const result: Record<string, number> = {__count_value: 0};
    for (let i = start; i <= end; i++) {
        result[i.toString()] = i;
    }
    return result;   
}



type ResolvablePromise<T> = Promise<T> & { resolve: (v: T) => void };
        
export function createLazyPromise<T = unknown>(): ResolvablePromise<T> {
    let onResolve: (v: T) => void;
    const promise = new Promise<T>((resolve) => {
        onResolve = resolve;
    });
    // @ts-expect-error This relies on the value being set by the time we get here
    promise.resolve = onResolve;
    return promise as ResolvablePromise<T>;
}