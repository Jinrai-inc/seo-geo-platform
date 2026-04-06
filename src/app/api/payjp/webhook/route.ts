import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/constants";
import { sendNotifications } from "@/server/services/notifications";

/**
 * POST /api/payjp/webhook
 * Pay.jp Webhook イベントを処理する。
 */
export async function POST(request: NextRequest) {
  // Basic 認証でリクエストを検証
  const authHeader = request.headers.get("authorization");
  const expectedToken = process.env.PAYJP_WEBHOOK_SECRET;

  if (expectedToken && authHeader !== `Basic ${expectedToken}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const event = body as PayjpWebhookEvent;

  try {
    switch (event.type) {
      case "subscription.created":
      case "subscription.renewed":
      case "subscription.resumed": {
        const subscription = event.data;
        const orgId = subscription.metadata?.orgId;
        const plan = subscription.metadata?.plan as keyof typeof PLANS | undefined;

        if (orgId && plan && plan in PLANS) {
          const planConfig = PLANS[plan];
          await prisma.organization.update({
            where: { id: orgId },
            data: {
              plan,
              maxProjects: planConfig.maxProjects,
              maxKeywords: planConfig.maxKeywords,
              maxGeoChecks: planConfig.maxGeoChecks,
            },
          });
        }
        break;
      }

      case "subscription.deleted":
      case "subscription.canceled": {
        const subscription = event.data;
        const orgId = subscription.metadata?.orgId;

        if (orgId) {
          const starterPlan = PLANS.STARTER;
          await prisma.organization.update({
            where: { id: orgId },
            data: {
              plan: "STARTER",
              maxProjects: starterPlan.maxProjects,
              maxKeywords: starterPlan.maxKeywords,
              maxGeoChecks: starterPlan.maxGeoChecks,
            },
          });
        }
        break;
      }

      case "charge.failed": {
        const charge = event.data;
        const customerId = charge.customer;
        console.error(`Payment failed for customer: ${customerId}`);

        // 支払い失敗した組織を特定して通知
        if (customerId) {
          const org = await prisma.organization.findFirst({
            where: { payjpCustomerId: customerId },
          });
          if (org) {
            await sendNotifications(org.id, {
              type: "error",
              message: `支払い処理に失敗しました。お支払い方法をご確認ください。`,
              domain: org.name,
            });
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error("Pay.jp webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// Pay.jp Webhook イベント型定義
interface PayjpWebhookEvent {
  type: string;
  data: {
    id: string;
    customer?: string;
    metadata?: Record<string, string>;
    [key: string]: unknown;
  };
}
