// export type SortColumn = keyof Country | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
    column: '';
    direction: SortDirection;
}
