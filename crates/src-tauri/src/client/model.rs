use std::str::FromStr;

use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, Debug, TS)]
pub struct SearchParametersCategories {
    general: bool,
    anime: bool,
    people: bool,
}

impl Serialize for SearchParametersCategories {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&format!(
            "{}{}{}",
            self.general as i8, self.anime as i8, self.people as i8
        ))
    }
}

#[derive(Deserialize, Debug, TS)]
pub struct SearchParametersPurities {
    sfw: bool,
    sketchy: bool,
    nsfw: bool,
}

impl Serialize for SearchParametersPurities {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&format!(
            "{}{}{}",
            self.sfw as i8, self.sketchy as i8, self.nsfw as i8
        ))
    }
}

#[derive(Serialize, Deserialize, Default, Debug, TS)]
#[serde(rename_all = "snake_case")]
pub enum SearchParametersSort {
    #[default]
    DateAdded,
    Relevance,
    Random,
    Views,
    Favorites,
    Toplist,
}

#[derive(Serialize, Deserialize, Default, Debug, TS)]
#[serde(rename_all = "snake_case")]
pub enum SearchParametersOrder {
    #[default]
    Desc,
    Asc,
}

#[derive(Serialize, Deserialize, Default, Debug, TS)]
pub enum SearchParametersTopRange {
    #[serde(rename = "1d")]
    OneDay,
    #[serde(rename = "3d")]
    ThreeDays,
    #[serde(rename = "1w")]
    OneWeek,
    #[default]
    #[serde(rename = "1M")]
    OneMonth,
    #[serde(rename = "3M")]
    ThreeMonths,
    #[serde(rename = "6M")]
    SixMonths,
    #[serde(rename = "1y")]
    OneYear,
}

#[derive(TS, Deserialize, Debug)]
pub struct Resolution {
    width: u32,
    height: u32,
}

impl Serialize for Resolution {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&format!("{}x{}", self.width, self.height))
    }
}

#[derive(TS, Deserialize, Debug)]
pub struct AspectRatio {
    width: u8,
    height: u8,
}

impl Serialize for AspectRatio {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&format!("{}x{}", self.width, self.height))
    }
}

#[derive(Debug, thiserror::Error)]
pub enum SearchParametersColorError {
    #[error("missing '#' prefix")]
    MissingPrefix,
    #[error("invalid length: expected 3 or 6 hex digits, got {0}")]
    InvalidLength(usize),
    #[error("invalid hex character: {0}")]
    InvalidHex(#[from] std::num::ParseIntError),
}

#[derive(TS, Deserialize, Debug)]
pub struct SearchParametersColor {
    r: u8,
    g: u8,
    b: u8,
}

impl FromStr for SearchParametersColor {
    type Err = SearchParametersColorError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let s = s
            .strip_prefix('#')
            .ok_or(SearchParametersColorError::MissingPrefix)?;

        let (r, g, b) = match s.len() {
            // shorthand: #RGB → #RRGGBB
            3 => {
                let r = u8::from_str_radix(&s[0..1].repeat(2), 16)?;
                let g = u8::from_str_radix(&s[1..2].repeat(2), 16)?;
                let b = u8::from_str_radix(&s[2..3].repeat(2), 16)?;
                (r, g, b)
            }
            6 => {
                let r = u8::from_str_radix(&s[0..2], 16)?;
                let g = u8::from_str_radix(&s[2..4], 16)?;
                let b = u8::from_str_radix(&s[4..6], 16)?;
                (r, g, b)
            }
            n => return Err(SearchParametersColorError::InvalidLength(n)),
        };

        Ok(SearchParametersColor { r, g, b })
    }
}

impl Serialize for SearchParametersColor {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(&format!("{:02X}{:02X}{:02X}", self.r, self.g, self.b))
    }
}

#[derive(Serialize, Deserialize, TS, Debug)]
#[serde(rename_all = "camelCase")]
#[ts(export)]
pub struct SearchParameters {
    #[serde(skip_serializing_if = "Option::is_none")]
    q: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    categories: Option<SearchParametersCategories>,
    #[serde(skip_serializing_if = "Option::is_none")]
    purity: Option<SearchParametersPurities>,
    #[serde(skip_serializing_if = "Option::is_none")]
    sorting: Option<SearchParametersSort>,
    #[serde(skip_serializing_if = "Option::is_none")]
    order: Option<SearchParametersOrder>,
    #[serde(skip_serializing_if = "Option::is_none")]
    top_range: Option<SearchParametersTopRange>,
    #[serde(skip_serializing_if = "Option::is_none")]
    atleast: Option<Resolution>,
    #[serde(skip_serializing_if = "Option::is_none")]
    resolutions: Option<Vec<Resolution>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    ratios: Option<Vec<AspectRatio>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    colors: Option<Vec<SearchParametersColor>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    page: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    seed: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
pub struct Meta {
    pub current_page: u32,
    pub last_page: u32,
    pub per_page: u32,
    pub total: u32,
    pub query: Option<Query>,
    pub seed: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[serde(untagged)]
pub enum Query {
    Text(String),
    Tag(TagQuery),
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
pub struct TagQuery {
    pub id: u32,
    pub tag: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export)]
pub struct SearchResponse {
    data: Vec<Wallpaper>,
    meta: Meta,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
pub struct Wallpaper {
    pub id: String,
    pub url: String,
    pub short_url: String,
    pub views: u64,
    pub favorites: u64,
    pub source: String,
    pub purity: String,
    pub category: String,
    pub dimension_x: u32,
    pub dimension_y: u32,
    pub resolution: String,
    pub ratio: String,
    pub file_size: u64,
    pub file_type: String,
    pub created_at: String,
    pub colors: Vec<String>,
    pub path: String,
    pub thumbs: Thumbs,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
pub struct Thumbs {
    pub large: String,
    pub original: String,
    pub small: String,
}
