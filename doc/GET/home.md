Dưới đây là tài liệu chi tiết (markdown format) cho API `GET /api/home`, bao gồm mô tả **từng trường** và **thuộc tính** trong response:

---

## 📘 API: `GET /api/home`

**Mô tả:**
API cung cấp dữ liệu tổng hợp cho trang chủ gồm:

* Danh sách truyện mới cập nhật
* Danh sách truyện phổ biến nhất
* Danh sách thể loại kèm số lượng truyện thuộc mỗi thể loại

**Phương thức:** `GET`
**Endpoint:** `/api/home`
**Phân quyền:** Công khai (không cần token)

---

### ✅ Response 200 - Thành công

```json
{
  "success": true,
  "message": "Lấy dữ liệu trang chủ thành công",
  "data": {
    "latestStorys": {...},      ← danh sách truyện mới cập nhật
    "popularStorys": {...},     ← danh sách truyện phổ biến
    "categories": [...]         ← danh sách thể loại
  },
  "timestamp": "2025-06-18T13:42:56.198Z"
}
```

---

### 🔍 Chi tiết các trường

#### 🗂 `data.latestStorys` / `data.popularStorys`

```json
{
  "success": true,
  "status": 200,
  "message": "Lấy danh sách truyện phổ biến thành công",
  "data": {
    "stories": [
      {
        "_id": "658f7cc310dc9c0a7e2e4bd4",
        "name": "Đấu La Đại Lục 5",
        "slug": "dau-la-dai-luc-5",
        "status": "ongoing",
        "thumb_url": "https://img.otruyenapi.com/uploads/comics/dau-la-dai-luc-5-thumb.jpg",
        "category": [...],
        "views": 121268,
        "ratingValue": 0,
        "ratingCount": 0
      }
    ]
  }
}
```

##### Các thuộc tính trong `stories[]`:

| Trường        | Kiểu   | Mô tả                                                 |
| ------------- | ------ | ----------------------------------------------------- |
| `_id`         | string | ID của truyện                                         |
| `name`        | string | Tên truyện                                            |
| `slug`        | string | Slug để dùng trong URL                                |
| `status`      | string | Trạng thái truyện: `ongoing`, `completed`, `upcoming` |
| `thumb_url`   | string | Link ảnh thumbnail                                    |
| `category`    | array  | Danh sách thể loại truyện                             |
| `views`       | number | Tổng số lượt xem                                      |
| `ratingValue` | number | Giá trị trung bình đánh giá (0–5)                     |
| `ratingCount` | number | Số lượt đánh giá                                      |

##### Các thuộc tính trong `category[]`:

| Trường | Kiểu   | Mô tả             |
| ------ | ------ | ----------------- |
| `_id`  | string | ID thể loại       |
| `name` | string | Tên thể loại      |
| `slug` | string | Slug của thể loại |

---

#### 🎭 `data.categories`

```json
[
  {
    "_id": "6508654a05d5791ad671a518",
    "name": "16+",
    "slug": "16",
    "storyCount": 0
  }
]
```

| Trường       | Kiểu   | Mô tả                            |
| ------------ | ------ | -------------------------------- |
| `_id`        | string | ID thể loại                      |
| `name`       | string | Tên thể loại                     |
| `slug`       | string | Slug URL                         |
| `storyCount` | number | Tổng số truyện thuộc thể loại đó |

---

#### 🕒 `timestamp`

| Trường      | Kiểu         | Mô tả                        |
| ----------- | ------------ | ---------------------------- |
| `timestamp` | string (ISO) | Thời gian server trả dữ liệu |

---

### ❌ Response 500 - Lỗi server

```json
{
  "success": false,
  "message": "Lỗi khi lấy dữ liệu trang chủ",
  "error": "Chi tiết lỗi..."
}
```

---