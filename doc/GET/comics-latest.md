Dưới đây là tài liệu chi tiết cho API `GET /api/v1/comics/latest`, được viết bằng định dạng Markdown đẹp mắt – phù hợp để lưu vào file `.md` (ví dụ: `comics-latest.md`):

---

# 📘 API: `GET /api/v1/comics/latest`

**Mô tả:**
Trả về danh sách truyện mới nhất được cập nhật gần đây nhất theo thời gian.

**Endpoint:** `/api/v1/comics/latest`
**Phương thức:** `GET`
**Phân quyền:** Public (không yêu cầu xác thực)

---

## 🧾 Request

**Query Parameters (tuỳ chọn):**

| Tên     | Kiểu   | Mặc định | Mô tả                 |
| ------- | ------ | -------- | --------------------- |
| `page`  | number | `1`      | Số trang hiện tại     |
| `limit` | number | `20`     | Số lượng truyện/trang |

---

## ✅ Response: 200 OK

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "success": true,
    "status": 200,
    "message": "Lấy danh sách truyện mới thành công",
    "data": {
      "stories": [ ... ],
      "pagination": {
        "total": 37,
        "page": 1,
        "limit": 20,
        "pages": 2
      }
    }
  },
  "pagination": {
    "totalItems": "Lấy danh sách truyện mới thành công",
    "totalPages": null,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "timestamp": "2025-06-18T13:47:42.935Z"
}
```

---

## 🧩 Chi tiết các trường trong `stories[]`

| Trường        | Kiểu   | Mô tả                              |
| ------------- | ------ | ---------------------------------- |
| `_id`         | string | ID của truyện                      |
| `name`        | string | Tên truyện                         |
| `slug`        | string | Chuỗi slug dùng cho URL            |
| `status`      | string | Trạng thái: `ongoing`, `completed` |
| `thumb_url`   | string | Link ảnh thumbnail                 |
| `category[]`  | array  | Danh sách thể loại (xem bên dưới)  |
| `ratingValue` | number | Điểm trung bình đánh giá (0–5)     |
| `ratingCount` | number | Số lượng người đã đánh giá         |
| `updatedAt`   | string | Thời gian cập nhật cuối (ISO 8601) |

---

## 📚 Chi tiết `category[]`

```json
"category": [
  {
    "_id": "6508654905d5791ad671a491",
    "name": "Action",
    "slug": "action"
  }
]
```

| Trường | Kiểu   | Mô tả             |
| ------ | ------ | ----------------- |
| `_id`  | string | ID của thể loại   |
| `name` | string | Tên thể loại      |
| `slug` | string | Slug của thể loại |

---

## 📦 `pagination` (trong `data`)

| Trường  | Kiểu   | Mô tả                        |
| ------- | ------ | ---------------------------- |
| `total` | number | Tổng số truyện trong kết quả |
| `page`  | number | Trang hiện tại               |
| `limit` | number | Số truyện/trang              |
| `pages` | number | Tổng số trang                |

---

## ⏱️ `timestamp`

| Trường      | Kiểu         | Mô tả                        |
| ----------- | ------------ | ---------------------------- |
| `timestamp` | string (ISO) | Thời gian phản hồi từ server |

---

## ⚠️ Lưu ý

* API này hỗ trợ phân trang thông qua query `page` và `limit`
* Thứ tự truyện sắp xếp theo thời gian cập nhật mới nhất (`updatedAt`)

---