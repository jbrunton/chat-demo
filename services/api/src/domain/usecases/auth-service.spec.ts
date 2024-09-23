import { AppLogger } from '@app/app.logger';
import { TestAuthService } from '@fixtures/auth/test-auth-service';
import { Role } from './auth-service';
import { UserFactory } from '@fixtures/messages/user.factory';
import { RoomFactory } from '@fixtures/messages/room.factory';
import { UnauthorizedException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

describe('AuthService', () => {
  const user = UserFactory.build();
  const room = RoomFactory.build();

  let service: TestAuthService;

  beforeEach(() => {
    service = new TestAuthService(mock<AppLogger>());
  });

  const stubPermission = (action: Role) => {
    service.stubPermission({ user, action, subject: room });
  };

  describe('authorize', () => {
    it('passes if the user is authorized for the action', async () => {
      stubPermission(Role.Read);
      await service.authorize({ user, action: Role.Read, subject: room });
    });

    it('fails if the user is not authorized for the action', async () => {
      await expect(
        service.authorize({ user, action: Role.Read, subject: room }),
      ).rejects.toEqual(
        new UnauthorizedException(
          'You do not have permission to perform this action.',
        ),
      );
    });

    it('fails with a custom message when one is provided', async () => {
      await expect(
        service.authorize({
          user,
          action: Role.Read,
          subject: room,
          message: 'Oops!',
        }),
      ).rejects.toEqual(new UnauthorizedException('Oops!'));
    });
  });

  describe('authorizedRoles', () => {
    it('returns the authorized roles the user has on the subject', async () => {
      stubPermission(Role.Read);
      stubPermission(Role.Write);

      const roles = await service.authorizedRoles({ user, subject: room });

      expect(roles).toEqual([Role.Read, Role.Write]);
    });
  });
});
