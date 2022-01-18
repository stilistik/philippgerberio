import { UploadHandler } from "@remix-run/node/formData";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "public/uploads";

export const uploadHandler: UploadHandler = ({ stream, filename }) => {
  return new Promise((resolve, reject) => {
    const fileURL = `uploads/${filename}`;
    const filepath = path.resolve(UPLOAD_DIR, filename);
    stream
      .pipe(fs.createWriteStream(filepath))
      .on("error", (error) => {
        reject(error);
      })
      .on("finish", () => {
        resolve(fileURL);
      });
  });
};
