export enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  USER = 'USER',
  VENDOR = 'VENDOR',
}

export enum Device_TYPE {
  WEB = 'WEB',
  IOS = 'IOS',
  ANDROID = 'ANDROID',
}

export enum InventoryStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  BACKORDER = 'backorder',
}

export enum Action {
  ADD = 'add',
  SUBTRACT = 'subtract',
  SET = 'set',
}

export enum VenderStatus {
  PENDING = 'pending',
  APPPROVED = 'approved',
  REJECTED = 'rejected',
}
