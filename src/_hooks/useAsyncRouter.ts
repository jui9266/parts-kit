import { useEffect, useMemo, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { asyncRouterAtom } from "@/_atoms/asyncRouter.atom";

function useAsyncRouterDef() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const completionCallbackRef = useRef<(() => void) | null>(null);

  const asyncRouter = useMemo(() => {
    const back = () => {
      return new Promise<void>((resolve) => {
        startTransition(() => router.back());
        completionCallbackRef.current = resolve;
      });
    };

    const forward = () => {
      return new Promise<void>((resolve) => {
        startTransition(() => router.forward());
        completionCallbackRef.current = resolve;
      });
    };

    const push = (path: string) => {
      return new Promise<void>((resolve) => {
        startTransition(() => router.push(path));
        completionCallbackRef.current = resolve;
      });
    };

    const replace = (path: string) => {
      return new Promise<void>((resolve) => {
        startTransition(() => router.replace(path));
        completionCallbackRef.current = resolve;
      });
    };

    return { back, forward, push, replace };
  }, [router, startTransition]);

  useEffect(() => {
    if (!isPending && completionCallbackRef.current) {
      completionCallbackRef.current();
      completionCallbackRef.current = null;
    }
  }, [isPending]);

  return asyncRouter;
}

/**
 * @docs https://react.dev/reference/react/useTransition#usetransition
 * "Call useTransition at the top level of your component to mark some state updates as Transitions."
 * 페이지 이동을 감지하기 위해서는 useTransition을 최상위 요소에서 호출해야 함
 */
export function useAsyncRouterInitialization() {
  const asyncRouter = useAsyncRouterDef();
  const setAsyncRouter = useSetAtom(asyncRouterAtom);

  useEffect(() => {
    setAsyncRouter(asyncRouter);
  }, [asyncRouter, setAsyncRouter]);
}

export function useAsyncRouter() {
  return useAtomValue(asyncRouterAtom);
}
