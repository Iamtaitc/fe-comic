Dưới đây là tài liệu `.md` hoàn chỉnh, đẹp và dễ nhìn cho API: `GET /api/v1/comics/popular`, dựa trên response mẫu và logic xử lý của bạn:

---

# 📘 API: `GET /api/v1/comics/popular`

**Mô tả:**
API trả về danh sách **truyện phổ biến** nhất, được xếp theo số lượng lượt xem (`views`).

**Endpoint:** `/api/v1/comics/popular`
**Phương thức:** `GET`
**Phân quyền:** Public (không yêu cầu xác thực)

---

## 🧾 Request

**Query Parameters (tuỳ chọn):**

| Tên     | Kiểu   | Mặc định | Mô tả                      |
| ------- | ------ | -------- | -------------------------- |
| `limit` | number | `10`     | Số lượng truyện cần lấy ra |

---

## ✅ Response: 200 OK

```json
{
  "success": true,
  "message": "Lấy danh sách truyện phổ biến thành công",
  "data": {
    "success": true,
    "status": 200,
    "message": "Lấy danh sách truyện phổ biến thành công",
    "data": {
      "stories": [
        {
          "_id": "6851324f54ddf1823a58d4d9",
          "name": "Quán Ăn Định Mệnh",
          "slug": "quan-an-dinh-menh",
          "status": "ongoing",
          "thumb_url": "https://img.otruyenapi.com/uploads/comics/quan-an-dinh-menh-thumb.jpg",
          "category": [
            {
              "_id": "6508654905d5791ad671a491",
              "name": "Action",
              "slug": "action"
            }
          ],
          "views": 911253,
          "ratingValue": 0,
          "ratingCount": 0
        }
      ]
    }
  },
  "timestamp": "2025-06-18T13:51:51.199Z"
}
```

---

## 🧩 Chi tiết các trường trong `stories[]`

| Trường        | Kiểu   | Mô tả                             |
| ------------- | ------ | --------------------------------- |
| `_id`         | string | ID của truyện                     |
| `name`        | string | Tên truyện                        |
| `slug`        | string | Slug dùng cho URL                 |
| `status`      | string | Trạng thái truyện (`ongoing`,...) |
| `thumb_url`   | string | Đường dẫn ảnh thumbnail           |
| `category[]`  | array  | Danh sách thể loại của truyện     |
| `views`       | number | Tổng số lượt xem                  |
| `ratingValue` | number | Điểm trung bình đánh giá (0–5)    |
| `ratingCount` | number | Tổng số lượt đánh giá             |

---

## 📚 Chi tiết `category[]`

```json
{
  "_id": "6508654905d5791ad671a491",
  "name": "Action",
  "slug": "action"
}
```

| Trường | Kiểu   | Mô tả             |
| ------ | ------ | ----------------- |
| `_id`  | string | ID thể loại       |
| `name` | string | Tên thể loại      |
| `slug` | string | Slug dùng cho URL |

---

## ⏱️ Trường thời gian

| Trường      | Kiểu         | Mô tả                        |
| ----------- | ------------ | ---------------------------- |
| `timestamp` | string (ISO) | Thời điểm phản hồi từ server |

---

## ⚠️ Lưu ý

* API mặc định trả 10 truyện phổ biến nếu không truyền `limit`
* Sắp xếp giảm dần theo `views`

---