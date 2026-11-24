import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  // 전화번호, 사업자번호는 AES-256-GCM으로 암호화해 저장
  phoneEnc: text("phone_enc"),
  businessNoEnc: text("business_no_enc"),
  isBusiness: boolean("is_business").notNull().default(false),
  role: text("role", { enum: ["customer", "admin"] }).notNull().default("customer"),
  marketingAgree: boolean("marketing_agree").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category", {
      enum: ["opener", "controller", "nutrient", "sensor", "parts", "system"],
    }).notNull(),
    summary: text("summary").notNull(),
    description: text("description").notNull().default(""),
    price: integer("price").notNull().default(0),
    // buy: 바로 결제, quote: 견적 상담 상품
    saleType: text("sale_type", { enum: ["buy", "quote"] }).notNull().default("buy"),
    stock: integer("stock").notNull().default(0),
    specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
    badge: text("badge"),
    isActive: boolean("is_active").notNull().default(true),
    sort: integer("sort").notNull().default(100),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("products_category_idx").on(t.category)],
);

export const orderStatuses = [
  "pending",
  "paid",
  "preparing",
  "shipping",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNo: text("order_no").notNull().unique(),
    userId: uuid("user_id").references(() => users.id),
    status: text("status", { enum: orderStatuses }).notNull().default("pending"),
    orderName: text("order_name").notNull(),
    itemsTotal: integer("items_total").notNull(),
    shippingFee: integer("shipping_fee").notNull(),
    total: integer("total").notNull(),
    ordererName: text("orderer_name").notNull(),
    ordererEmail: text("orderer_email").notNull(),
    phoneEnc: text("phone_enc").notNull(),
    // {zip, addr1, addr2} JSON을 통째로 암호화
    addressEnc: text("address_enc").notNull(),
    memo: text("memo"),
    taxInvoice: boolean("tax_invoice").notNull().default(false),
    businessNoEnc: text("business_no_enc"),
    paymentKey: text("payment_key"),
    paymentMethod: text("payment_method"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    carrier: text("carrier"),
    trackingNo: text("tracking_no"),
    cancelReason: text("cancel_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("orders_user_idx").on(t.userId), index("orders_status_idx").on(t.status)],
);

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  qty: integer("qty").notNull(),
});

export const quoteStatuses = ["new", "contacted", "quoted", "won", "lost"] as const;
export type QuoteStatus = (typeof quoteStatuses)[number];

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  quoteNo: text("quote_no").notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  customerType: text("customer_type").notNull(),
  name: text("name").notNull(),
  phoneEnc: text("phone_enc").notNull(),
  email: text("email"),
  region: text("region").notNull(),
  crop: text("crop").notNull(),
  areaM2: integer("area_m2").notNull(),
  greenhouseType: text("greenhouse_type").notNull(),
  needs: jsonb("needs").$type<string[]>().notNull().default([]),
  message: text("message"),
  status: text("status", { enum: quoteStatuses }).notNull().default("new"),
  adminMemo: text("admin_memo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const asStatuses = ["received", "checking", "repairing", "done"] as const;
export type AsStatus = (typeof asStatuses)[number];

// A/S 신청 (기존 사이트 A/S신청·A/S관리 게시판 대체). 목록은 공개하지 않는다.
export const asRequests = pgTable("as_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestNo: text("request_no").notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  name: text("name").notNull(),
  phoneEnc: text("phone_enc").notNull(),
  region: text("region").notNull(),
  productModel: text("product_model"),
  issueType: text("issue_type").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: asStatuses }).notNull().default("received"),
  adminMemo: text("admin_memo"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  region: text("region").notNull(),
  crop: text("crop").notNull(),
  areaM2: integer("area_m2").notNull(),
  year: integer("year").notNull(),
  scope: jsonb("scope").$type<string[]>().notNull().default([]),
  summary: text("summary").notNull(),
  result: text("result"),
});

export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  adminId: uuid("admin_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// 관리자 화면에서 바꾸는 사이트 설정 (key/value)
export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Case = typeof cases.$inferSelect;
