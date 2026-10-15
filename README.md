# Trần Hoàn — Portfolio

Website tĩnh (HTML/CSS/JS thuần), không cần build. Mở `index.html` trong trình duyệt là xem được.

## Cấu trúc

| File | Nội dung |
|---|---|
| `index.html` | Trang chủ: chân dung + gallery 3D cuộn ngang, About, Experience, Awards, Clients |
| `work.html` | Danh sách dự án + bộ lọc |
| `bpm.html`, `design-system.html`, `audit-bpm.html`, `mb-junior.html`, `space-ai.html`, `viettel.html`, `techcombank.html`, `forbes.html`, `mobile-apps.html` | Trang case study |
| `assets/js/data.js` | **Thông tin cá nhân + danh sách dự án** (sửa ở đây để đổi tên, email, ảnh cover, thứ tự dự án) |
| `assets/js/main.js` | Header, menu, footer, hiệu ứng, gallery, bộ lọc |
| `assets/css/style.css` | Toàn bộ style (màu ở `:root`) |
| `assets/img/` | Hình ảnh |

## Song ngữ VI / EN

- Mặc định mở bằng **tiếng Anh**. Nút **VI / EN** ở header; lựa chọn được nhớ lại cho lần sau. Link thẳng bản tiếng Việt: `index.html?lang=vi`.
- Mỗi đoạn chữ có 2 bản: `<span lang="vi">…</span><span lang="en">…</span>` (hoặc `<div lang="…">`). Sửa nội dung thì sửa cả 2 bản.
- Link CV tự đổi theo ngôn ngữ (`cv.vi` / `cv.en` trong `assets/js/data.js`).

## Sửa nhanh

- Đổi ảnh cover dự án: sửa `cover` trong `assets/js/data.js`.
- Thêm ảnh Space AI: thêm ảnh vào `assets/img/`, đặt `cover: "assets/img/ten-anh.jpg"` cho `space-ai` và chèn `<figure>` vào `space-ai.html`.
- Sau khi sửa CSS/JS, tăng số `?v=13` trong các file HTML để trình duyệt không dùng bản cache cũ.

## Đưa lên mạng (miễn phí)

- **Netlify Drop**: kéo thả cả thư mục `Portfolio` vào https://app.netlify.com/drop
- **GitHub Pages / Vercel**: push thư mục lên repo rồi bật Pages / import vào Vercel.
