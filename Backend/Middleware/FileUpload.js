const multer =require("multer")


const MYME_TYPE={
    "image/jpg":"jpg",
    "image/jpeg":"jpeg",
    "image/png":"png",
}


const fileUpload =multer({
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
          cb(null,"upload/images")
        },
        filename:(req,file,cb)=>{
         const ext=MYME_TYPE[file.mimetype]
         cb(null,Math.floor(Math.random() * 100)+'.'+ext)
        }
    }),
    filefilter:(req,file,cb)=>{
        const isValid =!!MYME_TYPE[file.mimetype]
        const error =isValid ? null : new Error("invalid image type")
        cb(error,isValid)
    }
})

module.exports=fileUpload