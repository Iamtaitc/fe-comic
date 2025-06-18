Dưới đây là tài liệu Markdown chuẩn cho 3 API danh sách truyện theo trạng thái: **đang phát hành**, **đã hoàn thành**, và **sắp ra mắt**. Viết gộp đẹp, rõ ràng, dễ dùng và phù hợp để lưu file `story-status-list.md`.

---

# 📘 API: Danh sách truyện theo trạng thái

Gồm 3 endpoint:

* `/api/v1/comics/danh-sach/dang-phat-hanh`
* `/api/v1/comics/danh-sach/da-hoan-thanh`
* `/api/v1/comics/danh-sach/sap-ra-mat`

**Phương thức:** `GET`
**Phân quyền:** Public (không cần token)

---

## 📍 1. `GET /api/v1/comics/danh-sach/dang-phat-hanh`

### ✅ Mô tả:

Lấy danh sách truyện **đang phát hành** (`status = ongoing`).

---

## 📍 2. `GET /api/v1/comics/danh-sach/da-hoan-thanh`

### ✅ Mô tả:

Lấy danh sách truyện **đã hoàn thành** (`status = completed`).

---

## 📍 3. `GET /api/v1/comics/danh-sach/sap-ra-mat`

### ✅ Mô tả:

Lấy danh sách truyện **sắp ra mắt** (`status = upcoming` hoặc chưa phát hành).

---

## 🧾 Request – Query Parameters (áp dụng cho cả 3 API):

| Tham số | Kiểu   | Bắt buộc | Mặc định | Mô tả                 |
| ------- | ------ | -------- | -------- | --------------------- |
| `page`  | number | ❌        | `1`      | Số trang              |
| `limit` | number | ❌        | `20`     | Số lượng truyện/trang |

---

## ✅ Response mẫu (cho tất cả API):

```json
{
  "success": true,
  "message": "Lấy danh sách truyện đang phát hành thành công",
  "data": {
    "success": true,
    "status": 200,
    "message": "Lấy danh sách truyện đang tiến hành thành công",
    "data": {
      "stories": [
        {
          "_id": "657d151668e54cf5b5088d3b",
          "name": "Ông Trời Đã Ban Cho Tôi Siêu Năng Lực Kỳ Lạ Gì Thế Này?",
          "slug": "ong-troi-da-ban-cho-toi-sieu-nang-luc-ky-la-gi-the-nay",
          "status": "ongoing",
          "thumb_url": "https://...thumb.jpg",
          "category": [
            { "name": "Comedy", "slug": "comedy" },
            { "name": "Fantasy", "slug": "fantasy" }
          ],
          "ratingValue": 0,
          "ratingCount": 0,
          "updatedAt": "2025-06-18T16:27:28.483Z"
        }
      ],
      "pagination": {
        "total": 404,
        "page": 1,
        "limit": 20,
        "pages": 21
      }
    }
  },
  "timestamp": "2025-06-18T16:27:49.508Z"
}
```

---

## 📚 Chi tiết `stories[]`

| Trường        | Kiểu   | Mô tả                                          |
| ------------- | ------ | ---------------------------------------------- |
| `_id`         | string | ID của truyện                                  |
| `name`        | string | Tên truyện                                     |
| `slug`        | string | Slug URL                                       |
| `status`      | string | Trạng thái: `ongoing`, `completed`, `upcoming` |
| `thumb_url`   | string | Ảnh đại diện                                   |
| `category[]`  | array  | Danh sách thể loại                             |
| `ratingValue` | number | Điểm đánh giá trung bình                       |
| `ratingCount` | number | Tổng số lượt đánh giá                          |
| `updatedAt`   | string | Ngày cập nhật gần nhất                         |

---

## 📦 Trường `pagination`

| Trường  | Kiểu   | Mô tả               |
| ------- | ------ | ------------------- |
| `total` | number | Tổng số truyện      |
| `page`  | number | Trang hiện tại      |
| `limit` | number | Số truyện mỗi trang |
| `pages` | number | Tổng số trang       |

---

## ⚠️ Lỗi có thể gặp

| Mã lỗi | Nguyên nhân                                  |
| ------ | -------------------------------------------- |
| 400    | Truyền sai `page`, `limit` hoặc không hợp lệ |
| 500    | Lỗi xử lý trong hệ thống hoặc kết nối DB     |

---