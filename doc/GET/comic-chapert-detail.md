Dưới đây là tài liệu hoàn chỉnh (Markdown) cho API `GET /api/v1/comics/:slug/chapter/:chapterName` – dùng để lấy **nội dung chi tiết của một chương truyện**, bao gồm ảnh, thông tin chapter và điều hướng:

---

# 📘 API: `GET /api/v1/comics/:slug/chapter/:chapterName`

**Mô tả:**
Lấy nội dung hình ảnh và thông tin chi tiết của **một chương truyện**, đồng thời trả về **điều hướng** đến chương trước/sau nếu có.

**Endpoint:** `/api/v1/comics/:slug/chapter/:chapterName`
**Phương thức:** `GET`
**Phân quyền:** Public (nếu người dùng đăng nhập, hệ thống tự đánh dấu đã đọc)

---

## 🧾 Request

### 📥 Path Parameters:

| Tên           | Kiểu   | Bắt buộc | Mô tả                          |
| ------------- | ------ | -------- | ------------------------------ |
| `slug`        | string | ✅        | Slug của truyện                |
| `chapterName` | string | ✅        | Tên chương (thường là số: `1`) |

---

## ✅ Response: 200 OK

```json
{
  "success": true,
  "message": "Lấy thông tin chapter thành công",
  "data": {
    "chapter": { ... },
    "navigation": {
      "prev": null,
      "next": {
        "_id": "6852dd2a8cbc95e3a28fc0cc",
        "chapterNumber": 2,
        "chapter_name": "2"
      }
    }
  },
  "timestamp": "2025-06-18T16:26:14.691Z"
}
```

---

## 📚 `data.chapter` – Chi tiết chapter

| Trường             | Kiểu         | Mô tả                                       |
| ------------------ | ------------ | ------------------------------------------- |
| `_id`              | string       | ID chương                                   |
| `chapterNumber`    | number       | Số thứ tự chương                            |
| `chapter_name`     | string       | Tên chương (thường là số)                   |
| `chapter_title`    | string       | Tiêu đề chương (nếu có)                     |
| `content[]`        | array        | Danh sách URL ảnh chương                    |
| `chapter_image[]`  | array        | Danh sách ảnh chi tiết (xem bên dưới)       |
| `chapter_api_data` | string       | Đường dẫn API gốc chứa nội dung chương      |
| `storyId`          | string       | ID của truyện                               |
| `views`            | number       | Số lượt xem chương                          |
| `likeCount`        | number       | Số lượt thích chương                        |
| `filename`         | string       | Tên file chương (đôi khi chứa nhiều chương) |
| `comic_name`       | string       | Tên truyện tại thời điểm chapter được tạo   |
| `server_name`      | string       | Tên server chứa ảnh                         |
| `chapter_path`     | string       | Đường dẫn thư mục gốc chứa ảnh chương       |
| `domain_cdn`       | string       | Tên miền CDN chính                          |
| `isPublished`      | boolean      | Trạng thái xuất bản                         |
| `createdAt`        | string       | Ngày tạo chương (ISO)                       |
| `updatedAt`        | string       | Ngày cập nhật chương (ISO)                  |
| `deletedAt`        | string\|null | Đã xoá chưa (null nếu chưa)                 |

---

### 🔍 `chapter_image[]` – Dữ liệu từng trang ảnh

| Trường       | Kiểu   | Mô tả            |
| ------------ | ------ | ---------------- |
| `image_page` | number | Trang số         |
| `image_file` | string | Tên file ảnh gốc |
| `_id`        | string | ID trang ảnh     |

---

### 🔍 `content[]` – URL ảnh hiển thị

Danh sách các URL ảnh hiển thị từng trang truyện, theo thứ tự từ trang 1 → trang N.

```json
[
  "https://sv1.otruyencdn.com/uploads/.../page_1.jpg",
  "https://sv1.otruyencdn.com/uploads/.../page_2.jpg",
  ...
]
```

---

## 🔁 `navigation` – Điều hướng chương

| Trường | Kiểu \| null | Mô tả                           |
| ------ | ------------ | ------------------------------- |
| `prev` | object/null  | Thông tin chương trước (nếu có) |
| `next` | object/null  | Thông tin chương sau (nếu có)   |

Cấu trúc mỗi chương:

```json
{
  "_id": "6852dd2a8cbc95e3a28fc0cc",
  "chapterNumber": 2,
  "chapter_name": "2"
}
```

---

## ⚠️ Lỗi có thể gặp

| Mã lỗi | Nguyên nhân                      | Mô tả                           |
| ------ | -------------------------------- | ------------------------------- |
| 400    | Không tìm thấy chapter hoặc slug | "Không tồn tại chương truyện"   |
| 500    | Lỗi server hoặc dữ liệu hỏng     | "Lỗi khi lấy thông tin chapter" |

---