import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { Context } from "../context";
import { prisma } from "@/lib/prisma";

const t = initTRPC.context<Context>().create();

export const auditRouter = t.router({
  getLatest: t.procedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return prisma.siteAudit.findFirst({
        where: { projectId: input.projectId },
        orderBy: { crawledAt: "desc" },
        include: { issues: true },
      });
    }),

  getAll: t.procedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ input }) => {
      return prisma.siteAudit.findMany({
        where: { projectId: input.projectId },
        orderBy: { crawledAt: "desc" },
      });
    }),

  getIssues: t.procedure
    .input(z.object({
      auditId: z.string(),
      severity: z.enum(["ERROR", "WARNING", "NOTICE"]).optional(),
    }))
    .query(async ({ input }) => {
      return prisma.auditIssue.findMany({
        where: {
          auditId: input.auditId,
          ...(input.severity ? { severity: input.severity } : {}),
        },
        orderBy: { severity: "asc" },
      });
    }),

  resolveIssue: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return prisma.auditIssue.update({
        where: { id: input.id },
        data: { isResolved: true },
      });
    }),

  startCrawl: t.procedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ input }) => {
      // クロールを開始し、暫定的な監査レコードを作成する
      const audit = await prisma.siteAudit.create({
        data: {
          projectId: input.projectId,
          pagesCrawled: 0,
          healthScore: 0,
          errorsCount: 0,
          warningsCount: 0,
          noticesCount: 0,
        },
      });

      // 本番では BullMQ ジョブキューに投入してバックグラウンドでクロールを実行する
      // await crawlQueue.add('site-audit', { auditId: audit.id, projectId: input.projectId });
      return audit;
    }),
});
