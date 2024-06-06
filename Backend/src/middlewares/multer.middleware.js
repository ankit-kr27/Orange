// Multer is a node. js middleware for handling multipart/form-data , which is primarily used for uploading files

import multer from "multer";

const storage = multer.diskStorage({    // diskStorage a StorageEngine implementation configured to store files on the local file system
    destination: function (req, file, cb){  // A string or function that determines the destination path for uploaded files 
        // cb: callback
        cb(null, "public/temp")
    },
    filename: function (req, file, cb){     // A function that determines the name of the uploaded file. If nothing is passed, Multer will generate a 32 character pseudorandom hex string with no extension

        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)

        // here we can define some expressions to create a unique filename, but we are avoiding that as of now and going with the original name
        cb(null, file.originalname)
    }
})

export const upload = multer({
    storage: storage
})

// file gets uploaded to any defined route (via post request).
// multer exports the upload function
// upload function gives us the filename uploaded via multer in the server in public/temp folder 
// the file will be uploaded to cloudinary
// fs.unlink will delete the file from temp

// we can also upload the data to the memory (i.e. ram) but that will be resource extensive. that is why we are uploading to the disk.