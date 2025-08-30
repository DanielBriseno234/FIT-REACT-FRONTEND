export type Sort = {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
}

export type Pageable = {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    unpaged: boolean;
    paged: boolean;
}
