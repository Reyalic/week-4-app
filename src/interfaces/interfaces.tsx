export type ReactState<T> = [T, React.Dispatch<React.SetStateAction<T>>]

export interface User {
    [index: string | number]: string | number,
    readonly id: number,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    birthday: string,
} 