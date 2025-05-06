// Main script for Home page - Script chính cho trang Home

document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in - Kiểm tra người dùng đã đăng nhập chưa
    checkUserLogin();

    // Banner Animation - Hoạt ảnh cho banner
    // Data for main advertising banner - Dữ liệu cho banner quảng cáo chính
    const bannerData = [
        {
            title: "iPhone 14 <span>Pro</span>",
            tagline: "Đột phá công nghệ",
            description: "Được tạo ra để thay đổi mọi thứ để tốt hơn. Cho tất cả mọi người",
            image: "../../images/banner_header.png"
        },
        {
            title: "Galaxy Z <span>Fold5</span>",
            tagline: "Gập mở tương lai",
            description: "Chiếc điện thoại mở ra một tương lai mới với màn hình gập linh hoạt và hiệu năng vượt trội",
            image: "../../images/product/Galaxy Z Fold5 Unlocked.png"
        },
        {
            title: "Apple Watch <span>Series 9</span>",
            tagline: "Sức khỏe tiên tiến",
            description: "Theo dõi sức khỏe 24/7 với công nghệ mới nhất và thời lượng pin cả ngày",
            image: "../../images/product/Apple_Watch_Series_9.png"
        }
    ];

    // Variable to track current banner slide - Biến theo dõi slide hiện tại của banner chính
    let currentBannerIndex = 0;
    // Get references to banner DOM elements - Lấy tham chiếu đến các phần tử DOM của banner
    const bannerContent = document.querySelector('.banner-content');
    const bannerImage = document.querySelector('.banner-image img');
    const bannerDots = document.querySelectorAll('.banner-nav-dot');
    const prevBtn = document.querySelector('.banner-arrow.prev');
    const nextBtn = document.querySelector('.banner-arrow.next');
    const bannerElement = document.querySelector('.banner');

    // Initialize banner navigation buttons display state - Khởi tạo trạng thái hiển thị các nút điều hướng banner
    updateBannerDots();

    // Set up click events for previous/next buttons - Thiết lập sự kiện click cho nút điều hướng trước/sau
    prevBtn.addEventListener('click', () => {
        navigateBanner(-1);
    });

    nextBtn.addEventListener('click', () => {
        navigateBanner(1);
    });

    // Set up click events for indicator dots - Thiết lập sự kiện click cho các nút indicator (chấm tròn)
    bannerDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentBannerIndex = index;
            updateBanner();
            updateBannerDots();
        });
    });

    // Auto slide banner every 5 seconds - Tự động chuyển slide banner mỗi 5 giây
    let bannerInterval = setInterval(() => {
        navigateBanner(1);
    }, 5000);

    // Stop auto-sliding when user hovers over banner - Dừng tự động chuyển slide khi người dùng di chuột vào banner
    bannerElement.addEventListener('mouseenter', () => {
        clearInterval(bannerInterval);
    });

    // Resume auto-sliding when user moves mouse away - Tiếp tục tự động chuyển slide khi người dùng di chuột ra khỏi banner
    bannerElement.addEventListener('mouseleave', () => {
        bannerInterval = setInterval(() => {
            navigateBanner(1);
        }, 5000);
    });

    // Track animation direction for appropriate effect - Biến theo dõi hướng animation để có hiệu ứng phù hợp
    let animationDirection = 'right';

    /**
     * Navigate between banner slides - Hàm điều hướng giữa các slide của banner
     * @param {number} direction - Direction to move: 1 for next, -1 for previous - Hướng di chuyển: 1 để tiến, -1 để lùi
     */
    function navigateBanner(direction) {
        // Update animation direction based on navigation - Cập nhật hướng animation dựa trên hướng điều hướng
        animationDirection = direction > 0 ? 'right' : 'left';

        // Calculate new index with wraparound - Tính toán index mới với xử lý vòng lặp
        currentBannerIndex = (currentBannerIndex + direction + bannerData.length) % bannerData.length;
        updateBanner();
        updateBannerDots();
    }

    /**
     * Update banner content and animations - Hàm cập nhật nội dung và animation của banner
     */
    function updateBanner() {
        // Fade out current content before changing - Làm mờ nội dung hiện tại trước khi thay đổi
        bannerContent.style.opacity = 0;
        bannerImage.style.opacity = 0;

        // Use timeout to create a delay before updating content - Sử dụng setTimeout để tạo độ trễ trước khi cập nhật nội dung mới
        setTimeout(() => {
            // Update content from banner data - Cập nhật nội dung từ dữ liệu banner
            const currentBanner = bannerData[currentBannerIndex];
            bannerContent.innerHTML = `
                <h3>${currentBanner.tagline}</h3>
                <h1>${currentBanner.title}</h1>
                <p>${currentBanner.description}</p>
                <button class="btn-buy">Mua ngay</button>
            `;
            bannerImage.src = currentBanner.image;

            // Reset animations for content elements - Đặt lại (reset) animation cho các phần tử nội dung
            const elements = [
                bannerContent.querySelector('h3'),
                bannerContent.querySelector('h1'),
                bannerContent.querySelector('p'),
                bannerContent.querySelector('.btn-buy')
            ];

            // Reset animation for each element - Reset animation cho từng phần tử
            elements.forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Trigger reflow to ensure animation reset - Trigger reflow để đảm bảo animation được reset
                }
            });

            // Apply new animations based on direction - Áp dụng animation mới dựa trên hướng điều hướng
            const animationIn = animationDirection === 'right' ? 'slideInLeft' : 'slideInRight';

            // Apply animations with increasing delays - Áp dụng animation cho từng phần tử với độ trễ tăng dần
            if (elements[0]) elements[0].style.animation = `${animationIn} 0.8s ease`;
            if (elements[1]) elements[1].style.animation = `${animationIn} 0.8s ease 0.2s both`;
            if (elements[2]) elements[2].style.animation = `${animationIn} 0.8s ease 0.4s both`;
            if (elements[3]) elements[3].style.animation = `${animationIn} 0.8s ease 0.6s both`;

            // Show new content after applying animations - Hiển thị nội dung mới sau khi đã áp dụng animation
            bannerContent.style.opacity = 1;
            bannerImage.style.opacity = 1;

            // Apply different animation for image - Áp dụng animation khác cho hình ảnh
            const imageAnimation = animationDirection === 'right' ? 'zoomInFromRight' : 'zoomInFromLeft';
            bannerImage.style.animation = `${imageAnimation} 1s ease`;
        }, 300);
    }

    /**
     * Update active state for banner navigation dots - Hàm cập nhật trạng thái active cho các nút điều hướng dạng chấm
     */
    function updateBannerDots() {
        bannerDots.forEach((dot, index) => {
            if (index === currentBannerIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Animation for Summer Sale Banner - Phần Animation cho Banner Ưu Đãi Mùa Hè
    const saleSlides = document.querySelectorAll('.sale-slide');
    const saleNavDots = document.querySelectorAll('.sale-banner-nav-dot');
    const salePrevBtn = document.querySelector('.sale-banner-arrow.prev');
    const saleNextBtn = document.querySelector('.sale-banner-arrow.next');
    const summerSaleElement = document.querySelector('.summer-sale');

    let currentSaleIndex = 0;
    let animationSaleDirection = 'right';

    // Initialize sale banner navigation indicators - Khởi tạo trạng thái hiển thị điểm chỉ mục cho banner khuyến mãi
    updateSaleDots();

    // Set up navigation events for sale banner - Thiết lập sự kiện điều hướng cho banner khuyến mãi
    if (salePrevBtn) {
        salePrevBtn.addEventListener('click', () => {
            navigateSale(-1);
        });
    }

    if (saleNextBtn) {
        saleNextBtn.addEventListener('click', () => {
            navigateSale(1);
        });
    }

    // Set up click events for sale banner indicator dots - Thiết lập sự kiện khi người dùng click vào các chấm chỉ mục
    saleNavDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSaleIndex = index;
            updateSaleBanner();
            updateSaleDots();
        });
    });

    // Auto slide summer sale banner every 6 seconds - Tự động chuyển slide cho banner khuyến mãi mỗi 6 giây
    let saleInterval = setInterval(() => {
        navigateSale(1);
    }, 6000);

    // Pause auto-sliding on hover - Dừng tự động chuyển slide khi người dùng tương tác
    if (summerSaleElement) {
        summerSaleElement.addEventListener('mouseenter', () => {
            clearInterval(saleInterval);
        });

        summerSaleElement.addEventListener('mouseleave', () => {
            saleInterval = setInterval(() => {
                navigateSale(1);
            }, 6000);
        });
    }

    /**
     * Navigate between sale banner slides - Hàm điều hướng giữa các slide của banner khuyến mãi
     * @param {number} direction - Direction to move (1: next, -1: previous) - Hướng di chuyển (1: tiến, -1: lùi)
     */
    function navigateSale(direction) {
        animationSaleDirection = direction > 0 ? 'right' : 'left';
        currentSaleIndex = (currentSaleIndex + direction + saleSlides.length) % saleSlides.length;
        updateSaleBanner();
        updateSaleDots();
    }

    /**
     * Update content and animations for sale banner - Hàm cập nhật nội dung và animation cho banner khuyến mãi
     */
    function updateSaleBanner() {
        // Hide all slides before showing the new one - Ẩn tất cả các slide trước khi hiển thị slide mới
        saleSlides.forEach(slide => {
            slide.classList.remove('active');

            // Reset animations for all images and content - Reset animations cho tất cả hình ảnh và nội dung
            const images = slide.querySelectorAll('img');
            const content = slide.querySelector('.sale-content');

            if (content) {
                const contentElements = [
                    content.querySelector('h2'),
                    content.querySelector('p'),
                    content.querySelector('.btn-sale')
                ];

                // Reset animation for each content element - Reset animation cho từng phần tử nội dung
                contentElements.forEach(el => {
                    if (el) {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow - Trigger reflow
                    }
                });
            }

            // Reset animation for all images - Reset animation cho tất cả hình ảnh
            images.forEach(img => {
                img.style.animation = 'none';
                img.offsetHeight; // Trigger reflow - Trigger reflow
            });
        });

        // Add small delay before showing new slide - Thêm độ trễ nhỏ trước khi hiển thị slide mới
        setTimeout(() => {
            const currentSlide = saleSlides[currentSaleIndex];
            currentSlide.classList.add('active');

            // Apply animations to current slide - Áp dụng animation cho slide hiện tại
            const images = currentSlide.querySelectorAll('img');
            // Distinguish between left and right images - Phân biệt giữa các hình ảnh bên trái và bên phải
            const leftImages = currentSlide.querySelectorAll('.summer-sale-img-left img');
            const rightImages = currentSlide.querySelectorAll('.summer-sale-img-right img');

            // Animations for left images - Animation cho hình ảnh bên trái
            leftImages.forEach((img, i) => {
                if (animationSaleDirection === 'right') {
                    // Left-to-right movement gets left-entry animation - Hiệu ứng di chuyển từ trái vào khi di chuyển sang phải
                    img.style.animation = `saleItemFadeInLeft 0.8s ease-out forwards ${0.2 + i * 0.2}s`;
                } else {
                    // Right-to-left movement gets top-entry animation - Hiệu ứng di chuyển từ trên xuống khi di chuyển sang trái  
                    img.style.animation = `saleItemFadeInDown 0.8s ease-out forwards ${0.2 + i * 0.2}s`;
                }
            });

            // Animations for right images - Animation cho hình ảnh bên phải
            rightImages.forEach((img, i) => {
                if (animationSaleDirection === 'right') {
                    // Left-to-right movement gets bottom-entry animation - Hiệu ứng di chuyển từ dưới lên khi di chuyển sang phải
                    img.style.animation = `saleItemFadeInUp 0.8s ease-out forwards ${0.3 + i * 0.2}s`;
                } else {
                    // Right-to-left movement gets right-entry animation - Hiệu ứng di chuyển từ phải vào khi di chuyển sang trái
                    img.style.animation = `saleItemFadeInRight 0.8s ease-out forwards ${0.3 + i * 0.2}s`;
                }
            });

            // Animations for content with sequential display - Animation cho phần nội dung - hiển thị lần lượt từng phần tử
            const content = currentSlide.querySelector('.sale-content');
            if (content) {
                const h2 = content.querySelector('h2');
                const p = content.querySelector('p');
                const button = content.querySelector('.btn-sale');

                // Apply animations with different delays - Áp dụng animation với độ trễ khác nhau để tạo hiệu ứng tuần tự
                if (h2) h2.style.animation = 'saleContentFadeIn 0.8s ease-out forwards 0.2s';
                if (p) p.style.animation = 'saleContentFadeIn 0.8s ease-out forwards 0.4s';
                if (button) button.style.animation = 'saleButtonFadeIn 0.8s ease-out forwards 0.6s';
            }
        }, 100);
    }

    /**
     * Update active state for sale banner navigation dots - Hàm cập nhật trạng thái active cho các nút điều hướng banner khuyến mãi
     */
    function updateSaleDots() {
        saleNavDots.forEach((dot, index) => {
            if (index === currentSaleIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Add functionality to scroll to footer when "Contact" link is clicked - Thêm chức năng để cuộn đến footer khi nhấp vào liên kết "Liên hệ"
    const contactLink = document.querySelector('.main-nav a:nth-child(3)');
    const footer = document.querySelector('.footer');

    contactLink.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior - Ngăn chặn hành vi mặc định của liên kết
        footer.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to footer - Cuộn mượt xuống footer
    });
});

/**
 * Check login status and display user information - Kiểm tra trạng thái đăng nhập và hiển thị thông tin người dùng
 * This function handles displaying user name after login and creating dropdown menu - Hàm này xử lý việc hiển thị tên người dùng sau khi đăng nhập và tạo menu dropdown
 */
function checkUserLogin() {
    const userIcon = document.getElementById('user-icon');
    const userName = document.getElementById('user-name');

    if (!userIcon || !userName) return; // Ensure elements exist in the DOM - Đảm bảo các phần tử tồn tại trong DOM

    // Check login info in sessionStorage (currently logged in user) - Kiểm tra thông tin đăng nhập trong sessionStorage (người dùng hiện tại đang đăng nhập)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser && currentUser.isLoggedIn) {
        // Display the logged in user's name - Hiển thị tên người dùng đã đăng nhập trên giao diện
        userName.textContent = currentUser.firstname;

        // Change link to personal page instead of login - Thay đổi link để chuyển sang trang cá nhân thay vì trang đăng nhập
        userIcon.href = "#"; // Could be changed to profile page link - Có thể thay đổi thành đường dẫn đến trang cá nhân

        // Add dropdown menu for logged in users when icon is clicked - Thêm dropdown menu cho người dùng đã đăng nhập khi click vào biểu tượng
        userIcon.addEventListener('click', function (e) {
            e.preventDefault();

            // Check and create dropdown menu if it doesn't exist - Kiểm tra và tạo menu dropdown nếu chưa tồn tại
            let dropdownMenu = document.getElementById('user-dropdown');

            if (!dropdownMenu) {
                // Create new dropdown menu with options for logged in user - Tạo mới dropdown menu với các lựa chọn cho người dùng đã đăng nhập
                dropdownMenu = document.createElement('div');
                dropdownMenu.id = 'user-dropdown';
                dropdownMenu.className = 'user-dropdown';
                dropdownMenu.innerHTML = `
                    <ul>
                        <li><a href="#">Tài khoản của tôi</a></li>
                        <li><a href="#">Đơn hàng</a></li>
                        <li><a href="#">Admin</a></li>
                        <li><a href="#" id="logout-btn">Đăng xuất</a></li>
                    </ul>
                `;
                //../../pages/manager/product_manager.html = Admin
                // Add dynamic CSS for dropdown menu - Thêm CSS động cho dropdown menu
                // This method allows adding style without editing the main CSS file - Phương pháp này cho phép thêm style mà không cần sửa file CSS chính
                const style = document.createElement('style');
                style.textContent = `
                    .header-icons {
                        position: relative;
                    }
                    
                    #user-name {
                        margin-left: 5px;
                        font-weight: bold;
                    }
                    
                    .user-dropdown {
                        position: absolute;
                        top: 100%;
                        right: 0;
                        background: white;
                        border: 1px solid #eee;
                        border-radius: 4px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        display: block;
                        z-index: 100;
                        min-width: 150px;
                    }
                    
                    .user-dropdown ul {
                        list-style: none;
                        padding: 0;
                        margin: 0;
                    }
                    
                    .user-dropdown ul li {
                        padding: 0;
                    }
                    
                    .user-dropdown ul li a {
                        padding: 10px 15px;
                        display: block;
                        color: #333;
                        text-decoration: none;
                    }
                    
                    .user-dropdown ul li a:hover {
                        background-color: #f5f5f5;
                    }
                `;
                document.head.appendChild(style);

                // Add dropdown menu to DOM - Thêm dropdown menu vào DOM
                userIcon.parentNode.appendChild(dropdownMenu);

                // Handle logout event when user clicks logout button - Xử lý sự kiện đăng xuất khi người dùng click vào nút đăng xuất
                document.getElementById('logout-btn').addEventListener('click', function (e) {
                    e.preventDefault();

                    // Show logout confirmation modal - Hiển thị thông báo xác nhận đăng xuất
                    showLogoutConfirmation();
                });

                // Add event to close dropdown when clicking outside - Thêm sự kiện đóng dropdown khi click ra ngoài
                // Improve UX by automatically closing menu when not needed - Cải thiện UX bằng cách tự động đóng menu khi không cần thiết
                document.addEventListener('click', function (event) {
                    if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
                        dropdownMenu.remove();
                    }
                });
            } else {
                // If menu already exists, remove it (close menu) - Nếu menu đã tồn tại, xóa nó đi (đóng menu)
                dropdownMenu.remove();
            }
        });
    } else {
        // Check if there is a remembered user in localStorage - Kiểm tra nếu có user được lưu trong localStorage (remember me)
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));

        if (rememberedUser) {
            // Auto login from remember me - Tự động đăng nhập từ remember me - khôi phục phiên đăng nhập
            sessionStorage.setItem('currentUser', JSON.stringify(rememberedUser));
            userName.textContent = rememberedUser.firstname;
            userIcon.href = "#";

            // Reload page to apply login state - Tải lại trang để áp dụng trạng thái đăng nhập
            window.location.reload();
        }
    }
}

// Display logout confirmation modal - Hiển thị modal xác nhận đăng xuất
function showLogoutConfirmation() {
    const modal = document.getElementById('logout-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    // Handle Cancel button - Xử lý nút Hủy
    document.getElementById('cancel-logout').onclick = function () {
        modal.style.display = 'none';
    };
    // Handle Logout button - Xử lý nút Đăng xuất
    document.getElementById('confirm-logout').onclick = function () {
        // Clear login information - Xóa thông tin đăng nhập
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        window.location.href = '../../pages/auth/lognin.html';
    };
    // Close modal when clicking outside - Đóng modal khi click ra ngoài
    modal.onclick = function (e) {
        if (e.target === modal) modal.style.display = 'none';
    };
}