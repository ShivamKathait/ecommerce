import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/common/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  const userRepo = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
      ],
    }).compile();

    service = moduleRef.get(UserService);
    jest.clearAllMocks();
  });

  it('returns a safe profile payload', async () => {
    userRepo.findOne.mockResolvedValueOnce({
      id: 1,
      name: 'Shivam',
      email: 'shivam@example.com',
      role: 'USER',
      is_email_verified: true,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
      password: 'secret',
      otp: '123456',
    });

    const result = await service.getMyProfile(1);

    expect(result.data).toEqual({
      id: 1,
      name: 'Shivam',
      email: 'shivam@example.com',
      role: 'USER',
      is_email_verified: true,
      created_at: new Date('2026-01-01T00:00:00.000Z'),
    });
    expect(result.data).not.toHaveProperty('password');
    expect(result.data).not.toHaveProperty('otp');
  });
});
