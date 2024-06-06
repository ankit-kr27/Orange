// wrapper for executing async functions

const asyncHandler = (requestHandler)=>{
    return (req, res, next)=>{
        try{
            Promise.resolve(requestHandler(req, res, next))   // next is just a boolean flag if the MW is done working or not
        }
        catch(err){
            res.status(err.statusCode || 500).json({      // sets the http error status
                            success: false,
                            message: err.message
                        })
            next(err)
        }
    }
}


// const asyncHandler = ()=>{}
// const asyncHandler = (func) => () => {} // a function accepting a function and returning a function
// const asyncHandler = (func) =>async () => {} 

// const asyncHandler = (fn) => async (req, res, next) =>{ 
//     try{
//         await fn(req, res, next)
//     }catch(err){
//         res.status(err.code || 500).json({      // sets the http error status
//             success: false,
//             message: err.message
//         })
//     }
// }

export {asyncHandler}