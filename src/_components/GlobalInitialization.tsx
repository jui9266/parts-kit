import { useAsyncRouterInitialization } from "@/_hooks/useAsyncRouter";
import { useInterceptor } from "@/app/(client)/_hooks/useInterceptor";
import { useEffect } from "react";
import ReactModal from "react-modal";

export default function GlobalInitialization() {
  // request, response 인터셉터 설정
  useInterceptor();
  /**
   * @docs https://react.dev/reference/react/useTransition#usetransition
   * "Call useTransition at the top level of your component to mark some state updates as Transitions."
   * 페이지 이동을 감지하기 위해서는 useTransition을 최상위 요소에서 호출해야 함
   */
  useAsyncRouterInitialization();

  useEffect(() => {
    ReactModal.setAppElement("body");
  }, []);

  return null;
}
