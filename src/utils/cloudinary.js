import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
});


const uploadOnCloudinary = async(localfilepath)=>{
   try {
    if(!localfilepath){
        return null
    }
    //upload file in cloudinary
  const response=  cloudinary.uploader.upload(localfilepath, {
        resource_type: 'auto'
    })
    //file has been uploaded successfully
    console.log('file is uploaded in cloudinary', response.url);
    return response
   } catch (error) {
      fs.unlinkSync(localfilepath) //removed locally saved temporary file as th upload operation get failed
      return null 
   }
}

export {uploadOnCloudinary}


