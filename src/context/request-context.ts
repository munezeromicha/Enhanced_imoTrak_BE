import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  userId: string;
  ip: string;
  userAgent: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function setRequestContext(context: RequestContext) {
  asyncLocalStorage.enterWith(context);
}

export function getRequestContext(): RequestContext | undefined {
  return asyncLocalStorage.getStore();
}
