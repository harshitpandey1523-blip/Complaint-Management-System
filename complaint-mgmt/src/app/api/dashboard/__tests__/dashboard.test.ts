import { describe, it, expect } from "vitest";
import { prismaMock } from "../../../../__mocks__/prisma";
import { GET } from "../route";

describe("GET /api/dashboard", () => {
  it("should return calculated dashboard metrics", async () => {
    // 1. Mock groupBy for status, priority, category
    prismaMock.complaint.groupBy
      .mockResolvedValueOnce([
        { status: "OPEN", _count: 3 },
        { status: "IN_PROGRESS", _count: 1 },
      ] as any)
      .mockResolvedValueOnce([
        { priority: "HIGH", _count: 2 },
        { priority: "MEDIUM", _count: 2 },
      ] as any)
      .mockResolvedValueOnce([
        { category: "OTHER", _count: 4 },
      ] as any);

    // 2. Mock counts
    prismaMock.complaint.count
      .mockResolvedValueOnce(4) // totalOpen
      .mockResolvedValueOnce(1) // todayNew
      .mockResolvedValueOnce(10) // totalComplaints
      .mockResolvedValueOnce(6) // resolvedComplaints
      .mockResolvedValueOnce(1); // slaBreach

    // 3. Mock resolvedWithTime
    prismaMock.complaint.findMany
      .mockResolvedValueOnce([]) // resolvedWithTime
      .mockResolvedValueOnce([]) // allComplaints (daily trend)
      .mockResolvedValueOnce([]); // recentComplaints

    // 4. Mock agents
    prismaMock.user.findMany.mockResolvedValueOnce([]);

    const response = await GET();
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.totalOpen).toBe(4);
    expect(data.todayNew).toBe(1);
    expect(data.totalComplaints).toBe(10);
    expect(data.resolvedComplaints).toBe(6);
    expect(data.avgResolutionHours).toBe(0);
    expect(data.slaBreach).toBe(1);
    expect(data.statusCounts).toEqual({ OPEN: 3, IN_PROGRESS: 1 });
    expect(data.priorityCounts).toEqual({ HIGH: 2, MEDIUM: 2 });
    expect(data.categoryCounts).toEqual({ OTHER: 4 });
  });

  it("should handle error gracefully and return 500 status", async () => {
    prismaMock.complaint.groupBy.mockRejectedValue(new Error("Database crash"));

    const response = await GET();
    expect(response.status).toBe(500);

    const data = await response.json();
    expect(data).toEqual({ error: "Database crash" });
  });
});
