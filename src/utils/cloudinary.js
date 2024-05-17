import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()
cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});
 

// const uploadOnCloudinary = async(localfilepath)=>{
//    try {
//     if(!localfilepath){
//         return null
//     }
//     //upload file in cloudinary
//   const response=  await cloudinary.uploader.upload(localfilepath, {
//         resource_type: 'auto'
//     }) 
//     console.log(response);
//     //file has been uploaded successfully
//     console.log('file is uploaded in cloudinary', response.url);
//     return response
//    } catch (error) {
//       fs.unlinkSync(localfilepath) //removed locally saved temporary file as th upload operation get failed
//       return null 
//    }
// }
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        fs.unlinkSync(localFilePath)
        
        return response;

    } catch (error) {
        console.log('error in clooudinart', error);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}




