Dưới đây là tài liệu tổng hợp (Markdown) cho các API **quản lý người dùng** liên quan đến: yêu thích (bookmark), lịch sử đọc, tiến độ đọc và đánh giá truyện.

---

# 👤 User API – Bookmark, Lịch sử, Đánh giá

## 1. 📌 Bookmark Truyện

### `GET /api/v1/user/bookmarks`

**Mô tả:** Lấy danh sách truyện đã thêm vào yêu thích của người dùng
**Phân quyền:** Private (cần token)

#### ✅ Response:

```json
{
  "success": true,
  "message": "Lấy danh sách truyện yêu thích thành công",
  "data": [
    {
      "_id": "...",
      "userId": "...",
      "storyId": {
        "_id": "...",
        "name": "...",
        "slug": "...",
        "status": "...",
        "thumb_url": "...",
        "ratingValue": 0,
        "ratingCount": 0
      },
      "note": "",
      "lastReadChapter": null,
      "readProgress": 0,
      "isActive": true
    }
  ]
}
```

---

### `POST /api/v1/comic/:cid/bookmark`

**Mô tả:** Thêm truyện vào danh sách yêu thích
**Path Param:** `cid` – ID truyện
**Phân quyền:** Private

#### ✅ Response:

```json
{
  "success": true,
  "message": "Đã thêm vào danh sách yêu thích",
  "data": {
    "userId": "...",
    "storyId": "...",
    "readProgress": 0,
    "isActive": true
  }
}
```

---

### `DELETE /api/v1/comic/:cid/bookmark`

**Mô tả:** Xóa truyện khỏi danh sách yêu thích
**Path Param:** `cid` – ID truyện
**Phân quyền:** Private

#### ✅ Response:

```json
{
  "success": true,
  "message": "Đã xóa khỏi danh sách yêu thích",
  "data": null
}
```

---

## 2. 📖 Quản lý Lịch sử Đọc

### `GET /api/v1/user/history`

**Mô tả:** Lấy toàn bộ lịch sử đọc truyện của user
**Phân quyền:** Private

---

### `DELETE /api/v1/user/history`

**Mô tả:** Xóa toàn bộ lịch sử đọc của user
**Phân quyền:** Private

---

### `DELETE /api/v1/user/history/:historyId`

**Mô tả:** Xóa 1 mục lịch sử cụ thể theo ID
**Path Param:** `historyId` – ID lịch sử
**Phân quyền:** Private

---

### `POST /api/v1/user/reading/history`

**Mô tả:** Lưu lại lịch sử đọc (khi mở chapter)
**Body:**

```json
{
  "storyId": "string",
  "chapterId": "string"
}
```

---

## 3. 🧭 Tiến Độ Đọc Truyện

### `PATCH /api/v1/user/reading/progress`

**Mô tả:** Cập nhật phần trăm đã đọc của chapter
**Body:**

```json
{
  "storyId": "string",
  "chapterId": "string",
  "progress": 4
}
```

#### ✅ Response:

```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

---

### `POST /api/v1/user/reading/complete`

**Mô tả:** Đánh dấu đã đọc xong chương
**Body:**

```json
{
  "storyId": "string",
  "chapterId": "string"
}
```

---

## 4. ⭐ Đánh Giá Truyện

### `POST /api/v1/comic/:cid/rate`

**Mô tả:** Đánh giá và nhận xét truyện
**Path Param:** `cid` – ID truyện
**Body:**

```json
{
  "value": number,       // bắt buộc
  "comment": string|null // tùy chọn
}
```

---
