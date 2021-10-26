import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useIntersection } from "./hooks/intersection";
import "./App.css";

const MAX_GISTS = 3000;
const PER_PAGE = 30;
const MAX_PAGE = MAX_GISTS / PER_PAGE;

const fetchGists = async (page: number) => {
    return await axios
        .get(`https://api.github.com/gists/public?page=${"" + page}`)
        .then(({ data }) => {
            return data;
        })
        .catch((error) => alert(error));
};

const App = () => {
    const ref = useRef<HTMLDivElement>(
        null
    ) as React.MutableRefObject<HTMLDivElement>;
    const intersection = useIntersection(ref);
    const [intersected, setIntersected] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [gistsList, setGistsList] = useState<any>(undefined);
    const [pageCounter, setPageCounter] = useState<number>(1);

    useEffect(() => {
        setIntersected(intersection);
    }, [intersection]);

    useEffect(() => {
        async function InfinityAPICall() {
            const data = await fetchGists(pageCounter);
            setGistsList([...gistsList, ...data]);
            setPageCounter(pageCounter + 1);
        }

        if (intersected && !loading) {
            console.log({ MAX_PAGE, pageCounter });
            setLoading(true);
            InfinityAPICall();
            setLoading(false);
        }
    }, [intersected, loading]);

    useEffect(() => {
        setLoading(true);
        async function initialAPICall() {
            const data = await fetchGists(pageCounter);
            setGistsList(data);
            setPageCounter(pageCounter + 1);
        }
        initialAPICall();
        setLoading(false);
    }, []);

    return (
        <div>
            {gistsList &&
                gistsList.map((item: any, idx: number) => {
                    const {
                        owner: { avatar_url },
                        files,
                    } = item;
                    return (
                        <div key={idx}>
                            <div className="list-item">
                                <img src={avatar_url} alt={`${idx}-avatar`} />
                                <p>{Object.keys(files)[0]}</p>
                            </div>
                            <hr />
                        </div>
                    );
                })}
            {pageCounter === MAX_PAGE && (
                <div>This is the end of the data! 🌞</div>
            )}
            {!loading && <div ref={ref}>Loading...</div>}
        </div>
    );
};

export default App;
