Dưới đây là tài liệu chi tiết cho API `GET /api/v1/comics/search`, bao gồm hướng dẫn **nhập dữ liệu tìm kiếm**, mô tả tham số, cấu trúc response và ghi chú quan trọng – viết chuẩn Markdown để lưu `.md`.

---

# 🔍 API: `GET /api/v1/comics/search`

**Mô tả:**
Tìm kiếm truyện theo từ khóa (`keyword`) trong tiêu đề hoặc slug.

**Endpoint:** `/api/v1/comics/search`
**Phương thức:** `GET`
**Phân quyền:** Public (không yêu cầu xác thực)

---

## 🧾 Request

### 📥 Query Parameters:

| Tên       | Kiểu   | Bắt buộc | Mặc định | Mô tả                           |
| --------- | ------ | -------- | -------- | ------------------------------- |
| `keyword` | string | ✅        | -        | Từ khóa dùng để tìm kiếm truyện |
| `page`    | number | ❌        | `1`      | Trang hiện tại                  |
| `limit`   | number | ❌        | `20`     | Số lượng truyện/trang           |

---

### ✅ Ví dụ gọi API:

```http
GET /api/v1/comics/search?keyword=one&page=1&limit=10
```

---

## 🖋️ Hướng dẫn nhập dữ liệu tìm kiếm

* Từ khóa (`keyword`) có thể là **tên truyện đầy đủ**, **một phần tên**, hoặc **slug**
* Không phân biệt chữ hoa/thường, không cần dấu
* Dữ liệu nhập nên được **encodeURI** nếu chứa khoảng trắng hoặc ký tự đặc biệt (VD: `tien%20hoa`)

---

## ✅ Response: 200 OK (mẫu)

```json
{
  "success": true,
  "message": "Tìm kiếm truyện với từ khóa \"one\" thành công",
  "data": {
    "success": true,
    "status": 200,
    "message": "Tìm thấy 2 kết quả",
    "data": {
      "stories": [
        {
          "_id": "67f93f29c32f1b001a9a94f3",
          "name": "One Piece",
          "slug": "one-piece",
          "status": "ongoing",
          "thumb_url": "https://img.otruyenapi.com/uploads/comics/one-piece-thumb.jpg",
          "category": [
            { "_id": "...", "name": "Hành động", "slug": "hanh-dong" }
          ],
          "ratingValue": 4.8,
          "ratingCount": 112,
          "updatedAt": "2025-06-18T12:00:00Z"
        }
        // ...
      ],
      "pagination": {
        "total": 2,
        "page": 1,
        "limit": 10,
        "pages": 1
      }
    }
  },
  "timestamp": "2025-06-18T14:00:00.000Z"
}
```

---

## 📚 Mô tả các trường `stories[]`

| Trường        | Kiểu   | Mô tả                              |
| ------------- | ------ | ---------------------------------- |
| `_id`         | string | ID truyện                          |
| `name`        | string | Tên truyện                         |
| `slug`        | string | Slug truyện                        |
| `status`      | string | Trạng thái: `ongoing`, `completed` |
| `thumb_url`   | string | Link ảnh đại diện                  |
| `category[]`  | array  | Danh sách thể loại                 |
| `ratingValue` | number | Điểm trung bình đánh giá (0–5)     |
| `ratingCount` | number | Số lượt đánh giá                   |
| `updatedAt`   | string | Thời gian cập nhật cuối cùng       |

---

## ⚠️ Lỗi có thể gặp

| Mã lỗi | Nguyên nhân                           |
| ------ | ------------------------------------- |
| 400    | Không truyền `keyword` trong query    |
| 500    | Lỗi hệ thống, không thể xử lý yêu cầu |

---