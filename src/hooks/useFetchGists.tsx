import { useEffect, useState } from "react";
import axios from "axios";

export interface IGist {
    avatar_url: string;
    files: any;
}

export const useFetchGists = (pageNumber: number) => {
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
                // eslint react-hooks/exhaustive-deps
                setGistsList((prev) => [...prev, ...necessaryData]);
            })
            .catch((error) => {
                setError(error.response.data.message);
            });
    }, [pageNumber]);
    return { isLoading, error, gistsList };
};
