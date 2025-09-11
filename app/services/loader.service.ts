import { enable as enableLoader, disable as disableLoader } from "~/store/loader.slice";
import { store } from "~/store/store";

export function enable(name: string) {
  store.dispatch(enableLoader(name));
}

export function disable(name: string) {
  store.dispatch(disableLoader(name));
}
