import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "public/uploads";

export const uploadHandler = unstable_createFileUploadHandler({
  directory: UPLOAD_DIR,
  file: ({ filename }) => filename,
});

export const parseFormData = (request: Request) => {
  return unstable_parseMultipartFormData(request, uploadHandler);
};

export const deletefile = (filePath: string) => {
  try {
    const p = path.resolve(UPLOAD_DIR, filePath.replace("/uploads/", ""));
    fs.unlinkSync(p);
  } catch (error) {
    console.log(error);
  }
};
