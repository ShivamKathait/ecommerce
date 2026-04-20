import { ServiceDescriptor } from '@ecommerce/contracts';

const DEFAULT_PORTS: Record<string, number> = {
  'auth-service': 3008,
  'admin-service': 3007,
  'user-service': 3002,
  'catalog-service': 3003,
  'inventory-service': 3004,
  'vendor-service': 3005,
  'payment-service': 3006,
  'order-service': 3009,
};

export function getServiceConfig(serviceName: string): ServiceDescriptor {
  const envKey = serviceName.toUpperCase().replace(/-/g, '_') + '_PORT';
  const fallbackPort = DEFAULT_PORTS[serviceName] ?? 3010;

  return {
    name: serviceName,
    port: Number(process.env[envKey] || fallbackPort),
  };
}

export function getServiceBaseUrl(serviceName: string): string {
  const envKey = serviceName.toUpperCase().replace(/-/g, '_') + '_URL';
  const configuredUrl = process.env[envKey];

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '');
  }

  const { port } = getServiceConfig(serviceName);
  return `http://localhost:${port}`;
}
