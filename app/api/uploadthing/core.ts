import {createUploadthing, FileRouter} from "uploadthing/next";
import {auth} from "@/auth";
import {UploadThingError} from "@uploadthing/shared";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({
        image: { maxFileSize: '4MB' },
    })
        .middleware(async () => {
            const session = await auth();
            if (!session) throw new UploadThingError('Não autorizado.');
            return { userId: session?.user?.id  };
        })
        .onUploadComplete(async ({ metadata }) => {
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;