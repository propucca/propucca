export class UpdateUserDto {
    data: {
        user_name: string
        role_id?: string
    }
    find: { id: string }
}

export class DeleteUserDto {
    find: { id: string }
}
