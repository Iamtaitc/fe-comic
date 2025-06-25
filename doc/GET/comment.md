# 📚 Comments API Documentation

> **Version**: v1
> **Base URL**: `http://localhost:3000/api/v1`

API quản lý bình luận cho truyện tranh (story) và chapter. Hỗ trợ tạo, lấy danh sách, cập nhật, xoá, like/unlike bình luận cùng phân trang và phân quyền.

---

## 💬 Comment Object

| Trường        | Kiểu                            | Mô tả                                              |
| ------------- | ------------------------------- | -------------------------------------------------- |
| `_id`         | `string`                        | ID bình luận                                       |
| `userId`      | `object`                        | Thông tin người bình luận                          |
|   `_id`       | `string`                        | ID user                                            |
|   `username`  | `string`                        | Tên hiển thị                                       |
|   `avatar`    | `string`                        | URL ảnh đại diện                                   |
| `storyId`     | `string`                        | ID truyện                                          |
| `chapterId`   | `string\|null`                  | ID chapter (null nếu bình luận ở cấp truyện)       |
| `content`     | `string`                        | Nội dung                                           |
| `parentId`    | `string\|null`                  | ID bình luận cha (nếu là reply)                    |
| `likeCount`   | `number`                        | Số lượt like                                       |
| `replyCount`  | `number`                        | Số phản hồi trực tiếp                              |
| `isEdited`    | `boolean`                       | Đã chỉnh sửa?                                      |
| `editedAt`    | `string\|null`                  | ISO‑8601 datetime                                  |
| `deletedAt`   | `string\|null`                  | ISO‑8601 datetime                                  |
| `status`      | `"approved"\|"pending"\|"spam"` | Trạng thái duyệt                                   |
| `metadata`    | `object`                        | Thông tin kỹ thuật (IP, userAgent, contentLength…) |
| `editHistory` | `Array`                         | Nhật ký chỉnh sửa                                  |
| `createdAt`   | `string`                        | ISO‑8601 datetime                                  |
| `updatedAt`   | `string`                        | ISO‑8601 datetime                                  |

---

## 🔗 Endpoints

| Method & Path                                           | Mô tả                                      | Quyền            |
| ------------------------------------------------------- | ------------------------------------------ | ---------------- |
| **GET** `/comic/:storyId/chapters/:chapterId/comments`  | Danh sách bình luận của một chapter        | Public           |
| **POST** `/comic/:storyId/chapters/:chapterId/comments` | Tạo bình luận vào chapter                  | Private          |
| **POST** `/comic/:storyId/comments`                     | Tạo bình luận vào truyện (root)            | Private          |
| **GET** `/comic/:storyId/comments`                      | Danh sách bình luận root của truyện        | Public           |
| **PATCH** `/comments/:commentId`                        | Cập nhật nội dung bình luận                | Owner hoặc Admin |
| **DELETE** `/comments/:commentId`                       | **✏️ Mới** Xoá mềm (soft‑delete) bình luận | Owner hoặc Admin |
| **POST** `/comments/:commentId/like`                    | **✏️ Mới** Like/Unlike bình luận (toggle)  | Private          |

---

### 1. GET /comic/\:storyId/chapters/\:chapterId/comments

Lấy danh sách bình luận của một chapter, hỗ trợ phân trang.

```http
GET /api/v1/comic/6857881b9af2bd6a74669dd4/chapters/6857b6b49af2bd6a746c24b5/comments?page=1&limit=20
```

#### Query Params

| Tham số | Kiểu     | Mặc định | Giải thích    |
| ------- | -------- | -------- | ------------- |
| `page`  | `number` | `1`      | Trang         |
| `limit` | `number` | `20`     | Số item/trang |

#### Response ‑ 200

```jsonc
{
  "success": true,
  "message": "Lấy danh sách bình luận chapter thành công",
  "data": [ Comment Object... ],
  "pagination": {
    "totalItems": 42,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "timestamp": "2025-06-24T09:27:16.022Z"
}
```

---

### 2. POST /comic/\:storyId/chapters/\:chapterId/comments

Tạo mới bình luận ở một chapter.

```http
POST /api/v1/comic/:storyId/chapters/:chapterId/comments
Authorization: Bearer <token>
Content-Type: application/json
{
  "content": "hay vãi"
}
```

#### Response ‑ 201

```jsonc
{
  "success": true,
  "message": "Tạo bình luận thành công",
  "data": Comment Object,
  "timestamp": "2025-06-24T09:38:54.501Z"
}
```

---

### 3. POST /comic/\:storyId/comments

Tạo bình luận root (không gắn chapter).

```http
POST /api/v1/comic/:storyId/comments
Authorization: Bearer <token>
{
  "content": "lần đầu"
}
```

*Response schema giống **#2**.*

---

### 4. GET /comic/\:storyId/comments

Lấy danh sách bình luận cấp truyện.

```http
GET /api/v1/comic/:storyId/comments?page=1&limit=20
```

*Response schema giống **#1**.*

---

### 5. PATCH /comments/\:commentId

Chỉnh sửa nội dung bình luận (soft‑edit, lưu `editHistory`). Chỉ owner hoặc admin.

```http
PATCH /api/v1/comments/685a7262dac18c420a1c644c
Authorization: Bearer <token>
{
  "content": "hay vãi lúa" 
}
```

#### Response ‑ 200

```jsonc
{
  "success": true,
  "message": "Cập nhật thành công",
  "data": Comment Object,
  "timestamp": "2025-06-24T09:43:01.863Z"
}
```

---

### 6. DELETE /comments/:commentId 

Xoá mềm bình luận. Trả về `deletedAt` & `deletionReason`.

```http
DELETE /api/v1/comments/685a7262dac18c420a1c644c
Authorization: Bearer <token>
```

#### Response ‑ 200

```jsonc
{
  "success": true,
  "message": "Xoá bình luận thành công",
  "data": {
    "_id": "685a7262dac18c420a1c644c",
    "deletedAt": "2025-06-24T10:00:00.000Z"
  },
  "timestamp": "2025-06-24T10:00:00.010Z"
}
```

> **Ghi chú**: Muốn xoá cứng (hard‑delete) chỉ admin DB mới thực hiện.

---

### 7. POST /comments/:commentId/like 

Toggle like/unlike cho bình luận. Nếu user đã like ➜ huỷ like, ngược lại ➜ like mới.

```http
POST /api/v1/comments/685a7262dac18c420a1c644c/like
Authorization: Bearer <token>
```

#### Response ‑ 200

```jsonc
{
  "success": true,
  "message": "Đã like bình luận", // hoặc "Đã huỷ like bình luận"
  "data": {
    "commentId": "685a7262dac18c420a1c644c",
    "likeCount": 5,
    "isLiked": true
  },
  "timestamp": "2025-06-24T10:05:00.012Z"
}
```

---

## 🔐 Authentication & Permissions

* **Public**: Xem bình luận.
* **Private** *(Bearer token)*:

  * Tạo, like/unlike bình luận.
  * Chỉnh sửa/Xoá bình luận của chính mình.
* **Admin**: Toàn quyền duyệt, sửa, xoá.

---

## 📝 Validation Rules (tóm tắt)

| Field             | Rule                                       |
| ----------------- | ------------------------------------------ |
| `commentId` param | `isMongoId`                                |
| `content` body    | `required`, `string`, `min:1`, `max:3,000` |

---

## ⏱️ Rate Limit

* **POST /comments/**: 10 requests/phút/user.
* **Like toggle**: 30 requests/phút/user.

