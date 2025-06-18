---

## 📘 API Documentation - `/api/v1`

---

### **\[GET] `/home`**

📌 **Mô tả:** Lấy dữ liệu trang chủ (banner, truyện đề cử, top tuần...)

📤 **Query:** *Không có*

📥 **Response (ví dụ):**

```json
{
  "banners": [...],
  "topWeekly": [...],
  "recommended": [...]
}
```

---

### **\[GET] `/comics/latest`**

📌 **Mô tả:** Lấy danh sách truyện mới cập nhật

📤 **Query:**

* `page` (optional): Số trang
* `limit` (optional): Số lượng truyện/trang

---

### **\[GET] `/comics/popular`**

📌 **Mô tả:** Truyện phổ biến nhất (dựa theo lượt xem hoặc theo tuần)

---

### **\[GET] `/comics/category/:slug`**

📌 **Mô tả:** Lấy danh sách truyện theo thể loại
🔑 **Path Param:**

* `slug` (string): Slug thể loại (vd: `hanh-dong`)

---

### **\[GET] `/comics/categorise`**

📌 **Mô tả:** Lấy danh sách tất cả thể loại

📥 **Response (ví dụ):**

```json
[
  { "slug": "hanh-dong", "name": "Hành động" },
  { "slug": "hai-huoc", "name": "Hài hước" }
]
```

---

### **\[GET] `/comics/search`**

📌 **Mô tả:** Tìm kiếm truyện theo từ khóa
📤 **Query:**

* `q` (string, bắt buộc): Từ khóa tìm kiếm

---

### **\[GET] `/comics/top-weekly`**

📌 **Mô tả:** Truyện có lượt xem cao nhất trong tuần

---

### **\[GET] `/comics/:slug`**

📌 **Mô tả:** Lấy chi tiết 1 truyện
🔑 **Path Param:**

* `slug` (string): Slug của truyện

📥 **Response (ví dụ):**

```json
{
  "title": "One Piece",
  "author": "Oda",
  "chapters": [...],
  "description": "..."
}
```

---

### **\[GET] `/comics/:slug/chapter/:chapterName`**

📌 **Mô tả:** Lấy chi tiết nội dung chapter
🔐 Nếu user đã login thì sẽ tự đánh dấu là đã đọc
🔑 **Path Param:**

* `slug` (string): Slug truyện
* `chapterName` (string): Tên chapter (vd: `chap-123`)

---

### **\[GET] `/comics/danh-sach/dang-phat-hanh`**

📌 **Mô tả:** Truyện đang phát hành

---

### **\[GET] `/comics/danh-sach/da-hoan-thanh`**

📌 **Mô tả:** Truyện đã hoàn thành

---

### **\[GET] `/comics/danh-sach/sap-ra-mat`**

📌 **Mô tả:** Truyện sắp ra mắt

---

