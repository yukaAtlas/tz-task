import { useState, useRef, useCallback } from "react";
import { useFetchGists, IGist } from "./hooks";
import "./App.css";

const MAX_GISTS = 3000;
const PER_PAGE = 30;
const MAX_PAGE = MAX_GISTS / PER_PAGE;

const App = () => {
    const [pageCounter, setPageCounter] = useState<number>(1);
    const { isLoading, error, gistsList } = useFetchGists(pageCounter);

    const ref = useRef<HTMLElement>(
        null
    ) as React.MutableRefObject<HTMLElement>;

    const lastElement = useCallback(
        (node) => {
            if (isLoading) return;
            const observer = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting && pageCounter <= MAX_PAGE) {
                    setPageCounter(pageCounter + 1);
                }
            });
            if (ref.current) {
                observer.disconnect();
            }
            if (node) {
                observer.observe(node);
            }
        },
        [isLoading]
    );

    return (
        <div>
            {error && <div>{error}</div>}
            {gistsList.length > 0 &&
                gistsList.map((item: IGist, idx: number) => {
                    return idx === gistsList.length - 1 &&
                        pageCounter < MAX_PAGE ? (
                        <div key={idx} ref={lastElement}>
                            <div className="list-item">
                                <img
                                    src={item.avatar_url}
                                    alt={`${idx}-avatar`}
                                />
                                <p>{Object.keys(item.files)[0]}</p>
                            </div>
                            <hr />
                        </div>
                    ) : (
                        <div key={idx}>
                            <div className="list-item">
                                <img
                                    src={item.avatar_url}
                                    alt={`${idx}-avatar`}
                                />
                                <p>{Object.keys(item.files)[0]}</p>
                            </div>
                            <hr />
                        </div>
                    );
                })}
            {pageCounter === MAX_PAGE && (
                <div>This is the end of the data! 🌞</div>
            )}
            {isLoading && <div>Loading...</div>}
        </div>
    );
};

export default App;
