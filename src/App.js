import React, { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════
// SUPABASE CONFIG
// ═══════════════════════════════════════════════════════
const SUPABASE_URL = "https://hezvogqgzjrdgzterotx.supabase.co";
const SUPABASE_KEY = "sb_publishable_y05QC4dyYW29vW0tLJyVAw_CEEsp59V";

const sb = {
  async get(table) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY }
    });
    const data = await r.json();
    return Array.isArray(data) ? data.map(row => row.data || row) : [];
  },
  async upsert(table, id, data) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ id, data })
    });
  },
  async delete(table, id) {
    await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY }
    });
  },
  async getSettings(key) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.${key}&select=*`, {
      headers: { apikey: SUPABASE_KEY }
    });
    const data = await r.json();
    return Array.isArray(data) && data[0] ? data[0].data : null;
  },
  async saveSettings(key, data) {
    await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ key, data })
    });
  }
};

// ═══════════════════════════════════════════════════════
// TRANSLATIONS
// ═══════════════════════════════════════════════════════
const T = {
  zh: {
    appName:"COVERSYNC", appSub:"汽車配件管理系統",
    tabOrders:"客人訂單", tabBulk:"大貨管理", tabStock:"低庫存提醒",
    newOrder:"+ 新增訂單", newBulk:"+ 新增大貨單",
    inProgress:"進行中", hasIssue:"有問題",
    allOrders:"客人訂單", allOrdersSub:"店內 + 網上訂單統一管理",
    bulkTitle:"大貨管理", bulkSub:"供應商訂單 · 生產 · 物流 · 上架",
    stockTitle:"低庫存提醒", stockSub:"以下產品庫存低於安全水平，建議即時補貨",
    channel:"渠道", status:"狀態", all:"全部",
    store:"店內", online:"網上",
    productType:"產品類型",
    client:"客人姓名", phone:"電話", address:"送貨地址",
    carMake:"車廠", carYear:"年份", carModel:"型號", seats:"座位",
    material:"物料", color:"顏色", stitching:"車線款式", embroidery:"繡字", logo:"Logo",
    layers:"層數", screenSize:"屏幕尺寸", compatible:"兼容型號", rearCam:"倒車鏡頭",
    steerDiam:"方向盤直徑", bootWaterproof:"防水層", bootFullWrap:"全包圍",
    total:"總金額", deposit:"已付訂金", balance:"待收餘款", due:"截止日期",
    supplier:"供應商", yearRange:"年份範圍", specialModel:"特別型號",
    qty:"訂購數量", unit:"單位", costPer:"成本價/件", sellPer:"售價/件",
    eta:"預計到貨", minStock:"最低庫存警示", currentStock:"現有庫存",
    notes:"備注", source:"訂單來源",
    vehicle:"車輛", design:"物料設計", payment:"付款",
    updateStatus:"更新訂單狀態", progress:"進度", logistics:"物流進度",
    back:"← 返回", backList:"← 返回列表",
    confirmCreate:"確認建立訂單", createDraft:"建立草稿", cancel:"取消",
    deleteOrder:"刪除訂單", deleteBulk:"刪除大貨單",
    reorderTag:"重訂", issueTitle:"此訂單有問題", createReorder:"建立重訂單",
    poPreview:"供應商採購單預覽", sendPO:"確認發出採購單給供應商",
    profit:"毛利/件", totalCost:"總成本",
    urgentZero:"零庫存", urgentLow:"庫存偏低",
    suggestQty:"建議補貨", createBulkBtn:"為選定產品建立大貨單",
    selectHint:"勾選產品後，點擊建立大貨單可直接轉入",
    invoiceNo:"Loyverse Invoice No.", enterInvoice:"輸入 Invoice No. 確認訂單",
    confirmWithInvoice:"填入後自動確認", emailClient:"Email 客人",
    sendEmail:"發送確認Email", emailSubject:"訂單確認", alertReason:"缺貨原因", alertBy:"提醒人",
    alertCreated:"提醒已建立", alertToBulk:"轉成大貨草稿",
    newAlert:"+ Sales 新增缺貨提醒",
    reasonOptions:["客人落單後缺貨","庫存快用完","預計需求上升","其他"],
    searchPlaceholder:"搜尋客人、訂單號、車款…",
    printQuote:"列印報價單", printConfirm:"列印確認單",
    printPO:"列印採購單", whatsapp:"WhatsApp 通知", copied:"已複製！",
    stNew:"新訂單", stPending:"待確認", stConfirmed:"已確認", stProducing:"生產中",
    stFactShip:"已發貨到集運", stTransit:"集運已發貨", stArrived:"到貨",
    stNotified:"已通知客人", stDone:"完成",
    stQC:"QC檢查", stReady:"待交收", stDelivered:"已完成", stIssue:"有問題",
    bsDraft:"草稿", bsSent:"已發出", bsPending:"待確認", bsConfirmed:"已確認", bsProducing:"生產中",
    bsShipped:"發貨", bsFactShip:"工廠發貨", bsTransit:"已集運發貨", bsArrived:"到貨", bsShelved:"已上架", bsDone:"完成", bsIssue:"有問題",
    seatsFull5:"全套 5座", seatsFull7:"全套 7座", seatsFront:"前排 2座",
    seatsRear:"後排", seatsDriver:"司機位",
    // product type labels
    pt_seat:"車座套", pt_mat:"地墊", pt_carplay:"CarPlay",
    pt_steer:"方向盤套", pt_boot:"尾箱墊", pt_other:"其他配件",
  },
  en: {
    appName:"COVERSYNC", appSub:"Car Accessories Management",
    tabOrders:"Customer Orders", tabBulk:"Bulk Orders", tabStock:"Low Stock Alerts",
    newOrder:"+ New Order", newBulk:"+ New Bulk Order",
    inProgress:"In Progress", hasIssue:"Issues",
    allOrders:"Customer Orders", allOrdersSub:"In-Store & Online Orders",
    bulkTitle:"Bulk Orders", bulkSub:"Supplier PO · Production · Logistics · Shelving",
    stockTitle:"Low Stock Alerts", stockSub:"Products below minimum stock level",
    channel:"Channel", status:"Status", all:"All",
    store:"In-Store", online:"Online",
    productType:"Product Type",
    client:"Client Name", phone:"Phone", address:"Delivery Address",
    carMake:"Make", carYear:"Year", carModel:"Model", seats:"Seats",
    material:"Material", color:"Color", stitching:"Stitching", embroidery:"Embroidery", logo:"Logo",
    layers:"Layers", screenSize:"Screen Size", compatible:"Compatible Model", rearCam:"Rear Camera",
    steerDiam:"Steering Diameter", bootWaterproof:"Waterproof Layer", bootFullWrap:"Full Wrap",
    total:"Total", deposit:"Deposit Paid", balance:"Balance Due", due:"Due Date",
    supplier:"Supplier", yearRange:"Year Range", specialModel:"Special Model",
    qty:"Order Qty", unit:"Unit", costPer:"Cost/Unit", sellPer:"Price/Unit",
    eta:"Est. Arrival", minStock:"Min Stock Alert", currentStock:"Current Stock",
    notes:"Notes", source:"Order Source",
    vehicle:"Vehicle", design:"Specs & Design", payment:"Payment",
    updateStatus:"Update Status", progress:"Progress", logistics:"Logistics",
    back:"← Back", backList:"← Back to List",
    confirmCreate:"Create Order", createDraft:"Save as Draft", cancel:"Cancel",
    deleteOrder:"Delete Order", deleteBulk:"Delete Bulk Order",
    reorderTag:"Re-order", issueTitle:"This order has an issue", createReorder:"Create Re-order",
    poPreview:"Supplier PO Preview", sendPO:"Send PO to Supplier",
    profit:"Profit/Unit", totalCost:"Total Cost",
    urgentZero:"Out of Stock", urgentLow:"Low Stock",
    suggestQty:"Suggest Reorder", createBulkBtn:"Create Bulk Order for Selected",
    selectHint:"Select products above, then click to create bulk orders",
    invoiceNo:"Loyverse Invoice No.", enterInvoice:"Enter Invoice No. to confirm order",
    confirmWithInvoice:"Auto-confirms on entry", emailClient:"Email Client",
    sendEmail:"Send Confirmation Email", emailSubject:"Order Confirmation", alertReason:"Reason", alertBy:"Raised by",
    alertCreated:"Alert created", alertToBulk:"Convert to Bulk Draft",
    newAlert:"+ Sales: Add Stock Alert",
    reasonOptions:["Order placed but out of stock","Stock running low","Anticipated demand increase","Other"],
    searchPlaceholder:"Search client, order ID, car…",
    printQuote:"Print Quote", printConfirm:"Print Confirmation",
    printPO:"Print PO", whatsapp:"WhatsApp", copied:"Copied!",
    stNew:"New", stPending:"Pending", stConfirmed:"Confirmed", stProducing:"In Production",
    stFactShip:"Shipped to Forwarder", stTransit:"Forwarder Shipped", stArrived:"Arrived",
    stNotified:"Client Notified", stDone:"Completed",
    stQC:"QC Check", stReady:"Ready", stDelivered:"Delivered", stIssue:"Issue",
    bsDraft:"Draft", bsSent:"Sent", bsPending:"Pending", bsConfirmed:"Confirmed", bsProducing:"In Production",
    bsShipped:"Shipped", bsFactShip:"Factory Shipped", bsTransit:"In Transit", bsArrived:"Arrived", bsShelved:"Shelved", bsDone:"Completed", bsIssue:"Issue",
    seatsFull5:"Full Set (5 seats)", seatsFull7:"Full Set (7 seats)", seatsFront:"Front 2 Seats",
    seatsRear:"Rear Seats", seatsDriver:"Driver Only",
    pt_seat:"Seat Cover", pt_mat:"Floor Mat", pt_carplay:"CarPlay",
    pt_steer:"Steering Cover", pt_boot:"Boot Liner", pt_other:"Other",
  }
};

// Product type keys — default list (overridden by settings state)
const DEFAULT_PRODUCT_TYPES = [
  { key:"seat",    labelZh:"車座套",   labelEn:"Seat Cover" },
  { key:"mat",     labelZh:"地墊",     labelEn:"Floor Mat" },
  { key:"carplay", labelZh:"CarPlay",  labelEn:"CarPlay" },
  { key:"steer",   labelZh:"方向盤套", labelEn:"Steering Cover" },
  { key:"boot",    labelZh:"尾箱墊",   labelEn:"Boot Liner" },
  { key:"shield",  labelZh:"晴雨擋",   labelEn:"Weather Shield" },
  { key:"other",   labelZh:"其他配件", labelEn:"Other" },
];

// ═══════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════
const getOrderStatuses = (t) => [
  { key:"pending",   color:"#AAAAAA", icon:"○", label:t.stPending },
  { key:"confirmed", color:"#4BE8A0", icon:"✓", label:t.stConfirmed },
  { key:"producing", color:"#F59E0B", icon:"◈", label:t.stProducing },
  { key:"factship",  color:"#F59E0B", icon:"◉", label:t.stFactShip },
  { key:"transit",   color:"#F59E0B", icon:"◑", label:t.stTransit },
  { key:"arrived",   color:"#F59E0B", icon:"●", label:t.stArrived },
  { key:"notified",  color:"#0EA5E9", icon:"◎", label:t.stNotified },
  { key:"done",      color:"#aaa",    icon:"✓", label:t.stDone },
  { key:"issue",     color:"#E84B4B", icon:"⚠", label:t.stIssue },
];

const getBulkStatuses = (t) => [
  { key:"pending",   color:"#888",    icon:"○", label:t.bsPending },
  { key:"confirmed", color:"#4BE8A0", icon:"✓", label:t.bsConfirmed },
  { key:"producing", color:"#B44BE8", icon:"◈", label:t.bsProducing },
  { key:"factship",  color:"#4BB5E8", icon:"◉", label:t.bsFactShip },
  { key:"transit",   color:"#E87C4B", icon:"◑", label:t.bsTransit },
  { key:"arrived",   color:"#16A34A", icon:"●", label:t.bsArrived },
  { key:"done",      color:"#aaa",    icon:"✓", label:t.bsDone },
  { key:"issue",     color:"#E84B4B", icon:"⚠", label:t.bsIssue },
];

const CAR_MAKES = ["Toyota","Honda","BMW","Mercedes","Audi","Lexus","Tesla","Hyundai","Kia","Mazda","Ford","Nissan","Other / 其他"];
const MATERIALS_MAP = {
  en: ["Nappa Leather","Perforated Leather","Alcantara","Synthetic Leather","Rubber","Carpet","Waterproof Fabric","Cotton","Mesh","Custom"],
  zh: ["Nappa 真皮","穿孔真皮","Alcantara","合成皮","橡膠","地毯","防水布","純棉","網布","客製布料"],
};
const COLORS_MAP = {
  en: ["Black","Beige","Dark Brown","Burgundy","Navy","Grey","White","Custom"],
  zh: ["黑","米白","深棕","酒紅","深藍","灰","白","客製色"],
};
const SCREEN_SIZES = ["7\"","9\"","10\"","10.25\"","12\"","12.3\"","13\"","Custom"];
const STEER_SIZES  = ["37cm","38cm","39cm","40cm","Custom"];
const LAYER_OPTIONS = { en:["1 Layer","2 Layers"], zh:["1層","2層"] };

const NOW    = new Date().toISOString().slice(0,10);
const uid    = (p) => p+"-"+String(Date.now()).slice(-5);
const fmtHKD = (n) => `HK$${Number(n||0).toLocaleString()}`;

// ═══════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════
const SEED_ORDERS = [
  { id:"ORD-00001", productType:"seat", channel:"store", client:"Marcus Lee", phone:"9123 4567", email:"marcus@email.com", carMake:"Toyota", carYear:"2023", carModel:"Alphard", seats:"Full Set (7 seats)", material:"Nappa Leather", materialZh:"Nappa 真皮", color:"Black", colorZh:"黑", stitching:"Red contrast", embroidery:"ML monogram", logo:"ML shield badge", deposit:2000, total:6800, status:"producing", created:NOW, due:"2024-02-10", address:"", notes:"VIP — heated seat wire routing needed.", reorder:false, invoiceNo:"13570" },
  { id:"ORD-00002", productType:"mat",  channel:"online", client:"Sarah Chan", phone:"6543 2198", email:"sarah@email.com", carMake:"BMW", carYear:"2022", carModel:"X5", layers:"2 Layers", material:"Rubber", materialZh:"橡膠", color:"Black", colorZh:"黑", stitching:"", embroidery:"", logo:"", deposit:600, total:1800, status:"arrived", created:NOW, due:"2024-02-05", address:"Flat 12B, Tower 3, Residence Oasis, Tseung Kwan O", notes:"Direct delivery.", reorder:false, invoiceNo:"13610" },
  { id:"ORD-00003", productType:"carplay", channel:"store", client:"David Wong", phone:"5432 1087", email:"", carMake:"Tesla", carYear:"2024", carModel:"Model 3", screenSize:"10.25\"", compatible:"Model 3 2021+", rearCam:"Yes", deposit:0, total:3200, status:"pending", created:NOW, due:"2024-02-20", address:"", notes:"Deposit pending.", reorder:false, invoiceNo:"" },
  { id:"ORD-00004", productType:"seat", channel:"online", client:"Jenny Lam", phone:"9876 0011", email:"jenny@email.com", carMake:"Honda", carYear:"2021", carModel:"Civic", seats:"Full Set (5 seats)", material:"Synthetic Leather", materialZh:"合成皮", color:"Beige", colorZh:"米白", stitching:"Silver", embroidery:"", logo:"", deposit:800, total:2400, status:"issue", created:NOW, due:"2024-01-25", address:"Shop 204, Shatin Plaza", notes:"Wrong colour — remake required.", reorder:true, invoiceNo:"13625" },
];

const SEED_BULK = [
  { id:"BLK-00001", productType:"seat", supplier:"韓國皮料行", carMake:"Toyota", carYear:"2022-2023", carModel:"Alphard / Vellfire", material:"Nappa Leather", materialZh:"Nappa 真皮", color:"Black", colorZh:"黑", qty:20, unit:"套", costPerUnit:480, sellPerUnit:1280, notes:"加厚款，需附安裝說明", status:"producing", created:NOW, eta:"2024-02-15", stockQty:3, minStock:5 },
  { id:"BLK-00002", productType:"mat",  supplier:"台灣橡膠廠", carMake:"BMW", carYear:"2021-2023", carModel:"3 Series", material:"Rubber", materialZh:"橡膠", color:"Black", colorZh:"黑", qty:30, unit:"套", costPerUnit:180, sellPerUnit:580, notes:"", status:"arrived", created:NOW, eta:"2024-01-28", stockQty:8, minStock:3 },
  { id:"BLK-00003", productType:"seat", supplier:"廣州皮具廠", carMake:"Honda", carYear:"2020-2023", carModel:"CR-V", material:"Synthetic Leather", materialZh:"合成皮", color:"Beige", colorZh:"米白", qty:15, unit:"套", costPerUnit:280, sellPerUnit:780, notes:"", status:"done", created:NOW, eta:"2024-01-20", stockQty:1, minStock:4 },
  { id:"BLK-00004", productType:"carplay", supplier:"深圳電子行", carMake:"Toyota", carYear:"2020-2023", carModel:"RAV4", material:"", materialZh:"", color:"", colorZh:"", qty:10, unit:"件", costPerUnit:650, sellPerUnit:1880, notes:"需確認屏幕尺寸 9\" or 10\"", status:"pending", created:NOW, eta:"", stockQty:0, minStock:2 },
];

const SEED_STOCK = [
  { id:"STK-001", productType:"seat", carMake:"Honda", carYear:"2020-2023", carModel:"CR-V", material:"Synthetic Leather", materialZh:"合成皮", color:"Beige", colorZh:"米白", currentStock:1, minStock:4, supplier:"廣州皮具廠", suggestQty:15 },
  { id:"STK-002", productType:"seat", carMake:"Toyota", carYear:"2022-2023", carModel:"Alphard", material:"Nappa Leather", materialZh:"Nappa 真皮", color:"Black", colorZh:"黑", currentStock:3, minStock:5, supplier:"韓國皮料行", suggestQty:20 },
  { id:"STK-003", productType:"carplay", carMake:"Toyota", carYear:"2020-2023", carModel:"RAV4", material:"", materialZh:"", color:"", colorZh:"", currentStock:0, minStock:2, supplier:"深圳電子行", suggestQty:10 },
];

// ═══════════════════════════════════════════════════════
// DOCUMENT GENERATORS
// ═══════════════════════════════════════════════════════
const buildSpecRows = (order) => {
  const rows = [];
  const pt = order.productType;
  if (pt==="seat") {
    if (order.designType)        rows.push(["Design Type", order.designType==="CUSTOM"?"Custom":"Original"]);
    if (order.designType==="CUSTOM" && order.customDesignNote) rows.push(["Custom Notes", order.customDesignNote]);
    if (order.seats)      rows.push(["Coverage", order.seats]);
    if (order.material)   rows.push(["Material", order.material]);
    if (order.color)      rows.push(["Colour", order.color]);
    if (order.stitching)  rows.push(["Stitches / Pipes", order.stitching]);
    if (order.embroidery) rows.push(["Embroidery", order.embroidery]);
  } else if (pt==="mat") {
    if (order.layers)        rows.push(["Layers", order.layers]);
    if (order.material)      rows.push(["Top Material", order.material]);
    if (order.color)         rows.push(["Top Colour", order.color]);
    if (order.mat2Material)  rows.push(["Bottom Material", order.mat2Material]);
    if (order.mat2Color)     rows.push(["Bottom Colour", order.mat2Color]);
  } else if (pt==="carplay") {
    if (order.screenSize)  rows.push(["Screen Size", order.screenSize]);
    if (order.compatible)  rows.push(["Compatible", order.compatible]);
    if (order.rearCam)     rows.push(["Rear Camera", order.rearCam]);
  } else if (pt==="steer") {
    if (order.material)    rows.push(["Material", order.material]);
    if (order.color)       rows.push(["Colour", order.color]);
    if (order.steerDiam)   rows.push(["Diameter", order.steerDiam]);
    if (order.stitching)   rows.push(["Stitching", order.stitching]);
  } else if (pt==="boot") {
    if (order.material)       rows.push(["Material", order.material]);
    if (order.color)          rows.push(["Colour", order.color]);
    if (order.bootWaterproof) rows.push(["Waterproof", order.bootWaterproof]);
    if (order.bootFullWrap)   rows.push(["Full Wrap", order.bootFullWrap]);
  } else if (pt==="shield") {
    if (order.shieldType) rows.push(["Type", order.shieldType]);
    if (order.material)   rows.push(["Material", order.material]);
    if (order.color)      rows.push(["Colour / Style", order.color]);
  } else {
    if (order.material) rows.push(["Material", order.material]);
    if (order.color)    rows.push(["Colour", order.color]);
  }
  return rows;
};

const PT_LABELS = { seat:"Seat Cover", mat:"Floor Mat", carplay:"CarPlay Screen", steer:"Steering Cover", boot:"Boot Liner", shield:"Weather Shield", other:"Accessory" };

const genCustomerDoc = (order, type) => `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;margin:0;padding:40px;font-size:14px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #111;}
  .brand{font-size:22px;font-weight:900;letter-spacing:3px;} .brand-sub{font-size:11px;color:#888;letter-spacing:2px;margin-top:3px;}
  .doc-type{text-align:right;} .doc-label{font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;}
  .doc-id{font-size:20px;font-weight:700;font-family:monospace;margin-top:4px;} .doc-date{font-size:12px;color:#888;margin-top:2px;}
  .section{margin-bottom:24px;} .section-title{font-size:10px;letter-spacing:3px;color:#888;text-transform:uppercase;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:12px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;} .field{margin-bottom:8px;}
  .field-label{font-size:11px;color:#888;margin-bottom:2px;} .field-value{font-size:14px;font-weight:500;}
  .spec-table{width:100%;border-collapse:collapse;margin-top:8px;background:#f8f8f8;border-radius:6px;overflow:hidden;}
  .spec-table td{padding:9px 14px;border-bottom:1px solid #eee;font-size:13px;}
  .spec-table td:first-child{color:#888;width:40%;font-size:11px;letter-spacing:1px;text-transform:uppercase;}
  .spec-table td:last-child{font-weight:600;}
  .price-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;}
  .price-total{display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:18px;border-top:2px solid #111;margin-top:4px;}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:11px;color:#aaa;text-align:center;}
  .notes-box{background:#fffdf0;border:1px solid #f0e080;border-radius:6px;padding:12px;font-size:13px;color:#555;}
  .pt-badge{display:inline-block;background:#111;color:#fff;border-radius:4px;padding:3px 10px;font-size:11px;letter-spacing:1px;margin-bottom:8px;}
  @media print{body{padding:20px;}}
</style></head><body>
<div class="header">
  <div><div class="brand">COVERSYNC</div><div class="brand-sub">Custom Car Accessories</div></div>
  <div class="doc-type">
    <div class="doc-label">${type==="quote"?"Quotation":"Order Confirmation"}</div>
    <div class="doc-id">${order.id}</div>
    <div class="doc-date">Date: ${order.created||NOW}</div>
  </div>
</div>
<div class="section">
  <div class="section-title">Client Information</div>
  <div class="grid">
    <div class="field"><div class="field-label">Name</div><div class="field-value">${order.client}</div></div>
    <div class="field"><div class="field-label">Phone</div><div class="field-value">${order.phone}</div></div>
    ${order.address?`<div class="field" style="grid-column:1/-1"><div class="field-label">Delivery Address</div><div class="field-value">${order.address}</div></div>`:""}
  </div>
</div>
<div class="section">
  <div class="section-title">Vehicle Details</div>
  <div class="grid">
    <div class="field"><div class="field-label">Make &amp; Model</div><div class="field-value">${order.carMake} ${order.carModel||""}</div></div>
    <div class="field"><div class="field-label">Year</div><div class="field-value">${order.carYear||"—"}</div></div>
  </div>
</div>
<div class="section">
  <div class="section-title">Product Specifications</div>
  <div class="pt-badge">${PT_LABELS[order.productType]||order.productType}</div>
  <table class="spec-table"><tbody>
    ${buildSpecRows(order).map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
  </tbody></table>
</div>
${order.notes?`<div class="section"><div class="section-title">Special Notes</div><div class="notes-box">${order.notes}</div></div>`:""}
<div class="section">
  <div class="section-title">Pricing</div>
  <div class="price-row"><span>Subtotal</span><span>${fmtHKD(order.total)}</span></div>
  <div class="price-row"><span>Deposit Paid</span><span style="color:#2a9a60">${fmtHKD(order.deposit)}</span></div>
  <div class="price-total"><span>Balance Due</span><span>${fmtHKD(order.total-order.deposit)}</span></div>
</div>
${order.due?`<div class="section"><div class="section-title">Estimated Completion</div><div class="field-value" style="font-size:16px;font-weight:600;">${order.due}</div></div>`:""}
<div class="footer">Thank you for your order. For enquiries please contact us directly.<br>This document is computer generated — no signature required.</div>
</body></html>`;

const genSupplierPO = (bulk) => `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'PingFang TC','Heiti TC','Microsoft YaHei',Arial,sans-serif;color:#000;margin:0;padding:30px;font-size:13px;}
  .header{text-align:center;margin-bottom:20px;}
  .title{font-size:16px;font-weight:700;margin-bottom:4px;}
  .subtitle{font-size:13px;color:#333;}
  table{width:100%;border-collapse:collapse;margin-top:12px;}
  th{background:#4361EE;color:#fff;padding:8px 10px;font-size:12px;text-align:center;border:1px solid #3050cc;}
  td{padding:8px 10px;border:1px solid #ccc;font-size:12px;text-align:center;vertical-align:middle;}
  tr:nth-child(even) td{background:#F0F4FF;}
  .total-row td{font-weight:700;background:#EEF1FF;border-top:2px solid #4361EE;}
  .notes-box{margin-top:16px;background:#fffbe6;border:1px solid #ffe066;border-radius:6px;padding:12px;font-size:12px;}
  .stamp-area{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:40px;}
  .stamp-box{border-top:1px solid #000;padding-top:10px;text-align:center;font-size:12px;color:#555;}
  .footer{margin-top:20px;font-size:11px;color:#aaa;text-align:center;}
  @media print{body{padding:15px;}}
</style></head><body>
<div class="header">
  <div class="title">COVERSYNC — 供應商採購訂單 Purchase Order</div>
  <div class="subtitle">訂單號 PO No.: ${bulk.id} &nbsp;|&nbsp; 日期 Date: ${bulk.created||NOW} ${bulk.eta?"&nbsp;|&nbsp; 要求到貨 Required ETA: "+bulk.eta:""}</div>
  <div class="subtitle" style="margin-top:4px">供應商 Supplier: <strong>${bulk.supplier}</strong></div>
</div>
<table>
  <thead>
    <tr>
      <th style="width:40px">No</th>
      <th>產品<br>Product</th>
      <th>車型<br>Car Model</th>
      <th>年份<br>Year</th>
      <th>座位數<br>Seats</th>
      <th>款式<br>Style</th>
      <th>皮料<br>Materials</th>
      <th>顏色<br>Colors</th>
      <th>數量<br>Qty</th>
      <th>備注<br>Note</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>${PT_LABELS[bulk.productType]||bulk.productType||"—"}</td>
      <td>${bulk.carMake} ${bulk.carModel}</td>
      <td>${bulk.carYear}</td>
      <td>—</td>
      <td>—</td>
      <td>${bulk.materialZh||bulk.material||"—"}</td>
      <td>${bulk.colorZh||bulk.color||"—"}</td>
      <td><strong>${bulk.qty} ${bulk.unit}</strong></td>
      <td style="text-align:left">${bulk.notes||""}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr class="total-row">
      <td colspan="8" style="text-align:right">合計 Total</td>
      <td><strong>${bulk.qty} ${bulk.unit}</strong></td>
      <td></td>
    </tr>
  </tfoot>
</table>
${bulk.costPerUnit?`<div style="margin-top:10px;font-size:12px;color:#555">成本價 Cost: HK$${bulk.costPerUnit} / ${bulk.unit} &nbsp;|&nbsp; 總金額 Total: HK$${(bulk.costPerUnit||0)*(bulk.qty||0)}</div>`:""}
${bulk.notes?`<div class="notes-box"><strong>備注 Notes:</strong> ${bulk.notes}</div>`:""}
<div class="stamp-area">
  <div class="stamp-box">採購方簽署 Buyer Signature<br><br><br></div>
  <div class="stamp-box">供應商確認 Supplier Confirmation<br><br><br></div>
</div>
<div class="footer">此採購單由 COVERSYNC 系統自動生成 · This PO is system generated.</div>
</body></html>`;

const genWhatsApp = (order, lang) => {
  const ptLabel = lang==="zh"
    ? {seat:"車座套",mat:"地墊",carplay:"CarPlay屏幕",steer:"方向盤套",boot:"尾箱墊",other:"配件"}[order.productType]||"配件"
    : PT_LABELS[order.productType]||"Accessory";
  const specLines = buildSpecRows(order).map(([k,v])=>` - ${k}: ${v}`).join("\n");
  if (lang==="en") return `Hi ${order.client},

Thank you for your order with COVERSYNC!

Order Ref: ${order.id}
Product: ${ptLabel}
Vehicle: ${order.carMake} ${order.carModel||""} (${order.carYear||"—"})
${specLines?`\nSpecifications:\n${specLines}\n`:""}
Total: ${fmtHKD(order.total)}
Deposit Paid: ${fmtHKD(order.deposit)}
Balance Due: ${fmtHKD(order.total-order.deposit)}
${order.due?`Est. Completion: ${order.due}\n`:""}
We will keep you updated on progress. Thank you for choosing us!`;

  return `您好 ${order.client}，

感謝您選擇 COVERSYNC！

訂單號碼：${order.id}
產品：${ptLabel}
車款：${order.carMake} ${order.carModel||""} (${order.carYear||"—"})
${specLines?`\n規格：\n${specLines}\n`:""}
總金額：${fmtHKD(order.total)}
已付訂金：${fmtHKD(order.deposit)}
待收餘款：${fmtHKD(order.total-order.deposit)}
${order.due?`預計完成：${order.due}\n`:""}
我們會即時跟進，如有查詢請隨時聯絡！`;
};

const openPrint = (html) => { const w=window.open("","_blank"); w.document.write(html); w.document.close(); setTimeout(()=>w.print(),500); };

// ═══════════════════════════════════════════════════════
// PRODUCT-SPECIFIC FORM FIELDS
// ═══════════════════════════════════════════════════════
function ProductFields({ productType, form, setForm, lang, t, MATERIALS, COLORS, settingsSeats=[] }) {
  const fin = S.fin;
  const fl2 = S.fl2;
  const fi2 = S.fi2;
  const fdg = S.fdg;
  const LAYERS = LAYER_OPTIONS[lang];

  if (productType==="seat") return (
    <div style={fdg}>
      {/* Design Type toggle */}
      <div style={{...fi2, gridColumn:"1/-1"}}>
        <label style={fl2}>{lang==="zh"?"設計類型":"Design Type"}</label>
        <div style={{display:"flex",gap:8,marginTop:4}}>
          {["ORIGINAL","CUSTOM"].map(v=>(
            <button key={v} type="button"
              style={{flex:1,padding:"8px",border:`2px solid ${(form.designType||"ORIGINAL")===v?"#E8B84B":"#1e1e2e"}`,borderRadius:7,background:(form.designType||"ORIGINAL")===v?"rgba(232,184,75,0.12)":"transparent",color:(form.designType||"ORIGINAL")===v?"#E8B84B":"#555",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",letterSpacing:1,transition:"all 0.15s"}}
              onClick={()=>setForm(p=>({...p,designType:v,customDesignNote:v==="ORIGINAL"?"":p.customDesignNote}))}>
              {v==="ORIGINAL"?(lang==="zh"?"原廠款":"Original"):(lang==="zh"?"客製款":"Custom")}
            </button>
          ))}
        </div>
        {/* Custom notes — only show if CUSTOM */}
        {(form.designType||"ORIGINAL")==="CUSTOM" && (
          <div style={{marginTop:10,padding:"12px 14px",background:"#FFF8E8",border:"1px solid #FFD580",borderRadius:8}}>
            <label style={{...fl2,color:"#b87800"}}>{lang==="zh"?"客製設計備注（必填）":"Custom Design Notes (required)"}</label>
            <textarea style={{...fin,minHeight:72,resize:"vertical",width:"100%",marginTop:6,background:"#fff",color:"#1a1a2e",border:"1px solid #FFD580"}}
              placeholder={lang==="zh"?"描述客製要求，例如：特別圖案、尺寸調整、加厚、特殊開孔位置…":"Describe custom requirements, e.g. special pattern, size adjustments, extra padding, special cutouts…"}
              value={form.customDesignNote||""}
              onChange={e=>setForm(p=>({...p,customDesignNote:e.target.value}))}/>
          </div>
        )}
      </div>
      <div style={fi2}><label style={fl2}>{t.seats}</label>
        <select style={fin} value={form.seats||""} onChange={e=>setForm(p=>({...p,seats:e.target.value}))}>
          {settingsSeats.map(v=><option key={v}>{v}</option>)}
        </select>
      </div>
      <div style={fi2}><label style={fl2}>{t.material}</label>
        <select style={fin} value={form.material||""} onChange={e=>setForm(p=>({...p,material:e.target.value}))}>{MATERIALS.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={{...fi2,gridColumn:"1/-1"}}>
        <label style={fl2}>{lang==="zh"?"顏色（可多選 / 自由填寫）":"Color (open text)"}</label>
        <input style={fin} placeholder={lang==="zh"?"例：黑色底 + 紅色車線…":"e.g. Black base + Red pipes…"} value={form.color||""} onChange={e=>setForm(p=>({...p,color:e.target.value}))}/>
      </div>
      <div style={fi2}><label style={fl2}>{lang==="zh"?"車線 / 喉管 Stitches / Pipes":"Stitches / Pipes"}</label>
        <input style={fin} placeholder={lang==="zh"?"例：紅色車線、白色菱形…":"e.g. Red stitch, white diamond pipes…"} value={form.stitching||""} onChange={e=>setForm(p=>({...p,stitching:e.target.value}))}/>
      </div>
      <div style={fi2}><label style={fl2}>{t.embroidery}</label>
        <input style={fin} placeholder="ML monogram" value={form.embroidery||""} onChange={e=>setForm(p=>({...p,embroidery:e.target.value}))}/>
      </div>
    </div>
  );

  if (productType==="mat") {
    const isDouble = (form.layers||LAYERS[0]) === LAYERS[1]; // 2nd option = double
    return (
      <div style={fdg}>
        <div style={{...fi2,gridColumn:"1/-1"}}>
          <label style={fl2}>{t.layers}</label>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            {LAYERS.map(v=>(
              <button key={v} type="button"
                style={{flex:1,padding:"8px",border:`2px solid ${(form.layers||LAYERS[0])===v?"#4361EE":"#E0E4EE"}`,borderRadius:7,background:(form.layers||LAYERS[0])===v?"#EEF1FF":"#F8F9FF",color:(form.layers||LAYERS[0])===v?"#4361EE":"#888",cursor:"pointer",fontWeight:700,fontSize:13,fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}
                onClick={()=>setForm(p=>({...p,layers:v}))}>
                {v}
              </button>
            ))}
          </div>
        </div>
        {/* Layer 1 */}
        <div style={{...fi2,gridColumn:"1/-1"}}>
          <label style={{...fl2,color:"#4361EE",fontWeight:700}}>{isDouble?(lang==="zh"?"面層 Top Layer":"Top Layer"):(lang==="zh"?"物料 Material":"Material")}</label>
        </div>
        <div style={fi2}><label style={fl2}>{lang==="zh"?"物料":"Material"}</label>
          <input style={fin} placeholder={lang==="zh"?"例：Nappa皮、TPE…":"e.g. Nappa Leather, TPE…"} value={form.material||""} onChange={e=>setForm(p=>({...p,material:e.target.value}))}/>
        </div>
        <div style={fi2}><label style={fl2}>{lang==="zh"?"顏色/設計":"Colour / Design"}</label>
          <input style={fin} placeholder={lang==="zh"?"例：黑色、紅色車線…":"e.g. Black, red stitching…"} value={form.color||""} onChange={e=>setForm(p=>({...p,color:e.target.value}))}/>
        </div>
        {/* Layer 2 — only if double */}
        {isDouble && <>
          <div style={{...fi2,gridColumn:"1/-1"}}>
            <label style={{...fl2,color:"#E87C4B",fontWeight:700}}>{lang==="zh"?"底層 Bottom Layer":"Bottom Layer"}</label>
          </div>
          <div style={fi2}><label style={fl2}>{lang==="zh"?"物料":"Material"}</label>
            <input style={fin} placeholder={lang==="zh"?"例：JD Black、橡膠底…":"e.g. JD Black, rubber base…"} value={form.mat2Material||""} onChange={e=>setForm(p=>({...p,mat2Material:e.target.value}))}/>
          </div>
          <div style={fi2}><label style={fl2}>{lang==="zh"?"顏色/設計":"Colour / Design"}</label>
            <input style={fin} placeholder={lang==="zh"?"例：黑色":"e.g. Black"} value={form.mat2Color||""} onChange={e=>setForm(p=>({...p,mat2Color:e.target.value}))}/>
          </div>
        </>}
      </div>
    );
  }

  if (productType==="carplay") return (
    <div style={fdg}>
      <div style={fi2}><label style={fl2}>{t.screenSize}</label>
        <select style={fin} value={form.screenSize||""} onChange={e=>setForm(p=>({...p,screenSize:e.target.value}))}>{SCREEN_SIZES.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={fi2}><label style={fl2}>{t.compatible}</label>
        <input style={fin} placeholder="Model 3 2021+" value={form.compatible||""} onChange={e=>setForm(p=>({...p,compatible:e.target.value}))}/>
      </div>
      <div style={fi2}><label style={fl2}>{t.rearCam}</label>
        <select style={fin} value={form.rearCam||"No"} onChange={e=>setForm(p=>({...p,rearCam:e.target.value}))}>
          {["Yes / 有","No / 沒有"].map(v=><option key={v}>{v}</option>)}
        </select>
      </div>
    </div>
  );

  if (productType==="steer") return (
    <div style={fdg}>
      <div style={fi2}><label style={fl2}>{t.material}</label>
        <select style={fin} value={form.material||""} onChange={e=>setForm(p=>({...p,material:e.target.value}))}>{MATERIALS.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={fi2}><label style={fl2}>{t.color}</label>
        <select style={fin} value={form.color||""} onChange={e=>setForm(p=>({...p,color:e.target.value}))}>{COLORS.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={fi2}><label style={fl2}>{t.steerDiam}</label>
        <select style={fin} value={form.steerDiam||""} onChange={e=>setForm(p=>({...p,steerDiam:e.target.value}))}>{STEER_SIZES.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={fi2}><label style={fl2}>{t.stitching}</label>
        <input style={fin} placeholder="Black" value={form.stitching||""} onChange={e=>setForm(p=>({...p,stitching:e.target.value}))}/>
      </div>
    </div>
  );

  if (productType==="boot") return (
    <div style={fdg}>
      <div style={fi2}><label style={fl2}>{t.material}</label>
        <select style={fin} value={form.material||""} onChange={e=>setForm(p=>({...p,material:e.target.value}))}>{MATERIALS.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={fi2}><label style={fl2}>{t.color}</label>
        <select style={fin} value={form.color||""} onChange={e=>setForm(p=>({...p,color:e.target.value}))}>{COLORS.map(v=><option key={v}>{v}</option>)}</select>
      </div>
      <div style={fi2}><label style={fl2}>{t.bootWaterproof}</label>
        <select style={fin} value={form.bootWaterproof||"No"} onChange={e=>setForm(p=>({...p,bootWaterproof:e.target.value}))}>
          {["Yes / 有","No / 沒有"].map(v=><option key={v}>{v}</option>)}
        </select>
      </div>
      <div style={fi2}><label style={fl2}>{t.bootFullWrap}</label>
        <select style={fin} value={form.bootFullWrap||"No"} onChange={e=>setForm(p=>({...p,bootFullWrap:e.target.value}))}>
          {["Yes / 全包圍","No / 標準"].map(v=><option key={v}>{v}</option>)}
        </select>
      </div>
    </div>
  );

  if (productType==="shield") return (
    <div style={fdg}>
      <div style={fi2}><label style={fl2}>{lang==="zh"?"類型":"Type"}</label>
        <select style={fin} value={form.shieldType||""} onChange={e=>setForm(p=>({...p,shieldType:e.target.value}))}>
          {["Front / 前擋","Rear / 後擋","Full Set / 全套","Side / 側窗"].map(v=><option key={v}>{v}</option>)}
        </select>
      </div>
      <div style={fi2}><label style={fl2}>{lang==="zh"?"物料":"Material"}</label>
        <input style={fin} placeholder={lang==="zh"?"例：壓克力、PC…":"e.g. Acrylic, PC…"} value={form.material||""} onChange={e=>setForm(p=>({...p,material:e.target.value}))}/>
      </div>
      <div style={{...fi2,gridColumn:"1/-1"}}><label style={fl2}>{lang==="zh"?"顏色/款式":"Colour / Style"}</label>
        <input style={fin} placeholder={lang==="zh"?"例：煙灰色、透明…":"e.g. Smoke, Clear…"} value={form.color||""} onChange={e=>setForm(p=>({...p,color:e.target.value}))}/>
      </div>
    </div>
  );

  // other
  return (
    <div style={fdg}>
      <div style={{...fi2,gridColumn:"1/-1"}}><label style={fl2}>{lang==="zh"?"貨品名稱":"Item Name"}</label>
        <input style={fin} placeholder={lang==="zh"?"例：車窗貼膜、避震器…":"e.g. Window Tint, Shock Absorber…"} value={form.itemName||""} onChange={e=>setForm(p=>({...p,itemName:e.target.value}))}/>
      </div>
      <div style={{...fi2,gridColumn:"1/-1"}}><label style={fl2}>{lang==="zh"?"規格 Specification":"Specification"}</label>
        <textarea style={{...fin,minHeight:72,resize:"vertical",width:"100%"}} placeholder={lang==="zh"?"填寫規格、型號、尺寸、顏色等…":"Spec, model, size, colour, etc…"} value={form.specification||""} onChange={e=>setForm(p=>({...p,specification:e.target.value}))}/>
      </div>
      <div style={fi2}><label style={fl2}>{lang==="zh"?"物料":"Material"}</label>
        <input style={fin} placeholder={lang==="zh"?"物料…":"Material…"} value={form.material||""} onChange={e=>setForm(p=>({...p,material:e.target.value}))}/>
      </div>
      <div style={fi2}><label style={fl2}>{lang==="zh"?"顏色":"Colour"}</label>
        <input style={fin} placeholder={lang==="zh"?"顏色…":"Colour…"} value={form.color||""} onChange={e=>setForm(p=>({...p,color:e.target.value}))}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SPEC SUMMARY (for detail view)
// ═══════════════════════════════════════════════════════
function SpecSummary({ order, lang, t }) {
  const rows = buildSpecRows(order);
  if (!rows.length) return null;
  return (
    <div style={S.ib}>
      <div style={S.ibt}>{t.design}</div>
      {rows.map(([k,v])=>(
        <div key={k} style={S.ir}><span>{k}</span><span style={{fontWeight:500}}>{v}</span></div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
const APP_PASSWORD = "yd2019";

export default function App() {
  const [lang, setLang] = useState("zh");
  const t = T[lang];
  const ORDER_STATUSES = getOrderStatuses(t);
  const BULK_STATUSES  = getBulkStatuses(t);

  // Login
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem("cs_auth")==="1");
  const [pwInput, setPwInput]   = useState("");
  const [pwError, setPwError]   = useState(false);
  const doLogin = () => {
    if (pwInput===APP_PASSWORD) { sessionStorage.setItem("cs_auth","1"); setLoggedIn(true); setPwError(false); }
    else { setPwError(true); setPwInput(""); }
  };

  const [tab, setTab]     = useState("orders");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const flash = (m) => { setToast(m); setTimeout(()=>setToast(""),2200); };

  // Settings — must be declared before MATERIALS/COLORS
  const [settingsCarMakes,   setSettingsCarMakes]   = useState(CAR_MAKES);
  const [settingsMaterialsEn,setSettingsMaterialsEn]= useState(MATERIALS_MAP.en);
  const [settingsMaterialsZh,setSettingsMaterialsZh]= useState(MATERIALS_MAP.zh);
  const [settingsColorsEn,   setSettingsColorsEn]   = useState(COLORS_MAP.en);
  const [settingsColorsZh,   setSettingsColorsZh]   = useState(COLORS_MAP.zh);
  const [settingsSeats,      setSettingsSeats]      = useState(["Full Set (5 seats)","Full Set (7 seats)","Front 2 Seats","Rear Seats","Driver Only","3rd Row Only"]);
  const [settingsScreenSizes,setSettingsScreenSizes]= useState(SCREEN_SIZES);
  const [settingsSteerSizes, setSettingsSteerSizes] = useState(STEER_SIZES);
  const [settingsProductTypes, setSettingsProductTypes] = useState(DEFAULT_PRODUCT_TYPES);
  const [settingsInput, setSettingsInput] = useState({});

  // Derive PRODUCT_TYPES from settings
  const PRODUCT_TYPES = settingsProductTypes.map(p=>p.key);
  const ptLabel = (pt) => {
    const found = settingsProductTypes.find(p=>p.key===pt);
    if (found) return lang==="zh"?found.labelZh:found.labelEn;
    return pt;
  };

  const MATERIALS = lang==="zh" ? settingsMaterialsZh : settingsMaterialsEn;
  const COLORS    = lang==="zh" ? settingsColorsZh    : settingsColorsEn;

  const addSettingItem = (key, setter, valEn, valZh) => {
    if (!valEn?.trim()) return;
    setter(p=>[...p, valEn.trim()]);
    if (valZh !== undefined) {
      if (key==="material") { setSettingsMaterialsZh(p=>[...p, valZh?.trim()||valEn.trim()]); }
      if (key==="color")    { setSettingsColorsZh(p=>[...p, valZh?.trim()||valEn.trim()]); }
    }
    setSettingsInput(p=>({...p,[key]:"", [key+"Zh"]:""}));
    flash("✓ Added");
  };

  const removeSettingItem = (setter, idx, key) => {
    setter(p=>p.filter((_,i)=>i!==idx));
    if (key==="material") setSettingsMaterialsZh(p=>p.filter((_,i)=>i!==idx));
    if (key==="color")    setSettingsColorsZh(p=>p.filter((_,i)=>i!==idx));
    flash("Removed");
  };

  // Orders
  const [orders, setOrders]             = useState([]);
  const [orderView, setOrderView]       = useState("list");
  const [activeOrder, setActiveOrder]   = useState(null);
  const [orderFilter, setOrderFilter]   = useState("all");
  const [chanFilter, setChanFilter]     = useState("all");
  const [ptFilter, setPtFilter]         = useState("all");
  const [orderQ, setOrderQ]             = useState("");
  const [waLang, setWaLang]             = useState("zh");
  const [showWA, setShowWA]             = useState(false);
  const [specPopup, setSpecPopup] = useState(null); // order id for spec popup
  const emptyOrder = { productType:"seat", channel:"store", client:"", phone:"", email:"", carMake:CAR_MAKES[0], carYear:"", carModel:"", seats:"", material:"", color:"", colorHistory:[], mat2Material:"", mat2Color:"", layers:"", stitching:"", embroidery:"", screenSize:"", compatible:"", rearCam:"", steerDiam:"", bootWaterproof:"", bootFullWrap:"", itemName:"", specification:"", shieldType:"", deposit:"", total:"", due:"", orderDate:NOW, customId:"", address:"", notes:"", invoiceNo:"", groupId:"", designType:"ORIGINAL", customDesignNote:"" };
  const [oForm, setOForm] = useState(emptyOrder);

  // Bulk
  const [bulkOrders, setBulkOrders]   = useState([]);
  const [bulkView, setBulkView]       = useState("list");
  const [activeBulk, setActiveBulk]   = useState(null);
  const [bulkFilter, setBulkFilter]   = useState("all");
  const [bulkPtFilter, setBulkPtFilter] = useState("all");
  const [selBulk, setSelBulk]         = useState([]);
  const emptyBulk = { productType:"seat", supplier:"", carMake:CAR_MAKES[0], carYear:"", carModel:"", material:"", materialZh:"", color:"", colorZh:"", qty:"", unit:"套", costPerUnit:"", sellPerUnit:"", eta:"", stockQty:"", minStock:"", notes:"" };
  const [bForm, setBForm] = useState(emptyBulk);

  // Stock alerts
  const [stockAlerts, setStockAlerts] = useState([]);
  const [selAlerts, setSelAlerts]     = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [editingAlert, setEditingAlert]   = useState(null);
  const emptyAlert = { productType:"seat", carMake:CAR_MAKES[0], carYear:"", carModel:"", material:"", color:"", suggestQty:"", reason:"", raisedBy:"", supplier:"", orderStatus:"pending", orderDate:"" };
  const [aForm, setAForm] = useState(emptyAlert);

  // ── Supabase: Load all data on mount ──
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const [ords, bulks, alerts, cfg] = await Promise.all([
          sb.get("orders"),
          sb.get("bulk_orders"),
          sb.get("stock_alerts"),
          sb.getSettings("app_settings"),
        ]);
        if (ords?.length)   setOrders(ords);
        if (bulks?.length)  setBulkOrders(bulks);
        if (alerts?.length) setStockAlerts(alerts);
        if (cfg) {
          if (cfg.carMakes)       setSettingsCarMakes(cfg.carMakes);
          if (cfg.materialsEn)    setSettingsMaterialsEn(cfg.materialsEn);
          if (cfg.materialsZh)    setSettingsMaterialsZh(cfg.materialsZh);
          if (cfg.colorsEn)       setSettingsColorsEn(cfg.colorsEn);
          if (cfg.colorsZh)       setSettingsColorsZh(cfg.colorsZh);
          if (cfg.seats)          setSettingsSeats(cfg.seats);
          if (cfg.screenSizes)    setSettingsScreenSizes(cfg.screenSizes);
          if (cfg.steerSizes)     setSettingsSteerSizes(cfg.steerSizes);
          if (cfg.productTypes)   setSettingsProductTypes(cfg.productTypes);
        }
      } catch(e) {
        flash("連接資料庫失敗，使用本地資料");
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  // ── Supabase: Save settings helper ──
  const saveSettingsToCloud = useCallback(async (updates) => {
    const current = {
      carMakes: settingsCarMakes, materialsEn: settingsMaterialsEn,
      materialsZh: settingsMaterialsZh, colorsEn: settingsColorsEn,
      colorsZh: settingsColorsZh, seats: settingsSeats,
      screenSizes: settingsScreenSizes, steerSizes: settingsSteerSizes,
      productTypes: settingsProductTypes, ...updates
    };
    await sb.saveSettings("app_settings", current);
  }, [settingsCarMakes, settingsMaterialsEn, settingsMaterialsZh, settingsColorsEn, settingsColorsZh, settingsSeats, settingsScreenSizes, settingsSteerSizes, settingsProductTypes]);
  const filteredOrders = orders.filter(o => {
    const ms = orderFilter==="all" || o.status===orderFilter;
    const mc = chanFilter==="all"  || o.channel===chanFilter;
    const mp = ptFilter==="all"    || o.productType===ptFilter;
    const mq = !orderQ || [o.client,o.id,o.carMake,o.carModel,o.phone,o.invoiceNo].some(v=>(v||"").toLowerCase().includes(orderQ.toLowerCase()));
    return ms&&mc&&mp&&mq;
  });

  const nextOrderNum = () => {
    const nums = orders.map(o=>{
      const base = o.groupId || o.id;
      const n = parseInt(base.replace(/[^0-9]/g,""));
      return isNaN(n)?0:n;
    });
    const max = nums.length>0?Math.max(...nums):0;
    return String(max+1).padStart(3,"0");
  };

  // Auto-calculate ETD: orderDate + 6 weeks
  const calcETD = (dateStr) => {
    const d = new Date(dateStr||NOW);
    d.setDate(d.getDate()+42); // 6 weeks
    return d.toISOString().slice(0,10);
  };

  const saveOrder = async () => {
    let newId;
    const groupBase = oForm.groupId?.trim();
    const customId = oForm.customId?.trim();
    if (customId) {
      newId = customId;
    } else if (groupBase) {
      const siblings = orders.filter(o=>o.groupId===groupBase);
      const letters = "BCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (siblings.length===0) {
        newId = groupBase;
      } else if (siblings.length===1 && siblings[0].id===groupBase) {
        const firstUpdated = {...siblings[0], id:groupBase+"A"};
        setOrders(p=>p.map(o=>o.id===groupBase?firstUpdated:o));
        await sb.upsert("orders", groupBase+"A", firstUpdated);
        await sb.delete("orders", groupBase);
        newId = groupBase+"B";
      } else {
        let idx=0;
        while(orders.find(o=>o.id===groupBase+letters[idx])) idx++;
        newId = groupBase+letters[Math.min(idx,24)];
      }
    } else {
      newId = nextOrderNum();
    }
    const orderDate = oForm.orderDate||NOW;
    const autoETD = calcETD(orderDate);
    const o = { ...oForm, id:newId, groupId:groupBase||newId, deposit:+oForm.deposit||0, total:+oForm.total||0, created:NOW, orderDate, due:oForm.due||autoETD, status:"pending", reorder:false, colorHistory:[], shipNo:"", shipDate:"", productionDoneDate:"", completedDate:"", contactedClient:false, issueNote:"", photos:[] };
    setOrders(p=>[o,...p]); setOrderView("list"); setOForm({...emptyOrder});
    await sb.upsert("orders", newId, o);
    flash("✓ Order "+newId+" created — ETD: "+autoETD);
  };

  const updateOSt = async (id,st) => {
    setOrders(p=>p.map(o=>o.id===id?{...o,status:st}:o));
    if(activeOrder?.id===id) setActiveOrder(a=>({...a,status:st}));
    const updated = orders.find(o=>o.id===id); if(updated) await sb.upsert("orders",id,{...updated,status:st});
    flash(t.updateStatus+" ✓");
  };

  const updateOrderColor = async (id, newColor) => {
    const order = orders.find(o=>o.id===id);
    if(!order) return;
    const history = [...(order.colorHistory||[]), {
      from: order.color||"",
      to: newColor,
      date: NOW,
      time: new Date().toLocaleTimeString("zh-HK",{hour:"2-digit",minute:"2-digit"})
    }];
    setOrders(p=>p.map(o=>o.id===id?{...o,color:newColor,colorHistory:history}:o));
    if(activeOrder?.id===id) setActiveOrder(a=>({...a,color:newColor,colorHistory:history}));
    await sb.upsert("orders",id,{...order,color:newColor,colorHistory:history});
    flash(lang==="zh"?"顏色已更新並記錄":"Colour updated & recorded");
  };

  const confirmWithInvoice = async (id, invNo) => {
    if (!invNo.trim()) return;
    setOrders(p=>p.map(o=>o.id===id?{...o,invoiceNo:invNo,status:"confirmed"}:o));
    if(activeOrder?.id===id) setActiveOrder(a=>({...a,invoiceNo:invNo,status:"confirmed"}));
    const updated = orders.find(o=>o.id===id); if(updated) await sb.upsert("orders",id,{...updated,invoiceNo:invNo,status:"confirmed"});
    flash(lang==="zh"?"✓ Invoice 已確認":"✓ Invoice confirmed");
  };

  const sendEmail = (order) => {
    const specRows = buildSpecRows(order);
    const specText = specRows.map(([k,v])=>`${k}: ${v}`).join("\n");
    const subject = encodeURIComponent(`Order Confirmation — ${order.id}`);
    const body = encodeURIComponent(
`Dear ${order.client},

Thank you for your order with COVERSYNC!

ORDER DETAILS
─────────────────────────
Order No.: ${order.id}${order.invoiceNo?"\nInvoice No.: "+order.invoiceNo:""}
Date: ${order.created}${order.due?"\nEst. Completion: "+order.due:""}

VEHICLE
─────────────────────────
${order.carMake} ${order.carModel||""} (${order.carYear||""})

SPECIFICATIONS
─────────────────────────
${specText||"Please refer to in-store record"}

PAYMENT
─────────────────────────
Total: HK$${order.total}
Deposit Paid: HK$${order.deposit}
Balance Due: HK$${order.total-order.deposit}

${order.notes?"Notes: "+order.notes+"\n\n":""}We will keep you updated on your order progress.
Thank you for choosing us!

COVERSYNC
`);
    window.location.href = `mailto:${order.email||""}?subject=${subject}&body=${body}`;
  };

  const doReorder = async (o) => {
    const n={...o,id:uid("ORD"),created:NOW,status:"pending",deposit:0,reorder:true,notes:"Re-order — Orig: "+o.id};
    setOrders(p=>[n,...p]); setOrderView("list");
    await sb.upsert("orders",n.id,n);
    flash("✓ "+n.id);
  };

  const delOrder = async (id) => {
    setOrders(p=>p.filter(o=>o.id!==id)); setActiveOrder(null); setOrderView("list");
    await sb.delete("orders",id);
    flash("Deleted");
  };

  // ── Bulk helpers ──
  const filteredBulk = bulkOrders.filter(b=>(bulkFilter==="all"||b.status===bulkFilter)&&(bulkPtFilter==="all"||b.productType===bulkPtFilter));

  const saveBulk = async () => {
    const b = { ...bForm, id:uid("BLK"), created:NOW, status:"pending", qty:+bForm.qty||0, costPerUnit:+bForm.costPerUnit||0, sellPerUnit:+bForm.sellPerUnit||0, stockQty:+bForm.stockQty||0, minStock:+bForm.minStock||0 };
    setBulkOrders(p=>[b,...p]); setBulkView("list"); setBForm(emptyBulk);
    await sb.upsert("bulk_orders",b.id,b);
    flash("✓ "+b.id);
  };

  const updateBSt = async (id,st) => {
    setBulkOrders(p=>p.map(b=>b.id===id?{...b,status:st}:b));
    if(activeBulk?.id===id) setActiveBulk(a=>({...a,status:st}));
    const updated = bulkOrders.find(b=>b.id===id); if(updated) await sb.upsert("bulk_orders",id,{...updated,status:st});
    flash(t.updateStatus+" ✓");
  };

  const sendPO = (id) => { updateBSt(id,"confirmed"); flash("PO confirmed / 採購單已確認"); };

  const genCombinedPO = (bulkList) => {
    const supplier = bulkList[0]?.supplier||"";
    const rows = bulkList.map((b,i)=>`<tr>
      <td>${i+1}</td>
      <td>${PT_LABELS[b.productType]||b.productType}</td>
      <td>${b.carMake} ${b.carModel||""}</td>
      <td>${b.carYear||"—"}</td>
      <td>—</td>
      <td>—</td>
      <td>${b.materialZh||b.material||"—"}</td>
      <td>${b.colorZh||b.color||"—"}</td>
      <td><strong>${b.qty} ${b.unit}</strong></td>
      <td style="text-align:left">${b.notes||""}</td>
    </tr>`).join("");
    const totalQty = bulkList.reduce((s,b)=>s+(+b.qty||0),0);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'PingFang TC','Microsoft YaHei',Arial,sans-serif;color:#000;margin:0;padding:30px;font-size:13px;}
  .header{text-align:center;margin-bottom:20px;}
  .title{font-size:16px;font-weight:700;margin-bottom:4px;}
  table{width:100%;border-collapse:collapse;margin-top:12px;}
  th{background:#4361EE;color:#fff;padding:8px 10px;font-size:12px;text-align:center;border:1px solid #3050cc;}
  td{padding:8px 10px;border:1px solid #ccc;font-size:12px;text-align:center;vertical-align:middle;}
  tr:nth-child(even) td{background:#F0F4FF;}
  .total-row td{font-weight:700;background:#EEF1FF;border-top:2px solid #4361EE;}
  .stamp-area{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:40px;}
  .stamp-box{border-top:1px solid #000;padding-top:10px;text-align:center;font-size:12px;color:#555;}
  @media print{body{padding:15px;}}
</style></head><body>
<div class="header">
  <div class="title">COVERSYNC — 合併採購訂單 Combined Purchase Order</div>
  <div>供應商 Supplier: <strong>${supplier}</strong> &nbsp;|&nbsp; 日期 Date: ${NOW} &nbsp;|&nbsp; 共 ${bulkList.length} 款產品</div>
</div>
<table>
  <thead><tr>
    <th style="width:35px">No</th><th>產品</th><th>車型</th><th>年份</th><th>座位</th><th>款式</th><th>皮料</th><th>顏色</th><th>數量</th><th>備注</th>
  </tr></thead>
  <tbody>${rows}</tbody>
  <tfoot><tr class="total-row"><td colspan="8" style="text-align:right">合計 Total</td><td><strong>${totalQty} 套</strong></td><td></td></tr></tfoot>
</table>
<div class="stamp-area">
  <div class="stamp-box">採購方簽署 Buyer Signature<br><br><br></div>
  <div class="stamp-box">供應商確認 Supplier Confirmation<br><br><br></div>
</div>
</body></html>`;
  };

  // Auto-update stock alerts to "ordered" when bulk confirmed
  const updateBStWithAlerts = async (id, st) => {
    await updateBSt(id, st);
    if (st==="confirmed") {
      const bulk = bulkOrders.find(b=>b.id===id);
      if (!bulk) return;
      const updatedAlerts = stockAlerts.map(a=>{
        if(a.productType===bulk.productType && a.carMake===bulk.carMake && a.orderStatus!=="ordered") {
          return {...a, orderStatus:"ordered"};
        }
        return a;
      });
      setStockAlerts(updatedAlerts);
      await Promise.all(updatedAlerts.filter((a,i)=>a!==stockAlerts[i]).map(a=>sb.upsert("stock_alerts",a.id,a)));
      flash(lang==="zh"?"大貨已確認，低庫存提醒自動更新為已下單":"Bulk confirmed — stock alerts auto-updated to Ordered");
    }
  };

  const delBulk = async (id) => {
    setBulkOrders(p=>p.filter(b=>b.id!==id)); setActiveBulk(null); setBulkView("list");
    await sb.delete("bulk_orders",id);
    flash("Deleted");
  };

  const createFromAlerts = async (items) => {
    const newBulks = items.map(a => ({id:uid("BLK"),productType:a.productType||"seat",supplier:a.supplier||"",carMake:a.carMake,carYear:a.carYear,carModel:a.carModel,material:a.material,materialZh:a.materialZh||a.material,color:a.color,colorZh:a.colorZh||a.color,qty:a.suggestQty,unit:"套",costPerUnit:"",sellPerUnit:"",eta:"",stockQty:0,minStock:0,notes:(lang==="zh"?"由Sales缺貨提醒建立":"From stock alert")+(a.reason?"\n原因: "+a.reason:""),status:"pending",created:NOW}));
    setBulkOrders(p=>[...newBulks,...p]);
    await Promise.all(newBulks.map(b=>sb.upsert("bulk_orders",b.id,b)));
    setSelAlerts([]); setTab("bulk"); flash(`✓ ${items.length} draft(s) created`);
  };

  const saveAlert = async () => {
    const a = { ...aForm, id:uid("STK"), currentStock:0, minStock:0, suggestQty:+aForm.suggestQty||10, createdBy:aForm.raisedBy, created:NOW };
    setStockAlerts(p=>[a,...p]); setShowAlertForm(false); setAForm(emptyAlert);
    await sb.upsert("stock_alerts",a.id,a);
    flash(lang==="zh"?"✓ 缺貨提醒已建立":"✓ Alert created");
  };

  const saveEditAlert = async () => {
    const updated = {...editingAlert};
    setStockAlerts(p=>p.map(a=>a.id===updated.id?updated:a));
    setEditingAlert(null);
    await sb.upsert("stock_alerts",updated.id,updated);
    flash(lang==="zh"?"✓ 提醒已更新":"✓ Alert updated");
  };

  const delAlert = async (id) => {
    setStockAlerts(p=>p.filter(a=>a.id!==id)); setSelAlerts(p=>p.filter(x=>x!==id));
    await sb.delete("stock_alerts",id);
  };

  const getSt  = (key) => ORDER_STATUSES.find(s=>s.key===key)||ORDER_STATUSES[0];
  const getBSt = (key) => BULK_STATUSES.find(s=>s.key===key)||BULK_STATUSES[0];
  const lowStock = bulkOrders.filter(b=>b.stockQty!==undefined&&b.minStock&&b.stockQty<=b.minStock);
  const allAlerts = [...stockAlerts,...lowStock.map(b=>({id:b.id,productType:b.productType,carMake:b.carMake,carYear:b.carYear,carModel:b.carModel,material:b.material,materialZh:b.materialZh,color:b.color,colorZh:b.colorZh,currentStock:b.stockQty,minStock:b.minStock,supplier:b.supplier,suggestQty:b.qty||10}))].filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i);

  const copyWA = (text) => { navigator.clipboard.writeText(text).then(()=>flash(t.copied)); };

  // Excel export
  const [showExport, setShowExport] = useState(false);
  const ALL_COLS = [
    {k:"id",        l:"訂單號"},
    {k:"orderDate", l:"訂單日期"},
    {k:"client",    l:"客人"},
    {k:"phone",     l:"電話"},
    {k:"email",     l:"Email"},
    {k:"channel",   l:"渠道"},
    {k:"productType",l:"產品類型"},
    {k:"carMake",   l:"車廠"},
    {k:"carModel",  l:"型號"},
    {k:"carYear",   l:"年份"},
    {k:"material",  l:"物料"},
    {k:"color",     l:"顏色"},
    {k:"stitching", l:"車線/喉管"},
    {k:"seats",     l:"座位"},
    {k:"total",     l:"總金額"},
    {k:"deposit",   l:"訂金"},
    {k:"invoiceNo", l:"Invoice No."},
    {k:"status",    l:"狀態"},
    {k:"due",       l:"ETD"},
    {k:"shipNo",    l:"集運單號"},
    {k:"shipDate",  l:"發貨日期"},
    {k:"notes",     l:"備注"},
  ];
  const [selCols, setSelCols] = useState(["id","orderDate","client","phone","productType","carMake","carModel","status","total","invoiceNo","due"]);

  const exportExcel = () => {
    const header = selCols.map(k=>ALL_COLS.find(c=>c.k===k)?.l||k);
    const rows = orders.map(o=>selCols.map(k=>{
      if(k==="productType") return ptLabel(o[k]);
      if(k==="status") return getSt(o.status)?.label||o.status;
      if(k==="channel") return o.channel==="store"?"店內":"網上";
      return o[k]||"";
    }));
    const csv = [header,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `coversync-orders-${NOW}.csv`;
    a.click();
    flash(lang==="zh"?"Excel 已匯出":"Excel exported");
    setShowExport(false);
  };

  // PDF order - opens in new window, can save as PDF
  const genOrderPDF = (order) => {
    const specRows = buildSpecRows(order);
    const st = getSt(order.status);
    return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;color:#111;margin:0;padding:30px;font-size:13px;}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #4361EE;}
  .logo{height:45px;object-fit:contain;}
  .doc-info{text-align:right;}
  .doc-title{font-size:11px;color:#888;letter-spacing:2px;text-transform:uppercase;}
  .doc-id{font-size:20px;font-weight:700;color:#4361EE;font-family:monospace;margin:4px 0;}
  .doc-date{font-size:11px;color:#888;}
  .status-badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;margin-top:6px;}
  .section{margin-bottom:20px;}
  .section-title{font-size:9px;color:#4361EE;letter-spacing:3px;font-weight:700;text-transform:uppercase;border-bottom:1px solid #E8ECF4;padding-bottom:6px;margin-bottom:12px;}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .field-label{font-size:10px;color:#888;margin-bottom:2px;}
  .field-value{font-size:13px;font-weight:600;}
  .spec-table{width:100%;border-collapse:collapse;margin-top:8px;}
  .spec-table td{padding:8px 12px;border-bottom:1px solid #f0f0f0;font-size:12px;}
  .spec-table td:first-child{color:#888;font-size:10px;letter-spacing:1px;text-transform:uppercase;width:35%;}
  .spec-table td:last-child{font-weight:600;}
  .price-section{background:#F8F9FF;border-radius:8px;padding:16px;margin-top:16px;}
  .price-row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #E8ECF4;font-size:13px;}
  .price-total{display:flex;justify-content:space-between;padding:10px 0;font-weight:700;font-size:16px;color:#4361EE;}
  .timeline{margin-top:20px;}
  .tl-item{display:flex;gap:10px;align-items:flex-start;padding:6px 0;}
  .tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:3px;}
  .tl-label{font-size:12px;}
  .footer{margin-top:32px;padding-top:16px;border-top:1px solid #E8ECF4;font-size:10px;color:#aaa;text-align:center;}
  .etd-alert{background:#FFF5F5;border:1px solid #FFCCCC;border-radius:6px;padding:8px 12px;font-size:11px;color:#E84B4B;font-weight:700;margin-top:8px;}
  @media print{body{padding:15px;} @page{margin:1cm;}}
</style>
<script>window.onload=function(){if(navigator.share){document.getElementById('sharebtn').style.display='block';}}</script>
</head><body>
<div class="header">
  <div class="doc-info" style="text-align:left">
    <div class="doc-title">訂單詳情 Order Details</div>
    <div class="doc-id">${order.id}</div>
    <div class="doc-date">${lang==="zh"?"訂單日期":"Order Date"}: ${order.orderDate||order.created||NOW}</div>
    <div class="status-badge" style="background:${st.color}22;color:${st.color};border:1px solid ${st.color}44">${st.label}</div>
  </div>
  <div style="text-align:right;font-size:22px;font-weight:900;color:#4361EE;letter-spacing:3px">COVERSYNC<br><span style="font-size:11px;color:#888;font-weight:400;letter-spacing:1px">Y&D Trading House</span></div>
</div>

<div class="section">
  <div class="section-title">${lang==="zh"?"客人資料":"Client Information"}</div>
  <div class="grid">
    <div><div class="field-label">${lang==="zh"?"客人姓名":"Name"}</div><div class="field-value">${order.client}</div></div>
    <div><div class="field-label">${lang==="zh"?"電話":"Phone"}</div><div class="field-value">${order.phone}</div></div>
    ${order.email?`<div><div class="field-label">Email</div><div class="field-value">${order.email}</div></div>`:""}
    ${order.address?`<div style="grid-column:1/-1"><div class="field-label">${lang==="zh"?"地址":"Address"}</div><div class="field-value">${order.address}</div></div>`:""}
  </div>
</div>

<div class="section">
  <div class="section-title">${lang==="zh"?"車輛資料":"Vehicle"}</div>
  <div class="grid">
    <div><div class="field-label">${lang==="zh"?"車廠型號":"Make & Model"}</div><div class="field-value">${order.carMake} ${order.carModel||""}</div></div>
    <div><div class="field-label">${lang==="zh"?"年份":"Year"}</div><div class="field-value">${order.carYear||"—"}</div></div>
  </div>
</div>

<div class="section">
  <div class="section-title">${lang==="zh"?"產品規格":"Product Specifications"}</div>
  <div style="display:inline-block;background:#EEF1FF;color:#4361EE;border:1px solid #C5CEFF;border-radius:4px;padding:3px 10px;font-size:11px;font-weight:700;margin-bottom:10px">${ptLabel(order.productType)}</div>
  ${order.designType==="CUSTOM"?`<div style="display:inline-block;background:#FFF8EE;color:#D97706;border:1px solid #FFD580;border-radius:4px;padding:3px 10px;font-size:11px;font-weight:700;margin-left:6px;margin-bottom:10px">Custom</div>`:""}
  <table class="spec-table"><tbody>
    ${specRows.map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join("")}
    ${order.customDesignNote?`<tr><td>Custom Notes</td><td>${order.customDesignNote}</td></tr>`:""}
  </tbody></table>
</div>

<div class="price-section">
  <div class="section-title" style="border-color:#C5CEFF">${lang==="zh"?"付款詳情":"Payment"}</div>
  <div class="price-row"><span>${lang==="zh"?"總金額":"Total"}</span><span style="font-weight:700">${fmtHKD(order.total)}</span></div>
  <div class="price-row"><span>${lang==="zh"?"已付訂金":"Deposit Paid"}</span><span style="color:#16A34A;font-weight:600">${fmtHKD(order.deposit)}</span></div>
  <div class="price-total"><span>${lang==="zh"?"待收餘款":"Balance Due"}</span><span>${fmtHKD(order.total-order.deposit)}</span></div>
  ${order.invoiceNo?`<div class="price-row"><span>Invoice No.</span><span style="font-family:monospace;font-weight:700">${order.invoiceNo}</span></div>`:""}
  ${order.due?`<div class="price-row"><span>ETD</span><span>${order.due}</span></div>`:""}
</div>

${order.shipNo?`<div class="section" style="margin-top:16px">
  <div class="section-title">${lang==="zh"?"集運資料":"Shipping"}</div>
  <div class="grid">
    <div><div class="field-label">${lang==="zh"?"集運單號":"Tracking No."}</div><div class="field-value" style="font-family:monospace">${order.shipNo}</div></div>
    ${order.shipDate?`<div><div class="field-label">${lang==="zh"?"發貨日期":"Ship Date"}</div><div class="field-value">${order.shipDate}</div></div>`:""}
  </div>
</div>`:""}

${order.notes?`<div class="section" style="margin-top:16px"><div class="section-title">${lang==="zh"?"備注":"Notes"}</div><div style="background:#FFFBF0;border:1px solid #FFE099;border-radius:6px;padding:12px;font-size:13px">${order.notes}</div></div>`:""}

<div class="footer">
  COVERSYNC · Y&D Trading House · ${lang==="zh"?"此文件由系統自動生成":"This document is system-generated"} · ${NOW}
</div>
<div style="text-align:center;margin-top:16px;display:none" id="sharebtn">
  <button onclick="navigator.share({title:'Order ${order.id}',text:'COVERSYNC Order Details',url:window.location.href})" style="background:#4361EE;color:#fff;border:none;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer">Share / Save PDF</button>
</div>
<script>
  // Auto-prompt save as PDF on mobile
  setTimeout(function(){
    if(/iPhone|iPad|Android/i.test(navigator.userAgent)){
      document.getElementById('sharebtn').style.display='block';
    }
  },500);
</script>
</body></html>`;
  };

  return (
    <div style={S.root}>
      <style>{CSS}</style>
      {toast && <div style={S.toast}>{toast}</div>}

      {/* Login screen */}
      {!loggedIn && (
        <div style={{position:"fixed",inset:0,background:"#F5F6FA",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}}>
          <div style={{background:"#fff",borderRadius:16,padding:"40px",width:360,boxShadow:"0 8px 40px rgba(0,0,0,0.1)",border:"1px solid #E8ECF4"}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:18,fontWeight:700,color:"#4361EE",letterSpacing:3,marginBottom:4}}>COVERSYNC</div>
            <div style={{fontSize:12,color:"#aaa",marginBottom:28}}>Y&D Trading House</div>
            <div style={{fontSize:13,color:"#555",marginBottom:8,fontWeight:600}}>{lang==="zh"?"請輸入密碼":"Enter Password"}</div>
            <input type="password" style={{...S.fin,width:"100%",marginBottom:8,fontSize:15}} placeholder="••••••••"
              value={pwInput} onChange={e=>{setPwInput(e.target.value);setPwError(false);}}
              onKeyDown={e=>e.key==="Enter"&&doLogin()}
              autoFocus/>
            {pwError && <div style={{color:"#E84B4B",fontSize:12,marginBottom:8}}>{lang==="zh"?"密碼錯誤，請重試":"Incorrect password, please try again"}</div>}
            <button style={{...S.pb,width:"100%",marginTop:4,fontSize:14}} onClick={doLogin}>
              {lang==="zh"?"登入":"Login"}
            </button>
            <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:16}}>
              <button className="lang-btn" style={{...S.langBtn,...(lang==="zh"?S.langBtnActive:{})}} onClick={()=>setLang("zh")}>中</button>
              <button className="lang-btn" style={{...S.langBtn,...(lang==="en"?S.langBtnActive:{})}} onClick={()=>setLang("en")}>EN</button>
            </div>
          </div>
        </div>
      )}

      {/* Loading screen */}
      {loading && (
        <div style={{position:"fixed",inset:0,background:"#F5F6FA",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:999}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:22,fontWeight:700,color:"#4361EE",letterSpacing:3,marginBottom:16}}>⬡ COVERSYNC</div>
          <div style={{fontSize:13,color:"#aaa",marginBottom:24}}>連接資料庫中… Connecting to database…</div>
          <div style={{display:"flex",gap:8}}>
            {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#4361EE",animation:`pulse 1.2s ${i*0.2}s infinite`,opacity:0.7}}/>)}
          </div>
          <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:0.4}50%{transform:scale(1.4);opacity:1}}`}</style>
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logo}>{t.appName}</div>
          <div style={S.logoSub}>{t.appSub}</div>
        </div>
        <nav style={S.nav}>
          {[
            {key:"orders",label:t.tabOrders,badge:orders.filter(o=>o.status==="pending").length},
            {key:"bulk",  label:t.tabBulk,  badge:bulkOrders.filter(b=>b.status==="draft").length},
            {key:"stock", label:t.tabStock, badge:allAlerts.length},
            {key:"settings",label:lang==="zh"?"設定":"Settings",badge:0},
          ].map(({key,label,badge})=>(
            <button key={key} className="nav-tab" style={{...S.navTab,...(tab===key?S.navTabActive:{})}} onClick={()=>setTab(key)}>
              {label}{badge>0&&<span style={{...S.badge,...(tab===key?{background:"#fff",color:"#080812"}:{})}}>{badge}</span>}
            </button>
          ))}
        </nav>
        <div style={S.headerRight}>
          <div style={S.langToggle}>
            <button className="lang-btn" style={{...S.langBtn,...(lang==="zh"?S.langBtnActive:{})}} onClick={()=>setLang("zh")}>中</button>
            <div style={S.langDiv}/>
            <button className="lang-btn" style={{...S.langBtn,...(lang==="en"?S.langBtnActive:{})}} onClick={()=>setLang("en")}>EN</button>
          </div>
          <div style={S.statsBar}>
            <div style={S.statPill}><span style={S.statN}>{orders.filter(o=>!["delivered","issue","done"].includes(o.status)).length}</span><span style={S.statL}>{t.inProgress}</span></div>
            <div style={S.statDiv}/>
            <div style={S.statPill}><span style={{...S.statN,color:"#E84B4B"}}>{orders.filter(o=>o.status==="issue").length}</span><span style={S.statL}>{t.hasIssue}</span></div>
          </div>
          <button style={{...S.gb,fontSize:11,padding:"5px 10px"}} onClick={()=>setShowExport(true)}>{lang==="zh"?"匯出 Excel":"Export Excel"}</button>
          <button style={{...S.gb,fontSize:11,padding:"5px 10px"}} onClick={()=>{sessionStorage.removeItem("cs_auth");setLoggedIn(false);}}>{lang==="zh"?"登出":"Logout"}</button>
        </div>
      </header>

      <div style={S.body}>

        {/* ════════ ORDERS ════════ */}
        {tab==="orders" && <>
          {orderView==="list" && (
            <div style={S.page}>
              <div style={S.ph}><div><h2 style={S.pt}>{t.allOrders}</h2><div style={S.ps}>{t.allOrdersSub}</div></div><button style={S.pb} onClick={()=>setOrderView("new")}>{t.newOrder}</button></div>
              <div style={S.filterBar}>
                <input style={S.si} placeholder={t.searchPlaceholder} value={orderQ} onChange={e=>setOrderQ(e.target.value)}/>
                <div style={S.fg}>
                  <span style={S.fl}>{t.productType}:</span>
                  {[{k:"all",l:t.all},...PRODUCT_TYPES.map(k=>({k,l:ptLabel(k)}))].map(({k,l})=>(
                    <button key={k} className="chip" style={{...S.chip,...(ptFilter===k?S.ca:{})}} onClick={()=>setPtFilter(k)}>{l}</button>
                  ))}
                </div>
                <div style={S.fg}>
                  <span style={S.fl}>{t.channel}:</span>
                  {[{k:"all",l:t.all},{k:"store",l:t.store},{k:"online",l:t.online}].map(({k,l})=>(
                    <button key={k} className="chip" style={{...S.chip,...(chanFilter===k?S.ca:{})}} onClick={()=>setChanFilter(k)}>{l}</button>
                  ))}
                </div>
                <div style={S.fg}>
                  <span style={S.fl}>{t.status}:</span>
                  {[{k:"all",l:t.all,c:"#888"},...ORDER_STATUSES.map(s=>({k:s.key,l:s.label,c:s.color}))].map(({k,l,c})=>(
                    <button key={k} className="chip" style={{...S.chip,...(orderFilter===k?{...S.ca,background:c+"33",color:c,borderColor:c+"66"}:{})}} onClick={()=>setOrderFilter(k)}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={S.tw}>
                <div style={S.th2}>{["ID","INV NO","TYPE","CLIENT","CAR / SPEC","STATUS","ETD","TOTAL"].map((h,i)=><div key={i} style={{...S.th,flex:[1.2,.8,.8,1,2,.9,.9,.7][i]}}>{h}</div>)}</div>
                {filteredOrders.map(o=>{const st=getSt(o.status);return(
                  <div key={o.id} className="trow" style={S.tr} onClick={()=>{setActiveOrder(o);setOrderView("detail");}}>
                    <div style={{...S.td,flex:1.2}}>
                      <span style={S.oid}>{o.id}</span>
                      {o.reorder&&<span style={S.rtag}>{t.reorderTag}</span>}
                      {o.groupId&&o.groupId!==o.id&&<span style={{background:"#EEF1FF",color:"#4361EE",border:"1px solid #C5CEFF",borderRadius:4,padding:"1px 5px",fontSize:10,fontWeight:700,marginLeft:4}}>#{o.groupId}</span>}
                    </div>
                    <div style={{...S.td,flex:.8,fontSize:11,color:"#888",fontFamily:"monospace"}}>{o.invoiceNo||"—"}</div>
                    <div style={{...S.td,flex:.8,fontSize:11}}><span style={S.ptBadge}>{ptLabel(o.productType)}</span></div>
                    <div style={{...S.td,flex:1,fontWeight:600,fontSize:13}}>{o.client}</div>
                    <div style={{...S.td,flex:2}}>
                      <div style={{fontSize:12,color:"#555"}}>{o.carMake} {o.carModel} {o.carYear}</div>
                      {(()=>{
                        const rows=buildSpecRows(o);
                        if(!rows.length) return null;
                        const preview=rows.slice(0,2).map(([k,v])=>v).join(" · ");
                        return(
                          <div style={{fontSize:11,color:"#4361EE",marginTop:2,cursor:"pointer"}}
                            onClick={e=>{e.stopPropagation();setSpecPopup(o.id);}}>
                            {preview}{rows.length>2?` +${rows.length-2} more`:""}
                          </div>
                        );
                      })()}
                    </div>
                    <div style={{...S.td,flex:.9}}><span style={{...S.sp,background:st.color+"22",color:st.color,borderColor:st.color+"44"}}>{st.icon} {st.label}</span></div>
                    <div style={{...S.td,flex:.9,fontSize:11}}>
                      {o.due?(()=>{
                        const daysLeft=Math.ceil((new Date(o.due)-new Date())/(1000*60*60*24));
                        const overdue=daysLeft<0&&!["done","delivered"].includes(o.status);
                        const urgent=daysLeft>=0&&daysLeft<=7&&!["done","delivered"].includes(o.status);
                        return <span style={{color:overdue?"#E84B4B":urgent?"#E87C4B":"#555",fontWeight:overdue||urgent?700:400}}>
                          {o.due}{overdue?` (${Math.abs(daysLeft)}d)`:urgent?` (${daysLeft}d)`:""}
                        </span>;
                      })():"—"}
                    </div>
                    <div style={{...S.td,flex:.7,fontFamily:"monospace",fontWeight:700,fontSize:12}}>{fmtHKD(o.total)}</div>
                  </div>
                );})}
                {filteredOrders.length===0&&<div style={S.er}>— {t.all} —</div>}
              </div>
            </div>
          )}

          {orderView==="new" && (
            <div style={S.page}>
              <div style={S.ph}><div><button style={S.bb} onClick={()=>setOrderView("list")}>{t.back}</button><h2 style={{...S.pt,marginTop:8}}>{t.newOrder}</h2></div></div>
              <div style={S.fc}>
                {/* Source */}
                <div style={S.fs}><div style={S.fst}>{t.source}</div>
                  <div style={{display:"flex",gap:10}}>
                    {[{k:"store",l:t.store},{k:"online",l:t.online}].map(({k,l})=><button key={k} className="chip" style={{...S.bcb,...(oForm.channel===k?S.bcba:{})}} onClick={()=>setOForm(p=>({...p,channel:k}))}>{l}</button>)}
                  </div>
                </div>
                {/* Product type */}
                <div style={S.fs}><div style={S.fst}>{t.productType}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {PRODUCT_TYPES.map(k=><button key={k} className="chip" style={{...S.bcb,...(oForm.productType===k?S.bcba:{})}} onClick={()=>setOForm(p=>({...p,productType:k}))}>{ptLabel(k)}</button>)}
                  </div>
                </div>
                {/* Sub-order / Group */}
                <div style={{...S.fs,background:"#F0F4FF",borderRadius:10,padding:"14px",border:"1px solid #C5CEFF"}}>
                  <div style={{...S.fst,color:"#4361EE"}}>{lang==="zh"?"同一客人多件產品 — Sub-order":"Same Client Multiple Products — Sub-order"}</div>
                  <div style={{fontSize:12,color:"#666",marginBottom:10}}>{lang==="zh"?"如客人訂多件產品，填入已有訂單號，系統自動加 B、C…":"If client orders multiple products, enter existing order no. System auto-adds B, C…"}</div>
                  <div style={{display:"flex",gap:12,alignItems:"flex-end"}}>
                    <div style={{...S.fi2,flex:1}}>
                      <label style={S.fl2}>{lang==="zh"?"現有訂單號（留空自動生成新號）":"Existing Order No. (leave blank to auto-generate)"}</label>
                      <input style={S.fin} placeholder={lang==="zh"?"例：001（第二件自動變 001B）":"e.g. 001 (next item auto-becomes 001B)"}
                        value={oForm.groupId||""} onChange={e=>setOForm(p=>({...p,groupId:e.target.value}))}/>
                    </div>
                    {oForm.groupId?.trim() && (
                      <div style={{fontSize:12,color:"#4361EE",background:"#EEF1FF",border:"1px solid #C5CEFF",borderRadius:7,padding:"8px 12px",whiteSpace:"nowrap"}}>
                        {(()=>{
                          const base=oForm.groupId.trim();
                          const siblings=orders.filter(o=>o.groupId===base);
                          const letters="BCDEFGHIJKLMNOPQRSTUVWXYZ";
                          if(siblings.length===0) return `→ ${base}`;
                          if(siblings.length===1&&siblings[0].id===base) return `→ ${base}A / ${base}B`;
                          let idx=0; while(orders.find(o=>o.id===base+letters[idx])) idx++;
                          return `→ ${base}${letters[Math.min(idx,24)]}`;
                        })()}
                      </div>
                    )}
                  </div>
                </div>
                <div style={S.fg2}>
                  {/* Client */}
                  <div style={S.fs}><div style={S.fst}>{t.client}</div><div style={S.fdg}>
                    {[{k:"client",l:t.client,ph:"Chan Tai Man"},{k:"phone",l:t.phone,ph:"9123 4567"},{k:"email",l:"Email",ph:"client@email.com"}].map(({k,l,ph})=>(
                      <div key={k} style={S.fi2}><label style={S.fl2}>{l}</label><input style={S.fin} placeholder={ph} value={oForm[k]||""} onChange={e=>setOForm(p=>({...p,[k]:e.target.value}))}/></div>
                    ))}
                    {oForm.channel==="online"&&<div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.address}</label><input style={S.fin} placeholder="Full address" value={oForm.address||""} onChange={e=>setOForm(p=>({...p,address:e.target.value}))}/></div>}
                  </div></div>
                  {/* Vehicle */}
                  <div style={S.fs}><div style={S.fst}>{t.vehicle}</div><div style={S.fdg}>
                    <div style={S.fi2}><label style={S.fl2}>{t.carMake}</label><select style={S.fin} value={oForm.carMake||""} onChange={e=>setOForm(p=>({...p,carMake:e.target.value}))}>{settingsCarMakes.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.carYear}</label><input style={S.fin} placeholder="2023" value={oForm.carYear||""} onChange={e=>setOForm(p=>({...p,carYear:e.target.value}))}/></div>
                    <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.carModel}</label><input style={S.fin} placeholder="Alphard" value={oForm.carModel||""} onChange={e=>setOForm(p=>({...p,carModel:e.target.value}))}/></div>
                  </div></div>
                  {/* Product-specific */}
                  <div style={{...S.fs,gridColumn:"1/-1"}}><div style={S.fst}>{t.design}</div>
                    <ProductFields productType={oForm.productType} form={oForm} setForm={setOForm} lang={lang} t={t} MATERIALS={MATERIALS} COLORS={COLORS} settingsSeats={settingsSeats}/>
                  </div>
                  {/* Payment */}
                  <div style={S.fs}><div style={S.fst}>{t.payment}</div><div style={S.fdg}>
                    <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"訂單日期":"Order Date"}</label>
                      <input type="date" style={S.fin} value={oForm.orderDate||NOW} onChange={e=>setOForm(p=>({...p,orderDate:e.target.value}))}/>
                    </div>
                    <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"自訂單號（留空自動生成）":"Custom Order ID (optional)"}</label>
                      <input style={S.fin} placeholder={lang==="zh"?"留空 = 自動 001, 002…":"Leave blank = auto 001, 002…"} value={oForm.customId||""} onChange={e=>setOForm(p=>({...p,customId:e.target.value}))}/>
                    </div>
                    <div style={S.fi2}><label style={S.fl2}>{t.total} (HK$)</label><input style={S.fin} type="number" placeholder="4800" value={oForm.total||""} onChange={e=>setOForm(p=>({...p,total:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.deposit} (HK$)</label><input style={S.fin} type="number" placeholder="1000" value={oForm.deposit||""} onChange={e=>setOForm(p=>({...p,deposit:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"ETD 預計完成（留空自動 +6週）":"ETD (blank = auto +6 weeks)"}</label>
                      <input type="date" style={S.fin} value={oForm.due||""} onChange={e=>setOForm(p=>({...p,due:e.target.value}))}/>
                    </div>
                    <div style={S.fi2}><label style={S.fl2}>{t.invoiceNo} <span style={{color:"#888",fontWeight:400}}>(optional)</span></label><input style={S.fin} placeholder="e.g. 13735" value={oForm.invoiceNo||""} onChange={e=>setOForm(p=>({...p,invoiceNo:e.target.value}))}/></div>
                  </div>
                  {/* ETD preview */}
                  {!oForm.due && oForm.orderDate && (
                    <div style={{fontSize:11,color:"#4361EE",marginTop:4}}>
                      {lang==="zh"?"自動 ETD：":"Auto ETD: "}{calcETD(oForm.orderDate)}
                    </div>
                  )}
                  </div>
                </div>
                <div style={S.fs}><div style={S.fst}>{t.notes}</div><textarea style={{...S.fin,minHeight:70,resize:"vertical",width:"100%"}} placeholder="Special requirements…" value={oForm.notes||""} onChange={e=>setOForm(p=>({...p,notes:e.target.value}))}/></div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:8}}>
                  <button style={S.gb} onClick={()=>setOrderView("list")}>{t.cancel}</button>
                  <button style={S.pb} onClick={saveOrder} disabled={!oForm.client||!oForm.carMake}>{t.confirmCreate}</button>
                </div>
              </div>
            </div>
          )}

          {orderView==="detail" && activeOrder && (
            <div style={S.page}>
              <button style={S.bb} onClick={()=>{setShowWA(false);setOrderView("list");}}>{t.backList}</button>
              <div style={S.dl}>
                <div>
                  <div style={S.dc}>
                    <div style={S.dch}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <div style={S.doi}>{activeOrder.id}</div>
                          <span style={S.ptBadge}>{ptLabel(activeOrder.productType)}</span>
                          {activeOrder.reorder&&<span style={S.rtag}>{t.reorderTag}</span>}
                        </div>
                        <div style={S.dcn}>{activeOrder.client}</div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                          <span style={{color:"#4361EE",fontSize:12,fontWeight:600,background:"#EEF1FF",borderRadius:4,padding:"2px 7px"}}>{activeOrder.channel==="store"?"店內":"網上"}</span>
                          <span style={{color:"#555",fontSize:14}}>{activeOrder.phone}</span>
                        </div>
                        {activeOrder.address&&<div style={{fontSize:13,color:"#555",marginTop:4}}>{activeOrder.address}</div>}
                        {/* Sibling orders same group */}
                        {(()=>{
                          const grp = activeOrder.groupId||activeOrder.id;
                          const siblings = orders.filter(o=>( o.groupId===grp||o.id===grp||o.id.startsWith(grp) )&&o.id!==activeOrder.id);
                          if(!siblings.length) return null;
                          return(
                            <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
                              <span style={{fontSize:11,color:"#888"}}>{lang==="zh"?"同單:":"Same order:"}</span>
                              {siblings.map(s=>(
                                <button key={s.id} onClick={()=>setActiveOrder(s)}
                                  style={{fontSize:11,fontWeight:700,color:"#4361EE",background:"#EEF1FF",border:"1px solid #C5CEFF",borderRadius:5,padding:"2px 8px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                                  {s.id} — {ptLabel(s.productType)}
                                </button>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                      {(()=>{const st=getSt(activeOrder.status);return <div style={{...S.bsb,background:st.color+"22",color:st.color,borderColor:st.color+"55"}}>{st.icon} {st.label}</div>;})()}
                    </div>
                    <div style={S.ig}>
                      <div style={S.ib}><div style={S.ibt}>{t.vehicle}</div>
                        {[["Make",activeOrder.carMake+" "+(activeOrder.carModel||"")],[t.carYear,activeOrder.carYear||"—"]].map(([k,v])=><div key={k} style={S.ir}><span>{k}</span><span>{v}</span></div>)}
                      </div>
                      <SpecSummary order={activeOrder} lang={lang} t={t}/>
                      <div style={S.ib}><div style={S.ibt}>{t.payment}</div>
                        <div style={S.ir}><span>{t.total}</span><span style={{fontWeight:700,fontSize:17,fontFamily:"monospace"}}>{fmtHKD(activeOrder.total)}</span></div>
                        <div style={S.ir}><span>{t.deposit}</span><span style={{color:"#4BE8A0",fontWeight:600}}>{fmtHKD(activeOrder.deposit)}</span></div>
                        <div style={S.ir}><span>{t.balance}</span><span style={{color:"#E87C4B",fontWeight:600}}>{fmtHKD(activeOrder.total-activeOrder.deposit)}</span></div>
                        <div style={S.ir}><span>{t.due}</span><span style={{color:activeOrder.due&&new Date(activeOrder.due)<new Date()&&activeOrder.status!=="delivered"?"#E84B4B":"#888"}}>{activeOrder.due||"—"}</span></div>
                        {activeOrder.invoiceNo&&<div style={S.ir}><span>{t.invoiceNo}</span><span style={{color:"#E8B84B",fontFamily:"monospace",fontWeight:600}}>{activeOrder.invoiceNo}</span></div>}
                      </div>
                    </div>
                    {activeOrder.notes&&<div style={S.nb}><span style={{color:"#555",fontSize:11,letterSpacing:2}}>{t.notes} </span>{activeOrder.notes}</div>}

                    {/* Colour change history */}
                    {activeOrder.colorHistory?.length>0 && (
                      <div style={{...S.nb,marginTop:8,background:"#FFF8EE",borderColor:"#FFD580"}}>
                        <div style={{fontSize:10,color:"#b87800",letterSpacing:2,fontWeight:700,marginBottom:6}}>{lang==="zh"?"顏色更改記錄":"COLOUR CHANGE HISTORY"}</div>
                        {activeOrder.colorHistory.map((h,i)=>(
                          <div key={i} style={{fontSize:11,color:"#666",padding:"3px 0",borderBottom:"1px solid #FFF0CC"}}>
                            {h.date} {h.time} : {h.from||"(original)"} → {h.to}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ETD countdown */}
                    {activeOrder.due && !["done","delivered"].includes(activeOrder.status) && (()=>{
                      const daysLeft = Math.ceil((new Date(activeOrder.due)-new Date())/(1000*60*60*24));
                      const overdue = daysLeft<0;
                      const urgent = daysLeft>=0 && daysLeft<=7;
                      if(!overdue && !urgent) return null;
                      return (
                        <div style={{marginTop:8,padding:"10px 14px",background:overdue?"#FFF5F5":"#FFFBF0",border:`1px solid ${overdue?"#FFCCCC":"#FFD580"}`,borderRadius:8,fontSize:12,fontWeight:700,color:overdue?"#E84B4B":"#D97706"}}>
                          {overdue ? `ETD 已過期 ${Math.abs(daysLeft)} 天！` : `ETD 剩餘 ${daysLeft} 天，請加快跟進！`}
                        </div>
                      );
                    })()}

                    <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
                      {/* + Add same-client product */}
                      <button style={{...S.pb,background:"#16A34A"}} onClick={()=>{
                        setOForm({
                          ...emptyOrder,
                          client: activeOrder.client,
                          phone: activeOrder.phone,
                          email: activeOrder.email||"",
                          address: activeOrder.address||"",
                          channel: activeOrder.channel,
                          carMake: activeOrder.carMake,
                          carYear: activeOrder.carYear,
                          carModel: activeOrder.carModel,
                          invoiceNo: activeOrder.invoiceNo||"",
                          groupId: activeOrder.groupId||activeOrder.id,
                        });
                        setOrderView("new");
                        flash(lang==="zh"?"客人資料已複製，請選擇新產品":"Client info copied — select new product");
                      }}>+ {lang==="zh"?"加同客產品":"Add Product (Same Client)"}</button>
                      <button style={S.docBtn} onClick={()=>openPrint(genCustomerDoc(activeOrder,"quote"))}>{t.printQuote}</button>
                      <button style={S.docBtn} onClick={()=>openPrint(genCustomerDoc(activeOrder,"confirm"))}>{t.printConfirm}</button>
                      <button style={{...S.docBtn,background:"#EEF1FF",borderColor:"#4361EE",color:"#4361EE"}} onClick={()=>openPrint(genOrderPDF(activeOrder))}>
                        {lang==="zh"?"PDF / 儲存":"PDF / Save"}
                      </button>
                      <button style={{...S.docBtn,background:"rgba(37,211,102,0.1)",borderColor:"rgba(37,211,102,0.35)",color:"#25d366"}} onClick={()=>setShowWA(w=>!w)}>{t.whatsapp}</button>
                      <button style={{...S.docBtn,background:"rgba(75,150,232,0.1)",borderColor:"rgba(75,150,232,0.35)",color:"#4B96E8"}} onClick={()=>sendEmail(activeOrder)}>{t.emailClient}</button>
                    </div>
                    {showWA&&(
                      <div style={S.waPanel}>
                        <div style={{display:"flex",gap:8,marginBottom:10}}>
                          {[{l:"中文",v:"zh"},{l:"English",v:"en"}].map(({l,v})=><button key={v} className="chip" style={{...S.chip,...(waLang===v?S.ca:{})}} onClick={()=>setWaLang(v)}>{l}</button>)}
                        </div>
                        <pre style={S.waPre}>{genWhatsApp(activeOrder,waLang)}</pre>
                        <button style={{...S.pb,marginTop:10,width:"100%"}} onClick={()=>copyWA(genWhatsApp(activeOrder,waLang))}>{lang==="zh"?"複製訊息":"Copy Message"}</button>
                      </div>
                    )}
                  </div>
                  {activeOrder.status==="issue"&&(
                    <div style={S.issueCard}>
                      <div style={{fontWeight:700,marginBottom:4,color:"#E84B4B"}}>{t.issueTitle}</div>
                      <div style={{color:"#888",fontSize:13,marginBottom:14}}>{activeOrder.notes}</div>
                      <button style={S.reorderBtn} onClick={()=>doReorder(activeOrder)}>{t.createReorder}</button>
                    </div>
                  )}
                </div>
                <div>
                  {/* Step-by-step status flow */}
                  <div style={S.sc}>
                    <div style={S.sct}>{lang==="zh"?"訂單進度":"Order Progress"}</div>

                    {/* PENDING → CONFIRMED: Enter invoice */}
                    {activeOrder.status==="pending" && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"填入 Invoice No. 確認訂單":"Enter Invoice No. to confirm"}</div>
                        <div style={{display:"flex",gap:8,marginTop:8}}>
                          <input style={{...S.fin,flex:1}} placeholder="e.g. 13735" value={invoiceInput} onChange={e=>setInvoiceInput(e.target.value)}/>
                          <button style={{...S.pb,whiteSpace:"nowrap",opacity:invoiceInput.trim()?1:0.4}} onClick={()=>{confirmWithInvoice(activeOrder.id,invoiceInput);setInvoiceInput("");}}>
                            {lang==="zh"?"確認":"Confirm"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CONFIRMED → PRODUCING: Start production */}
                    {activeOrder.status==="confirmed" && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"按下開始生產":"Click to start production"}</div>
                        <button style={{...S.pb,width:"100%",marginTop:8}} onClick={()=>updateOSt(activeOrder.id,"producing")}>
                          {lang==="zh"?"開始生產":"Start Production"}
                        </button>
                      </div>
                    )}

                    {/* PRODUCING → FACTSHIP: Enter production done date */}
                    {activeOrder.status==="producing" && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"完成生產日期":"Production Completed Date"}</div>
                        <input type="date" style={{...S.fin,marginTop:8,width:"100%"}}
                          value={activeOrder.productionDoneDate||""}
                          onChange={async e=>{
                            const val=e.target.value;
                            setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,productionDoneDate:val}:o));
                            setActiveOrder(a=>({...a,productionDoneDate:val}));
                            await sb.upsert("orders",activeOrder.id,{...activeOrder,productionDoneDate:val});
                          }}/>
                        {activeOrder.productionDoneDate && (
                          <button style={{...S.pb,width:"100%",marginTop:8}} onClick={()=>updateOSt(activeOrder.id,"factship")}>
                            {lang==="zh"?"確認已發貨到集運":"Confirm Shipped to Forwarder"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* FACTSHIP → TRANSIT: Enter shipping no + date */}
                    {activeOrder.status==="factship" && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"集運單號 + 發貨日期":"Shipping No. + Ship Date"}</div>
                        <input style={{...S.fin,marginTop:8,width:"100%"}} placeholder={lang==="zh"?"集運單號 e.g. 1234567890":"Shipping No. e.g. 1234567890"}
                          value={activeOrder.shipNo||""}
                          onChange={async e=>{
                            const val=e.target.value;
                            setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,shipNo:val}:o));
                            setActiveOrder(a=>({...a,shipNo:val}));
                            await sb.upsert("orders",activeOrder.id,{...activeOrder,shipNo:val});
                          }}/>
                        <input type="date" style={{...S.fin,marginTop:8,width:"100%"}}
                          value={activeOrder.shipDate||""}
                          onChange={async e=>{
                            const val=e.target.value;
                            setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,shipDate:val}:o));
                            setActiveOrder(a=>({...a,shipDate:val}));
                            await sb.upsert("orders",activeOrder.id,{...activeOrder,shipDate:val});
                          }}/>
                        {activeOrder.shipNo && activeOrder.shipDate && (
                          <button style={{...S.pb,width:"100%",marginTop:8}} onClick={()=>updateOSt(activeOrder.id,"transit")}>
                            {lang==="zh"?"確認集運已發貨":"Confirm Forwarder Shipped"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* TRANSIT: Show tracking links */}
                    {activeOrder.status==="transit" && activeOrder.shipNo && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"追蹤包裹":"Track Shipment"}</div>
                        <a href={`https://auspost.com.au/mypost/track/#/details/${activeOrder.shipNo}`} target="_blank" rel="noreferrer"
                          style={{display:"block",marginTop:8,padding:"8px 12px",background:"#EEF1FF",borderRadius:7,color:"#4361EE",fontSize:13,fontWeight:600,textDecoration:"none",border:"1px solid #C5CEFF"}}>
                          Australia Post Tracking
                        </a>
                        <a href={`https://t.17track.net/en#nums=${activeOrder.shipNo}`} target="_blank" rel="noreferrer"
                          style={{display:"block",marginTop:6,padding:"8px 12px",background:"#FFF8EE",borderRadius:7,color:"#E87C4B",fontSize:13,fontWeight:600,textDecoration:"none",border:"1px solid #FFD5A0"}}>
                          17Track (Other Carriers)
                        </a>
                        <button style={{...S.pb,width:"100%",marginTop:10}} onClick={()=>updateOSt(activeOrder.id,"arrived")}>
                          {lang==="zh"?"確認已到貨":"Confirm Arrived"}
                        </button>
                      </div>
                    )}

                    {/* ARRIVED → NOTIFIED: Contact client */}
                    {activeOrder.status==="arrived" && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"通知客人":"Notify Client"}</div>
                        <p style={{fontSize:12,color:"#888",marginTop:6}}>{lang==="zh"?"請聯絡客人後按下確認":"Contact the client then confirm below"}</p>
                        <button style={{...S.pb,width:"100%",marginTop:8}} onClick={()=>updateOSt(activeOrder.id,"notified")}>
                          {lang==="zh"?"已聯絡客人":"Client Contacted"}
                        </button>
                      </div>
                    )}

                    {/* NOTIFIED → DONE: Enter completion date */}
                    {activeOrder.status==="notified" && (
                      <div style={S.stepBox}>
                        <div style={S.stepLabel}>{lang==="zh"?"完成日期":"Completion Date"}</div>
                        <input type="date" style={{...S.fin,marginTop:8,width:"100%"}}
                          value={activeOrder.completedDate||""}
                          onChange={async e=>{
                            const val=e.target.value;
                            setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,completedDate:val}:o));
                            setActiveOrder(a=>({...a,completedDate:val}));
                            await sb.upsert("orders",activeOrder.id,{...activeOrder,completedDate:val});
                          }}/>
                        {activeOrder.completedDate && (
                          <button style={{...S.pb,width:"100%",marginTop:8}} onClick={()=>updateOSt(activeOrder.id,"done")}>
                            {lang==="zh"?"確認完成":"Mark Completed"}
                          </button>
                        )}
                      </div>
                    )}

                    {/* DONE */}
                    {activeOrder.status==="done" && (
                      <div style={{...S.stepBox,background:"#F0FDF4",borderColor:"#86EFAC"}}>
                        <div style={{fontWeight:700,color:"#16A34A",fontSize:14}}>{lang==="zh"?"訂單已完成":"Order Completed"}</div>
                        {activeOrder.completedDate&&<div style={{fontSize:12,color:"#888",marginTop:4}}>{lang==="zh"?"完成日期":"Completed"}: {activeOrder.completedDate}</div>}
                      </div>
                    )}

                    {/* ISSUE: show note */}
                    {activeOrder.status==="issue" && (
                      <div style={{...S.stepBox,background:"#FFF5F5",borderColor:"#FFCCCC"}}>
                        <div style={{fontWeight:700,color:"#E84B4B",marginBottom:6}}>{lang==="zh"?"問題記錄":"Issue Note"}</div>
                        <textarea style={{...S.fin,minHeight:60,resize:"vertical",width:"100%"}}
                          placeholder={lang==="zh"?"填寫問題詳情…":"Describe the issue…"}
                          value={activeOrder.issueNote||""}
                          onChange={async e=>{
                            const val=e.target.value;
                            setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,issueNote:val}:o));
                            setActiveOrder(a=>({...a,issueNote:val}));
                            await sb.upsert("orders",activeOrder.id,{...activeOrder,issueNote:val});
                          }}/>
                        <button style={{...S.reorderBtn,width:"100%",marginTop:8}} onClick={()=>doReorder(activeOrder)}>{t.createReorder}</button>
                      </div>
                    )}

                    {/* Mark as issue button (always visible except done/issue) */}
                    {!["done","issue","pending"].includes(activeOrder.status) && (
                      <button style={{...S.db,marginTop:12}} onClick={()=>updateOSt(activeOrder.id,"issue")}>
                        {lang==="zh"?"標記有問題":"Mark as Issue"}
                      </button>
                    )}

                    {/* Progress dots */}
                    <div style={{marginTop:16}}>
                      <div style={{fontSize:9,color:"#888",letterSpacing:2,fontWeight:700,marginBottom:10}}>{t.progress}</div>
                      <div style={{display:"flex",flexDirection:"column"}}>
                        {ORDER_STATUSES.filter(s=>s.key!=="issue").map((s,i,arr)=>{
                          const cur=arr.findIndex(x=>x.key===activeOrder.status); const done=i<=cur&&activeOrder.status!=="issue";
                          return(<div key={s.key} style={S.pi}>
                            <div style={{...S.pd,background:done?s.color:"#E8ECF4",borderColor:done?s.color:"#E8ECF4",boxShadow:done?`0 0 6px ${s.color}55`:"none"}}/>
                            {i<arr.length-1&&<div style={{...S.pc,background:done&&i<cur?s.color:"#E8ECF4"}}/>}
                            <span style={{...S.pl,color:done?s.color:"#bbb",fontSize:10}}>{s.label}</span>
                          </div>);})}
                      </div>
                    </div>
                  </div>

                  {/* Editable shipping info — always shown once shipNo exists or in factship/transit */}
                  {(activeOrder.shipNo || ["factship","transit","arrived","notified","done"].includes(activeOrder.status)) && (
                      <div style={S.sc}>
                        <div style={S.sct}>{lang==="zh"?"集運資料（可修改）":"Shipping Info (Editable)"}</div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          <div style={S.fi2}>
                            <label style={S.fl2}>{lang==="zh"?"集運單號":"Shipping No."}</label>
                            <input style={S.fin} placeholder="e.g. 1234567890"
                              value={activeOrder.shipNo||""}
                              onChange={async e=>{
                                const val=e.target.value;
                                setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,shipNo:val}:o));
                                setActiveOrder(a=>({...a,shipNo:val}));
                                await sb.upsert("orders",activeOrder.id,{...activeOrder,shipNo:val});
                              }}/>
                          </div>
                          <div style={S.fi2}>
                            <label style={S.fl2}>{lang==="zh"?"發貨日期":"Ship Date"}</label>
                            <input type="date" style={S.fin}
                              value={activeOrder.shipDate||""}
                              onChange={async e=>{
                                const val=e.target.value;
                                setOrders(p=>p.map(o=>o.id===activeOrder.id?{...o,shipDate:val}:o));
                                setActiveOrder(a=>({...a,shipDate:val}));
                                await sb.upsert("orders",activeOrder.id,{...activeOrder,shipDate:val});
                              }}/>
                          </div>
                          {activeOrder.shipNo&&(
                            <div style={{display:"flex",gap:8,marginTop:4}}>
                              <a href={`https://auspost.com.au/mypost/track/#/details/${activeOrder.shipNo}`} target="_blank" rel="noreferrer"
                                style={{flex:1,textAlign:"center",padding:"6px",background:"#EEF1FF",borderRadius:6,color:"#4361EE",fontSize:12,fontWeight:600,textDecoration:"none",border:"1px solid #C5CEFF"}}>
                                AusPost Track
                              </a>
                              <a href={`https://t.17track.net/en#nums=${activeOrder.shipNo}`} target="_blank" rel="noreferrer"
                                style={{flex:1,textAlign:"center",padding:"6px",background:"#FFF8EE",borderRadius:6,color:"#E87C4B",fontSize:12,fontWeight:600,textDecoration:"none",border:"1px solid #FFD5A0"}}>
                                17Track
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Undo status — go back one step */}
                    {!["pending","done"].includes(activeOrder.status) && (
                      <div style={S.sc}>
                        <div style={S.sct}>{lang==="zh"?"狀態修正":"Correct Status"}</div>
                        <button style={{...S.gb,width:"100%",fontSize:12}} onClick={async()=>{
                          const flow = ["pending","confirmed","producing","factship","transit","arrived","notified","done"];
                          const cur = flow.indexOf(activeOrder.status);
                          const prev = cur>0 ? flow[cur-1] : "pending";
                          if(window.confirm(lang==="zh"?`確定返回「${getSt(prev).label}」狀態？`:`Revert to "${getSt(prev).label}"?`)){
                            await updateOSt(activeOrder.id, prev);
                          }
                        }}>
                          {lang==="zh"?"返回上一個狀態":"Revert to Previous Status"}
                        </button>
                      </div>
                    )}

                  <button style={S.db} onClick={()=>{if(confirm("Delete?"))delOrder(activeOrder.id);}}>{t.deleteOrder}</button>
                </div>
              </div>
            </div>
          )}
        </>}

        {/* ════════ BULK ════════ */}
        {tab==="bulk" && <>
          {bulkView==="list" && (
            <div style={S.page}>
              <div style={S.ph}>
                <div><h2 style={S.pt}>{t.bulkTitle}</h2><div style={S.ps}>{t.bulkSub}</div></div>
                <div style={{display:"flex",gap:10}}>
                  {selBulk.length>=2 && (()=>{
                    const selected = bulkOrders.filter(b=>selBulk.includes(b.id));
                    const suppliers = [...new Set(selected.map(b=>b.supplier))];
                    return (
                      <button style={{...S.pb,background:"#E87C4B"}} onClick={()=>{
                        if(suppliers.length>1 && !window.confirm(lang==="zh"?`選中訂單來自 ${suppliers.length} 個不同供應商，確定合併？`:`Selected orders from ${suppliers.length} suppliers. Combine anyway?`)) return;
                        openPrint(genCombinedPO(selected));
                      }}>
                        {lang==="zh"?`合併採購單 (${selBulk.length})`:` Combined PO (${selBulk.length})`}
                      </button>
                    );
                  })()}
                  <button style={S.pb} onClick={()=>setBulkView("new")}>{t.newBulk}</button>
                </div>
              </div>
              <div style={S.filterBar}>
                <div style={S.fg}>
                  <span style={S.fl}>{t.productType}:</span>
                  {[{k:"all",l:t.all},...PRODUCT_TYPES.map(k=>({k,l:ptLabel(k)}))].map(({k,l})=>(
                    <button key={k} className="chip" style={{...S.chip,...(bulkPtFilter===k?S.ca:{})}} onClick={()=>setBulkPtFilter(k)}>{l}</button>
                  ))}
                </div>
                <div style={S.fg}>
                  <span style={S.fl}>{t.status}:</span>
                  {[{k:"all",l:t.all},...BULK_STATUSES.map(s=>({k:s.key,l:s.label,c:s.color}))].map(({k,l,c})=><button key={k} className="chip" style={{...S.chip,...(bulkFilter===k?{...S.ca,...(c?{background:c+"33",color:c,borderColor:c+"55"}:{})}:{})}} onClick={()=>setBulkFilter(k)}>{l}</button>)}
                </div>
                {selBulk.length>0&&<div style={{fontSize:12,color:"#4361EE"}}>{lang==="zh"?`已選 ${selBulk.length} 張`:`${selBulk.length} selected`} — <button style={{background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:12}} onClick={()=>setSelBulk([])}>{lang==="zh"?"清除":"Clear"}</button></div>}
              </div>
              <div style={S.tw}>
                <div style={S.th2}>
                  <div style={{...S.th,flex:.3}}><input type="checkbox" style={{accentColor:"#4361EE"}} onChange={e=>setSelBulk(e.target.checked?filteredBulk.map(b=>b.id):[])}/></div>
                  {["ID","TYPE","SUPPLIER","CAR","MATERIAL","QTY","COST","PRICE","STATUS"].map((h,i)=><div key={i} style={{...S.th,flex:[1.1,.8,1,1.4,.9,.5,.7,.7,.9][i]}}>{h}</div>)}
                </div>
                {filteredBulk.map(b=>{const st=getBSt(b.status);const low=b.stockQty!==undefined&&b.minStock&&b.stockQty<=b.minStock;const sel=selBulk.includes(b.id);return(
                  <div key={b.id} className="trow" style={{...S.tr,...(low?{borderLeft:"3px solid #E84B4B"}:{}),...(sel?{background:"#F0F4FF"}:{})}} onClick={()=>{setActiveBulk(b);setBulkView("detail");}}>
                    <div style={{...S.td,flex:.3}} onClick={e=>e.stopPropagation()}>
                      <input type="checkbox" checked={sel} onChange={e=>setSelBulk(p=>e.target.checked?[...p,b.id]:p.filter(x=>x!==b.id))} style={{accentColor:"#4361EE"}}/>
                    </div>
                    <div style={{...S.td,flex:1.1,color:"#4361EE",fontFamily:"monospace",fontSize:12,fontWeight:600}}>{b.id}</div>
                    <div style={{...S.td,flex:.8,fontSize:11}}><span style={S.ptBadge}>{ptLabel(b.productType)}</span></div>
                    <div style={{...S.td,flex:1,fontWeight:600}}>{b.supplier}</div>
                    <div style={{...S.td,flex:1.4,color:"#777",fontSize:12}}>{b.carMake} {b.carModel} ({b.carYear})</div>
                    <div style={{...S.td,flex:.9,fontSize:12,color:"#666"}}>{lang==="zh"?(b.materialZh||b.material):b.material}</div>
                    <div style={{...S.td,flex:.5}}>{b.qty}{b.unit}</div>
                    <div style={{...S.td,flex:.7,fontFamily:"monospace",fontSize:12}}>{fmtHKD(b.costPerUnit)}</div>
                    <div style={{...S.td,flex:.7,fontFamily:"monospace",fontSize:12,color:"#16A34A"}}>{fmtHKD(b.sellPerUnit)}</div>
                    <div style={{...S.td,flex:.9}}><span style={{...S.sp,background:st.color+"22",color:st.color,borderColor:st.color+"44"}}>{st.icon} {st.label}</span></div>
                  </div>
                );})}
                {filteredBulk.length===0&&<div style={S.er}>—</div>}
              </div>
            </div>
          )}

          {bulkView==="new" && (
            <div style={S.page}>
              <div style={S.ph}><div><button style={S.bb} onClick={()=>setBulkView("list")}>{t.back}</button><h2 style={{...S.pt,marginTop:8}}>{t.newBulk}</h2></div></div>
              <div style={S.fc}>
                <div style={S.fs}><div style={S.fst}>{t.productType}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {PRODUCT_TYPES.map(k=><button key={k} className="chip" style={{...S.bcb,...(bForm.productType===k?S.bcba:{})}} onClick={()=>setBForm(p=>({...p,productType:k}))}>{ptLabel(k)}</button>)}
                  </div>
                </div>
                <div style={S.fg2}>
                  <div style={S.fs}><div style={S.fst}>{t.supplier}</div><div style={S.fdg}>
                    <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.supplier}</label><input style={S.fin} placeholder="韓國皮料行" value={bForm.supplier||""} onChange={e=>setBForm(p=>({...p,supplier:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.carMake}</label><select style={S.fin} value={bForm.carMake||""} onChange={e=>setBForm(p=>({...p,carMake:e.target.value}))}>{CAR_MAKES.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.yearRange}</label><input style={S.fin} placeholder="2022-2024" value={bForm.carYear||""} onChange={e=>setBForm(p=>({...p,carYear:e.target.value}))}/></div>
                    <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.specialModel}</label><input style={S.fin} placeholder="Alphard / Vellfire" value={bForm.carModel||""} onChange={e=>setBForm(p=>({...p,carModel:e.target.value}))}/></div>
                  </div></div>
                  <div style={S.fs}><div style={S.fst}>{t.material} & {t.qty}</div><div style={S.fdg}>
                    <div style={S.fi2}><label style={S.fl2}>{t.material}</label><select style={S.fin} value={bForm.material||""} onChange={e=>setBForm(p=>({...p,material:e.target.value}))}>{MATERIALS.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.color}</label><select style={S.fin} value={bForm.color||""} onChange={e=>setBForm(p=>({...p,color:e.target.value}))}>{COLORS.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.qty}</label><input style={S.fin} type="number" placeholder="20" value={bForm.qty||""} onChange={e=>setBForm(p=>({...p,qty:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.unit}</label><select style={S.fin} value={bForm.unit||"套"} onChange={e=>setBForm(p=>({...p,unit:e.target.value}))}>{["套","件","米","卷"].map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.costPer} (HK$)</label><input style={S.fin} type="number" placeholder="480" value={bForm.costPerUnit||""} onChange={e=>setBForm(p=>({...p,costPerUnit:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.sellPer} (HK$)</label><input style={S.fin} type="number" placeholder="1280" value={bForm.sellPerUnit||""} onChange={e=>setBForm(p=>({...p,sellPerUnit:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.currentStock}</label><input style={S.fin} type="number" placeholder="0" value={bForm.stockQty||""} onChange={e=>setBForm(p=>({...p,stockQty:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.minStock}</label><input style={S.fin} type="number" placeholder="3" value={bForm.minStock||""} onChange={e=>setBForm(p=>({...p,minStock:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.eta}</label><input style={S.fin} type="date" value={bForm.eta||""} onChange={e=>setBForm(p=>({...p,eta:e.target.value}))}/></div>
                  </div></div>
                </div>
                <div style={S.fs}><div style={S.fst}>{t.notes}</div><textarea style={{...S.fin,minHeight:70,resize:"vertical",width:"100%"}} placeholder="特別規格…" value={bForm.notes||""} onChange={e=>setBForm(p=>({...p,notes:e.target.value}))}/></div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:12,marginTop:8}}>
                  <button style={S.gb} onClick={()=>setBulkView("list")}>{t.cancel}</button>
                  <button style={S.pb} onClick={saveBulk} disabled={!bForm.supplier||!bForm.carModel}>{t.createDraft}</button>
                </div>
              </div>
            </div>
          )}

          {bulkView==="detail" && activeBulk && (
            <div style={S.page}>
              <button style={S.bb} onClick={()=>setBulkView("list")}>{t.back}</button>
              <div style={S.dl}>
                <div>
                  <div style={S.dc}>
                    <div style={S.dch}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                          <div style={S.doi}>{activeBulk.id}</div>
                          <span style={S.ptBadge}>{ptLabel(activeBulk.productType)}</span>
                        </div>
                        <div style={S.dcn}>{activeBulk.supplier}</div>
                        <div style={{color:"#666",fontSize:14,marginTop:4}}>{activeBulk.carMake} {activeBulk.carModel} ({activeBulk.carYear})</div>
                      </div>
                      {(()=>{const st=getBSt(activeBulk.status);return <div style={{...S.bsb,background:st.color+"22",color:st.color,borderColor:st.color+"55"}}>{st.icon} {st.label}</div>;})()}
                    </div>
                    <div style={S.ig}>
                      <div style={S.ib}><div style={S.ibt}>{t.material}</div>
                        {[[t.material,lang==="zh"?(activeBulk.materialZh||activeBulk.material):activeBulk.material],[t.color,lang==="zh"?(activeBulk.colorZh||activeBulk.color):activeBulk.color],[t.qty,`${activeBulk.qty}${activeBulk.unit}`]].map(([k,v])=><div key={k} style={S.ir}><span>{k}</span><span style={{fontWeight:600}}>{v}</span></div>)}
                      </div>
                      <div style={S.ib}><div style={S.ibt}>{t.payment}</div>
                        {[[t.costPer,fmtHKD(activeBulk.costPerUnit)],[t.sellPer,fmtHKD(activeBulk.sellPerUnit)],[t.profit,fmtHKD((activeBulk.sellPerUnit||0)-(activeBulk.costPerUnit||0))],[t.totalCost,fmtHKD((activeBulk.costPerUnit||0)*(activeBulk.qty||0))]].map(([k,v],i)=><div key={k} style={S.ir}><span>{k}</span><span style={{fontFamily:"monospace",color:i===2?"#E8B84B":i===1?"#4BE8A0":"inherit"}}>{v}</span></div>)}
                      </div>
                      <div style={S.ib}><div style={S.ibt}>{t.currentStock}</div>
                        <div style={S.ir}><span>{t.currentStock}</span><span style={{color:activeBulk.stockQty<=activeBulk.minStock?"#E84B4B":"#4BE8A0",fontWeight:700}}>{activeBulk.stockQty} {activeBulk.unit}</span></div>
                        <div style={S.ir}><span>{t.minStock}</span><span>{activeBulk.minStock} {activeBulk.unit}</span></div>
                        <div style={S.ir}><span>{t.eta}</span><span>{activeBulk.eta||"—"}</span></div>
                      </div>
                    </div>
                    {activeBulk.notes&&<div style={S.nb}><span style={{color:"#555",fontSize:11,letterSpacing:2}}>{t.notes} </span>{activeBulk.notes}</div>}
                    <div style={{display:"flex",gap:8,marginTop:14}}>
                      <button style={S.docBtn} onClick={()=>openPrint(genSupplierPO(activeBulk))}>{t.printPO}</button>
                    </div>
                  </div>
                  {activeBulk.status==="draft"&&(
                    <div style={S.poCard}>
                      <div style={S.poTitle}>{t.poPreview}</div>
                      <div style={S.poBody}>
                        {[[lang==="zh"?"供應商":"Supplier",activeBulk.supplier],[lang==="zh"?"車款":"Vehicle",`${activeBulk.carMake} ${activeBulk.carModel} (${activeBulk.carYear})`],[lang==="zh"?"產品":"Product",ptLabel(activeBulk.productType)],[lang==="zh"?"物料":"Material",`${lang==="zh"?(activeBulk.materialZh||activeBulk.material):activeBulk.material} — ${lang==="zh"?(activeBulk.colorZh||activeBulk.color):activeBulk.color}`],[lang==="zh"?"數量":"Quantity",`${activeBulk.qty} ${activeBulk.unit}`],[lang==="zh"?"成本":"Cost",fmtHKD(activeBulk.costPerUnit)+" / "+activeBulk.unit],[lang==="zh"?"要求到貨":"Required ETA",activeBulk.eta||"—"],activeBulk.notes&&[lang==="zh"?"備注":"Notes",activeBulk.notes]].filter(Boolean).map(([k,v])=>(
                          <div key={k} style={S.poRow}><span style={{color:"#555"}}>{k}：</span><strong>{v}</strong></div>
                        ))}
                      </div>
                      <button style={S.sendBtn} onClick={()=>updateBStWithAlerts(activeBulk.id,"confirmed")}>{t.sendPO}</button>
                    </div>
                  )}
                </div>
                <div>
                  <div style={S.sc}><div style={S.sct}>{t.updateStatus}</div>
                    <div style={{display:"flex",flexDirection:"column",gap:7}}>
                      {BULK_STATUSES.map(s=>{const on=activeBulk.status===s.key;return(
                        <button key={s.key} className="status-btn" style={{...S.sfb,background:on?s.color:"transparent",color:on?"#000":s.color,borderColor:s.color+(on?"":"33"),fontWeight:on?700:400}} onClick={()=>updateBSt(activeBulk.id,s.key)}>
                          <span>{s.icon}</span>{s.label}{on&&" ◀"}
                        </button>
                      );})}
                    </div>
                  </div>
                  <div style={S.sc}><div style={S.sct}>{t.logistics}</div>
                    <div style={{display:"flex",flexDirection:"column"}}>
                      {BULK_STATUSES.map((s,i,arr)=>{const cur=arr.findIndex(x=>x.key===activeBulk.status);const done=i<=cur;return(
                        <div key={s.key} style={S.pi}>
                          <div style={{...S.pd,background:done?s.color:"#E8ECF4",borderColor:done?s.color:"#E8ECF4",boxShadow:done?`0 0 8px ${s.color}55`:"none"}}/>
                          {i<arr.length-1&&<div style={{...S.pc,background:done&&i<cur?s.color:"#E8ECF4"}}/>}
                          <span style={{...S.pl,color:done?s.color:"#bbb"}}>{s.label}</span>
                        </div>);
                      })}
                    </div>
                  </div>
                  <button style={S.db} onClick={()=>{if(confirm("Delete?"))delBulk(activeBulk.id);}}>{t.deleteBulk}</button>
                </div>
              </div>
            </div>
          )}
        </>}

        {/* ════════ STOCK ════════ */}
        {tab==="stock" && (
          <div style={S.page}>
            <div style={S.ph}>
              <div><h2 style={S.pt}>{t.stockTitle}</h2><div style={S.ps}>{t.stockSub}</div></div>
              <div style={{display:"flex",gap:10}}>
                {selAlerts.length>0&&<button style={S.pb} onClick={()=>createFromAlerts(allAlerts.filter(a=>selAlerts.includes(a.id)))}>{t.createBulkBtn} ({selAlerts.length})</button>}
                <button style={{...S.pb,background:"transparent",border:"1px solid #E8B84B",color:"#E8B84B"}} onClick={()=>setShowAlertForm(true)}>{t.newAlert}</button>
              </div>
            </div>

            {/* New Alert Form */}
            {showAlertForm && (
              <div style={{...S.fc,marginBottom:20,border:"1px solid rgba(232,184,75,0.3)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                  <div style={{...S.fst,color:"#4361EE"}}>{t.newAlert}</div>
                  <button style={S.gb} onClick={()=>setShowAlertForm(false)}>{t.cancel}</button>
                </div>
                {/* Product type */}
                <div style={{...S.fs,marginBottom:14}}>
                  <div style={S.fst}>{t.productType}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {PRODUCT_TYPES.map(k=><button key={k} className="chip" style={{...S.bcb,...(aForm.productType===k?S.bcba:{})}} onClick={()=>setAForm(p=>({...p,productType:k}))}>{ptLabel(k)}</button>)}
                  </div>
                </div>
                <div style={S.fg2}>
                  <div style={S.fs}><div style={S.fst}>{t.vehicle}</div><div style={S.fdg}>
                    <div style={S.fi2}><label style={S.fl2}>{t.carMake}</label><select style={S.fin} value={aForm.carMake} onChange={e=>setAForm(p=>({...p,carMake:e.target.value}))}>{CAR_MAKES.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.carYear}</label><input style={S.fin} placeholder="2022-2023" value={aForm.carYear} onChange={e=>setAForm(p=>({...p,carYear:e.target.value}))}/></div>
                    <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.carModel}</label><input style={S.fin} placeholder="Alphard" value={aForm.carModel} onChange={e=>setAForm(p=>({...p,carModel:e.target.value}))}/></div>
                  </div></div>
                  <div style={S.fs}><div style={S.fst}>{t.design}</div><div style={S.fdg}>
                    <div style={S.fi2}><label style={S.fl2}>{t.material}</label><select style={S.fin} value={aForm.material} onChange={e=>setAForm(p=>({...p,material:e.target.value}))}>{MATERIALS.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.color}</label><select style={S.fin} value={aForm.color} onChange={e=>setAForm(p=>({...p,color:e.target.value}))}>{COLORS.map(v=><option key={v}>{v}</option>)}</select></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.suggestQty}</label><input style={S.fin} type="number" placeholder="10" value={aForm.suggestQty} onChange={e=>setAForm(p=>({...p,suggestQty:e.target.value}))}/></div>
                    <div style={S.fi2}><label style={S.fl2}>{t.supplier}</label><input style={S.fin} placeholder="韓國皮料行" value={aForm.supplier} onChange={e=>setAForm(p=>({...p,supplier:e.target.value}))}/></div>
                  </div></div>
                  <div style={S.fs}><div style={S.fst}>{t.alertReason}</div><div style={S.fdg}>
                    <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.alertReason}</label>
                      <select style={S.fin} value={aForm.reason} onChange={e=>setAForm(p=>({...p,reason:e.target.value}))}>
                        <option value="">-- {lang==="zh"?"請選擇":"Select"} --</option>
                        {t.reasonOptions.map(v=><option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"下單狀態":"Order Status"}</label>
                      <select style={S.fin} value={aForm.orderStatus||"pending"} onChange={e=>setAForm(p=>({...p,orderStatus:e.target.value}))}>
                        <option value="pending">{lang==="zh"?"未下單":"Not Ordered"}</option>
                        <option value="ordered">{lang==="zh"?"已下單":"Ordered"}</option>
                      </select>
                    </div>
                    <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"建議補貨日期":"Suggested Order Date"}</label>
                      <input style={S.fin} type="date" value={aForm.orderDate||""} onChange={e=>setAForm(p=>({...p,orderDate:e.target.value}))}/>
                    </div>
                    <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{t.alertBy}</label><input style={S.fin} placeholder={lang==="zh"?"Sales同事名字":"Your name"} value={aForm.raisedBy} onChange={e=>setAForm(p=>({...p,raisedBy:e.target.value}))}/></div>
                  </div></div>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:8}}>
                  <button style={S.pb} onClick={saveAlert} disabled={!aForm.carModel}>
                    {lang==="zh"?"確認建立提醒":"Create Alert"}
                  </button>
                </div>
              </div>
            )}

            <div style={{background:"#fff",borderRadius:12,border:"1px solid #E8ECF4",overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.05)"}}>
              <div style={{display:"grid",gridTemplateColumns:"32px 100px 1.3fr 1fr 0.9fr 90px 100px 80px 40px",padding:"10px 16px",background:"#F8F9FF",borderBottom:"1px solid #E8ECF4"}}>
                {["","狀態","車款","物料/顏色","原因","建議日期","下單狀態","提醒人",""].map((h,i)=>(
                  <div key={i} style={{fontSize:10,color:"#888",fontWeight:700,letterSpacing:1}}>{h}</div>
                ))}
              </div>
              {allAlerts.map((a,idx)=>{
                const sel=selAlerts.includes(a.id);
                const isSalesAlert = !a.minStock && !a.currentStock && a.raisedBy;
                const crit = a.currentStock===0 && !isSalesAlert;
                const dotColor = isSalesAlert?"#4BB5E8":crit?"#E84B4B":"#F59E0B";
                const statusLabel = isSalesAlert?(lang==="zh"?"Sales提醒":"Sales Alert"):crit?(lang==="zh"?"零庫存":"Out of Stock"):(lang==="zh"?"庫存低":"Low Stock");
                const ordered = a.orderStatus==="ordered";
                return(
                  <div key={a.id} style={{display:"grid",gridTemplateColumns:"32px 100px 1.3fr 1fr 0.9fr 90px 100px 80px 40px",padding:"13px 16px",borderBottom:idx<allAlerts.length-1?"1px solid #F0F2F8":"none",alignItems:"center",background:sel?"#F0F4FF":"#fff",transition:"background 0.1s"}}>
                    <input type="checkbox" checked={sel} onChange={e=>setSelAlerts(p=>e.target.checked?[...p,a.id]:p.filter(x=>x!==a.id))} style={{width:15,height:15,cursor:"pointer",accentColor:"#4361EE"}}/>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:dotColor,flexShrink:0}}/>
                      <span style={{fontSize:11,color:dotColor,fontWeight:700,whiteSpace:"nowrap"}}>{statusLabel}</span>
                    </div>
                    <div>
                      <div style={{fontWeight:600,fontSize:13,color:"#1a1a2e"}}>{a.carMake} {a.carModel}</div>
                      <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{a.carYear} · <span style={{color:"#4361EE"}}>{ptLabel(a.productType)}</span></div>
                    </div>
                    <div style={{fontSize:12,color:"#555"}}>{a.material}{a.color?" — "+a.color:""}</div>
                    <div style={{fontSize:12,color:"#777"}}>{a.reason||"—"}</div>
                    <div style={{fontSize:12,color:a.orderDate?"#E87C4B":"#bbb"}}>{a.orderDate||"—"}</div>
                    <div>
                      <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:20,background:ordered?"#DCFCE7":"#FEF3C7",color:ordered?"#16A34A":"#D97706"}}>
                        {ordered?(lang==="zh"?"✓ 已下單":"✓ Ordered"):(lang==="zh"?"○ 未下單":"○ Not Ordered")}
                      </span>
                    </div>
                    <div style={{fontSize:12,color:"#888"}}>{a.raisedBy||"—"}</div>
                    <div style={{display:"flex",gap:4}}>
                      <button style={{background:"#EEF1FF",border:"1px solid #C5CEFF",color:"#4361EE",borderRadius:5,padding:"3px 7px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}
                        onClick={()=>setEditingAlert({...a})}>
                        {lang==="zh"?"改":"Edit"}
                      </button>
                      <button style={{background:"#FFF0F0",border:"1px solid #FFCCCC",color:"#CC3333",borderRadius:5,padding:"3px 7px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}} onClick={()=>delAlert(a.id)}>✕</button>
                    </div>
                  </div>
                );
              })}
              {allAlerts.length===0&&(
                <div style={{padding:"40px",textAlign:"center",color:"#bbb",fontSize:13}}>
                  {lang==="zh"?"暫無提醒，按上方按鈕新增":"No alerts yet — click above to add one"}
                </div>
              )}
            </div>
            {allAlerts.length>0&&selAlerts.length===0&&<div style={{textAlign:"center",color:"#bbb",fontSize:12,marginTop:12}}>☑ {t.selectHint}</div>}
          </div>
        )}

        {/* ════════ SETTINGS ════════ */}
        {tab==="settings" && (
          <div style={S.page}>
            <div style={S.ph}>
              <div><h2 style={S.pt}>{lang==="zh"?"系統設定":"Settings"}</h2><div style={S.ps}>{lang==="zh"?"管理所有下拉選項 — 新增或刪除項目":"Manage all dropdown options — add or remove items"}</div></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>

              {/* ── Product Types ── */}
              <div style={{...S.settingsCard,gridColumn:"1/-1"}}>
                <div style={S.settingsTitle}>{lang==="zh"?"產品類型 Product Types":"Product Types"}</div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:8,marginBottom:12}}>
                  {settingsProductTypes.map((pt,idx)=>(
                    <div key={pt.key} style={{...S.settingsItem,justifyContent:"space-between"}}>
                      <div>
                        <div style={{fontSize:13,color:"#1a1a2e",fontWeight:600}}>{pt.labelEn}</div>
                        <div style={{fontSize:11,color:"#888"}}>{pt.labelZh}</div>
                      </div>
                      <button style={S.removeBtn} onClick={()=>setSettingsProductTypes(p=>p.filter((_,i)=>i!==idx))}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",padding:"12px",background:"#F8F9FF",borderRadius:8,border:"1px solid #E8ECF4"}}>
                  <input style={{...S.fin,flex:1,minWidth:130}} placeholder="English label e.g. 🛞 Tyre Cover"
                    value={settingsInput["ptEn"]||""}
                    onChange={e=>setSettingsInput(p=>({...p,ptEn:e.target.value}))}/>
                  <input style={{...S.fin,flex:1,minWidth:120}} placeholder="中文名稱 e.g. 🛞 輪胎套"
                    value={settingsInput["ptZh"]||""}
                    onChange={e=>setSettingsInput(p=>({...p,ptZh:e.target.value}))}/>
                  <button style={S.pb} onClick={()=>{
                    const en = settingsInput["ptEn"]?.trim();
                    if(!en) return;
                    const key = en.replace(/[^a-z0-9]/gi,"").toLowerCase().slice(0,12)||"custom"+Date.now();
                    setSettingsProductTypes(p=>[...p,{key,labelEn:en,labelZh:settingsInput["ptZh"]?.trim()||en}]);
                    setSettingsInput(p=>({...p,ptEn:"",ptZh:""}));
                    flash("✓ Product type added");
                  }}>+ {lang==="zh"?"新增":"Add"}</button>
                </div>
              </div>
              {[
                { title:lang==="zh"?"🚗 車廠品牌":"🚗 Car Makes", items:settingsCarMakes, setItems:setSettingsCarMakes, key:"carMake", bilingual:false },
                { title:lang==="zh"?"座位配置":"Seat Coverage", items:settingsSeats, setItems:setSettingsSeats, key:"seats", bilingual:false },
                { title:lang==="zh"?"CarPlay 屏幕尺寸":"CarPlay Screen Sizes", items:settingsScreenSizes, setItems:setSettingsScreenSizes, key:"screen", bilingual:false },
                { title:lang==="zh"?"方向盤尺寸":"Steering Wheel Sizes", items:settingsSteerSizes, setItems:setSettingsSteerSizes, key:"steer", bilingual:false },
              ].map(({title,items,setItems,key,bilingual})=>(
                <div key={key} style={S.settingsCard}>
                  <div style={S.settingsTitle}>{title}</div>
                  <div style={S.settingsList}>
                    {items.map((item,idx)=>(
                      <div key={idx} style={S.settingsItem}>
                        <span style={{fontSize:13,color:"#333"}}>{item}</span>
                        <button style={S.removeBtn} onClick={()=>removeSettingItem(setItems,idx,key)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}>
                    <input style={{...S.fin,flex:1}} placeholder={lang==="zh"?"新增項目…":"Add item…"}
                      value={settingsInput[key]||""}
                      onChange={e=>setSettingsInput(p=>({...p,[key]:e.target.value}))}
                      onKeyDown={e=>{ if(e.key==="Enter") { addSettingItem(key,setItems,settingsInput[key]); }}}
                    />
                    <button style={S.pb} onClick={()=>addSettingItem(key,setItems,settingsInput[key])}>+</button>
                  </div>
                </div>
              ))}

              {/* ── Materials (bilingual) ── */}
              <div style={S.settingsCard}>
                <div style={S.settingsTitle}>{lang==="zh"?"🎨 物料 Materials":"🎨 Materials"}</div>
                <div style={S.settingsList}>
                  {settingsMaterialsEn.map((enItem,idx)=>(
                    <div key={idx} style={S.settingsItem}>
                      <div>
                        <div style={{fontSize:13,color:"#333"}}>{enItem}</div>
                        <div style={{fontSize:11,color:"#888"}}>{settingsMaterialsZh[idx]||""}</div>
                      </div>
                      <button style={S.removeBtn} onClick={()=>removeSettingItem(setSettingsMaterialsEn,idx,"material")}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <input style={{...S.fin,flex:1,minWidth:120}} placeholder="English name"
                    value={settingsInput["material"]||""}
                    onChange={e=>setSettingsInput(p=>({...p,material:e.target.value}))}/>
                  <input style={{...S.fin,flex:1,minWidth:100}} placeholder="中文名稱"
                    value={settingsInput["materialZh"]||""}
                    onChange={e=>setSettingsInput(p=>({...p,materialZh:e.target.value}))}/>
                  <button style={S.pb} onClick={()=>addSettingItem("material",setSettingsMaterialsEn,settingsInput["material"],settingsInput["materialZh"])}>+</button>
                </div>
              </div>

              {/* ── Colors (bilingual) ── */}
              <div style={S.settingsCard}>
                <div style={S.settingsTitle}>{lang==="zh"?"🎨 顏色 Colors":"🎨 Colors"}</div>
                <div style={S.settingsList}>
                  {settingsColorsEn.map((enItem,idx)=>(
                    <div key={idx} style={S.settingsItem}>
                      <div>
                        <div style={{fontSize:13,color:"#333"}}>{enItem}</div>
                        <div style={{fontSize:11,color:"#888"}}>{settingsColorsZh[idx]||""}</div>
                      </div>
                      <button style={S.removeBtn} onClick={()=>removeSettingItem(setSettingsColorsEn,idx,"color")}>✕</button>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                  <input style={{...S.fin,flex:1,minWidth:120}} placeholder="English name"
                    value={settingsInput["color"]||""}
                    onChange={e=>setSettingsInput(p=>({...p,color:e.target.value}))}/>
                  <input style={{...S.fin,flex:1,minWidth:100}} placeholder="中文名稱"
                    value={settingsInput["colorZh"]||""}
                    onChange={e=>setSettingsInput(p=>({...p,colorZh:e.target.value}))}/>
                  <button style={S.pb} onClick={()=>addSettingItem("color",setSettingsColorsEn,settingsInput["color"],settingsInput["colorZh"])}>+</button>
                </div>
              </div>

            </div>
              <div style={{marginTop:20,padding:"14px 18px",background:"#F8F9FF",border:"1px solid #E8ECF4",borderRadius:10,fontSize:12,color:"#666"}}>
              {lang==="zh"?"提示：所有更改即時生效。刷新頁面後會還原預設值（上線雲端版本後可永久儲存）。":"Tip: All changes take effect immediately. Settings reset on page refresh — they will persist once connected to cloud storage."}
              </div>
          </div>
        )}
      </div>

      {/* Spec Popup */}
      {specPopup && (()=>{
        const o = orders.find(x=>x.id===specPopup);
        if(!o) return null;
        const rows = buildSpecRows(o);
        const st = getSt(o.status);
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}} onClick={()=>setSpecPopup(null)}>
            <div style={{background:"#fff",borderRadius:14,padding:"24px",width:420,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 16px 60px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontFamily:"monospace",color:"#4361EE",fontWeight:700,fontSize:14}}>{o.id}</div>
                  <div style={{fontWeight:700,fontSize:18,color:"#1a1a2e",marginTop:2}}>{o.client}</div>
                  <div style={{fontSize:12,color:"#888"}}>{o.carMake} {o.carModel} {o.carYear}</div>
                </div>
                <span style={{...S.sp,background:st.color+"22",color:st.color,borderColor:st.color+"44"}}>{st.label}</span>
              </div>
              <div style={{fontSize:10,color:"#4361EE",letterSpacing:2,fontWeight:700,marginBottom:8,textTransform:"uppercase"}}>{ptLabel(o.productType)} — {lang==="zh"?"規格詳情":"Specifications"}</div>
              {rows.map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid #F0F2F8",fontSize:13}}>
                  <span style={{color:"#888",fontSize:11}}>{k}</span>
                  <span style={{fontWeight:600,color:"#1a1a2e",textAlign:"right",maxWidth:"60%"}}>{v}</span>
                </div>
              ))}
              {o.notes&&<div style={{marginTop:12,background:"#FFFBF0",border:"1px solid #FFE099",borderRadius:7,padding:"10px",fontSize:12,color:"#666"}}>{o.notes}</div>}
              <div style={{display:"flex",gap:8,marginTop:16}}>
                <button style={{...S.pb,flex:1}} onClick={()=>{setSpecPopup(null);setActiveOrder(o);setOrderView("detail");}}>
                  {lang==="zh"?"查看完整訂單":"View Full Order"}
                </button>
                <button style={{...S.gb}} onClick={()=>setSpecPopup(null)}>{t.cancel}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Edit Alert Modal */}
      {editingAlert && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}} onClick={()=>setEditingAlert(null)}>
          <div style={{background:"#fff",borderRadius:14,padding:"24px",width:500,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 16px 60px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:16,fontWeight:700,color:"#1a1a2e",marginBottom:16}}>{lang==="zh"?"編輯缺貨提醒":"Edit Stock Alert"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"車廠":"Make"}</label><select style={S.fin} value={editingAlert.carMake||""} onChange={e=>setEditingAlert(p=>({...p,carMake:e.target.value}))}>{settingsCarMakes.map(v=><option key={v}>{v}</option>)}</select></div>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"年份":"Year"}</label><input style={S.fin} value={editingAlert.carYear||""} onChange={e=>setEditingAlert(p=>({...p,carYear:e.target.value}))}/></div>
              <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{lang==="zh"?"型號":"Model"}</label><input style={S.fin} value={editingAlert.carModel||""} onChange={e=>setEditingAlert(p=>({...p,carModel:e.target.value}))}/></div>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"物料":"Material"}</label><input style={S.fin} value={editingAlert.material||""} onChange={e=>setEditingAlert(p=>({...p,material:e.target.value}))}/></div>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"顏色":"Colour"}</label><input style={S.fin} value={editingAlert.color||""} onChange={e=>setEditingAlert(p=>({...p,color:e.target.value}))}/></div>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"建議補貨數量":"Suggest Qty"}</label><input type="number" style={S.fin} value={editingAlert.suggestQty||""} onChange={e=>setEditingAlert(p=>({...p,suggestQty:+e.target.value}))}/></div>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"下單狀態":"Order Status"}</label>
                <select style={S.fin} value={editingAlert.orderStatus||"pending"} onChange={e=>setEditingAlert(p=>({...p,orderStatus:e.target.value}))}>
                  <option value="pending">{lang==="zh"?"未下單":"Not Ordered"}</option>
                  <option value="ordered">{lang==="zh"?"已下單":"Ordered"}</option>
                </select>
              </div>
              <div style={S.fi2}><label style={S.fl2}>{lang==="zh"?"建議補貨日期":"Suggested Date"}</label><input type="date" style={S.fin} value={editingAlert.orderDate||""} onChange={e=>setEditingAlert(p=>({...p,orderDate:e.target.value}))}/></div>
              <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{lang==="zh"?"原因":"Reason"}</label>
                <select style={S.fin} value={editingAlert.reason||""} onChange={e=>setEditingAlert(p=>({...p,reason:e.target.value}))}>
                  <option value="">—</option>
                  {t.reasonOptions.map(v=><option key={v}>{v}</option>)}
                </select>
              </div>
              <div style={{...S.fi2,gridColumn:"1/-1"}}><label style={S.fl2}>{lang==="zh"?"提醒人":"Raised By"}</label><input style={S.fin} value={editingAlert.raisedBy||""} onChange={e=>setEditingAlert(p=>({...p,raisedBy:e.target.value}))}/></div>
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
              <button style={S.gb} onClick={()=>setEditingAlert(null)}>{t.cancel}</button>
              <button style={S.pb} onClick={saveEditAlert}>{lang==="zh"?"儲存更改":"Save Changes"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Export Modal */}
      {showExport && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300}} onClick={()=>setShowExport(false)}>
          <div style={{background:"#fff",borderRadius:16,padding:"28px",width:480,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 16px 60px rgba(0,0,0,0.2)"}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:16,fontWeight:700,color:"#1a1a2e",marginBottom:4}}>{lang==="zh"?"匯出 Excel":"Export Excel"}</div>
            <div style={{fontSize:12,color:"#888",marginBottom:16}}>{lang==="zh"?"選擇要匯出的欄位：":"Select columns to export:"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
              {ALL_COLS.map(col=>(
                <label key={col.k} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:"#333"}}>
                  <input type="checkbox" checked={selCols.includes(col.k)} style={{accentColor:"#4361EE"}}
                    onChange={e=>setSelCols(p=>e.target.checked?[...p,col.k]:p.filter(x=>x!==col.k))}/>
                  {col.l}
                </label>
              ))}
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button style={S.gb} onClick={()=>setShowExport(false)}>{t.cancel}</button>
              <button style={S.pb} onClick={exportExcel} disabled={selCols.length===0}>
                {lang==="zh"?`匯出 ${orders.length} 張訂單`:`Export ${orders.length} Orders`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  ::-webkit-scrollbar{width:5px;height:5px;}
  ::-webkit-scrollbar-track{background:#f0f0f0;}
  ::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px;}
  body{background:#F5F6FA;}
  input,textarea,select{font-family:'DM Sans',sans-serif;color:#1a1a2e;background:#fff;}
  select option{background:#fff;color:#1a1a2e;}
  .nav-tab:hover{background:rgba(67,97,238,0.07)!important;color:#4361EE!important;}
  .chip:hover{opacity:0.8;}
  .trow:hover{background:#F0F4FF!important;}
  .status-btn:hover{opacity:0.8;}
  .alert-card:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,0.08);}
  .lang-btn:hover{color:#4361EE!important;}
`;

const S = {
  root:{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",fontFamily:"'DM Sans',sans-serif",background:"#F5F6FA",color:"#1a1a2e"},
  header:{display:"flex",alignItems:"center",padding:"0 24px",height:60,borderBottom:"1px solid #E8ECF4",background:"#fff",gap:20,flexShrink:0,boxShadow:"0 1px 4px rgba(0,0,0,0.06)"},
  headerLeft:{display:"flex",flexDirection:"column",flexShrink:0},
  logo:{fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:700,color:"#4361EE",letterSpacing:3},
  logoSub:{fontSize:9,color:"#aab",letterSpacing:2,marginTop:2},
  nav:{display:"flex",gap:3,flex:1},
  navTab:{display:"flex",alignItems:"center",gap:7,padding:"7px 16px",background:"transparent",border:"1px solid transparent",borderRadius:8,color:"#888",cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.15s",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"},
  navTabActive:{background:"#EEF1FF",borderColor:"#C5CEFF",color:"#4361EE"},
  badge:{background:"#E84B4B",color:"#fff",borderRadius:20,padding:"1px 6px",fontSize:10,fontWeight:700,fontFamily:"'DM Mono',monospace",marginLeft:2},
  headerRight:{display:"flex",alignItems:"center",gap:12,flexShrink:0},
  langToggle:{display:"flex",alignItems:"center",background:"#F5F6FA",border:"1px solid #E0E4EE",borderRadius:8,overflow:"hidden"},
  langBtn:{background:"transparent",border:"none",color:"#888",cursor:"pointer",padding:"6px 13px",fontSize:12,fontWeight:700,letterSpacing:1,fontFamily:"'DM Mono',monospace",transition:"all 0.15s"},
  langBtnActive:{background:"#4361EE",color:"#fff"},
  langDiv:{width:1,height:20,background:"#E0E4EE"},
  statsBar:{display:"flex",alignItems:"center",gap:12,background:"#F5F6FA",borderRadius:8,padding:"6px 14px",border:"1px solid #E0E4EE"},
  statPill:{display:"flex",flexDirection:"column",alignItems:"center"},
  statN:{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:700,color:"#4361EE",lineHeight:1},
  statL:{fontSize:9,color:"#aaa",letterSpacing:1,marginTop:2},
  statDiv:{width:1,height:24,background:"#E0E4EE"},
  body:{flex:1,overflow:"auto",background:"#F5F6FA"},
  page:{padding:"22px 28px",maxWidth:1380,margin:"0 auto"},
  ph:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20},
  pt:{fontSize:22,fontWeight:700,color:"#1a1a2e",marginBottom:3},
  ps:{fontSize:12,color:"#aaa"},
  pb:{background:"#4361EE",color:"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0,boxShadow:"0 2px 8px rgba(67,97,238,0.25)"},
  gb:{background:"#fff",color:"#555",border:"1px solid #E0E4EE",borderRadius:8,padding:"9px 20px",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  bb:{background:"#fff",border:"1px solid #E0E4EE",color:"#555",borderRadius:7,padding:"6px 14px",cursor:"pointer",fontSize:12,letterSpacing:0.5,fontFamily:"'DM Sans',sans-serif"},
  db:{width:"100%",background:"transparent",border:"1px solid #FFCCCC",color:"#CC3333",borderRadius:8,padding:"10px",cursor:"pointer",fontSize:12,letterSpacing:1,fontWeight:600,fontFamily:"'DM Sans',sans-serif",marginTop:8},
  docBtn:{background:"#EEF1FF",border:"1px solid #C5CEFF",color:"#4361EE",borderRadius:7,padding:"7px 14px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  reorderBtn:{background:"linear-gradient(135deg,#E84B7C,#c02860)",color:"#fff",border:"none",borderRadius:8,padding:"10px 20px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"},
  sendBtn:{width:"100%",background:"linear-gradient(135deg,#4361EE,#3048cc)",color:"#fff",border:"none",borderRadius:8,padding:"12px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:14},
  filterBar:{display:"flex",flexDirection:"column",gap:8,marginBottom:16},
  fg:{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"},
  fl:{fontSize:11,color:"#888",letterSpacing:1,marginRight:4,whiteSpace:"nowrap",fontWeight:600},
  si:{border:"1px solid #E0E4EE",borderRadius:8,padding:"8px 14px",fontSize:13,outline:"none",width:280,background:"#fff",color:"#1a1a2e",boxShadow:"0 1px 3px rgba(0,0,0,0.05)"},
  chip:{border:"1px solid #E0E4EE",borderRadius:20,padding:"4px 12px",background:"#fff",color:"#666",cursor:"pointer",fontSize:12,fontWeight:600,transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif"},
  ca:{background:"#EEF1FF",color:"#4361EE",borderColor:"#C5CEFF"},
  ptBadge:{background:"#EEF1FF",color:"#4361EE",border:"1px solid #C5CEFF",borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"},
  tw:{background:"#fff",borderRadius:12,border:"1px solid #E8ECF4",overflow:"hidden",boxShadow:"0 1px 6px rgba(0,0,0,0.05)"},
  th2:{display:"flex",background:"#F8F9FF",padding:"10px 18px",borderBottom:"1px solid #E8ECF4"},
  th:{flex:1,color:"#888",fontSize:10,letterSpacing:2,paddingRight:6,fontWeight:700},
  tr:{display:"flex",padding:"13px 18px",borderBottom:"1px solid #F0F2F8",cursor:"pointer",transition:"background 0.1s",alignItems:"center"},
  td:{flex:1,paddingRight:8,fontSize:13,color:"#333"},
  er:{padding:"36px",textAlign:"center",color:"#ccc",fontSize:13},
  oid:{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#4361EE",fontWeight:600},
  rtag:{background:"#FFE8F0",color:"#E84B7C",border:"1px solid #FFCCE0",borderRadius:4,padding:"1px 6px",fontSize:10,fontWeight:700,marginLeft:5},
  sp:{border:"1px solid",borderRadius:20,padding:"3px 9px",fontSize:11,fontWeight:600,whiteSpace:"nowrap"},
  fc:{background:"#fff",border:"1px solid #E8ECF4",borderRadius:12,padding:"24px",boxShadow:"0 1px 6px rgba(0,0,0,0.05)"},
  fg2:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:18},
  fs:{marginBottom:16},
  fst:{fontSize:10,color:"#4361EE",letterSpacing:2,fontWeight:700,marginBottom:10,textTransform:"uppercase"},
  fdg:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12},
  fi2:{display:"flex",flexDirection:"column",gap:5},
  fl2:{fontSize:11,color:"#666",letterSpacing:0.5,fontWeight:600},
  fin:{border:"1px solid #E0E4EE",borderRadius:7,padding:"8px 11px",fontSize:13,outline:"none",width:"100%",color:"#1a1a2e",background:"#fff"},
  bcb:{flex:1,padding:"10px",background:"#F8F9FF",border:"2px solid #E0E4EE",borderRadius:8,color:"#888",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"},
  bcba:{background:"#EEF1FF",borderColor:"#4361EE",color:"#4361EE"},
  dl:{display:"grid",gridTemplateColumns:"1fr 290px",gap:20,marginTop:14},
  dc:{background:"#fff",border:"1px solid #E8ECF4",borderRadius:12,padding:"24px",marginBottom:16,boxShadow:"0 1px 6px rgba(0,0,0,0.05)"},
  dch:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20},
  doi:{fontFamily:"'DM Mono',monospace",color:"#4361EE",fontSize:12,letterSpacing:1,fontWeight:600},
  dcn:{fontSize:24,fontWeight:700,margin:"4px 0",color:"#1a1a2e"},
  bsb:{border:"1px solid",borderRadius:8,padding:"7px 16px",fontSize:12,fontWeight:700,letterSpacing:0.5,whiteSpace:"nowrap",flexShrink:0},
  ig:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:16},
  ib:{background:"#F8F9FF",borderRadius:10,padding:"14px",border:"1px solid #E8ECF4"},
  ibt:{fontSize:9,color:"#4361EE",letterSpacing:2,fontWeight:700,marginBottom:10,textTransform:"uppercase"},
  ir:{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #EEF0F8",fontSize:12,color:"#555"},
  nb:{background:"#FFFBF0",border:"1px solid #FFE099",borderRadius:8,padding:"11px 14px",fontSize:12,color:"#7a6a20",lineHeight:1.7,marginTop:6},
  waPanel:{background:"#F8F9FF",border:"1px solid #E0E4EE",borderRadius:10,padding:"16px",marginTop:12},
  waPre:{whiteSpace:"pre-wrap",fontFamily:"'DM Mono',monospace",fontSize:12,color:"#444",lineHeight:1.7,background:"#fff",borderRadius:7,padding:"12px",border:"1px solid #E8ECF4",maxHeight:200,overflow:"auto"},
  issueCard:{background:"#FFF5F5",border:"1px solid #FFCCCC",borderRadius:10,padding:"20px",textAlign:"center",marginBottom:14},
  poCard:{background:"#FFFBF0",border:"2px dashed #FFD566",borderRadius:10,padding:"20px"},
  poTitle:{fontSize:13,fontWeight:700,color:"#b87800",marginBottom:12,letterSpacing:1},
  poBody:{background:"#fff",borderRadius:8,padding:"14px",border:"1px solid #F0E8C0"},
  poRow:{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #F8F4E0",fontSize:13,color:"#555"},
  sc:{background:"#fff",border:"1px solid #E8ECF4",borderRadius:10,padding:"18px",marginBottom:12,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"},
  sct:{fontSize:9,color:"#4361EE",letterSpacing:2,fontWeight:700,marginBottom:14,textTransform:"uppercase"},
  sfb:{border:"1px solid",borderRadius:7,padding:"9px 12px",cursor:"pointer",fontSize:12,textAlign:"left",transition:"all 0.15s",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:8},
  pi:{display:"flex",alignItems:"center",gap:10,position:"relative"},
  pd:{width:10,height:10,borderRadius:"50%",border:"2px solid",flexShrink:0,transition:"all 0.3s"},
  pc:{position:"absolute",left:4,top:10,width:2,height:22,transition:"all 0.3s"},
  pl:{fontSize:11,paddingLeft:4,paddingTop:4,paddingBottom:13,transition:"color 0.3s",color:"#aaa"},
  alertGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16},
  alertCard:{background:"#fff",border:"1px solid",borderRadius:12,padding:"18px",transition:"all 0.15s",cursor:"default",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"},
  toast:{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:"#1a1a2e",color:"#fff",padding:"11px 26px",borderRadius:30,fontSize:13,fontWeight:700,letterSpacing:0.5,zIndex:200,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"},
  settingsCard:{background:"#fff",border:"1px solid #E8ECF4",borderRadius:12,padding:"22px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"},
  settingsTitle:{fontSize:14,fontWeight:700,color:"#1a1a2e",marginBottom:14},
  settingsList:{display:"flex",flexDirection:"column",gap:6,maxHeight:200,overflowY:"auto",marginBottom:8},
  settingsItem:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:"#F8F9FF",borderRadius:7,border:"1px solid #E8ECF4"},
  removeBtn:{background:"#FFF0F0",border:"1px solid #FFCCCC",color:"#CC3333",borderRadius:5,padding:"3px 9px",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",flexShrink:0},
  stepBox:{background:"#F8F9FF",border:"1px solid #E8ECF4",borderRadius:10,padding:"14px",marginBottom:12},
  stepLabel:{fontSize:11,fontWeight:700,color:"#4361EE",letterSpacing:1,textTransform:"uppercase"},
};
