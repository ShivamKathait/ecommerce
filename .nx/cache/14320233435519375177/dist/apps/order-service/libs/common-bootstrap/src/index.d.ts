import { ServiceHealthResponse, ServiceReadinessResponse } from '@ecommerce/contracts';
interface BootstrapHttpOptions {
    rawBody?: boolean;
}
export declare function bootstrapHttpService(module: unknown, serviceName: string, options?: BootstrapHttpOptions): Promise<void>;
export declare function createHealthPayload(serviceName: string): ServiceHealthResponse;
export declare function createReadinessPayload(serviceName: string): ServiceReadinessResponse;
export {};
