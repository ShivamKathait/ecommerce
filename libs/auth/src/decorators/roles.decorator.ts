import { SetMetadata } from '@nestjs/common';
import { Role } from '@ecommerce/shared/common/utils';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
