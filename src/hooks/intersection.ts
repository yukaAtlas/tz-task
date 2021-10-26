import { useState, useEffect } from "react";

export const useIntersection = (
    ref: React.MutableRefObject<HTMLDivElement>
) => {
    const [intersecting, setIntersecting] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting);
        });
        // observer.observe(ref.current);
        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.unobserve(ref.current);
            // observer.disconnect();
        };
    }, []);

    return intersecting;
};
