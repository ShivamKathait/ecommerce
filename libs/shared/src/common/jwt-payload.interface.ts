export interface JwtPayload {
  id: number;
  session_id: number;
  iat?: number;
  exp?: number;
}
