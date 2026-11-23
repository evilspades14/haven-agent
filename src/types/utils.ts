export type ParsedSearchCategories = {
  general: boolean;
  anime: boolean;
  people: boolean;
};

export function parseSearchCategories(value: string): ParsedSearchCategories {
  const [general, anime, people] = value.split("");
  const generalBoolean = general === "1" ? true : false;
  const animeBoolean = anime === "1" ? true : false;
  const peopleBoolean = people === "1" ? true : false;
  return {
    general: generalBoolean,
    anime: animeBoolean,
    people: peopleBoolean,
  };
}

export function buildSearchCategories(value: ParsedSearchCategories): string {
  const generalString = value.general ? "1" : "0";
  const animeString = value.anime ? "1" : "0";
  const peopleString = value.people ? "1" : "0";
  return `${generalString}${animeString}${peopleString}`;
}

export type ParsedSearchPurities = {
  sfw: boolean;
  sketchy: boolean;
  nsfw: boolean;
};

export function parseSearchPurities(value: string): ParsedSearchPurities {
  const [sfw, sketchy, nsfw] = value.split("");
  const sfwBoolean = sfw === "1" ? true : false;
  const sketchyBoolean = sketchy === "1" ? true : false;
  const nsfwBoolean = nsfw === "1" ? true : false;
  return {
    sfw: sfwBoolean,
    sketchy: sketchyBoolean,
    nsfw: nsfwBoolean,
  };
}

export function buildSearchPurities(value: ParsedSearchPurities): string {
  const sfwString = value.sfw ? "1" : "0";
  const sketchyString = value.sketchy ? "1" : "0";
  const nsfwString = value.nsfw ? "1" : "0";
  return `${sfwString}${sketchyString}${nsfwString}`;
}