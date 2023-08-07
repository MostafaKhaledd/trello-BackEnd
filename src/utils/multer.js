import multer from "multer";
export const fileValidation = {
    image: ['image/jpag', 'image/png']
}
export function fileUpload(customValidation = []) {
    const storage = multer.diskStorage({})
    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("in-valid format"), false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}