import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = "public/uploads";

export const uploadHandler = unstable_createFileUploadHandler({
  directory: UPLOAD_DIR,
  maxFileSize: 5_000_000,
});

export const parseFormData = (request: Request) => {
  return unstable_parseMultipartFormData(request, uploadHandler);
};

export const deletefile = (filePath: string) => {
  try {
    fs.unlinkSync(path.resolve("public", filePath));
  } catch (error) {
    console.log(error);
  }
};
