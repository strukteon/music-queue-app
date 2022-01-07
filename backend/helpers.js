export function generateMessage(success = false, message = "INTERNAL_SERVER_ERROR", data = null) {
    return {
        success,
        message,
        data
    }
}

export function generateJsonMessage(success, message, data) {
    return JSON.stringify(generateMessage(success, message, data))
}
