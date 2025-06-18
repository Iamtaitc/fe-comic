Dưới đây là tài liệu chi tiết cho API `GET /api/v1/comics/category/:slug`, viết bằng Markdown, dễ đọc – phù hợp lưu file `.md` (ví dụ: `comics-by-category.md`):

---

# 📘 API: `GET /api/v1/comics/category/:slug`

**Mô tả:**
Lấy danh sách truyện thuộc một **thể loại cụ thể**, dựa trên `slug` truyền vào URL.

**Endpoint:** `/api/v1/comics/category/:slug`
**Phương thức:** `GET`
**Phân quyền:** Public (không yêu cầu xác thực)

---

## 🧾 Request

**Path Parameters:**

| Tên    | Kiểu   | Bắt buộc | Mô tả                            |
| ------ | ------ | -------- | -------------------------------- |
| `slug` | string | ✅        | Slug của thể loại (vd: `action`) |

**Query Parameters (tuỳ chọn):**

| Tên     | Kiểu   | Mặc định | Mô tả                     |
| ------- | ------ | -------- | ------------------------- |
| `page`  | number | `1`      | Số trang hiện tại         |
| `limit` | number | `20`     | Số lượng truyện mỗi trang |

---

## ✅ Response: 200 OK

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "success": true,
    "status": 200,
    "message": "Lấy danh sách truyện theo thể loại thành công",
    "data": {
      "category": {
        "id": "6508654905d5791ad671a491",
        "name": "Action",
        "slug": "action"
      },
      "stories": [
        {
          "_id": "67da8e47a4a4a602fb8de2ca",
          "name": "Tin Tức Của Toàn Tri Giả",
          "slug": "tin-tuc-cua-toan-tri-gia",
          "status": "ongoing",
          "thumb_url": "https://img.otruyenapi.com/uploads/comics/tin-tuc-cua-toan-tri-gia-thumb.jpg",
          "category": [ ... ],
          "ratingValue": 0,
          "ratingCount": 0,
          "updatedAt": "2025-06-18T13:54:01.918Z"
        }
      ],
      "pagination": {
        "total": 46,
        "page": 1,
        "limit": 20,
        "pages": 3
      }
    }
  },
  "pagination": {
    "totalItems": "Lấy danh sách truyện theo thể loại undefined thành công",
    "totalPages": null,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2025-06-18T13:54:26.333Z"
}
```

---

## 🧩 Chi tiết các trường trong `category`

| Trường | Kiểu   | Mô tả             |
| ------ | ------ | ----------------- |
| `id`   | string | ID của thể loại   |
| `name` | string | Tên thể loại      |
| `slug` | string | Slug để truy xuất |

---

## 📚 Chi tiết `stories[]`

| Trường        | Kiểu   | Mô tả                              |
| ------------- | ------ | ---------------------------------- |
| `_id`         | string | ID của truyện                      |
| `name`        | string | Tên truyện                         |
| `slug`        | string | Slug dùng trong URL                |
| `status`      | string | Trạng thái: `ongoing`, `completed` |
| `thumb_url`   | string | Ảnh thumbnail                      |
| `category[]`  | array  | Danh sách thể loại của truyện      |
| `ratingValue` | number | Điểm trung bình đánh giá (0–5)     |
| `ratingCount` | number | Tổng số lượt đánh giá              |
| `updatedAt`   | string | Thời điểm cập nhật gần nhất (ISO)  |

---

## 📦 Trường `pagination` (bên trong `data`)

| Trường  | Kiểu   | Mô tả                        |
| ------- | ------ | ---------------------------- |
| `total` | number | Tổng số truyện theo thể loại |
| `page`  | number | Trang hiện tại               |
| `limit` | number | Số lượng/trang               |
| `pages` | number | Tổng số trang                |

---

## ⏱️ Trường thời gian

| Trường      | Kiểu         | Mô tả                        |
| ----------- | ------------ | ---------------------------- |
| `timestamp` | string (ISO) | Thời gian phản hồi từ server |

---

## ⚠️ Lưu ý

* `slug` phải là một slug hợp lệ của thể loại đã có trong hệ thống
* Nếu slug không tồn tại, API sẽ trả về lỗi 400 hoặc 404
