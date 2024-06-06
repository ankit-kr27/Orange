class ApiError extends Error{   // Extending the functionalities of Error class of nodejs
    constructor(
        statusCode, 
        message = "Something went wrong",
        errors = [],     // different errors
        stack = '',     // error stack
    ){
        super(message) // whenever we override a constructor, we make a super call
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}