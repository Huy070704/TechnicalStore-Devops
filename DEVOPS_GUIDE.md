# 📘 CẨM NANG DEVOPS THỰC CHIẾN TỪ A ĐẾN Z (DÀNH CHO NGƯỜI MỚI)
> **Dự án:** Technical-Store (React Frontend + Node.js/TypeScript Backend + MongoDB Atlas + PayOS)  
> **Mục tiêu:** Hướng dẫn chi tiết, dễ hiểu nhất về cách đóng gói Docker, điều phối mạng và triển khai ứng dụng lên Cloud (Azure VM).

---

## 📑 MỤC LỤC
1. [Tư duy cốt lõi: DevOps làm gì sau khi viết xong code?](#1-tư-duy-cốt-lõi-devops-làm-gì-sau-khi-viết-xong-code)
2. [Kiến trúc hệ thống trực quan](#2-kiến-trúc-hệ-thống-trực-quan)
3. [Giải mã chi tiết từng file cấu hình trong dự án](#3-giải-mã-chi-tiết-từng-file-cấu-hình-trong-dự-án)
   - [3.1. backend/Dockerfile](#31-backenddockerfile)
   - [3.2. frontend/Dockerfile & frontend/nginx.conf](#32-frontenddockerfile--frontendnginxconf)
   - [3.3. docker-compose.yml](#33-docker-composeyml)
   - [3.4. Quản lý biến môi trường (.env)](#34-quản-lý-biến-môi-trường-env)
4. [Quy trình triển khai 5 bước tuần tự từ A đến Z](#4-quy-trình-triển-khai-5-bước-tuần-tự-từ-a-đến-z)
   - [Bước 1: Chạy và kiểm tra tại máy Local](#bước-1-chạy-và-kiểm-tra-tại-máy-local)
   - [Bước 2: Chuẩn bị mã nguồn và bảo mật trên Git](#bước-2-chuẩn-bị-mã-nguồn-và-bảo-mật-trên-git)
   - [Bước 3: Khởi tạo máy chủ Cloud (Azure VM)](#bước-3-khởi-tạo-máy-chủ-cloud-azure-vm)
   - [Bước 4: Cài đặt môi trường & đưa cấu hình lên Azure](#bước-4-cài-đặt-môi-trường--đưa-cấu-hình-lên-azure)
   - [Bước 5: Kích hoạt ứng dụng và nạp dữ liệu (Seed)](#bước-5-kích-hoạt-ứng-dụng-và-nạp-dữ-liệu-seed)
5. [Bảng tra cứu lỗi thường gặp (Troubleshooting)](#5-bảng-tra-cứu-lỗi-thường-gặp-troubleshooting)
6. [Sổ tay các câu lệnh Docker thường dùng nhất](#6-sổ-tay-các-câu-lệnh-docker-thường-dùng-nhất)

---

## 1. TƯ DUY CỐT LÕI: DEVOPS LÀM GÌ SAU KHI VIẾT XONG CODE?

Khi lập trình viên hoàn thành tính năng, ứng dụng mới chỉ chạy được trên máy tính của họ bằng lệnh `yarn dev` hoặc `npm run dev`. 

Nhiệm vụ của **DevOps** là giải quyết 3 câu hỏi lớn:
1. **Làm sao để code chạy được trên bất kỳ máy tính nào mà không bị lỗi thiếu thư viện?**  
   $\rightarrow$ Sử dụng **Docker** để đóng gói toàn bộ code và môi trường thành các "Container".
2. **Làm sao để Frontend và Backend kết nối mượt mà mà không bao giờ bị lỗi CORS hay lỗi cổng?**  
   $\rightarrow$ Sử dụng **Nginx làm Reverse Proxy** đứng gác cổng.
3. **Làm sao để người dùng trên toàn thế giới có thể truy cập 24/7?**  
   $\rightarrow$ Đưa toàn bộ hệ sinh thái Docker lên **Máy chủ đám mây (Azure Virtual Machine)**.

---

## 2. KIẾN TRÚC HỆ THỐNG TRỰC QUAN

Hệ thống được thiết kế theo mô hình **Single Entry Point (Một cửa ngõ duy nhất)**:

```text
               Trình duyệt người dùng (Khách hàng)
                              │
                              │ (Chỉ gọi qua cổng 80 - HTTP)
                              ▼
             ┌─────────────────────────────────┐
             │   MÁY ẢO AZURE (Cloud Host)     │
             │                                 │
             │   ┌─────────────────────────┐   │
             │   │ CONTAINER: frontend     │   │
             │   │ (Chạy Nginx siêu nhẹ)   │   │
             │   │                         │   │
             │   │ • Khách xem web (/)     │   │
             │   │   ──> Trả file HTML/CSS │   │
             │   │                         │   │
             │   │ • Khách gọi /api/...    │   │
             │   │   ──> Chuyển tiếp ──────┼───┼───────────┐
             │   └─────────────────────────┘   │           │ (Mạng Docker nội bộ)
             │                                 │           ▼
             │   ┌─────────────────────────┐   │   ┌─────────────────────────┐
             │   │ CONTAINER: backend      │◄──┼───┘ Lắng nghe cổng 8080     │
             │   │ (Node.js / Express API) │   │   Nhận yêu cầu & xử lý      │
             │   └────────────┬────────────┘   │   └─────────────────────────┘
             └────────────────┼────────────────┘
                              │ (Kết nối Internet)
                              ▼
                 [ MONGODB ATLAS (Cloud DB) ]
```

* **Lợi ích số 1:** Trình duyệt chỉ nói chuyện duy nhất với cổng `80` $\rightarrow$ **Xóa bỏ vĩnh viễn nỗi lo lỗi CORS**.
* **Lợi ích số 2:** Cổng `8080` của Backend được bảo vệ bên trong mạng nội bộ, người ngoài không thể tấn công trực tiếp.

---

## 3. GIẢI MÃ CHI TIẾT TỪNG FILE CẤU HÌNH TRONG DỰ ÁN

### 3.1. `backend/Dockerfile`
File này là công thức nấu ăn hướng dẫn Docker cách tạo ra container Backend chạy code Node.js + TypeScript:

```dockerfile
# GIAI ĐOẠN 1: Môi trường gốc (Base)
FROM node:24-alpine AS base
WORKDIR /app
# Cài đặt libc6-compat để thư viện mã hóa bcrypt chạy được trên hệ điều hành Alpine siêu nhẹ
RUN apk add --no-cache libc6-compat
RUN chown -R node:node /app

# GIAI ĐOẠN 2: Cài đặt thư viện (Deps)
FROM base AS deps
USER node
COPY --chown=node:node package*.json ./
# Cài sạch sẽ các dependencies
RUN npm ci

# GIAI ĐOẠN 3: Chạy ứng dụng (Production)
FROM base AS production
ENV NODE_ENV=production
USER node
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

EXPOSE 8080
ENV PORT=8080
# Khởi động trực tiếp TypeScript bằng ts-node
CMD ["npx", "ts-node", "-r", "tsconfig-paths/register", "src/server.ts"]
```
* **Kỹ thuật Multi-stage build:** Chia làm nhiều tầng (`base` $\rightarrow$ `deps` $\rightarrow$ `production`) giúp tận dụng bộ nhớ đệm (cache) của Docker. Khi bạn sửa code trong `src/`, Docker không phải tốn thời gian chạy lại `npm install`.

---

### 3.2. `frontend/Dockerfile` & `frontend/nginx.conf`

#### File `frontend/Dockerfile`:
```dockerfile
# TẦNG 1: Biên dịch mã nguồn React (Builder)
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Vite biên dịch toàn bộ React thành file tĩnh trong thư mục /app/dist
RUN npm run build

# TẦNG 2: Máy chủ phục vụ web Nginx (Runner)
FROM nginx:alpine AS runner
# Vứt bỏ toàn bộ Node.js nặng nề, chỉ copy đúng thư mục dist vào Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Nạp file cấu hình điều phối Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### File `frontend/nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # 1. Cầu nối API: Bất cứ request nào có tiền tố /api/ sẽ được chuyển về container Backend
    location /api/ {
        proxy_pass http://backend:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 2. Hỗ trợ React Router: Khi khách bấm F5 ở link /products/123, không bị lỗi 404
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

### 3.3. `docker-compose.yml`
File này đóng vai trò nhạc trưởng, liên kết tất cả các container lại với nhau:

```yaml
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: technical-store-backend
    restart: always # Tự khởi động lại nếu bị crash hoặc khi máy chủ reboot
    dns:
      - 8.8.8.8   # Cần thiết để backend phân giải được tên miền MongoDB Atlas
      - 8.8.4.4
      - 1.1.1.1
    ports:
      - "8080:8080"
    env_file:
      - ./backend/.env # Nạp toàn bộ bí mật từ file .env vào container
    environment:
      - PORT=8080

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: technical-store-frontend
    restart: always
    ports:
      - "80:80"        # Mở cổng 80 đón người dùng Internet
    depends_on:
      - backend        # Bắt buộc backend phải chạy trước frontend
```

---

### 3.4. Quản lý biến môi trường (`.env`)

* **`frontend/.env`:**
  ```env
  VITE_API_URL=/api
  ```
  *(Dùng đường dẫn tương đối `/api` để trình duyệt gọi thẳng vào Nginx cổng 80, Nginx sẽ tự chuyển tiếp sang backend).*

* **`backend/.env`:**
  ```env
  PORT=8080
  NODE_ENV=development
  MONGO_URI=mongodb+srv://<user>:<pass>@cluster0...mongodb.net/TechnicalStore
  FRONTEND_URL=http://localhost      # Đổi thành http://<IP_AZURE> khi lên Cloud
  PAYOS_RETURN_URL=http://localhost/checkout/result?paymentSuccess=true
  PAYOS_CANCEL_URL=http://localhost/checkout/result?paymentCancelled=true
  ```

---

## 4. QUY TRÌNH TRIỂN KHAI 5 BƯỚC TUẦN TỰ TỪ A ĐẾN Z

```text
[Bước 1: Chạy Local] ──> [Bước 2: Push Git] ──> [Bước 3: Tạo Azure VM] ──> [Bước 4: Cài đặt VM] ──> [Bước 5: Kích hoạt & Seed]
```

### Bước 1: Chạy và kiểm tra tại máy Local
Mở terminal tại thư mục gốc của dự án (`Technical-Store`) và chạy:
```bash
# 1. Build image và khởi chạy ngầm
docker compose up -d --build

# 2. Kiểm tra log backend xem kết nối MongoDB Atlas thành công chưa
docker logs -f technical-store-backend
```
Khi thấy dòng `✅ Database connection established successfully.` và `Backend listening on port 8080`, hãy mở trình duyệt vào [http://localhost](http://localhost) để kiểm tra giao diện.

---

### Bước 2: Chuẩn bị mã nguồn và bảo mật trên Git
1. Kiểm tra file `.gitignore` ở thư mục gốc và các thư mục con: đảm bảo các file `.env` **không bao giờ được commit lên GitHub**.
2. Đẩy toàn bộ mã nguồn lên repository GitHub của bạn:
   ```bash
   git add .
   git commit -m "feat: complete docker configurations for production"
   git push origin main
   ```

---

### Bước 3: Khởi tạo máy chủ Cloud (Azure VM)
1. Đăng nhập vào [Azure Portal](https://portal.azure.com/).
2. Chọn **Create a resource** $\rightarrow$ **Virtual Machine**.
3. Cấu hình các thông số chuẩn:
   * **Image:** `Ubuntu Server 24.04 LTS - x64 Gen2`.
   * **Size (Cực kỳ quan trọng):** Chọn gói **`Standard_B2s`** (2 vCPUs, 4 GiB RAM) để đủ tài nguyên build Docker không bị treo máy.
   * **Authentication:** Chọn `SSH public key`, tải file khóa `vm_key.pem` về máy tính của bạn.
4. **Cấu hình Firewall (Networking / NSG):**
   * Cho phép cổng **22 (SSH)** để bạn truy cập quản trị.
   * Cho phép cổng **80 (HTTP)** để người dùng vào xem web.

---

### Bước 4: Cài đặt môi trường & đưa cấu hình lên Azure

1. **Kết nối SSH vào máy ảo từ máy cá nhân của bạn:**
   ```bash
   ssh -i "đường/dẫn/tới/vm_key.pem" azureuser@<IP_AZURE>
   ```

2. **Cài đặt Docker và Docker Compose trên máy ảo:**
   ```bash
   # Cập nhật hệ thống
   sudo apt update && sudo apt upgrade -y

   # Cài đặt Docker engine và Docker Compose plugin
   sudo apt install docker.io docker-compose-v2 git -y

   # Cho phép user chạy Docker không cần gõ sudo
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **Kéo mã nguồn từ GitHub về máy ảo:**
   ```bash
   git clone <LINK_REPO_GITHUB_CUA_BAN>
   cd Technical-Store
   ```

4. **Tạo file `backend/.env` trên máy ảo:**
   Tạo file bảo mật bằng lệnh `nano backend/.env`, dán nội dung cấu hình vào và sửa lại URL theo IP của máy ảo:
   ```env
   PORT=8080
   NODE_ENV=production
   FRONTEND_URL=http://<IP_AZURE>
   PAYOS_RETURN_URL=http://<IP_AZURE>/checkout/result?paymentSuccess=true
   PAYOS_CANCEL_URL=http://<IP_AZURE>/checkout/result?paymentCancelled=true
   # ... giữ nguyên các khóa MONGO_URI, CLOUDINARY, PAYOS, EMAIL ...
   ```
   *(Nhấn `Ctrl + O` $\rightarrow$ `Enter` để lưu, `Ctrl + X` để thoát).*

---

### Bước 5: Kích hoạt ứng dụng và nạp dữ liệu (Seed)

1. **Khởi chạy hệ thống trên máy ảo:**
   ```bash
   docker compose up -d --build
   ```

2. **Khởi tạo dữ liệu mẫu cho Database MongoDB Atlas (Chỉ chạy 1 lần đầu):**
   ```bash
   docker exec -it technical-store-backend npm run seed
   docker exec -it technical-store-backend npm run seed:transactions
   ```

3. **Nghiệm thu thành quả:**
   Mở trình duyệt trên điện thoại hoặc máy tính của bất kỳ ai, gõ địa chỉ:  
   👉 `http://<IP_AZURE>`  
   Trang web bán hàng Technical Store sẽ hiển thị đầy đủ hình ảnh, sản phẩm và chức năng thanh toán trực tuyến!

---

## 5. BẢNG TRA CỨU LỖI THƯỜNG GẶP (TROUBLESHOOTING)

| Hiện tượng lỗi | Nguyên nhân gốc rễ | Cách xử lý nhanh |
| :--- | :--- | :--- |
| **502 Bad Gateway** khi gọi API | Nginx không tìm thấy Backend (Backend chưa khởi động xong hoặc Backend chạy lệch cổng). | Kiểm tra `docker logs technical-store-backend`. Đảm bảo trong `backend/.env` có `PORT=8080`. |
| **F5 trang web bị lỗi 404 Not Found** | Nginx chưa có rule `try_files` chuyển tiếp cho React Router. | Kiểm tra lại file `frontend/nginx.conf` đã có dòng `try_files $uri $uri/ /index.html;` chưa. |
| **Lỗi MongoDB `querySrv ENOTFOUND`** | Container Docker không phân giải được DNS đám mây của Atlas. | Thêm mục `dns: [8.8.8.8, 1.1.1.1]` vào service `backend` trong `docker-compose.yml`. |
| **Máy ảo Azure bị đơ (Not Responding)** | Chọn gói máy ảo quá yếu (`B1s` 1GB RAM) dẫn đến tràn bộ nhớ khi build. | Nâng cấp cấu hình máy ảo lên `Standard_B2s` (4GB RAM) trên Azure Portal. |
| **CORS blocked: `<URL>`** | Biến `FRONTEND_URL` trong `backend/.env` không khớp với địa chỉ trang web đang mở. | Sửa lại `FRONTEND_URL=http://<IP_AZURE>` trong `backend/.env` rồi restart lại backend. |

---

## 6. SỔ TAY CÁC CÂU LỆNH DOCKER THƯỜNG DÙNG NHẤT

```bash
# Xem danh sách container đang chạy và trạng thái cổng
docker ps

# Xem log trực tiếp của Backend (bấm Ctrl+C để thoát)
docker logs -f technical-store-backend

# Xem log của Nginx Frontend
docker logs -f technical-store-frontend

# Khởi động lại toàn bộ hệ thống sau khi sửa code
docker compose up -d --build

# Tắt toàn bộ hệ thống
docker compose down

# Kiểm tra dung lượng RAM/CPU các container đang sử dụng
docker stats

# Dọn dẹp các image/container rác chiếm ổ cứng
docker system prune -f
```

