export interface ServiceHealthResponse {
    service: string;
    status: 'ok';
    timestamp: string;
}
export interface ServiceDescriptor {
    name: string;
    port: number;
}
