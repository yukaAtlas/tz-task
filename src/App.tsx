import React, { useState, useRef, useCallback } from "react";
import { useFetchGists, IGist } from "./hooks";
import "./App.scss";

const MAX_GISTS = 3000;
const PER_PAGE = 30;
const MAX_PAGE = MAX_GISTS / PER_PAGE;

const App = () => {
    const [pageCounter, setPageCounter] = useState<number>(1);
    const { isLoading, error, gistsList } = useFetchGists(pageCounter);
    const defaultModalValue = {
        isOpen: false,
        selectedProfileURL: "",
    };
    const [modal, setModal] = useState<{
        isOpen: boolean;
        selectedProfileURL: string;
    }>(defaultModalValue);

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

    React.useEffect(() => {
        console.log({ modal });
    }, [modal]);

    const handleFadeAnimation =
        (idx: number) => (_: React.MouseEvent<HTMLElement>) => {
            setModal({
                isOpen: true,
                selectedProfileURL: gistsList[idx].avatar_url,
            });

            setTimeout(() => {
                setModal(defaultModalValue);
            }, 3000);
        };

    return (
        <>
            <div>
                {error && <div>{error}</div>}
                {gistsList.length > 0 &&
                    gistsList.map((item: IGist, idx: number) => {
                        return idx === gistsList.length - 1 &&
                            pageCounter < MAX_PAGE ? (
                            <div
                                key={idx}
                                ref={lastElement}
                                onClick={handleFadeAnimation(idx)}
                            >
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
                            <div key={idx} onClick={handleFadeAnimation(idx)}>
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
            {modal.isOpen && (
                <div className="modal-root">
                    <div
                        className={`avatar-wrapper ${
                            modal.isOpen ? `avatar-animation` : ""
                        }`}
                    >
                        <img
                            src={modal.selectedProfileURL}
                            alt="Selected Profile Avatar"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default App;
