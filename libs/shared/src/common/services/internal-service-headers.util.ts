import { ConfigService } from '@nestjs/config';

export function getInternalServiceHeaders(
  configService: ConfigService,
  extraHeaders?: Record<string, string>,
): Record<string, string> {
  const token = configService.get<string>('INTERNAL_SERVICE_TOKEN');
  if (!token) {
    throw new Error('INTERNAL_SERVICE_TOKEN is not configured');
  }

  return {
    'x-internal-token': token,
    ...(extraHeaders ?? {}),
  };
}
