"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyToService = proxyToService;
const common_config_1 = require("../../../libs/common-config/src");
const HOP_BY_HOP_HEADERS = new Set([
    'connection',
    'content-length',
    'host',
    'transfer-encoding',
]);
function proxyToService(serviceName) {
    return async (req, res) => {
        const targetUrl = `${(0, common_config_1.getServiceBaseUrl)(serviceName)}${req.originalUrl}`;
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
            if (!value || HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
                continue;
            }
            if (Array.isArray(value)) {
                for (const entry of value) {
                    headers.append(key, entry);
                }
                continue;
            }
            headers.set(key, value);
        }
        const method = req.method.toUpperCase();
        const init = {
            method,
            headers,
            redirect: 'manual',
        };
        if (method !== 'GET' && method !== 'HEAD' && req.body !== undefined) {
            headers.set('content-type', 'application/json');
            init.body = JSON.stringify(req.body);
        }
        const response = await fetch(targetUrl, init);
        const buffer = Buffer.from(await response.arrayBuffer());
        response.headers.forEach((value, key) => {
            if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        });
        res.status(response.status).send(buffer);
    };
}
//# sourceMappingURL=proxy.js.map