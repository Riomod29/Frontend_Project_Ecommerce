/**
 * File: lognin.js
 * Mô tả: Xử lý logic đăng nhập người dùng, quản lý phiên đăng nhập và lưu thông tin đăng nhập
 */

document.addEventListener('DOMContentLoaded', function () {
    // Lấy tham chiếu đến các phần tử DOM cần thiết
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('message-container');

    // Kiểm tra tham số URL để hiển thị thông báo "Đăng ký thành công"
    // Khi người dùng vừa đăng ký xong và được chuyển hướng đến trang đăng nhập
    const urlParams = new URLSearchParams(window.location.search);
    const fromRegister = urlParams.get('registered');
    if (fromRegister === 'true') {
        showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    }

    // Gắn sự kiện submit cho form đăng nhập
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Ngăn form tự động gửi để xử lý bằng JavaScript

        // Lấy dữ liệu từ các trường nhập liệu
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        // Kiểm tra trạng thái checkbox "Nhớ tài khoản"
        const remember = document.getElementById('remember').checked;

        // Kiểm tra dữ liệu đầu vào - đảm bảo người dùng đã nhập email và mật khẩu
        if (!email || !password) {
            showMessage('Vui lòng điền email và mật khẩu', 'error');
            return;
        }

        // Lấy danh sách người dùng đã đăng ký từ localStorage
        // Nếu chưa có ai đăng ký, sẽ trả về mảng rỗng
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Tìm người dùng khớp với email và mật khẩu đã nhập
        // Lưu ý: Trong ứng dụng thực tế, không nên lưu mật khẩu dưới dạng plain text
        // Nên sử dụng mã hóa một chiều (hash) và so sánh các giá trị hash
        const user = users.find(u => u.email === email && u.password === password);

        // Nếu không tìm thấy người dùng khớp, hiển thị thông báo lỗi
        if (!user) {
            showMessage('Email hoặc mật khẩu không chính xác', 'error');
            return;
        }

        // Đăng nhập thành công - hiển thị thông báo
        showMessage('Đăng nhập thành công!', 'success');

        // Tạo đối tượng chứa thông tin người dùng hiện tại để lưu vào sessionStorage
        // Chỉ lưu những thông tin cần thiết, không bao gồm mật khẩu
        const currentUser = {
            id: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            isLoggedIn: true, // Đánh dấu người dùng đã đăng nhập
            rememberMe: remember // Lưu trạng thái "Nhớ tài khoản"
        };

        // Lưu thông tin đăng nhập vào sessionStorage để duy trì trạng thái trong phiên làm việc hiện tại
        // sessionStorage sẽ bị xóa khi đóng trình duyệt
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Xử lý tùy chọn "Nhớ tài khoản"
        if (remember) {
            // Nếu "Nhớ tài khoản" được chọn, lưu thông tin vào localStorage để duy trì đăng nhập lâu dài
            // localStorage vẫn còn dữ liệu khi đóng và mở lại trình duyệt
            localStorage.setItem('rememberedUser', JSON.stringify(currentUser));
        } else {
            // Nếu không chọn "Nhớ tài khoản", xóa thông tin đã lưu trước đó (nếu có)
            localStorage.removeItem('rememberedUser');
        }

        // Chuyển hướng đến trang thống kê sản phẩm sau khi đăng nhập thành công
        setTimeout(function () {
            window.location.href = '../../pages/manager/statistical.html';
        }, 1500);
    });

    /**
     * Hàm hiển thị thông báo cho người dùng
     * @param {string} message - Nội dung thông báo cần hiển thị
     * @param {string} type - Loại thông báo: 'success' hoặc 'error'
     */
    function showMessage(message, type) {
        // Đặt nội dung và định dạng cho thông báo
        messageContainer.textContent = message;
        messageContainer.className = 'message-' + type;
        messageContainer.style.display = 'block'; // Hiển thị container thông báo

        // Tự động ẩn thông báo lỗi sau 5 giây
        // Thông báo thành công sẽ không tự ẩn để người dùng có thể thấy trong quá trình chuyển trang
        if (type === 'error') {
            setTimeout(function () {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
});