import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "remix";

const UPLOAD_DIR = "public/uploads";

export const uploadHandler = unstable_createFileUploadHandler({
  directory: UPLOAD_DIR,
  maxFileSize: 5_000_000,
});

export const parseFormData = (request: Request) => {
  return unstable_parseMultipartFormData(request, uploadHandler);
};
