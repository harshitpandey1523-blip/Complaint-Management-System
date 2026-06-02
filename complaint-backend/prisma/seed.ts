import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean existing data
  await prisma.comment.deleteMany();
  await prisma.complaint.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      role: "ADMIN",
      avatar: "SC",
    },
  });

  const agent1 = await prisma.user.create({
    data: {
      name: "Marcus Rivera",
      email: "marcus.rivera@company.com",
      role: "AGENT",
      avatar: "MR",
    },
  });

  const agent2 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      role: "AGENT",
      avatar: "PS",
    },
  });

  const customer1 = await prisma.user.create({
    data: {
      name: "James Wilson",
      email: "james.wilson@email.com",
      role: "CUSTOMER",
      avatar: "JW",
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: "Emily Thompson",
      email: "emily.t@email.com",
      role: "CUSTOMER",
      avatar: "ET",
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: "David Park",
      email: "david.park@email.com",
      role: "CUSTOMER",
      avatar: "DP",
    },
  });

  const customer4 = await prisma.user.create({
    data: {
      name: "Lisa Anderson",
      email: "lisa.a@email.com",
      role: "CUSTOMER",
      avatar: "LA",
    },
  });

  const customer5 = await prisma.user.create({
    data: {
      name: "Robert Kim",
      email: "robert.kim@email.com",
      role: "CUSTOMER",
      avatar: "RK",
    },
  });

  // ─── Complaints ───────────────────────────────────────
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);

  const complaints = await Promise.all([
    prisma.complaint.create({
      data: {
        subject: "Received damaged laptop screen",
        description:
          "I ordered a MacBook Pro and when it arrived the screen was cracked. The outer packaging looked fine but the inner box was dented. This is extremely disappointing for such an expensive product.",
        orderId: "ORD-2024-8847",
        category: "PRODUCT_DEFECT",
        priority: "URGENT",
        status: "IN_PROGRESS",
        customerId: customer1.id,
        assignedToId: agent1.id,
        createdAt: daysAgo(2),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Order stuck in transit for 2 weeks",
        description:
          "My order was shipped on the 15th and tracking has shown no updates since the 17th. It's been sitting at the regional hub for 14 days now. I need this for a birthday gift.",
        orderId: "ORD-2024-9012",
        category: "SHIPPING_DELAY",
        priority: "HIGH",
        status: "AWAITING_CUSTOMER",
        customerId: customer2.id,
        assignedToId: agent2.id,
        createdAt: daysAgo(5),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Received blue shoes instead of red",
        description:
          "I ordered the Nike Air Max in Red (Size 10) but received Blue ones instead. The order confirmation clearly shows Red. I need the correct color.",
        orderId: "ORD-2024-8903",
        category: "WRONG_ITEM",
        priority: "MEDIUM",
        status: "OPEN",
        customerId: customer3.id,
        assignedToId: null,
        createdAt: daysAgo(1),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Refund not processed after return",
        description:
          "I returned my order 3 weeks ago and the tracking shows it was delivered to the warehouse. However, I still haven't received my refund of $189.99. Your policy says 5-7 business days.",
        orderId: "ORD-2024-7823",
        category: "REFUND_REQUEST",
        priority: "HIGH",
        status: "IN_PROGRESS",
        customerId: customer4.id,
        assignedToId: agent1.id,
        createdAt: daysAgo(7),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Double charged for single order",
        description:
          "I was charged twice ($59.99 x2) for order ORD-2024-9100. My bank statement shows two identical transactions. Please refund the duplicate charge immediately.",
        orderId: "ORD-2024-9100",
        category: "BILLING_ISSUE",
        priority: "URGENT",
        status: "OPEN",
        customerId: customer5.id,
        assignedToId: null,
        createdAt: hoursAgo(3),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Cannot reset my account password",
        description:
          "I've tried resetting my password multiple times but the reset email never arrives. I've checked spam folders. I need access to track my orders.",
        category: "ACCOUNT_ISSUE",
        priority: "MEDIUM",
        status: "RESOLVED",
        resolution:
          "Password reset link was being blocked by email provider. Manually reset the password and confirmed customer can log in.",
        customerId: customer1.id,
        assignedToId: agent2.id,
        createdAt: daysAgo(10),
        resolvedAt: daysAgo(9),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Product quality doesn't match description",
        description:
          "The leather jacket I received feels like synthetic material, not genuine leather as advertised. The stitching is also uneven. This is not worth the $299 I paid.",
        orderId: "ORD-2024-8790",
        category: "PRODUCT_DEFECT",
        priority: "MEDIUM",
        status: "OPEN",
        customerId: customer2.id,
        assignedToId: null,
        createdAt: hoursAgo(6),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Missing items from my order",
        description:
          "I ordered 3 items but only received 2. The wireless earbuds are missing from the package. The packing slip shows all 3 items.",
        orderId: "ORD-2024-9055",
        category: "WRONG_ITEM",
        priority: "HIGH",
        status: "IN_PROGRESS",
        customerId: customer3.id,
        assignedToId: agent1.id,
        createdAt: daysAgo(3),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Warranty claim for defective blender",
        description:
          "My KitchenAid blender stopped working after 2 months. It's still under warranty. The motor makes a grinding noise and doesn't spin. Need a replacement.",
        orderId: "ORD-2024-7500",
        category: "PRODUCT_DEFECT",
        priority: "LOW",
        status: "CLOSED",
        resolution:
          "Replacement blender shipped via express. Customer confirmed receipt and working condition.",
        customerId: customer4.id,
        assignedToId: agent2.id,
        createdAt: daysAgo(20),
        resolvedAt: daysAgo(17),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Shipping to wrong address despite update",
        description:
          "I updated my shipping address before the order was dispatched but it was still sent to my old address. Now it's marked as delivered but I'm not there anymore.",
        orderId: "ORD-2024-8950",
        category: "SHIPPING_DELAY",
        priority: "URGENT",
        status: "IN_PROGRESS",
        customerId: customer5.id,
        assignedToId: agent2.id,
        createdAt: daysAgo(1),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Promo code not applied to order",
        description:
          "I used promo code SUMMER25 at checkout and it showed the discount, but I was charged full price. The order total should have been $74.99 not $99.99.",
        orderId: "ORD-2024-9088",
        category: "BILLING_ISSUE",
        priority: "MEDIUM",
        status: "RESOLVED",
        resolution:
          "Refunded the $25 difference back to customer's payment method. Processing time: 3-5 business days.",
        customerId: customer1.id,
        assignedToId: agent1.id,
        createdAt: daysAgo(4),
        resolvedAt: daysAgo(3),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Furniture arrived with scratches",
        description:
          "The oak dining table I ordered has visible scratches on the surface and one leg is slightly wobbly. For a $1200 table this is unacceptable.",
        orderId: "ORD-2024-8820",
        category: "PRODUCT_DEFECT",
        priority: "HIGH",
        status: "OPEN",
        customerId: customer3.id,
        assignedToId: null,
        createdAt: hoursAgo(1),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Want to cancel and get refund",
        description:
          "I accidentally ordered the wrong size. The order hasn't shipped yet. Please cancel order ORD-2024-9120 and refund me.",
        orderId: "ORD-2024-9120",
        category: "REFUND_REQUEST",
        priority: "LOW",
        status: "CLOSED",
        resolution:
          "Order cancelled before shipping. Full refund of $45.00 processed.",
        customerId: customer4.id,
        assignedToId: agent1.id,
        createdAt: daysAgo(6),
        resolvedAt: daysAgo(6),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Subscription auto-renewed without notice",
        description:
          "My premium subscription auto-renewed and I was charged $149.99. I didn't receive any renewal notice email. I want to cancel and get a refund.",
        category: "BILLING_ISSUE",
        priority: "HIGH",
        status: "AWAITING_CUSTOMER",
        customerId: customer2.id,
        assignedToId: agent2.id,
        createdAt: daysAgo(2),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Delivery person left package in rain",
        description:
          "My package was left outside in the rain without any protection. The contents are water damaged. The delivery instructions clearly say to leave at covered porch.",
        orderId: "ORD-2024-9070",
        category: "SHIPPING_DELAY",
        priority: "MEDIUM",
        status: "OPEN",
        customerId: customer5.id,
        assignedToId: null,
        createdAt: hoursAgo(8),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Loyalty points not credited",
        description:
          "I made 3 purchases last month totaling $450 but my loyalty points weren't credited. I should have received 4500 points.",
        category: "ACCOUNT_ISSUE",
        priority: "LOW",
        status: "RESOLVED",
        resolution:
          "Manually credited 4500 loyalty points to customer account. Investigated and fixed the sync issue with the loyalty system.",
        customerId: customer1.id,
        assignedToId: agent2.id,
        createdAt: daysAgo(12),
        resolvedAt: daysAgo(11),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Gift wrapping was missing",
        description:
          "I paid extra $5.99 for gift wrapping on this order but the item arrived in regular packaging. This was supposed to be a surprise gift.",
        orderId: "ORD-2024-9060",
        category: "OTHER",
        priority: "LOW",
        status: "IN_PROGRESS",
        customerId: customer4.id,
        assignedToId: agent1.id,
        createdAt: daysAgo(2),
      },
    }),
    prisma.complaint.create({
      data: {
        subject: "Electronics arrived without battery",
        description:
          "The wireless mouse I ordered came without the AA battery that's supposed to be included according to the product listing.",
        orderId: "ORD-2024-9095",
        category: "PRODUCT_DEFECT",
        priority: "LOW",
        status: "OPEN",
        customerId: customer5.id,
        assignedToId: null,
        createdAt: hoursAgo(12),
      },
    }),
  ]);

  // ─── Comments ─────────────────────────────────────────
  // Add comments to the first several complaints
  await prisma.comment.createMany({
    data: [
      // Damaged laptop (complaint 0)
      {
        complaintId: complaints[0].id,
        userId: agent1.id,
        content:
          "Hi James, I'm sorry to hear about the damage. I've initiated a replacement order. Could you please upload photos of the damaged screen and packaging?",
        isInternal: false,
        createdAt: daysAgo(1.5),
      },
      {
        complaintId: complaints[0].id,
        userId: customer1.id,
        content:
          "I've taken photos and can send them. How should I upload them?",
        isInternal: false,
        createdAt: daysAgo(1.2),
      },
      {
        complaintId: complaints[0].id,
        userId: agent1.id,
        content:
          "Warehouse confirmed this batch had packaging issues. Escalating to logistics team for investigation.",
        isInternal: true,
        createdAt: daysAgo(1),
      },
      {
        complaintId: complaints[0].id,
        userId: agent1.id,
        content:
          "You can reply to this ticket with the photos attached, or email them to support@company.com referencing ticket ID. A replacement MacBook Pro has been shipped via express delivery.",
        isInternal: false,
        createdAt: daysAgo(0.8),
      },

      // Shipping delay (complaint 1)
      {
        complaintId: complaints[1].id,
        userId: agent2.id,
        content:
          "Emily, I've contacted the carrier and they're investigating the delay at the regional hub. I'll update you within 24 hours.",
        isInternal: false,
        createdAt: daysAgo(4),
      },
      {
        complaintId: complaints[1].id,
        userId: agent2.id,
        content:
          "Carrier update: Package was misrouted. They're rerouting it now. ETA is 2 more business days.",
        isInternal: false,
        createdAt: daysAgo(3),
      },
      {
        complaintId: complaints[1].id,
        userId: agent2.id,
        content:
          "Emily, could you please confirm if the delivery address is still correct? The carrier wants to verify before rerouting.",
        isInternal: false,
        createdAt: daysAgo(2),
      },

      // Refund not processed (complaint 3)
      {
        complaintId: complaints[3].id,
        userId: agent1.id,
        content:
          "Lisa, I can see the return was received at our warehouse on the 5th. Let me check with the finance team about the refund status.",
        isInternal: false,
        createdAt: daysAgo(6),
      },
      {
        complaintId: complaints[3].id,
        userId: agent1.id,
        content:
          "Finance team says the refund was stuck in the approval queue. I've expedited it.",
        isInternal: true,
        createdAt: daysAgo(5),
      },
      {
        complaintId: complaints[3].id,
        userId: agent1.id,
        content:
          "Great news — your refund of $189.99 has been processed. It should appear in your account within 3-5 business days. I apologize for the delay.",
        isInternal: false,
        createdAt: daysAgo(5),
      },

      // Missing items (complaint 7)
      {
        complaintId: complaints[7].id,
        userId: agent1.id,
        content:
          "David, I apologize for the inconvenience. I'm checking with the fulfillment center about the missing earbuds.",
        isInternal: false,
        createdAt: daysAgo(2.5),
      },
      {
        complaintId: complaints[7].id,
        userId: agent1.id,
        content:
          "Fulfillment confirms earbuds were out of stock during packing but weren't removed from the order. Shipping replacement now.",
        isInternal: true,
        createdAt: daysAgo(2),
      },

      // Subscription renewal (complaint 13)
      {
        complaintId: complaints[13].id,
        userId: agent2.id,
        content:
          "Hi Emily, I can see the auto-renewal charge. I've paused your subscription. Would you like a full refund, or would you like to keep the subscription at a discounted rate?",
        isInternal: false,
        createdAt: daysAgo(1.5),
      },

      // Wrong address (complaint 9)
      {
        complaintId: complaints[9].id,
        userId: agent2.id,
        content:
          "Robert, I see the address was updated but the order had already been dispatched. I've contacted the courier to attempt a redirect. If unsuccessful, we'll ship a replacement to your new address.",
        isInternal: false,
        createdAt: hoursAgo(18),
      },
      {
        complaintId: complaints[9].id,
        userId: customer5.id,
        content:
          "Thank you for looking into this. Please let me know if the redirect works.",
        isInternal: false,
        createdAt: hoursAgo(16),
      },

      // Gift wrapping (complaint 16)
      {
        complaintId: complaints[16].id,
        userId: agent1.id,
        content:
          "Lisa, I sincerely apologize. I've refunded the gift wrapping fee and I'm sending a $10 store credit as a gesture of goodwill.",
        isInternal: false,
        createdAt: daysAgo(1.5),
      },
    ],
  });

  console.log("✅ Seed data created successfully!");
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Complaints: ${await prisma.complaint.count()}`);
  console.log(`   Comments: ${await prisma.comment.count()}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
