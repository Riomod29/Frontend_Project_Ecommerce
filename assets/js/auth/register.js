// User registration logic, validation, and storage - Xử lý đăng ký người dùng, kiểm tra dữ liệu và lưu trữ

/**
 * File: register.js - Xử lý logic đăng ký người dùng mới
 * Description: Handle new user registration, input validation, and save info to localStorage - Xử lý đăng ký người dùng mới, kiểm tra dữ liệu nhập, và lưu thông tin vào localStorage
 */

document.addEventListener('DOMContentLoaded', function () {
    // Wait for DOM to load - Chờ DOM tải xong

    // Get references to necessary DOM elements - Lấy tham chiếu đến các phần tử DOM cần thiết
    const registerForm = document.getElementById('registerForm');
    const messageContainer = document.getElementById('message-container');

    // Handle submit event for registration form - Xử lý sự kiện submit của form đăng ký
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from auto-submitting to handle with JavaScript - Ngăn form tự động gửi để xử lý bằng JavaScript

        // Get and clean data from input fields - Lấy dữ liệu từ các trường nhập liệu và làm sạch dữ liệu
        const lastname = document.getElementById('lastname').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const terms = document.getElementById('terms').checked;

        // === INPUT VALIDATION SECTION - PHẦN KIỂM TRA DỮ LIỆU ĐẦU VÀO ===

        // Check last name - Kiểm tra họ và tên đệm
        if (!lastname) {
            showMessage('Họ và tên đệm không được để trống', 'error');
            return;
        }

        // Check first name - Kiểm tra tên
        if (!firstname) {
            showMessage('Tên không được để trống', 'error');
            return;
        }

        // Check email - Kiểm tra email
        if (!email) {
            showMessage('Email không được để trống', 'error');
            return;
        }

        // Validate email format using regex - Kiểm tra định dạng email hợp lệ bằng biểu thức chính quy
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Email phải đúng định dạng', 'error');
            return;
        }

        // Check password - Kiểm tra mật khẩu
        if (!password) {
            showMessage('Mật khẩu không được để trống', 'error');
            return;
        }

        // Check password length (minimum 8 characters) - Kiểm tra độ dài mật khẩu (tối thiểu 8 ký tự)
        if (password.length < 8) {
            showMessage('Mật khẩu tối thiểu 8 ký tự', 'error');
            return;
        }

        // Check confirm password - Kiểm tra xác nhận mật khẩu
        if (!confirmPassword) {
            showMessage('Mật khẩu xác nhận không được để trống', 'error');
            return;
        }

        // Check if passwords match - Kiểm tra khớp mật khẩu
        if (password !== confirmPassword) {
            showMessage('Mật khẩu không trùng khớp', 'error');
            return;
        }

        // Check if terms are agreed - Kiểm tra người dùng đã đồng ý với điều khoản chưa
        if (!terms) {
            showMessage('Bạn cần đồng ý với chính sách và điều khoản', 'error');
            return;
        }

        // Check for duplicate user - Kiểm tra trùng lặp người dùng

        // Get registered users from localStorage - Lấy danh sách người dùng đã đăng ký từ localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if email already exists - Kiểm tra xem email đã tồn tại trong hệ thống chưa
        if (users.some(user => user.email === email)) {
            showMessage('Email đã được sử dụng', 'error');
            return;
        }

        // === SAVE NEW USER INFO SECTION - PHẦN LƯU THÔNG TIN NGƯỜI DÙNG MỚI ===

        // Create new user object with form data - Tạo đối tượng người dùng mới với thông tin từ form
        const user = {
            lastname,              // Last name - Họ và tên đệm
            firstname,             // First name - Tên
            email,                 // Email (used as ID) - Email (dùng làm ID)
            password,              // Password (should be hashed) - Mật khẩu (nên được mã hóa)
            createdAt: new Date().toISOString() // Registration time - Thời điểm đăng ký
        };

        // Add new user to users array - Thêm người dùng mới vào mảng users
        users.push(user);

        // Save updated users array to localStorage - Lưu mảng users đã cập nhật vào localStorage
        localStorage.setItem('users', JSON.stringify(users));

        // Show registration success message - Hiển thị thông báo đăng ký thành công
        showMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');

        // Redirect to login page after registration - Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
        setTimeout(function () {
            window.location.href = './lognin.html?registered=true';
        }, 2000);
    });

    /**
     * Function to display messages to the user - Hàm hiển thị thông báo cho người dùng
     * @param {string} message - Content of the message to display - Nội dung thông báo cần hiển thị
     * @param {string} type - Type of message: 'success' or 'error' - Loại thông báo: 'success' hoặc 'error'
     */
    function showMessage(message, type) {
        // Set message content - Đặt nội dung thông báo
        messageContainer.textContent = message;

        // Set appropriate CSS class for message type - Đặt class CSS phù hợp với loại thông báo
        messageContainer.className = type === 'error' ? 'message-error' : 'message-success';

        // Display message container - Hiển thị container thông báo
        messageContainer.style.display = 'block';

        // Auto-hide error messages after 5 seconds - Tự động ẩn thông báo lỗi sau 5 giây
        if (type === 'error') {
            setTimeout(function () {
                messageContainer.style.display = 'none';
            }, 5000);
        }
    }
});