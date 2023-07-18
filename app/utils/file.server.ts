import {
  NodeOnDiskFile,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import fs from "fs";
import { db } from "./db.server";
import path from "path";
import { encode } from "blurhash";
import sharp from "sharp";

const UPLOAD_DIR = "public/uploads";

export const uploadHandler = unstable_createFileUploadHandler({
  directory: UPLOAD_DIR,
  file: ({ filename }) => filename,
  maxPartSize: 5_000_000_000,
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
const encodeImageToBlurhash = (p: string): Promise<string> =>
  new Promise((resolve, reject) => {
    sharp(path.resolve(UPLOAD_DIR, p))
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: "inside" })
      .toBuffer((err, buffer, { width, height }) => {
        if (err) return reject(err);
        resolve(encode(new Uint8ClampedArray(buffer), width, height, 4, 4));
      });
  });

export async function handleFileUpload(
  request: Request,
  { projectId, postId }: { projectId?: string; postId?: string }
) {
  const data = await parseFormData(request);
  const file = data.get("file") as NodeOnDiskFile;

  let blurHash: string | undefined = undefined;
  if (file.type.includes("image")) {
    console.log("TEST");
    blurHash = await encodeImageToBlurhash(file.name);
    console.log(blurHash);
  }

  return db.resource.create({
    data: {
      name: file.name,
      url: `/uploads/${file.name}`,
      mimetype: file.type,
      blurHash,
      projectId,
      postId,
    },
  });
}
