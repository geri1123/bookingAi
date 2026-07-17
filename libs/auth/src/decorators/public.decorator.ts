import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

// Perdoret per endpoint qe s'kerkojne JWT, p.sh. webhook WhatsApp, /health
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
