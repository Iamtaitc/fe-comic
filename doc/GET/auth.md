Dưới đây là tài liệu Markdown hoàn chỉnh cho các API xác thực và hồ sơ người dùng, bao gồm: đăng ký, đăng nhập, đổi mật khẩu, lấy và cập nhật thông tin hồ sơ.

---

# 🔐 API Xác Thực & Hồ Sơ Người Dùng

Base URL: `/api/v1/auth`
**Phân quyền:**

* `Public`: không cần token
* `Private`: cần `Authorization: Bearer <token>`

---

## 1. 📥 `POST /register` – Đăng ký tài khoản

**Mô tả:** Tạo tài khoản người dùng mới

### 🔸 Request body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### ✅ Response:

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    ...
  }
}
```

---

## 2. 🔐 `POST /login` – Đăng nhập

**Mô tả:** Đăng nhập bằng tài khoản đã đăng ký

### 🔸 Request body:

```json
{
  "username": "string",
  "password": "string"
}
```

### ✅ Response:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "jwt-token",
    "user": {
      "_id": "string",
      "username": "string",
      ...
    }
  }
}
```

---

## 3. 👤 `GET /me` – Lấy thông tin người dùng hiện tại

**Phân quyền:** Private

### ✅ Response:

```json
{
  "success": true,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    ...
  }
}
```

---

## 4. 🔁 `PATCH /change-password` – Đổi mật khẩu

**Phân quyền:** Private

### 🔸 Request body:

```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

### ✅ Response:

```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công",
  "data": null
}
```

---

## 5. ✏️ `PATCH /update-profile` – Cập nhật hồ sơ cá nhân

**Phân quyền:** Private

### 🔸 Request body:

```json
{
  "username": "string",
  "email": "string",
  "avatar": "url",     // nếu có
  "bio": "string"       // nếu có
}
```

### ✅ Response:

```json
{
  "success": true,
  "message": "Cập nhật thông tin thành công",
  "data": {
    "_id": "string",
    "username": "string",
    "email": "string",
    ...
  }
}
```

---

## ⚠️ Các lỗi có thể gặp

| Mã lỗi | Trường hợp                                             |
| ------ | ------------------------------------------------------ |
| 400    | Thiếu thông tin bắt buộc, dữ liệu sai                  |
| 401    | Không có hoặc token không hợp lệ                       |
| 403    | Không có quyền thực hiện (thường khi đổi mật khẩu sai) |
| 409    | Email hoặc username đã tồn tại khi đăng ký             |
| 500    | Lỗi hệ thống không xác định                            |

---