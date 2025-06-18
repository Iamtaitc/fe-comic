Dưới đây là tài liệu hoàn chỉnh (Markdown) cho API `GET /api/v1/comics/:slug` – dùng để lấy **chi tiết truyện và danh sách chapter**, trình bày đẹp và rõ ràng, sẵn sàng lưu file `.md`:

---

# 📘 API: `GET /api/v1/comics/:slug`

**Mô tả:**
Lấy **thông tin chi tiết** của một truyện cụ thể, bao gồm mô tả truyện và danh sách chương (chapter).

**Endpoint:** `/api/v1/comics/:slug`
**Phương thức:** `GET`
**Phân quyền:** Public (không yêu cầu xác thực)

---

## 🧾 Request

### 📥 Path Parameters:

| Tham số | Kiểu   | Bắt buộc | Mô tả                                                |
| ------- | ------ | -------- | ---------------------------------------------------- |
| `slug`  | string | ✅        | Slug của truyện (ví dụ: `summoners-war-captain-eve`) |

---

## ✅ Response: 200 OK

```json
{
  "success": true,
  "message": "Lấy thông tin chi tiết truyện thành công",
  "data": {
    "Story": { ... },
    "chapters": [ ... ]
  },
  "timestamp": "2025-06-18T16:24:17.291Z"
}
```

---

## 🧩 `data.Story` – Thông tin truyện

| Trường         | Kiểu          | Mô tả                              |
| -------------- | ------------- | ---------------------------------- |
| `_id`          | string        | ID của truyện                      |
| `name`         | string        | Tên truyện                         |
| `slug`         | string        | Slug URL                           |
| `origin_name`  | array         | Tên gốc (nếu có, hoặc rỗng)        |
| `content`      | string (HTML) | Mô tả nội dung (HTML)              |
| `status`       | string        | Trạng thái: `ongoing`, `completed` |
| `thumb_url`    | string        | Ảnh thumbnail                      |
| `sub_docquyen` | boolean       | Truyện độc quyền không             |
| `author`       | array         | Tác giả (hoặc `["Đang cập nhật"]`) |
| `category[]`   | array         | Danh sách thể loại                 |
| `views`        | number        | Tổng lượt xem                      |
| `ratingValue`  | number        | Điểm đánh giá trung bình (0–5)     |
| `ratingCount`  | number        | Tổng số lượt đánh giá              |
| `likeCount`    | number        | Tổng số lượt thích                 |
| `createdAt`    | string (ISO)  | Ngày tạo                           |
| `updatedAt`    | string (ISO)  | Ngày cập nhật gần nhất             |

#### 🔎 Ví dụ `category[]`:

```json
[
  {
    "_id": "6508654905d5791ad671a491",
    "name": "Action",
    "slug": "action"
  }
]
```

---

## 📚 `data.chapters[]` – Danh sách chapter

| Trường          | Kiểu   | Mô tả                      |
| --------------- | ------ | -------------------------- |
| `_id`           | string | ID chapter                 |
| `chapterNumber` | number | Số thứ tự chương           |
| `chapter_name`  | string | Tên chương (thường là số)  |
| `chapter_title` | string | Tiêu đề chương (nếu có)    |
| `createdAt`     | string | Thời gian tạo chương (ISO) |
| `likeCount`     | number | Số lượt thích chương       |
| `views`         | number | Lượt xem chương            |

#### 🔎 Ví dụ chapter:

```json
{
  "_id": "6852dd2a8cbc95e3a28fc0c9",
  "chapterNumber": 1,
  "chapter_name": "1",
  "chapter_title": "",
  "createdAt": "2025-06-18T15:37:14.673Z",
  "likeCount": 3553,
  "views": 192162
}
```

---

## ⚠️ Lỗi có thể gặp

| Mã lỗi | Nguyên nhân                      | Mô tả                            |
| ------ | -------------------------------- | -------------------------------- |
| 400    | Truyện không tồn tại theo `slug` | "Không tìm thấy truyện"          |
| 500    | Lỗi hệ thống khi xử lý dữ liệu   | "Lỗi khi lấy thông tin chi tiết" |

---