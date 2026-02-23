import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import uniqid from "uniqid";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf' // for resume uploads
];

export async function POST(req) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();

    if (formData.has('file')) {
      const file = formData.get('file');

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return Response.json(
          { error: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.` },
          { status: 400 }
        );
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return Response.json(
          { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
          { status: 400 }
        );
      }

      const s3Client = new S3Client({
        region: 'ap-south-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
      });

      const randomId = uniqid();
      const ext = file.name.split('.').pop();
      const newFilename = randomId + '.' + ext;
      const bucketName = process.env.BUCKET_NAME;

      const chunks = [];
      for await (const chunk of file.stream()) {
        chunks.push(chunk);
      }

      await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: newFilename,
        ACL: 'public-read',
        Body: Buffer.concat(chunks),
        ContentType: file.type,
      }));

      const link = `https://${bucketName}.s3.ap-south-1.amazonaws.com/${newFilename}`;
      return Response.json(link);
    }

    return Response.json({ error: 'No file provided' }, { status: 400 });
  } catch (error) {
    console.error('Upload error:', error);
    return Response.json({ error: 'Upload failed' }, { status: 500 });
  }
}
