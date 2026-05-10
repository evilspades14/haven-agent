use std::error::Error as StdError;
use serde::Serialize;

pub type SafeError = Box<dyn StdError + Send + Sync>;

#[derive(Debug, thiserror::Error)]
pub enum CommandError {
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    #[error(transparent)]
    Other(#[from] SafeError),
}

// Manual Serialize impl required by Tauri
impl Serialize for CommandError {
    fn serialize<S: serde::Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_string())
    }
}