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
    console.log('effect');
    const isSame =
      prevDeps.current.length === deps.length &&
      prevDeps.current.every((obj, index) => isEqualByProps(obj, deps[index], props));

    console.log(isSame);

    if (isFirst.current || !isSame) {
      console.log('func');
      effectFunc();
    }

    isFirst.current = false;
    prevDeps.current = [...deps];
  }, [deps]);
}
