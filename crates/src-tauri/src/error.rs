use serde::Serialize;
use std::error::Error as StdError;

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
        log::error!("{}", &self.to_string());
        s.serialize_str(&self.to_string())
    }
}
