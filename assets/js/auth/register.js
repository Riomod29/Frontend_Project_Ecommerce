/**
 * File: register.js
 * Mô tả: Xử lý logic đăng ký người dùng mới, kiểm tra dữ liệu nhập, và lưu thông tin vào localStorage
 */

document.addEventListener('DOMContentLoaded', function () {
    // Lấy tham chiếu đến các phần tử DOM cần thiết
    const registerForm = document.getElementById('registerForm');
    const messageContainer = document.getElementById('message-container');

    // Xử lý sự kiện submit của form đăng ký
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn form tự động gửi để xử lý bằng JavaScript

        // Lấy dữ liệu từ các trường nhập liệu và làm sạch dữ liệu
        const lastname = document.getElementById('lastname').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // === PHẦN KIỂM TRA DỮ LIỆU ĐẦU VÀO ===

        // Kiểm tra họ và tên đệm
        if (!lastname) {
            showMessage('Họ và tên đệm không được để trống', 'error');
            return;
        }

        // Kiểm tra tên
        if (!firstname) {
            showMessage('Tên không được để trống', 'error');
            return;
        }

        // Kiểm tra email - không được để trống
        if (!email) {
            showMessage('Email không được để trống', 'error');
            return;
        }

        // Kiểm tra định dạng email hợp lệ bằng biểu thức chính quy (regex)
        // Đảm bảo email có dạng: something@something.something
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Email phải đúng định dạng', 'error');
            return;
        }

        // Kiểm tra mật khẩu - không được để trống
        if (!password) {
            showMessage('Mật khẩu không được để trống', 'error');
            return;
        }

        // Kiểm tra độ dài mật khẩu - tối thiểu 8 ký tự để đảm bảo an toàn
        if (password.length < 8) {
            showMessage('Mật khẩu tối thiểu 8 ký tự', 'error');
            return;
        }

        // Kiểm tra xác nhận mật khẩu - không được để trống
        if (!confirmPassword) {
            showMessage('Mật khẩu xác nhận không được để trống', 'error');
            return;
        }

        // Kiểm tra khớp mật khẩu - hai mật khẩu phải giống nhau
        if (password !== confirmPassword) {
            showMessage('Mật khẩu không trùng khớp', 'error');
            return;
        }

        // Kiểm tra người dùng đã đồng ý với điều khoản chưa
        if (!terms) {
            showMessage('Bạn cần đồng ý với chính sách và điều khoản', 'error');
            return;
        }

        // === PHẦN KIỂM TRA TRÙNG LẶP NGƯỜI DÙNG ===

        // Lấy danh sách người dùng đã đăng ký từ localStorage
        // Nếu chưa có ai đăng ký, trả về mảng rỗng []
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Kiểm tra xem email đã tồn tại trong hệ thống chưa
        // Dùng hàm some để kiểm tra có bất kỳ người dùng nào có email trùng không
        if (users.some(user => user.email === email)) {
            showMessage('Email đã được sử dụng', 'error');
            return;
        }

        // === PHẦN LƯU THÔNG TIN NGƯỜI DÙNG MỚI ===

        // Tạo đối tượng người dùng mới với thông tin từ form
        const user = {
            lastname,              // Họ và tên đệm
            firstname,             // Tên
            email,                 // Email (dùng làm ID)
            // Lưu ý: Trong ứng dụng thực tế, mật khẩu nên được mã hóa (hashed) trước khi lưu
            password,              // Mật khẩu (nên được mã hóa)
            createdAt: new Date().toISOString() // Thời điểm đăng ký
        };

        // Thêm người dùng mới vào mảng users
        users.push(user);

        // Lưu mảng users đã cập nhật vào localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Hiển thị thông báo đăng ký thành công
        showMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');

        // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
        setTimeout(function () {
            window.location.href = './lognin.html?registered=true';
        }, 2000);
    });

    /**
     * Hàm hiển thị thông báo cho người dùng
     * @param {string} message - Nội dung thông báo cần hiển thị
     * @param {string} type - Loại thông báo: 'success' hoặc 'error'
     */
    function showMessage(message, type) {
        // Đặt nội dung thông báo
        messageContainer.textContent = message;

        // Đặt class CSS phù hợp với loại thông báo
        messageContainer.className = type === 'error' ? 'message-error' : 'message-success';

        // Hiển thị container thông báo
        messageContainer.style.display = 'block';

        // Tự động ẩn thông báo lỗi sau 5 giây
        // Thông báo thành công sẽ không tự ẩn vì người dùng sẽ được chuyển trang
        if (type === 'error') {
            setTimeout(function () {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
});