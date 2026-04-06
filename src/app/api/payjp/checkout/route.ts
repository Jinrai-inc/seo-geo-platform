import { NextRequest, NextResponse } from "next/server";
import Payjp from "payjp";
import { prisma } from "@/lib/prisma";

function getPayjp() {
  return Payjp(process.env.PAYJP_SECRET_KEY || "");
}

function getPlanMap(): Record<string, string> {
  return {
    STARTER: process.env.PAYJP_PLAN_STARTER || "",
    BUSINESS: process.env.PAYJP_PLAN_BUSINESS || "",
    AGENCY: process.env.PAYJP_PLAN_AGENCY || "",
  };
}

/**
 * POST /api/payjp/checkout
 * Pay.jp でサブスクリプションを作成する。
 * フロントからカードトークン (token) を受け取る想定。
 */
export async function POST(request: NextRequest) {
  try {
    const { orgId, plan, token } = await request.json();

    if (!orgId || !plan || !token) {
      return NextResponse.json(
        { error: "orgId, plan, and token are required" },
        { status: 400 }
      );
    }

    const planId = getPlanMap()[plan];
    if (!planId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const payjp = getPayjp();

    // 顧客の作成 or 取得
    let customerId = org.payjpCustomerId;
    if (!customerId) {
      const customer = await payjp.customers.create({
        card: token,
        metadata: { orgId },
      });
      customerId = customer.id;
      await prisma.organization.update({
        where: { id: orgId },
        data: { payjpCustomerId: customerId },
      });
    } else {
      // 既存顧客にカードを更新
      await payjp.customers.update(customerId, { card: token });
    }

    // サブスクリプション作成
    const subscription = await payjp.subscriptions.create({
      customer: customerId,
      plan: planId,
      metadata: { orgId, plan },
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    console.error("Pay.jp checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
