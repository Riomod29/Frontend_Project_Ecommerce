/**
 * File: lognin.js - Xử lý logic đăng nhập người dùng
 * Description: Handle user login logic, session management and login information storage - Xử lý logic đăng nhập người dùng, quản lý phiên đăng nhập và lưu thông tin đăng nhập
 */

// Wait for DOM to load - Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', function () {
    // Get references to necessary DOM elements - Lấy tham chiếu đến các phần tử DOM cần thiết
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('message-container');

    // Check URL parameters to display registration success message - Kiểm tra tham số URL để hiển thị thông báo đăng ký thành công
    // When user has just registered and is redirected to the login page - Khi người dùng vừa đăng ký xong và được chuyển hướng đến trang đăng nhập
    const urlParams = new URLSearchParams(window.location.search);
    const fromRegister = urlParams.get('registered');
    if (fromRegister === 'true') {
        showMessage('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    }

    // Attach submit event to login form - Gắn sự kiện submit cho form đăng nhập
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from auto-submitting to process with JavaScript - Ngăn form tự động gửi để xử lý bằng JavaScript

        // Get data from input fields - Lấy dữ liệu từ các trường nhập liệu
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        // Check "Remember account" checkbox status - Kiểm tra trạng thái checkbox "Nhớ tài khoản"
        const remember = document.getElementById('remember').checked;

        // Validate input data - ensure user has entered email and password - Kiểm tra dữ liệu đầu vào - đảm bảo người dùng đã nhập email và mật khẩu
        if (!email || !password) {
            showMessage('Vui lòng điền email và mật khẩu', 'error');
            return;
        }

        // Get list of registered users from localStorage - Lấy danh sách người dùng đã đăng ký từ localStorage
        // If no one has registered, returns an empty array - Nếu chưa có ai đăng ký, sẽ trả về mảng rỗng
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Find user matching the entered email and password - Tìm người dùng khớp với email và mật khẩu đã nhập
        // Note: In real applications, passwords should not be stored as plain text - Lưu ý: Trong ứng dụng thực tế, không nên lưu mật khẩu dưới dạng plain text
        // One-way hashing should be used and hash values compared - Nên sử dụng mã hóa một chiều (hash) và so sánh các giá trị hash
        const user = users.find(u => u.email === email && u.password === password);

        // If no matching user is found, display error message - Nếu không tìm thấy người dùng khớp, hiển thị thông báo lỗi
        if (!user) {
            showMessage('Email hoặc mật khẩu không chính xác', 'error');
            return;
        }

        // Successful login - display message - Đăng nhập thành công - hiển thị thông báo
        showMessage('Đăng nhập thành công!', 'success');

        // Create object with current user information to save in sessionStorage - Tạo đối tượng chứa thông tin người dùng hiện tại để lưu vào sessionStorage
        // Only save necessary information, not including password - Chỉ lưu những thông tin cần thiết, không bao gồm mật khẩu
        const currentUser = {
            id: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            isLoggedIn: true, // Mark user as logged in - Đánh dấu người dùng đã đăng nhập
            rememberMe: remember // Save "Remember account" status - Lưu trạng thái "Nhớ tài khoản"
        };

        // Save login information in sessionStorage to maintain state in current session - Lưu thông tin đăng nhập vào sessionStorage để duy trì trạng thái trong phiên làm việc hiện tại
        // sessionStorage will be cleared when the browser is closed - sessionStorage sẽ bị xóa khi đóng trình duyệt
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Handle "Remember account" option - Xử lý tùy chọn "Nhớ tài khoản"
        if (remember) {
            // If "Remember account" is selected, save information in localStorage for persistent login - Nếu "Nhớ tài khoản" được chọn, lưu thông tin vào localStorage để duy trì đăng nhập lâu dài
            // localStorage retains data even after closing and reopening the browser - localStorage vẫn còn dữ liệu khi đóng và mở lại trình duyệt
            localStorage.setItem('rememberedUser', JSON.stringify(currentUser));
        } else {
            // If "Remember account" is not selected, clear previously saved information (if any) - Nếu không chọn "Nhớ tài khoản", xóa thông tin đã lưu trước đó (nếu có)
            localStorage.removeItem('rememberedUser');
        }

        // Redirect to product statistics page after successful login - Chuyển hướng đến trang thống kê sản phẩm sau khi đăng nhập thành công
        setTimeout(function () {
            window.location.href = '../../pages/manager/statistical.html';
        }, 1500);
    });

    /**
     * Function to display messages to the user - Hàm hiển thị thông báo cho người dùng
     * @param {string} message - Content of the message to display - Nội dung thông báo cần hiển thị
     * @param {string} type - Type of message: 'success' or 'error' - Loại thông báo: 'success' hoặc 'error'
     */
    function showMessage(message, type) {
        // Set content and format for the message - Đặt nội dung và định dạng cho thông báo
        messageContainer.textContent = message;
        messageContainer.className = 'message-' + type;
        messageContainer.style.display = 'block'; // Show message container - Hiển thị container thông báo

        // Automatically hide error messages after 5 seconds - Tự động ẩn thông báo lỗi sau 5 giây
        // Success messages will not auto-hide so user can see during page transition - Thông báo thành công sẽ không tự ẩn để người dùng có thể thấy trong quá trình chuyển trang
        if (type === 'error') {
            setTimeout(function () {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
});