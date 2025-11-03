// // /* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION_NAME,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = (req: any): Promise<void> =>
  new Promise((resolve, reject) => {
    const uploadSingle = upload.single("logo");
    uploadSingle(req, {} as any, async (err: any) => {
      if (err) return reject(err);

      if (req.file) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `fuloos/${req.file.originalname}`,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        };

        try {
          const uploadResult = await s3.upload(params).promise();
          req.file.location = uploadResult.Location; // S3 URL
          resolve();
        } catch (s3Error) {
          reject(s3Error);
        }
      } else {
        resolve();
      }
    });
  });

// import multer from "multer";
// import AWS from "aws-sdk";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_S3_REGION_NAME,
// });

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// export const uploadMiddleware = (req: any): Promise<void> =>
//   new Promise((resolve, reject) => {
//     const uploadSingle = upload.single("logo");
//     uploadSingle(req, {} as any, async (err: any) => {
//       if (err) return reject(err);

//       if (req.file) {
//         const params = {
//           Bucket: process.env.AWS_STORAGE_BUCKET_NAME!,
//           Key: `Jaypee Associates/${Date.now()}-${req.file.originalname.replace(/ /g, "_")}`,
//           Body: req.file.buffer,
//           ContentType: req.file.mimetype,
//         };

//         try {
//           const uploadResult = await s3.upload(params).promise();
//           req.file.location = uploadResult.Location; // S3 URL
//           resolve();
//         } catch (s3Error) {
//           reject(s3Error);
//         }
//       } else {
//         resolve();
//       }
//     });
//   });
// ;


