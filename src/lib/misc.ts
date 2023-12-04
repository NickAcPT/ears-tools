type EnumKeys<Enum> = Exclude<keyof Enum, number>

const enumObject = <Enum extends Record<string, number | string>>(e: Enum) => {
    const copy = {...e} as { [K in EnumKeys<Enum>]: Enum[K] };
    Object.values(e).forEach(value => typeof value === 'number' && delete copy[value]);
    return copy;
};


export function enumKeys<Enum extends Record<string, number | string>>(e: Enum): EnumKeys<Enum>[] {
    return Object.keys(enumObject(e)) as EnumKeys<Enum>[];
}
