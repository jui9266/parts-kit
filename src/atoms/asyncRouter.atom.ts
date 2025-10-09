import { atom } from "jotai";

interface AsyncRouter {
  back: () => Promise<void>;
  forward: () => Promise<void>;
  push: (path: string) => Promise<void>;
  replace: (path: string) => Promise<void>;
}

export const asyncRouterAtom = atom<AsyncRouter>({
  back: async () => {},
  forward: async () => {},
  push: async () => {},
  replace: async () => {},
});

asyncRouterAtom.debugLabel = "asyncRouterAtom";
