use std::str::FromStr;

use alloy::signers::Signature;
use lib_types::shared::api_error::ApiErrorCode;

use crate::error::api_error::ApiError;

pub fn to_hex_string(bytes: [u8; 65]) -> String {
    let strs: Vec<String> = bytes.iter().map(|b| format!("{:02X}", b)).collect();
    strs.join("")
}

pub fn verify_signature(
    signature: String,
    message: String,
    target_addr: String,
) -> Result<bool, ApiError> {
    let sig = Signature::from_str(&signature).map_err(|_| {
        ApiError::bad_request()
            .code(ApiErrorCode::InvalidSignature)
            .message("Failed to parse signature")
    })?;

    // Recover the signer from the message.
    let recovered = sig.recover_address_from_msg(message).map_err(|e| {
        ApiError::bad_request()
            .code(ApiErrorCode::InvalidSignature)
            .message(format!("Failed to recover signature: {}", e))
    })?;
    println!("REC {} {}", recovered.to_string(), target_addr);
    Ok(recovered.to_string().to_lowercase() == target_addr.to_lowercase())
}
