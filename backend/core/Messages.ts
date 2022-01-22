export function generateMessage(success, message = null, data = null) {
    return {
        success,
        message,
        data
    }
}