import React, { useState } from 'react';
import { 
  BookOpen, 
  QrCode, 
  Server, 
  Database, 
  ShieldCheck, 
  CreditCard, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Copy, 
  Check, 
  Sparkles,
  Smartphone,
  ChefHat,
  Cpu
} from 'lucide-react';

export const TechGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'workflow' | 'architecture' | 'database' | 'security' | 'payment' | 'code' | 'ios_troubleshoot'>('workflow');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const sampleServerCode = `// server.js - Backend Express + Socket.IO cho hệ thống QR Dine-in
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// In-memory state (hoặc kết nối Database PostgreSQL / MongoDB / Firestore)
const activeOrders = [];
const tableSessions = {};

// Socket.io Real-time Channel
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Khách join room theo số bàn (VD: room "table_05")
  socket.on('join_table', ({ tableNumber }) => {
    socket.join(\`table_\${tableNumber}\`);
    console.log(\`Socket \${socket.id} joined table_\${tableNumber}\`);
  });

  // Khách gửi đơn đặt món từ bàn
  socket.on('client_submit_order', (orderData) => {
    const newOrder = {
      id: \`ord_\${Date.now()}\`,
      ...orderData,
      status: 'pending',
      createdAt: Date.now()
    };
    activeOrders.push(newOrder);

    // 1. Phát thông báo tức thì đến Màn hình Bếp (KDS) và Thu ngân
    io.emit('kds_new_order', newOrder);

    // 2. Phản hồi xác nhận về chính bàn của khách
    io.to(\`table_\${orderData.tableNumber}\`).emit('order_confirmed', newOrder);
  });

  // Bếp cập nhật trạng thái món (cooking / served)
  socket.on('kds_update_status', ({ orderId, status, tableNumber }) => {
    const ord = activeOrders.find(o => o.id === orderId);
    if (ord) {
      ord.status = status;
      // Báo real-time cho khách tại bàn biết món đã nấu xong
      io.to(\`table_\${tableNumber}\`).emit('order_status_changed', { orderId, status });
    }
  });

  // Khách bấm chuông gọi phục vụ
  socket.on('client_call_service', (serviceCallData) => {
    io.emit('staff_service_alert', serviceCallData);
  });
});

server.listen(3000, () => {
  console.log('QR Order Server running on port 3000');
});`;

  const sampleDbSchema = `-- PostgreSQL Schema cho ứng dụng đặt món QR
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    bank_bin VARCHAR(10),
    bank_account VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES restaurants(id),
    table_number VARCHAR(20) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 4,
    zone VARCHAR(50) DEFAULT 'Tầng 1',
    qr_token VARCHAR(100) UNIQUE, -- Token bảo mật chống quét ngoài quán
    status VARCHAR(20) DEFAULT 'empty' -- empty, ordering, eating, waiting_bill
);

CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES menu_categories(id),
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 0) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    is_available BOOLEAN DEFAULT TRUE,
    prep_time_minutes INT DEFAULT 10
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES restaurant_tables(id),
    order_number VARCHAR(20) NOT NULL,
    total_amount DECIMAL(12, 0) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, cooking, served, paid, cancelled
    payment_status VARCHAR(20) DEFAULT 'unpaid', -- unpaid, paid
    payment_method VARCHAR(20), -- vietqr, momo, cash
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 0) NOT NULL,
    selected_options JSONB, -- Lưu chi tiết topping, độ cay, ít ngọt...
    note VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending'
);`;

  return (
    <div className="min-h-screen bg-stone-100/70 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 sticky top-[88px] sm:top-[92px] z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Hướng Dẫn Viết Ứng Dụng Đặt Món QR Tại Bàn (A-Z)</span>
            </h1>
            <p className="text-xs text-stone-500">
              Kiến trúc kỹ thuật, sơ đồ luồng nghiệp vụ, CSDL, mã nguồn mẫu & giải pháp bảo mật
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {[
              { id: 'workflow', label: '1. Luồng Nghiệp Vụ', icon: ArrowRight },
              { id: 'architecture', label: '2. Kiến Trúc Hệ Thống', icon: Server },
              { id: 'database', label: '3. Thiết Kế CSDL', icon: Database },
              { id: 'security', label: '4. Bảo Mật Mã QR', icon: ShieldCheck },
              { id: 'payment', label: '5. Tích Hợp VietQR', icon: CreditCard },
              { id: 'code', label: '6. Code Mẫu Backend', icon: Code2 },
              { id: 'ios_troubleshoot', label: '7. Khắc Phục Lỗi iOS / iPhone', icon: Smartphone },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as typeof activeSection)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeSection === tab.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* SECTION 1: WORKFLOW */}
        {activeSection === 'workflow' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Sơ Đồ Luồng Hoạt Động (End-to-End Customer Flow)</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  {
                    step: 'Bước 1: Quét Mã QR',
                    desc: 'Khách ngồi vào bàn, mở camera điện thoại quét mã QR dán trên Standee bàn. Trình duyệt tự mở trang Web App với tham số số bàn (VD: ?table=05). Không cần tải app.',
                    color: 'bg-blue-50 border-blue-200 text-blue-900',
                    numBg: 'bg-blue-600'
                  },
                  {
                    step: 'Bước 2: Chọn Món & Tùy Biến',
                    desc: 'Khách duyệt thực đơn theo danh mục (Lẩu, Nướng, Đồ uống), chọn kích cỡ tô, mức độ cay, topping thêm và ghi chú riêng cho đầu bếp.',
                    color: 'bg-amber-50 border-amber-200 text-amber-900',
                    numBg: 'bg-amber-600'
                  },
                  {
                    step: 'Bước 3: Gửi Đơn Đến Bếp',
                    desc: 'Khách bấm "Gửi Đơn Xuống Bếp". Hệ thống bắn dữ liệu qua WebSocket/SSE. Màn hình Bếp (KDS) kêu chuông ting ting và hiển thị phiếu món ngay lập tức.',
                    color: 'bg-orange-50 border-orange-200 text-orange-900',
                    numBg: 'bg-orange-600'
                  },
                  {
                    step: 'Bước 4: Theo Dõi & Thanh Toán',
                    desc: 'Khách theo dõi tiến độ món (Đang nấu → Đã lên món). Khi dùng xong, bấm thanh toán để tạo mã VietQR động đúng số tiền hoặc thanh toán tiền mặt.',
                    color: 'bg-emerald-50 border-emerald-200 text-emerald-900',
                    numBg: 'bg-emerald-600'
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border ${item.color} flex flex-col justify-between space-y-2`}>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`w-5 h-5 rounded-full ${item.numBg} text-white flex items-center justify-center text-3xs font-black`}>
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-sm">{item.step}</h4>
                      </div>
                      <p className="text-xs leading-relaxed opacity-90">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Real-world benefits */}
              <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <strong className="text-stone-900 block mb-1">⚡ Tốc độ gọi món nhanh gấp 3 lần</strong>
                  <span className="text-stone-500">Khách không phải vẫy tay đợi nhân viên mang menu giấy đến và ghi chép tay.</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <strong className="text-stone-900 block mb-1">🎯 Không nhầm lẫn order</strong>
                  <span className="text-stone-500">Mọi ghi chú về topping, giảm cay, ít đường được chuyển chính xác 100% xuống bếp.</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <strong className="text-stone-900 block mb-1">💰 Tự động hóa doanh thu & giảm nhân sự</strong>
                  <span className="text-stone-500">Nhà hàng tiết kiệm 30-50% chi phí nhân viên chạy bàn trong giờ cao điểm.</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: ARCHITECTURE */}
        {activeSection === 'architecture' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>Kiến Trúc Công Nghệ & Tech Stack Đề Xuất</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-amber-600" />
                  <span>Frontend (Khách & KDS)</span>
                </h4>
                <ul className="space-y-1.5 text-stone-600">
                  <li>• <strong>Framework:</strong> React 18+ / Next.js / Vue 3</li>
                  <li>• <strong>Styling:</strong> Tailwind CSS (Tối ưu Mobile-First)</li>
                  <li>• <strong>State & Sync:</strong> React Context / Zustand / TanStack Query</li>
                  <li>• <strong>Real-time Client:</strong> Socket.IO Client / Firebase Firestore onSnapshot / SSE</li>
                  <li>• <strong>QR Code:</strong> thư viện <code className="bg-stone-200 px-1 py-0.5 rounded text-2xs">qrcode.react</code></li>
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>Backend & API Gateway</span>
                </h4>
                <ul className="space-y-1.5 text-stone-600">
                  <li>• <strong>Runtime:</strong> Node.js (Express / Fastify / NestJS) hoặc Golang</li>
                  <li>• <strong>Realtime Engine:</strong> WebSocket (Socket.io) / Server-Sent Events (SSE)</li>
                  <li>• <strong>Message Broker:</strong> Redis Pub/Sub (nếu scale đa server)</li>
                  <li>• <strong>Printer Integration:</strong> ESC/POS Network thermal printer (In phiếu bếp LAN)</li>
                </ul>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Database & Dịch Vụ Ngoài</span>
                </h4>
                <ul className="space-y-1.5 text-stone-600">
                  <li>• <strong>Database:</strong> PostgreSQL (với Drizzle/Prisma ORM) hoặc Firebase Firestore</li>
                  <li>• <strong>Cổng Thanh Toán:</strong> VietQR Open API, MoMo QR, VNPay, SeAPay webhook</li>
                  <li>• <strong>AI Assistant:</strong> Gemini 2.5 Flash để gợi ý set combo món ăn</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: DATABASE */}
        {activeSection === 'database' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <span>Thiết Kế Cơ Sở Dữ Liệu Quan Hệ (PostgreSQL DDL)</span>
              </h2>
              <button
                onClick={() => handleCopy('db_schema', sampleDbSchema)}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedCodeId === 'db_schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeId === 'db_schema' ? 'Đã sao chép' : 'Sao chép SQL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-stone-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-96 border border-stone-800 leading-relaxed">
              {sampleDbSchema}
            </pre>
          </div>
        )}

        {/* SECTION 4: SECURITY */}
        {activeSection === 'security' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Giải Pháp Bảo Mật & Chống Quét Giả Mạo Mã QR</span>
            </h2>

            <p className="text-xs text-stone-600">
              Khi triển khai QR Order tại nhà hàng, rủi ro lớn nhất là khách chụp hình mã QR đem về nhà rồi đặt món ảo phá hoại bếp. Dưới đây là 4 phương pháp phòng chống triệt để:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <strong className="font-bold text-stone-900 block text-sm">
                  1. Mã PIN Phiên Bàn (Table Session PIN / Token)
                </strong>
                <p className="text-stone-600 leading-relaxed">
                  Khi khách vào quán, nhân viên mở bàn trên POS và in phiếu nhỏ hoặc hiển thị mã PIN 4 số (VD: <strong>8942</strong>). Khi khách quét QR, cần nhập PIN để kích hoạt phiên đặt món. Sau khi thanh toán, PIN sẽ tự động reset.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <strong className="font-bold text-stone-900 block text-sm">
                  2. Kiểm Tra Tọa Độ GPS (Geofencing)
                </strong>
                <p className="text-stone-600 leading-relaxed">
                  Web App yêu cầu quyền vị trí (Geolocation API) và so sánh khoảng cách với tọa độ GPS của nhà hàng. Nếu cách xa quá 100m, hệ thống từ chối cho phép gửi đơn.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <strong className="font-bold text-stone-900 block text-sm">
                  3. Dynamic Rotating QR Code (Mã QR Xoay Vòng)
                </strong>
                <p className="text-stone-600 leading-relaxed">
                  Sử dụng màn hình e-ink nhỏ hoặc tablet tại bàn để thay đổi token mã QR sau mỗi 10-15 phút. Mã QR cũ sẽ hết hạn.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <strong className="font-bold text-stone-900 block text-sm">
                  4. Chế Độ Nhân Viên Xác Nhận Đơn (Staff Auto-Accept)
                </strong>
                <p className="text-stone-600 leading-relaxed">
                  Đơn hàng của khách quét QR sẽ ở trạng thái "Chờ duyệt", nhân viên phục vụ chỉ cần bấm 1 chạm trên điện thoại/POS để chuyển xuống bếp nấu.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: PAYMENT */}
        {activeSection === 'payment' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Tích Hợp Thanh Toán VietQR Tự Động</span>
            </h2>

            <p className="text-xs text-stone-600">
              Chuẩn VietQR (NAPAS 247) cho phép tạo mã QR ngân hàng động kèm chính xác số tiền và nội dung chuyển khoản mà không cần ký hợp đồng phức tạp với cổng trung gian.
            </p>

            <div className="p-4 bg-stone-950 text-stone-200 rounded-2xl font-mono text-xs space-y-2">
              <span className="text-stone-400">// Cú pháp URL sinh ảnh VietQR nhanh:</span>
              <div className="text-amber-400 break-all">
                https://img.vietqr.io/image/{'{BANK_BIN}'}-{'{ACCOUNT_NUMBER}'}-compact2.png?amount={'{TOTAL_MONEY}'}&addInfo={'{MEMO}'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                <strong className="block font-bold">Webhooks Xác Nhận Tự Động (Auto IPN)</strong>
                <p>
                  Sử dụng các dịch vụ webhook như SeAPay / Casso / MBBank Open API để lắng nghe biến động số dư tài khoản. Khi khách chuyển tiền đúng cú pháp <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">BAN05 THANHTOAN</code>, hệ thống POS sẽ tự động đổi trạng thái đơn sang "Đã thanh toán".
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-stone-700 space-y-1">
                <strong className="block font-bold">Hỗ Trợ Đa Dạng Hình Thức</strong>
                <p>
                  Kết hợp cả VietQR (Chuyển khoản liên ngân hàng miễn phí), Ví điện tử MoMo/ZaloPay và Tiền mặt để phục vụ mọi đối tượng khách hàng.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 6: CODE */}
        {activeSection === 'code' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-600" />
                <span>Mã Nguồn Mẫu Server Node.js + Socket.IO</span>
              </h2>
              <button
                onClick={() => handleCopy('server_code', sampleServerCode)}
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedCodeId === 'server_code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodeId === 'server_code' ? 'Đã sao chép' : 'Sao chép Code'}</span>
              </button>
            </div>

            <pre className="p-4 bg-stone-950 text-emerald-400 font-mono text-xs rounded-2xl overflow-x-auto max-h-[500px] border border-stone-800 leading-relaxed">
              {sampleServerCode}
            </pre>
          </div>
        )}

        {/* SECTION 7: IOS SCAN TROUBLESHOOTING */}
        {activeSection === 'ios_troubleshoot' && (
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Cẩm Nang Khắc Phục Lỗi Quét Mã QR Trên iPhone / iPad (iOS)</span>
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Các nguyên nhân kỹ thuật khiến camera iPhone hoặc Safari không mở được mã QR và giải pháp xử lý triệt để
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Point 1 */}
              <div className="p-4 bg-red-50/70 rounded-2xl border border-red-200 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-900 text-sm">
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-3xs font-black">1</span>
                  <span>Lỗi URL `localhost` trên thiết bị di động độc lập</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Khi chạy dev trên máy tính, URL mặc định là <code className="bg-red-100 text-red-800 px-1 py-0.5 rounded font-mono">http://localhost:3000</code>. Khi lấy iPhone quét, iPhone sẽ tự trỏ về chính nó và báo lỗi <em>"Không thể kết nối máy chủ"</em>.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-red-200 text-emerald-900 font-medium">
                  💡 <strong>Giải pháp:</strong> Dùng IP mạng LAN Wi-Fi (ví dụ: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">http://192.168.1.15:3000</code>), Ngrok/Cloudflare tunnel hoặc Domain công khai có HTTPS (<code className="font-mono bg-stone-100 px-1 py-0.5 rounded">https://nhahang.vn</code>).
                </div>
              </div>

              {/* Point 2 */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-3xs font-black">2</span>
                  <span>Tiêu chuẩn Vùng An Toàn (Quiet Zone) của Apple VisionKit</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Thuật toán quét mã QR của iOS Camera yêu cầu vùng viền trắng xung quanh (Quiet Zone / Margin) tối thiểu <strong>3 đến 4 module</strong>. Nếu mã QR in sát viền hoặc có nền rối, iPhone sẽ không thể nhận diện 3 góc định vị.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-emerald-900 font-medium">
                  💡 <strong>Giải pháp:</strong> Sử dụng thư viện QR với cấu hình <code className="font-mono">margin: 3</code> và độ tương phản tuyệt đối giữa màu đen đậm <code className="font-mono">#111827</code> và nền trắng <code className="font-mono">#ffffff</code>.
                </div>
              </div>

              {/* Point 3 */}
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-900 text-sm">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xs font-black">3</span>
                  <span>Cài đặt Camera iOS chưa bật quét QR</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Một số phiên bản iOS hoặc người dùng đã vô tình tắt tính năng quét QR tự động trong cài đặt máy.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-blue-200 text-stone-800 font-medium">
                  📱 <strong>Thao tác:</strong> Mở <strong>Cài đặt (Settings) ➔ Camera ➔ Bật "Quét mã QR" (Scan QR Codes)</strong>, hoặc mở app <strong>Zalo</strong> bấm icon Quét QR góc trên bên phải.
                </div>
              </div>

              {/* Point 4 */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-stone-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-3xs font-black">4</span>
                  <span>Mức độ sửa lỗi (Error Correction Level)</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Mã QR nên đặt ở mức <strong>Level M (15%)</strong> hoặc <strong>Level Q (25%)</strong> để dù tem bàn bị trầy xước nhẹ hoặc góc nghiêng camera, iPhone vẫn giải mã dữ liệu tức thì.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-emerald-900 font-medium">
                  ✅ <strong>Hệ thống đã tích hợp:</strong> Trình tạo QR Studio trong ứng dụng này đã tự động áp dụng toàn bộ các tiêu chuẩn trên.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
