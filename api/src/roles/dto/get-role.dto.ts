export class GetRoleDto {
    pagination: boolean;
    paginationDetails: {
        limit: number;
        page: number;
    };
    search: Record<string, any>;
    sort: {
        modified_on: number;
    };
}