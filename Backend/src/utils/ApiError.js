class ApiError extends Error {
    // Extending the functionalities of the Error class of Node.js
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [], // Array to hold different errors
        stack = "" // Error stack trace
    ) {
        super(message); // Call the parent class constructor with the message
        this.statusCode = statusCode;
        this.message = message;
        this.errors = errors;
        this.success = false;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // Determine the status based on the status code
        this.isOperational = true; // Operational errors are known and can be handled by the application

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
