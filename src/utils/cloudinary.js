import dotenv from 'dotenv'
dotenv.config()
import {v2 as cloudinary} from 'cloudinary';      
console.log(process.env.cloud_name);
cloudinary.config({ 
  cloud_name:process.env.cloud_name, 
  api_key: process.env.api_key, 
  api_secret: process.env.api_secret ,
  secure:true
});
export default cloudinary