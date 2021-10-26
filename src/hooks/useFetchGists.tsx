import { useEffect, useState } from "react";
import axios from "axios";

export interface IGist {
    avatar_url: string;
    files: any;
}

export const useFetchGists = (pageNumber: number) => {
    console.log({ pageNumber });
    const [isLoading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [gistsList, setGistsList] = useState<IGist[]>([]);

    useEffect(() => {
        setLoading(true);
        setError(undefined);
        axios
            .get(
                `https://api.github.com/gists/public?page=${"" + pageNumber}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((res) => {
                const necessaryData = res.data.map((item: any) => {
                    const {
                        owner: { avatar_url },
                        files,
                    } = item;
                    return {
                        avatar_url,
                        files,
                    };
                });
                setLoading(false);
                setGistsList([...gistsList, ...necessaryData]);
            })
            .catch((error) => {
                setError(error.message);
            });
    }, [pageNumber]);
    return { isLoading, error, gistsList };
};
