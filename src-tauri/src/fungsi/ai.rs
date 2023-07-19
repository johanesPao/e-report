use chatgpt::prelude::Url;
use chatgpt::prelude::*;
use chatgpt::types::Role;
use std::str::FromStr;

use crate::struktur::{KlienKonfigChatGPT, RolePromptChatGPT};

fn chatgpt_klien(klien_konfig: &KlienKonfigChatGPT) -> Result<ChatGPT> {
    // mapping ChatGPTEngine
    let chatgpt_engine = pemetaan_engine(klien_konfig.model_gpt.clone())?;
    // build klien ChatGPT
    let klien = ChatGPT::new_with_config(
        klien_konfig.kunci_api.clone(),
        ModelConfigurationBuilder::default()
            .api_url(Url::from_str(klien_konfig.endpoint_api.as_str()).unwrap())
            .temperature(klien_konfig.temperature)
            .engine(chatgpt_engine)
            .build()
            .unwrap(),
    )?;
    Ok(klien)
}

pub async fn kueri(
    klien_konfig: &KlienKonfigChatGPT,
    role_prompt: RolePromptChatGPT,
) -> Result<String> {
    // buat klien chatgpt
    let klien = chatgpt_klien(klien_konfig)?;
    // buat Vector ChatMessage
    let mut vektor_pesan: Vec<ChatMessage> = Vec::new();
    // ekstrak role ChatMessage ke dalam vektor
    for hitung in 0..role_prompt.role.len() {
        // mapping nilai string role dengan Enum Role pada ChatGPTrs module
        let pemetaan_role = pemetaan_role(role_prompt.role[hitung].role.clone())?;
        // buat pesan
        let pesan = ChatMessage {
            role: pemetaan_role,
            content: role_prompt.role[hitung].content.clone(),
        };
        // push pesan ke dalam vektor_pesan
        vektor_pesan.push(pesan);
    }
    // konversi prompt pada RolePromptChatGPT dari RoleKontenChatGPT menjadi ChatMessage
    let prompt = ChatMessage {
        role: pemetaan_role(role_prompt.prompt.role)?,
        content: role_prompt.prompt.content,
    };
    // penambahan prompt pada ChatMessage
    vektor_pesan.push(prompt);
    // inisiasi percakapan dengan chatgpt dan kembalikan pesan respon chatgpt
    let respon = klien
        .send_history(&vektor_pesan)
        .await?
        .message()
        .content
        .clone();
    // ChatGPT::types::ChatMessage()
    Ok(respon)
}

fn pemetaan_engine(model: String) -> Result<ChatGPTEngine> {
    let chatgpt_engine: ChatGPTEngine;
    match model.as_str() {
        "gpt-3.5-turbo" => chatgpt_engine = ChatGPTEngine::Gpt35Turbo,
        "gpt-3.5-turbo-0301" => chatgpt_engine = ChatGPTEngine::Gpt35Turbo_0301,
        "gpt-4" => chatgpt_engine = ChatGPTEngine::Gpt4,
        "gpt-4-32k" => chatgpt_engine = ChatGPTEngine::Gpt4_32k,
        "gpt-4-0314" => chatgpt_engine = ChatGPTEngine::Gpt4_0314,
        "gpt-4-32k-0314" => chatgpt_engine = ChatGPTEngine::Gpt4_32k_0314,
        _ => chatgpt_engine = ChatGPTEngine::Gpt35Turbo, // Untuk kasus lainnya, default to Gpt35Turbo
    };
    Ok(chatgpt_engine)
}

fn pemetaan_role(role: String) -> Result<Role> {
    let enum_role: Role;
    match role.as_str() {
        "system" => enum_role = Role::System,
        "user" => enum_role = Role::User,
        "assistant" => enum_role = Role::Assistant,
        _ => enum_role = Role::User, // UNtuk kasus lainnya, default to User
    };
    Ok(enum_role)
}
