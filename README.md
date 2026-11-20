# SoiPanic – website

Trang giới thiệu, trang hỗ trợ và chính sách quyền riêng tư của SoiPanic, ứng dụng iOS đọc log panic-full để khoanh vùng linh kiện lỗi trên iPhone.

Ứng dụng trên App Store: https://apps.apple.com/app/id6824146332

Website chạy trên GitHub Pages:

- Trang chủ: https://app-works-247.github.io/soipanic/
- Hỗ trợ (Support URL trên App Store Connect): https://app-works-247.github.io/soipanic/support.html
- Quyền riêng tư (Privacy Policy URL): https://app-works-247.github.io/soipanic/privacy.html

Nếu đổi tên hay đường dẫn hai trang hỗ trợ và quyền riêng tư, nhớ cập nhật lại trong App Store Connect.

## Cấu trúc

```text
index.html      trang chủ, có bản demo phân tích log chạy trên trình duyệt
support.html    cách lấy log, cách nhập log, liên hệ
privacy.html    chính sách quyền riêng tư (vi, ja, ko, en)
css/style.css   style dùng chung cho cả ba trang
js/main.js      đổi ngôn ngữ, demo, menu trên điện thoại
assets/
  web/          ảnh đã nén dùng trên website (icon, ảnh chụp app theo từng ngôn ngữ)
  screenshots/  ảnh gốc nộp App Store: iphone_6.3 và ipad_13, mỗi ngôn ngữ một thư mục
```

Trang chủ hỗ trợ bốn ngôn ngữ. Nội dung tiếng Việt viết thẳng trong `index.html`; bản tiếng Anh, Nhật, Hàn nằm trong object `T` ở `js/main.js`. Khi sửa chữ trên trang, sửa cả hai chỗ.

## Liên hệ

daovansonbg@gmail.com
