import { getContent } from "@/lib/content";
import GetInvolvedClient from "./GetInvolvedClient";

export const revalidate = 60;

export const metadata = {
  title: "Get Involved — OCDA",
  description:
    "Join the OCDA movement — donate, volunteer, or partner with us to transform communities across Nigeria.",
};

export interface GetInvolvedData {
  pageHero?: { label?: string; headline?: string; description?: string };
  featureCards?: Array<{ title: string; description: string }>;
  donate?: {
    headline?: string;
    description?: string;
    presetAmounts?: string[];
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
  };
  volunteer?: { headline?: string; description?: string };
}

export default async function GetInvolvedPage() {
  const data = await getContent<GetInvolvedData>("get_involved");
  return <GetInvolvedClient data={data ?? {}} />;
}
