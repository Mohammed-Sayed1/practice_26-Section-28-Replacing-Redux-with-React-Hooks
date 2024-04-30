import { useEffect, useState } from "react";

/** Deffining these variables here and not inside the custom hook, to not redeffine them when the state changes and the component rerender
 * and to make it shared across all concerned components
 */
let globalState = {};
let listeners = [];
let actions = {};

export const useStore = (shouldListen = true) => {
  const setState = useState(globalState)[1];

  const dispatch = (actionIdentifier, payload) => {
    const newState = actions[actionIdentifier](globalState, payload);
    globalState = { ...globalState, ...newState };

    /** the next for loop for just rerender the component that uses this custom hook */
    for (const listener of listeners) {
      listener(globalState);
    }
  };

  /** Using useEffect with empty deps array that will run once when the component first mounts and once when the component unmounts
   * to add a pointer setState function to listeners array when the component first mounts
   * and to remove it when the component unmounts by making useEffect returns a cleanup function
   */
  useEffect(() => {
    if (shouldListen) {
      listeners.push(setState);
    }

    return () => {
      if (shouldListen) {
        listeners = listeners.filter((li) => li !== setState);
      }
    };
  }, [setState, shouldListen]);

  return [globalState, dispatch];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = { ...globalState, ...initialState };
  }
  actions = { ...actions, ...userActions };
};
