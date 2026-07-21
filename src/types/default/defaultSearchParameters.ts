import { SearchParameters } from "../core/SearchParameters";

export function defaultSearchParamters(): SearchParameters {
    return {
        q: null,
        atleast: null,
        categories: null,
        colors: null,
        order: "desc",
        page: 1,
        purity: null,
        ratios: null,
        resolutions: null,
        seed: null,
        sorting: null,
        topRange: "3M"
    }
}