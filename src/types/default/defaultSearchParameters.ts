import { SearchParameters } from "../core/SearchParameters";

export function defaultSearchParamters(): SearchParameters {
    return {
        q: "",
        atleast: null,
        categories: null,
        colors: null,
        order: "desc",
        page: 1,
        purity: null,
        ratios: null,
        resolutions: null,
        seed: null,
        sorting: "relevance",
        topRange: "3M"
    }
}