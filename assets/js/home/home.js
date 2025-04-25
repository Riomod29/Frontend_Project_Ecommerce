// Banner Animation
document.addEventListener('DOMContentLoaded', function () {
    // Banner data for different products
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

    let currentBannerIndex = 0;
    const bannerContent = document.querySelector('.banner-content');
    const bannerImage = document.querySelector('.banner-image img');
    const bannerDots = document.querySelectorAll('.banner-nav-dot');
    const prevBtn = document.querySelector('.banner-arrow.prev');
    const nextBtn = document.querySelector('.banner-arrow.next');
    const bannerElement = document.querySelector('.banner');

    // Initialize banner navigation dots
    updateBannerDots();

    // Set up event listeners for navigation
    prevBtn.addEventListener('click', () => {
        navigateBanner(-1);
    });

    nextBtn.addEventListener('click', () => {
        navigateBanner(1);
    });

    // Set up event listeners for dots
    bannerDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentBannerIndex = index;
            updateBanner();
            updateBannerDots();
        });
    });

    // Auto rotate banner every 5 seconds
    let bannerInterval = setInterval(() => {
        navigateBanner(1);
    }, 5000);

    // Stop auto rotation when user interacts with banner
    bannerElement.addEventListener('mouseenter', () => {
        clearInterval(bannerInterval);
    });

    bannerElement.addEventListener('mouseleave', () => {
        bannerInterval = setInterval(() => {
            navigateBanner(1);
        }, 5000);
    });

    // Animation direction state
    let animationDirection = 'right';

    // Function to navigate between banners
    function navigateBanner(direction) {
        // Update animation direction based on navigation direction
        animationDirection = direction > 0 ? 'right' : 'left';

        currentBannerIndex = (currentBannerIndex + direction + bannerData.length) % bannerData.length;
        updateBanner();
        updateBannerDots();
    }

    // Function to update banner content and animation
    function updateBanner() {
        // Fade out current content
        bannerContent.style.opacity = 0;
        bannerImage.style.opacity = 0;

        setTimeout(() => {
            // Update content
            const currentBanner = bannerData[currentBannerIndex];
            bannerContent.innerHTML = `
                <h3>${currentBanner.tagline}</h3>
                <h1>${currentBanner.title}</h1>
                <p>${currentBanner.description}</p>
                <button class="btn-buy">Mua ngay</button>
            `;
            bannerImage.src = currentBanner.image;

            // Reset animations
            const elements = [
                bannerContent.querySelector('h3'),
                bannerContent.querySelector('h1'),
                bannerContent.querySelector('p'),
                bannerContent.querySelector('.btn-buy')
            ];

            elements.forEach(el => {
                if (el) {
                    el.style.animation = 'none';
                    el.offsetHeight; // Trigger reflow
                }
            });

            // Apply animations with delays based on direction
            const animationIn = animationDirection === 'right' ? 'slideInLeft' : 'slideInRight';

            if (elements[0]) elements[0].style.animation = `${animationIn} 0.8s ease`;
            if (elements[1]) elements[1].style.animation = `${animationIn} 0.8s ease 0.2s both`;
            if (elements[2]) elements[2].style.animation = `${animationIn} 0.8s ease 0.4s both`;
            if (elements[3]) elements[3].style.animation = `${animationIn} 0.8s ease 0.6s both`;

            // Fade in new content
            bannerContent.style.opacity = 1;
            bannerImage.style.opacity = 1;

            // Apply different animation to image based on direction
            const imageAnimation = animationDirection === 'right' ? 'zoomInFromRight' : 'zoomInFromLeft';
            bannerImage.style.animation = `${imageAnimation} 1s ease`;
        }, 300);
    }

    // Function to update the active dot
    function updateBannerDots() {
        bannerDots.forEach((dot, index) => {
            if (index === currentBannerIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Summer Sale Banner Animation
    const saleSlides = document.querySelectorAll('.sale-slide');
    const saleNavDots = document.querySelectorAll('.sale-banner-nav-dot');
    const salePrevBtn = document.querySelector('.sale-banner-arrow.prev');
    const saleNextBtn = document.querySelector('.sale-banner-arrow.next');
    const summerSaleElement = document.querySelector('.summer-sale');

    let currentSaleIndex = 0;
    let animationSaleDirection = 'right';

    // Initialize sale banner
    updateSaleDots();

    // Set up event listeners for navigation
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

    // Set up event listeners for dots
    saleNavDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSaleIndex = index;
            updateSaleBanner();
            updateSaleDots();
        });
    });

    // Auto rotate sale banner every 6 seconds
    let saleInterval = setInterval(() => {
        navigateSale(1);
    }, 6000);

    // Stop auto rotation when user interacts with banner
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

    // Function to navigate between sale slides
    function navigateSale(direction) {
        animationSaleDirection = direction > 0 ? 'right' : 'left';
        currentSaleIndex = (currentSaleIndex + direction + saleSlides.length) % saleSlides.length;
        updateSaleBanner();
        updateSaleDots();
    }

    // Function to update sale banner and animations
    function updateSaleBanner() {
        // Hide all slides
        saleSlides.forEach(slide => {
            slide.classList.remove('active');

            // Reset animations for all images and content
            const images = slide.querySelectorAll('img');
            const content = slide.querySelector('.sale-content');

            if (content) {
                const contentElements = [
                    content.querySelector('h2'),
                    content.querySelector('p'),
                    content.querySelector('.btn-sale')
                ];

                contentElements.forEach(el => {
                    if (el) {
                        el.style.animation = 'none';
                        el.offsetHeight; // Trigger reflow
                    }
                });
            }

            images.forEach(img => {
                img.style.animation = 'none';
                img.offsetHeight; // Trigger reflow
            });
        });

        // Show current slide with animations
        setTimeout(() => {
            const currentSlide = saleSlides[currentSaleIndex];
            currentSlide.classList.add('active');

            // Apply animations to the active slide
            const images = currentSlide.querySelectorAll('img');
            const leftImages = currentSlide.querySelectorAll('.summer-sale-img-left img');
            const rightImages = currentSlide.querySelectorAll('.summer-sale-img-right img');

            leftImages.forEach((img, i) => {
                if (animationSaleDirection === 'right') {
                    img.style.animation = `saleItemFadeInLeft 0.8s ease-out forwards ${0.2 + i * 0.2}s`;
                } else {
                    img.style.animation = `saleItemFadeInDown 0.8s ease-out forwards ${0.2 + i * 0.2}s`;
                }
            });

            rightImages.forEach((img, i) => {
                if (animationSaleDirection === 'right') {
                    img.style.animation = `saleItemFadeInUp 0.8s ease-out forwards ${0.3 + i * 0.2}s`;
                } else {
                    img.style.animation = `saleItemFadeInRight 0.8s ease-out forwards ${0.3 + i * 0.2}s`;
                }
            });

            // Animate content
            const content = currentSlide.querySelector('.sale-content');
            if (content) {
                const h2 = content.querySelector('h2');
                const p = content.querySelector('p');
                const button = content.querySelector('.btn-sale');

                if (h2) h2.style.animation = 'saleContentFadeIn 0.8s ease-out forwards 0.2s';
                if (p) p.style.animation = 'saleContentFadeIn 0.8s ease-out forwards 0.4s';
                if (button) button.style.animation = 'saleButtonFadeIn 0.8s ease-out forwards 0.6s';
            }
        }, 100);
    }

    // Function to update the active sale dot
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
    const contactLink = document.querySelector('.main-nav a:nth-child(3)'); // Chọn liên kết "Liên hệ"
    const footer = document.querySelector('.footer');

    contactLink.addEventListener('click', function (e) {
        e.preventDefault(); // Ngăn chặn hành vi mặc định của liên kết
        footer.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt xuống footer
    });
});

// Other JS functionality can be added below