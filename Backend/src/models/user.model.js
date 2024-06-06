import mongoose, {Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    // unique id is provided by the mongoDB database automatically

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,     // it removes whitespaces from the beginning and the end of the string.
        index: true    // expensive but optimized for search purposes
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,    // cloudinary url
        required: true
    },
    coverImage: {
        type: String    // cloudinary url
    },
    password: {
        type: String,
        required: [true, 'Password is required']    // with boolean field we can give a custom error message
    },
    refreshToken: {
        type: String
    }
}, {timestamps: true})

userSchema.pre("save", async function (next){   // pre middleware executes the function before the data is being saved to encrypt the data
    if(this.isModified("password"))     // only hash the password when it is modified
        this.password = await bcrypt.hash(this.password, 10)  // hash the pw with 10 rounds of execution
    next();
})
// "function": arrow functions doesn't support the context of this keyword
// "async": because the process of encryption takes time
// "next": when the work is done next() is executed to pass the flag to the next execution

userSchema.methods.isPasswordCorrect = async function(password){   // injecting methods into schema
     // Schema also gives us to define methods to be executed
    return await bcrypt.compare(password, this.password)    // compare returns true or false
}

userSchema.methods.generateAccessToken = function(){    // no need for async function as it's done immediately
    return jwt.sign(    // payload | Object | Buffer
        {   // payload
            _id: this._id,   // Provided by mongoDB
            email: this.email,
            username: this.username,
            fullName: this.fullName
            // _id is the only necessary field, others are not.
        },
        process.env.ACCESS_TOKEN_SECRET,     // Object
        {   // passed in object
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY      // Buffer
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(    
        {   // payload
            _id: this._id,   // Provided by mongoDB
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY     // refresh token expires later than access token 1d vs 10d (user defined values)
        }
    )
}
// access token and refresh token are same but the difference lies in their usage

export const User = mongoose.model("User", userSchema)