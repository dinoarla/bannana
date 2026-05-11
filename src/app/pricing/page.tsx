export const dynamic = "force-dynamic";
import { getSessionUser } from "@/lib/auth/session";
import { PricingContent } from "./PricingContent";

export default async function PricingPage() {
  const user = await getSessionUser();
  return <PricingContent isLoggedIn={!!user} />;
}
