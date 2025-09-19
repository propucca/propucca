import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto {
    data: {
        role_name: string;
        permissions: string[];
    }
    find: {
        id: string;
    }
}

export class DeleteRoleDto {
    find: {
        id: string;
    }
}
