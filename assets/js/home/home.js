document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra người dùng đã đăng nhập chưa
    checkUserLogin();

    // Banner Animation
    // Dữ liệu cho banner quảng cáo chính - mỗi đối tượng chứa thông tin cho một slide
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

    // Biến theo dõi slide hiện tại của banner chính
    let currentBannerIndex = 0;
    // Lấy tham chiếu đến các phần tử DOM của banner
    const bannerContent = document.querySelector('.banner-content');
    const bannerImage = document.querySelector('.banner-image img');
    const bannerDots = document.querySelectorAll('.banner-nav-dot');
    const prevBtn = document.querySelector('.banner-arrow.prev');
    const nextBtn = document.querySelector('.banner-arrow.next');
    const bannerElement = document.querySelector('.banner');

    // Khởi tạo trạng thái hiển thị các nút điều hướng banner
    updateBannerDots();

    // Thiết lập sự kiện click cho nút điều hướng trước/sau
    prevBtn.addEventListener('click', () => {
        navigateBanner(-1);
    });

    nextBtn.addEventListener('click', () => {
        navigateBanner(1);
    });

    // Thiết lập sự kiện click cho các nút indicator (chấm tròn) ở dưới banner
    bannerDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentBannerIndex = index;
            updateBanner();
            updateBannerDots();
        });
    });

    // Tự động chuyển slide banner mỗi 5 giây
    // Sử dụng setInterval để tạo hiệu ứng slideshow tự động
    let bannerInterval = setInterval(() => {
        navigateBanner(1);
    }, 5000);

    // Dừng tự động chuyển slide khi người dùng di chuột vào banner
    // Cải thiện UX bằng cách cho phép người dùng xem slide hiện tại mà không bị gián đoạn
    bannerElement.addEventListener('mouseenter', () => {
        clearInterval(bannerInterval);
    });

    // Tiếp tục tự động chuyển slide khi người dùng di chuột ra khỏi banner
    bannerElement.addEventListener('mouseleave', () => {
        bannerInterval = setInterval(() => {
            navigateBanner(1);
        }, 5000);
    });

    // Biến theo dõi hướng animation để có hiệu ứng phù hợp
    let animationDirection = 'right';

    /**
     * Hàm điều hướng giữa các slide của banner
     * @param {number} direction - Hướng di chuyển: 1 để tiến, -1 để lùi
     */
    function navigateBanner(direction) {
        // Cập nhật hướng animation dựa trên hướng điều hướng
        animationDirection = direction > 0 ? 'right' : 'left';

        // Tính toán index mới với xử lý vòng lặp (nếu đang ở slide cuối mà tiến tiếp sẽ về slide đầu)
        // Sử dụng phép toán modulo với bannerData.length để đảm bảo index luôn trong phạm vi hợp lệ
        currentBannerIndex = (currentBannerIndex + direction + bannerData.length) % bannerData.length;
        updateBanner();
        updateBannerDots();
    }

    /**
     * Hàm cập nhật nội dung và animation của banner
     * Áp dụng hiệu ứng fade và slide để tạo chuyển động mượt mà
     */
    function updateBanner() {
        // Làm mờ nội dung hiện tại trước khi thay đổi
        bannerContent.style.opacity = 0;
        bannerImage.style.opacity = 0;

        // Sử dụng setTimeout để tạo độ trễ trước khi cập nhật nội dung mới
        // Điều này tạo ra hiệu ứng fade in/out mượt mà
        setTimeout(() => {
            // Cập nhật nội dung từ dữ liệu banner
            const currentBanner = bannerData[currentBannerIndex];
            bannerContent.innerHTML = `
                <h3>${currentBanner.tagline}</h3>
                <h1>${currentBanner.title}</h1>
                <p>${currentBanner.description}</p>
                <button class="btn-buy">Mua ngay</button>
            `;
            bannerImage.src = currentBanner.image;

            // Đặt lại (reset) animation cho các phần tử nội dung
            // Lấy tất cả các phần tử con trong banner content để áp dụng animation riêng biệt
            const elements = [
                bannerContent.querySelector('h3'),
                bannerContent.querySelector('h1'),
                bannerContent.querySelector('p'),
                bannerContent.querySelector('.btn-buy')
            ];

            // Reset animation cho từng phần tử
            elements.forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Trigger reflow để đảm bảo animation được reset hoàn toàn
                }
            });

            // Áp dụng animation mới dựa trên hướng điều hướng
            // Chọn kiểu animation phù hợp với hướng di chuyển để tạo hiệu ứng nhất quán
            const animationIn = animationDirection === 'right' ? 'slideInLeft' : 'slideInRight';

            // Áp dụng animation cho từng phần tử với độ trễ tăng dần
            // Tạo hiệu ứng các phần tử xuất hiện lần lượt thay vì cùng một lúc
            if (elements[0]) elements[0].style.animation = `${animationIn} 0.8s ease`;
            if (elements[1]) elements[1].style.animation = `${animationIn} 0.8s ease 0.2s both`;
            if (elements[2]) elements[2].style.animation = `${animationIn} 0.8s ease 0.4s both`;
            if (elements[3]) elements[3].style.animation = `${animationIn} 0.8s ease 0.6s both`;

            // Hiển thị nội dung mới sau khi đã áp dụng animation
            bannerContent.style.opacity = 1;
            bannerImage.style.opacity = 1;

            // Áp dụng animation khác cho hình ảnh dựa trên hướng
            const imageAnimation = animationDirection === 'right' ? 'zoomInFromRight' : 'zoomInFromLeft';
            bannerImage.style.animation = `${imageAnimation} 1s ease`;
        }, 300);
    }

    /**
     * Hàm cập nhật trạng thái active cho các nút điều hướng dạng chấm
     * Đánh dấu vị trí slide hiện tại trong giao diện
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

    // Phần Animation cho Banner Ưu Đãi Mùa Hè
    // Cơ chế tương tự như banner chính nhưng có một số hiệu ứng và thời gian khác biệt
    const saleSlides = document.querySelectorAll('.sale-slide');
    const saleNavDots = document.querySelectorAll('.sale-banner-nav-dot');
    const salePrevBtn = document.querySelector('.sale-banner-arrow.prev');
    const saleNextBtn = document.querySelector('.sale-banner-arrow.next');
    const summerSaleElement = document.querySelector('.summer-sale');

    let currentSaleIndex = 0;
    let animationSaleDirection = 'right';

    // Khởi tạo trạng thái hiển thị điểm chỉ mục cho banner khuyến mãi
    updateSaleDots();

    // Thiết lập sự kiện điều hướng cho banner khuyến mãi
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

    // Thiết lập sự kiện khi người dùng click vào các chấm chỉ mục
    saleNavDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSaleIndex = index;
            updateSaleBanner();
            updateSaleDots();
        });
    });

    // Tự động chuyển slide cho banner khuyến mãi mỗi 6 giây
    let saleInterval = setInterval(() => {
        navigateSale(1);
    }, 6000);

    // Dừng tự động chuyển slide khi người dùng tương tác - tương tự như banner chính
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
     * Hàm điều hướng giữa các slide của banner khuyến mãi
     * @param {number} direction - Hướng di chuyển (1: tiến, -1: lùi)
     */
    function navigateSale(direction) {
        animationSaleDirection = direction > 0 ? 'right' : 'left';
        currentSaleIndex = (currentSaleIndex + direction + saleSlides.length) % saleSlides.length;
        updateSaleBanner();
        updateSaleDots();
    }

    /**
     * Hàm cập nhật nội dung và animation cho banner khuyến mãi
     * Phức tạp hơn banner chính vì có nhiều phần tử con cần animation riêng biệt
     */
    function updateSaleBanner() {
        // Ẩn tất cả các slide trước khi hiển thị slide mới
        saleSlides.forEach(slide => {
            slide.classList.remove('active');

            // Reset animations cho tất cả hình ảnh và nội dung
            // Đảm bảo animation luôn chạy mới khi chuyển slide
            const images = slide.querySelectorAll('img');
            const content = slide.querySelector('.sale-content');

            if (content) {
                const contentElements = [
                    content.querySelector('h2'),
                    content.querySelector('p'),
                    content.querySelector('.btn-sale')
                ];

                // Reset animation cho từng phần tử nội dung
                contentElements.forEach(el => {
                    if (el) {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                    }
                });
            }

            // Reset animation cho tất cả hình ảnh
            images.forEach(img => {
                img.style.animation = 'none';
                img.offsetHeight; // Trigger reflow
            });
        });

        // Thêm độ trễ nhỏ trước khi hiển thị slide mới để tạo hiệu ứng mượt mà hơn
        setTimeout(() => {
            const currentSlide = saleSlides[currentSaleIndex];
            currentSlide.classList.add('active');

            // Áp dụng animation cho slide hiện tại với nhiều hiệu ứng phức tạp
            const images = currentSlide.querySelectorAll('img');
            // Phân biệt giữa các hình ảnh bên trái và bên phải để áp dụng animation khác nhau
            const leftImages = currentSlide.querySelectorAll('.summer-sale-img-left img');
            const rightImages = currentSlide.querySelectorAll('.summer-sale-img-right img');

            // Animation cho hình ảnh bên trái - xử lý khác nhau tùy thuộc vào hướng di chuyển
            leftImages.forEach((img, i) => {
                if (animationSaleDirection === 'right') {
                    // Hiệu ứng di chuyển từ trái vào khi di chuyển sang phải
                    img.style.animation = `saleItemFadeInLeft 0.8s ease-out forwards ${0.2 + i * 0.2}s`;
                } else {
                    // Hiệu ứng di chuyển từ trên xuống khi di chuyển sang trái  
                    img.style.animation = `saleItemFadeInDown 0.8s ease-out forwards ${0.2 + i * 0.2}s`;
                }
            });

            // Animation cho hình ảnh bên phải
            rightImages.forEach((img, i) => {
                if (animationSaleDirection === 'right') {
                    // Hiệu ứng di chuyển từ dưới lên khi di chuyển sang phải
                    img.style.animation = `saleItemFadeInUp 0.8s ease-out forwards ${0.3 + i * 0.2}s`;
                } else {
                    // Hiệu ứng di chuyển từ phải vào khi di chuyển sang trái
                    img.style.animation = `saleItemFadeInRight 0.8s ease-out forwards ${0.3 + i * 0.2}s`;
                }
            });

            // Animation cho phần nội dung - hiển thị lần lượt từng phần tử
            const content = currentSlide.querySelector('.sale-content');
            if (content) {
                const h2 = content.querySelector('h2');
                const p = content.querySelector('p');
                const button = content.querySelector('.btn-sale');

                // Áp dụng animation với độ trễ khác nhau để tạo hiệu ứng tuần tự
                if (h2) h2.style.animation = 'saleContentFadeIn 0.8s ease-out forwards 0.2s';
                if (p) p.style.animation = 'saleContentFadeIn 0.8s ease-out forwards 0.4s';
                if (button) button.style.animation = 'saleButtonFadeIn 0.8s ease-out forwards 0.6s';
            }
        }, 100);
    }

    /**
     * Hàm cập nhật trạng thái active cho các nút điều hướng banner khuyến mãi
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

    // Thêm chức năng để cuộn đến footer khi nhấp vào liên kết "Liên hệ"
    const contactLink = document.querySelector('.main-nav a:nth-child(3)');
    const footer = document.querySelector('.footer');

    contactLink.addEventListener('click', function (e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
        footer.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt xuống footer
    });
});

/**
 * Kiểm tra trạng thái đăng nhập và hiển thị thông tin người dùng
 * Hàm này xử lý việc hiển thị tên người dùng sau khi đăng nhập và tạo menu dropdown
 */
function checkUserLogin() {
    const userIcon = document.getElementById('user-icon');
    const userName = document.getElementById('user-name');

    if (!userIcon || !userName) return; // Đảm bảo các phần tử tồn tại trong DOM

    // Kiểm tra thông tin đăng nhập trong sessionStorage (người dùng hiện tại đang đăng nhập)
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser && currentUser.isLoggedIn) {
        // Hiển thị tên người dùng đã đăng nhập trên giao diện
        userName.textContent = currentUser.firstname;

        // Thay đổi link để chuyển sang trang cá nhân thay vì trang đăng nhập
        userIcon.href = "#"; // Có thể thay đổi thành đường dẫn đến trang cá nhân

        // Thêm dropdown menu cho người dùng đã đăng nhập khi click vào biểu tượng
        userIcon.addEventListener('click', function (e) {
            e.preventDefault();

            // Kiểm tra và tạo menu dropdown nếu chưa tồn tại
            let dropdownMenu = document.getElementById('user-dropdown');

            if (!dropdownMenu) {
                // Tạo mới dropdown menu với các lựa chọn cho người dùng đã đăng nhập
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
                // Thêm CSS động cho dropdown menu
                // Phương pháp này cho phép thêm style mà không cần sửa file CSS chính
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

                // Thêm dropdown menu vào DOM
                userIcon.parentNode.appendChild(dropdownMenu);

                // Xử lý sự kiện đăng xuất khi người dùng click vào nút đăng xuất
                document.getElementById('logout-btn').addEventListener('click', function (e) {
                    e.preventDefault();

                    // Hiển thị thông báo xác nhận đăng xuất
                    showLogoutConfirmation();
                });

                // Thêm sự kiện đóng dropdown khi click ra ngoài
                // Cải thiện UX bằng cách tự động đóng menu khi không cần thiết
                document.addEventListener('click', function (event) {
                    if (!userIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
                        dropdownMenu.remove();
                    }
                });
            } else {
                // Nếu menu đã tồn tại, xóa nó đi (đóng menu)
                dropdownMenu.remove();
            }
        });
    } else {
        // Kiểm tra nếu có user được lưu trong localStorage (remember me)
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));

        if (rememberedUser) {
            // Tự động đăng nhập từ remember me - khôi phục phiên đăng nhập
            sessionStorage.setItem('currentUser', JSON.stringify(rememberedUser));
            userName.textContent = rememberedUser.firstname;
            userIcon.href = "#";

            // Tải lại trang để áp dụng trạng thái đăng nhập
            window.location.reload();
        }
    }
}

// Hiển thị modal xác nhận đăng xuất
function showLogoutConfirmation() {
    const modal = document.getElementById('logout-modal');
    if (!modal) return;
    modal.style.display = 'flex';
    // Xử lý nút Hủy
    document.getElementById('cancel-logout').onclick = function () {
        modal.style.display = 'none';
    };
    // Xử lý nút Đăng xuất
    document.getElementById('confirm-logout').onclick = function () {
        // Xóa thông tin đăng nhập
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        window.location.href = '../../pages/auth/lognin.html';
    };
    // Đóng modal khi click ra ngoài
    modal.onclick = function (e) {
        if (e.target === modal) modal.style.display = 'none';
    };
}