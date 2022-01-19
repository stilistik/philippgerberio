import { UploadHandler } from "@remix-run/node/formData";
import fs from "fs";
import path from "path";
import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";

const UPLOAD_DIR = "public/uploads";

// export const uploadHandler: UploadHandler = async ({ stream, filename }) => {
//   const fileURL = `uploads/${filename}`;
//   const filepath = path.resolve(UPLOAD_DIR, filename);

//   // Get the file as a buffer
//   const chunks = [];
//   for await (const chunk of stream) chunks.push(chunk);
//   const buffer = Buffer.concat(chunks);

//   fs.writeFileSync(filepath, buffer);
//   return fileURL;
// };

export const uploadHandler = unstable_createFileUploadHandler({
  directory: UPLOAD_DIR,
  maxFileSize: 5_000_000,
});

export const parseFormData = (request: Request) => {
  return unstable_parseMultipartFormData(request, uploadHandler);
};
