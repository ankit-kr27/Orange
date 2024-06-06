import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({     // this configuration gives us the permission to upload files 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{     // localFilePath is the locally saved temporary file
    try {
        if(!localFilePath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"   // automatically determine the type of the file
        })
        // file has been uploaded successfully
        // console.log("File has been uploaded on cloudinary! ", response);

        fs.unlinkSync(localFilePath)    // we did it syncronously because this utility function can be called for different files and we don't want it to be done in the background

        return response;    // response will give us the url and other data

    } catch (error) {
        fs.unlink(localFilePath)    // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

const deleteFromCloudinary = async (url, resourceType)=>{
    try{
        // http://res.cloudinary.com/dvyovlngn/image/upload/v1707507668/n8ap7ojlaobu50h4vy8j.png
    
        const publicId = url.split('/').pop().split('.')[0]

        const response = await cloudinary.uploader.destroy(publicId, {resource_type: resourceType})

        return response
    } catch(error){
        console.log(error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });
