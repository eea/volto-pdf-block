import { useRef, useEffect } from 'react';

export function useVerticallScroll() {
  const elRef = useRef();
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        // eslint-disable-next-line no-console
        console.log(e);
        if (e.deltaY === 0) return;
        e.preventDefault();
        el.scrollTo({
          top: el.scrollTop + e.deltaY,
          behavior: 'smooth',
        });
      };
      el.addEventListener('wheel', onWheel);
      return () => el.removeEventListener('wheel', onWheel);
    }
  }, []);
  return elRef;
}
