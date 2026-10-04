# Love Security — romantic anti-phishing microsite

Một trò đùa “phishing” an toàn: không giả mạo thương hiệu, không hỏi mật khẩu, chỉ dẫn người nhận tới trang chọn địa điểm, món ăn và gửi lời nhắn.

## Chạy thử

Mở terminal tại thư mục này:

```bash
python3 -m http.server 4173
```

Sau đó mở `http://localhost:4173`.

## Kết nối Google Forms

1. Tạo Google Form gồm 4 câu hỏi: `Nơi hẹn`, `Món ăn`, `Lời nhắn`, `Ngày hẹn`.
2. Trong Google Forms, chọn **Get pre-filled link**, điền dữ liệu mẫu rồi tạo link.
3. Từ link tạo sẵn, lấy 4 khóa dạng `entry.123456789`.
4. Mở `app.js`, điền `FORM_ACTION` theo mẫu `https://docs.google.com/forms/d/e/FORM_ID/formResponse` và thay các `entry` tương ứng.
5. Bật email notification trong Google Forms nếu muốn nhận mail mỗi khi có phản hồi.

## Gửi email

Mở `email-template.html`, thay `YOUR_WEBSITE_URL` bằng link website đã deploy. Nội dung email được thiết kế theo phong cách cảnh báo bảo mật nhưng nói rõ không yêu cầu mật khẩu hay dữ liệu nhạy cảm.

## Cá nhân hóa nhanh

- Đổi cách xưng hô và lời nhắn trực tiếp trong `index.html`.
- Đổi ảnh bằng cách thay đường dẫn `*.jpeg` trong `index.html`.
- Đổi lựa chọn địa điểm/món ăn trong thuộc tính `value` và phần chữ hiển thị; giá trị gửi về Google Form lấy từ `value`.
# phising-cute
# phising-cute
