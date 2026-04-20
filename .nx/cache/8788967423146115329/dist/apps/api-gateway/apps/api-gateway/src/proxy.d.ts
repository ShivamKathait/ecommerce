import { Request, Response } from 'express';
export declare function proxyToService(serviceName: string): (req: Request, res: Response) => Promise<void>;
