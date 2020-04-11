import { useEffect, useRef } from 'react';

function isEqualByProps(object1, object2, props) {
  let isEqual = true;

  // eslint-disable-next-line no-restricted-syntax
  for (const prop of props) {
    isEqual = object1[prop] === object2[prop];
    if (!isEqual) {
      break;
    }
  }

  return isEqual;
}

export default function useDeepEffect(effectFunc, deps, props) {
  const isFirst = useRef(true);
  const prevDeps = useRef(deps);

  useEffect(() => {
    const isSame =
      prevDeps.current.length === deps.length &&
      prevDeps.current.every((obj, index) => isEqualByProps(obj, deps[index], props));

    if (isFirst.current || !isSame) {
      effectFunc();
    }

    isFirst.current = false;
    prevDeps.current = [...deps];
  }, [deps]);
}
