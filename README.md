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

Demo trên web chỉ nhận ra ba mẫu lỗi khai báo trong `SAMPLES` (`js/main.js`). Nó không dùng bộ luật thật của ứng dụng.

## Chạy thử trên máy

Không cần build. Mở thẳng `index.html`, hoặc chạy một server tĩnh:

```sh
python3 -m http.server 8000
```

rồi vào http://localhost:8000.

## Cập nhật ảnh chụp trên trang chủ

Ảnh trong `assets/web/` được tạo từ `assets/screenshots/iphone_6.3/<ngôn ngữ>/raw_screenshot_<n>.png`. Trang chủ dùng ảnh số 1, 2, 4 và 5. Sau khi thay ảnh gốc, tạo lại bằng:

```sh
for l in vi en ja ko; do
  for i in 1 2 4 5; do
    sips -s format jpeg -s formatOptions 78 -Z 1160 \
      assets/screenshots/iphone_6.3/$l/raw_screenshot_$i.png \
      --out assets/web/app-$l-$i.jpg
  done
done
```

## Triển khai

GitHub Pages lấy từ nhánh `main`, thư mục gốc (Settings › Pages › Deploy from a branch). Push lên `main` là trang tự cập nhật sau một hai phút.

## Liên hệ

daovansonbg@gmail.com
