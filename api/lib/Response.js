const CustomError = require('./Error');
const { HTTP_CODES } = require('../config/Enum');

class Response {
    constructor() { }
    static successResponse(code=200,data) {
        return {
            code,
            data,
        }
    }

    static errorResponse(error, lang) {
        console.error(error);
        if (error instanceof CustomError) {
            return {
                code: error.code,
                error: {
                    message: error.message,
                    description: error.description
                }
            }
        } else if (error.message.includes("E11000")) {
            return {
                code: Enum.HTTP_CODES.CONFLICT,
                error: {
                    message: i18n.translate("COMMON.ALREADY_EXIST", lang),
                    description: i18n.translate("COMMON.ALREADY_EXIST", lang)
                }
            }
        }

        return {
            code: Enum.HTTP_CODES.INT_SERVER_ERROR,
            error: {
                message: i18n.translate("COMMON.UNKNOWN_ERROR", lang),
                description: error.message
            }
        }
    }
}

module.exports = Response;