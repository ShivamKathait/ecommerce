export interface ServiceHealthResponse {
    service: string;
    status: 'ok';
    timestamp: string;
    uptimeSeconds: number;
    version: string;
}
export interface ServiceReadinessResponse {
    service: string;
    status: 'ready';
    timestamp: string;
}
export interface ServiceDescriptor {
    name: string;
    port: number;
}
