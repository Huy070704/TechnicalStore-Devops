# 🚀 HƯỚNG DẪN DEPLOY TOÀN DIỆN: AZURE FOR STUDENTS -> PRODUCTION (FRONTEND + BACKEND)

Tài liệu này ghi lại toàn bộ quy trình chuẩn hóa từ bước tạo máy ảo Azure for Students, xử lý tài nguyên tránh crash, bảo mật file `.env` (không lộ secret/credentials trên terminal), cấu hình Docker backend, Nginx frontend reverse proxy và fix triệt để mọi lỗi thường gặp.

---

## 📑 MỤC LỤC
1. [Thiết kế kiến trúc hệ thống](#1-thiết-kế-kiến-trúc-hệ-thống)
2. [Giai đoạn 1: Khởi tạo máy ảo trên Azure for Students chuẩn kỹ thuật](#giai-đoạn-1-khởi-tạo-máy-ảo-trên-azure-for-students-chuẩn-kỹ-thuật)
3. [Giai đoạn 2: Chuẩn bị Frontend & Build Production](#giai-đoạn-2-chuẩn-bị-frontend--build-production)
4. [Giai đoạn 3: Kết nối SSH & Cài đặt môi trường trên VM](#giai-đoạn-3-kết-nối-ssh--cài-đặt-môi-trường-trên-vm)
5. [Giai đoạn 4: Đưa biến môi trường (.env) lên VM an toàn](#giai-đoạn-4-đưa-biến-môi-trường-env-lên-vm-an-toàn)
6. [Giai đoạn 5: Deploy Backend bằng Docker](#giai-đoạn-5-deploy-backend-bằng-docker)
7. [Giai đoạn 6: Deploy Frontend & Cấu hình Nginx Reverse Proxy](#giai-đoạn-6-deploy-frontend--cấu-hình-nginx-reverse-proxy)
8. [Giai đoạn 7: Seed dữ liệu Database MongoDB Atlas](#giai-đoạn-7-seed-dữ-liệu-database-mongodb-atlas)
9. [Bảng tra cứu lỗi và cách xử lý nhanh](#bảng-tra-cứu-lỗi-và-cách-xử-lý-nhanh)

---

## 1. THIẾT KẾ KIẾN TRÚC HỆ THỐNG

Thay vì để trình duyệt người dùng kết nối trực tiếp vào nhiều port khác nhau (gây lỗi CORS và lỗi firewall), hệ thống chuẩn production sử dụng mô hình:

```text
[ Người dùng Internet ]
          │ (Port 80 - HTTP)
          ▼
   [ Nginx Web Server ] (Máy ảo Azure)
   ├── Đường dẫn /       ──> Trả về file HTML/CSS/JS (Thư mục /var/www/html)
   └── Đường dẫn /api/   ──> Reverse Proxy nội bộ tới http://127.0.0.1:8080/api/
                                  │
                                  ▼
                     [ Docker Container: test-api ] (Port 8080)
                                  │
                                  ▼
                     [ MongoDB Atlas (Cloud) ]
```

* **Lợi ích:**
  1. Trình duyệt chỉ gọi vào một nguồn gốc duy nhất: `http://<IP_AZURE>` $\rightarrow$ **Không bao giờ bị lỗi CORS**.
  2. Không cần mở port `8080` ra ngoài Internet $\rightarrow$ **Bảo mật tối đa cho Backend**.
  3. Chỉ cần mở port `22` (SSH) và port `80` (Web).

---

## GIAI ĐOẠN 1: KHỞI TẠO MÁY ẢO TRÊN AZURE FOR STUDENTS CHUẨN KỸ THUẬT

### 1.1. Chọn cấu hình VM (CỰC KỲ QUAN TRỌNG)
> ⚠️ **CẢNH BÁO LỖI TREO MÁY:** Không chọn gói `Standard_B1s` hay `Standard_B1ls` (chỉ có 0.5GB - 1GB RAM). Khi chạy Node.js hoặc Docker, máy sẽ bị tràn RAM (OOM - Out of Memory) dẫn đến đóng băng toàn bộ OS, Azure Agent báo `Not Ready`, và SSH bị `timed out during banner exchange`.

1. Vào [Azure Portal](https://portal.azure.com/) $\rightarrow$ **Virtual machines** $\rightarrow$ **Create** $\rightarrow$ **Azure virtual machine**.
2. **Project details:**
   * **Subscription:** `Azure for Students`
   * **Resource group:** Chọn có sẵn hoặc tạo mới (ví dụ: `rg-technical-store`).
3. **Instance details:**
   * **Virtual machine name:** `vm-test-backend`
   * **Region:** `East Asia` hoặc `Southeast Asia` (Singapore - độ trễ thấp nhất về VN).
   * **Image:** `Ubuntu Server 24.04 LTS - x64 Gen2`
   * **Size:** Chọn **`Standard_B2als_v2`** (2 vCPUs, 4 GiB memory) hoặc **`Standard_B2s`** (2 vCPUs, 4 GiB memory). Gói này nằm trong hạn mức credit student và đủ RAM chạy mượt mà cả FE + BE.
4. **Administrator account:**
   * **Authentication type:** Chọn `SSH public key`.
   * **Username:** `azureuser`
   * **SSH public key source:** Chọn `Generate new key pair` (hoặc `Use existing key stored in Azure`).
   * **Key pair name:** `vm_key` $\rightarrow$ Tải file `.pem` về máy và lưu vào nơi an toàn (ví dụ: `C:\Users\Admin\Downloads\folderkey.pem\vm_key.pem`).
5. **Inbound port rules:**
   * Tích chọn: **SSH (22)** và **HTTP (80)**.
6. Nhấn **Review + create** $\rightarrow$ **Create**.

---

## GIAI ĐOẠN 2: CHUẨN BỊ FRONTEND & BUILD PRODUCTION

Thực hiện trên **máy tính cá nhân của bạn**:

### 2.1. Cấu hình Endpoint API Frontend
Để tận dụng Nginx Reverse Proxy, cấu hình file `frontend/.env` sử dụng đường dẫn tương đối `/api`:

Mở file `frontend/.env`:
```env
VITE_API_URL=/api
```
*(Hoặc `http://<IP_AZURE>/api` nếu bạn muốn chỉ định tường minh).*

### 2.2. Kiểm tra và Build Frontend
Mở terminal tại thư mục `frontend`:
```cmd
cd frontend
npm run build
```
* Sau khi hoàn tất, Vite sẽ tạo ra thư mục `frontend/dist` chứa toàn bộ mã nguồn tĩnh tối ưu hóa.

---

## GIAI ĐOẠN 3: KẾT NỐI SSH & CÀI ĐẶT MÔI TRƯỜNG TRÊN VM

### 3.1. Kết nối SSH vào máy ảo
Mở Command Prompt (CMD) trên máy tính:
```cmd
ssh -i "C:\Users\Admin\Downloads\folderkey.pem\vm_key.pem" azureuser@<IP_AZURE>
```
*(Thay `<IP_AZURE>` bằng IP công khai của máy ảo, ví dụ `20.24.82.205`).*

### 3.2. Cập nhật hệ thống & Cài Docker, Nginx
Trên terminal SSH của VM, chạy lần lượt:

```bash
# 1. Cập nhật gói phần mềm
sudo apt update && sudo apt upgrade -y

# 2. Cài đặt Docker tự động
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# 3. Cài đặt Nginx
sudo apt install nginx -y

# 4. Kiểm tra dịch vụ
docker --version
nginx -v
```

---

## GIAI ĐOẠN 4: ĐƯA BIẾN MÔI TRƯỜNG (.ENV) LÊN VM AN TOÀN

> 🔒 **NGUYÊN TẮC BẢO MẬT:** Không gõ `echo "KEY=SECRET" >> .env` hoặc truyền key trực tiếp qua lệnh CLI vì key sẽ bị lưu vĩnh viễn trong file `~/.bash_history` và hiển thị trên màn hình.

### Cách tốt nhất: Dùng lệnh `scp` truyền file mã hóa qua SSH
Mở một cửa sổ **CMD mới trên máy tính của bạn** (không phải trong cửa sổ SSH), chạy lệnh copy file thẳng vào máy ảo:

```cmd
scp -i "C:\Users\Admin\Downloads\folderkey.pem\vm_key.pem" "d:\ki 8\WDP301\Technical-Store\Technical-Store\backend\.env" azureuser@<IP_AZURE>:/home/azureuser/.env
```

### Điều chỉnh biến môi trường cho Production (trên VM):
Quay lại cửa sổ SSH của VM, mở file:
```bash
nano /home/azureuser/.env
```
Đảm bảo các giá trị quan trọng được cập nhật:
```env
PORT=8080
NODE_ENV=production
FRONTEND_URL=http://<IP_AZURE>
MONGO_URI=mongodb+srv://... (chuỗi kết nối MongoDB Atlas của bạn)
JWT_SECRET=...
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=...
JWT_REFRESH_EXPIRES_IN=30d
```
*Nhấn `Ctrl + O` $\rightarrow$ `Enter` để lưu $\rightarrow$ `Ctrl + X` để thoát.*

**Phân quyền bảo vệ file .env:**
```bash
chmod 600 /home/azureuser/.env
```
*(Chỉ tài khoản `azureuser` mới có quyền đọc/ghi file này).*

---

## GIAI ĐOẠN 5: DEPLOY BACKEND BẰNG DOCKER

Thực hiện trên **terminal SSH của VM**:

### 5.1. Dừng container cũ (nếu có)
```bash
docker rm -f test-api 2>/dev/null || true
```

### 5.2. Khởi chạy Container Backend mới với file `.env`
```bash
docker run -d \
  --name test-api \
  --restart always \
  -p 8080:8080 \
  --env-file /home/azureuser/.env \
  thanhhuy0707/technical-store-api:latest
```

### 5.3. Kiểm tra log khởi động
```bash
docker logs -f test-api
```
Khi xuất hiện các dòng:
```text
✅ MongoDB connected: TechnicalStore
✅ Database connection established successfully.
Backend listening on port 8080
```
Nhấn `Ctrl + C` để thoát màn hình xem log.

---

## GIAI ĐOẠN 6: DEPLOY FRONTEND & CẤU HÌNH NGINX REVERSE PROXY

### 6.1. Upload thư mục `dist` lên VM
Mở cửa sổ **CMD trên máy tính cá nhân**, chạy:
```cmd
scp -r -i "C:\Users\Admin\Downloads\folderkey.pem\vm_key.pem" "d:\ki 8\WDP301\Technical-Store\Technical-Store\frontend\dist" azureuser@<IP_AZURE>:/home/azureuser/dist
```

### 6.2. Đưa file vào Web Root và cấp quyền đọc (Trên SSH của VM)
```bash
# Xóa web mặc định và copy mã nguồn mới
sudo rm -rf /var/www/html/*
sudo cp -r /home/azureuser/dist/* /var/www/html/

# QUAN TRỌNG: Cấp quyền 755 để Nginx không bị lỗi 403 Forbidden / MIME type text/html
sudo chmod -R 755 /var/www/html
```

### 6.3. Cấu hình Nginx
Mở file cấu hình Nginx:
```bash
sudo nano /etc/nginx/sites-available/default
```

Xóa nội dung cũ và dán toàn bộ cấu hình chuẩn sau:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    # 1. Reverse Proxy cho API Backend
    location /api/ {
        proxy_pass http://127.0.0.1:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2. Xử lý Swagger Docs (nếu có truy cập /api-docs)
    location /api-docs {
        proxy_pass http://127.0.0.1:8080/api-docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # 3. Phục vụ React SPA (tránh lỗi 404 khi F5 trang con)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
*Nhấn `Ctrl + O` $\rightarrow$ `Enter` để lưu $\rightarrow$ `Ctrl + X` để thoát.*

### 6.4. Kiểm tra cấu hình và Restart Nginx
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## GIAI ĐOẠN 7: SEED DỮ LIỆU DATABASE MONGODB ATLAS

Nếu cơ sở dữ liệu mới tinh và chưa có dữ liệu sản phẩm/danh mục:

### Cách 1: Seed trực tiếp từ bên trong container (Trên SSH VM)
```bash
docker exec -it test-api npm run seed
docker exec -it test-api npm run seed:transactions
```

### Cách 2: Seed từ máy local (Vì dùng MongoDB Atlas Cloud)
Trên máy tính cá nhân của bạn:
```cmd
cd backend
npm run seed
```

---

## 🛠️ BẢNG TRA CỨU LỖI VÀ CÁCH XỬ LÝ NHANH

| Hiện tượng lỗi | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **SSH bị treo / Connection timed out during banner exchange** | VM thiếu RAM (1GB) bị crash CPU/OS khi chạy container. Azure Agent chuyển `Not Ready`. | Vào Azure Portal $\rightarrow$ Resize VM lên gói `Standard_B2als_v2` (4GB RAM) $\rightarrow$ Restart VM. |
| **Màn hình trắng tinh, Console báo `MIME type "text/html"`** | Thư mục `assets` bị quyền `drwx------` (chỉ root đọc được, Nginx bị chặn). | Chạy trên VM: `sudo chmod -R 755 /var/www/html`. |
| **Đăng nhập báo `net::ERR_CONNECTION_REFUSED :8080`** | Gọi trực tiếp port 8080 từ ngoài bị firewall chặn hoặc container chưa chạy. | Cấu hình Nginx reverse proxy `location /api/` trỏ về `127.0.0.1:8080` để đi qua port 80. |
| **Log container báo `connect ECONNREFUSED ::1:27017`** | Container chưa nhận file `.env`, rơi về Mongo mặc định `localhost`. | Chạy container với cờ `--env-file /home/azureuser/.env`. |
| **F5 trang `/login` bị lỗi 404 Not Found Nginx** | Chưa cấu hình fallback file cho Single Page Application (SPA). | Thêm `try_files $uri $uri/ /index.html;` vào khối `location /` của Nginx. |
| **Đăng nhập bị lỗi CORS policy** | Biến `FRONTEND_URL` trong `.env` chưa khớp với IP/Domain người dùng truy cập. | Đổi `FRONTEND_URL=http://<IP_AZURE>` trong `.env` rồi restart container. |
