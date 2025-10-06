import { useAsyncRouterInitialization } from "@/_hooks/useAsyncRouter";

export default function GlobalInitialization() {
  /**
   * @docs https://react.dev/reference/react/useTransition#usetransition
   * "Call useTransition at the top level of your component to mark some state updates as Transitions."
   * 페이지 이동을 감지하기 위해서는 useTransition을 최상위 요소에서 호출해야 함
   */
  useAsyncRouterInitialization();

  return null;
}
