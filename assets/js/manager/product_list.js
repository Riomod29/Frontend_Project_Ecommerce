// Product list management logic - Quản lý danh sách sản phẩm

/**
 * File: product_list.js - Quản lý danh sách sản phẩm
 * Description: Handle product CRUD, filtering, pagination, and UI events - Xử lý thêm/sửa/xóa sản phẩm, lọc, phân trang và sự kiện giao diện
 */

// Wait for DOM to load - Chờ DOM tải xong
document.addEventListener('DOMContentLoaded', function () {
    // Initialize products if not exists - Khởi tạo sản phẩm nếu chưa tồn tại
    if (!localStorage.getItem('products')) {
        // Initial sample data exactly as shown in images - Dữ liệu mẫu ban đầu như trong hình ảnh
        const initialProducts = [
            {
                id: 'SP001',
                name: 'Iphone 12 Pro',
                price: 12000000,
                quantity: 10,
                discount: 0,
                category: 'DM001',
                status: 'active',
                image: 'https://example.com/iphone12pro.jpg',
                description: 'Apple iPhone 12 Pro'
            },
            {
                id: 'SP002',
                name: 'Samsung Galaxy X20',
                price: 21000000,
                quantity: 100,
                discount: 5,
                category: 'DM001',
                status: 'inactive',
                image: 'https://example.com/samsungx20.jpg',
                description: 'Samsung Galaxy X20'
            },
            {
                id: 'SP003',
                name: 'Phone 8 Plus',
                price: 5000000,
                quantity: 10,
                discount: 0,
                category: 'DM001',
                status: 'active',
                image: 'https://example.com/phone8plus.jpg',
                description: 'Phone 8 Plus'
            },
            {
                id: 'SP004',
                name: 'Iphone 14 Pro max',
                price: 25000000,
                quantity: 20,
                discount: 2,
                category: 'DM001',
                status: 'inactive',
                image: 'https://example.com/iphone14promax.jpg',
                description: 'Apple iPhone 14 Pro Max'
            }
        ];
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    // DOM Elements - Các phần tử DOM
    const productTableBody = document.getElementById('productTableBody');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryFilterBtn = document.getElementById('categoryFilterBtn');
    const statusFilterBtn = document.getElementById('statusFilterBtn');
    const addProductBtn = document.getElementById('addProductBtn');

    // Modal elements - Các phần tử modal
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.getElementById('closeModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const modalTitle = document.getElementById('modalTitle');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const productToDeleteSpan = document.getElementById('productToDelete');

    // Success notification elements - Các phần tử thông báo thành công
    const successNotification = document.getElementById('successNotification');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Form elements - Các phần tử form
    const productForm = document.getElementById('productForm');
    const productCode = document.getElementById('productCode');
    const productName = document.getElementById('productName');
    const productCategory = document.getElementById('productCategory');
    const productQuantity = document.getElementById('productQuantity');
    const productPrice = document.getElementById('productPrice');
    const productDiscount = document.getElementById('productDiscount');
    const productImage = document.getElementById('productImage');
    const productDescription = document.getElementById('productDescription');

    // Variables - Các biến
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let currentPage = 1;
    const productsPerPage = 8;
    let categoryFilter = 'all';
    let statusFilter = 'all';
    let priceRangeFilter = { min: null, max: null }; // Thêm biến lọc khoảng giá
    let sortField = 'name'; // 'name' | 'createdAt' | 'price'
    let sortDirection = 'asc'; // 'asc' | 'desc'
    let currentProductId = null;
    let productToDelete = null;
    let productNameToDelete = null;

    // Initialize the page - Khởi tạo trang
    displayProducts();
    setupEventListeners();
    renderCategoryFilterOptions();

    // Set up all event listeners - Thiết lập tất cả các sự kiện
    function setupEventListeners() {
        // Search - Tìm kiếm
        searchBtn.addEventListener('click', function () {
            displayProducts();
        });

        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                displayProducts();
            }
        });

        // Lọc theo trạng thái
        document.getElementById('statusFilterSelect').addEventListener('change', function () {
            statusFilter = this.value;
            currentPage = 1;
            displayProducts();
        });

        // Add product button - Nút thêm sản phẩm
        addProductBtn.addEventListener('click', function () {
            openProductModal();
        });

        // Close product modal - Đóng modal sản phẩm
        closeModal.addEventListener('click', function () {
            productModal.style.display = 'none';
        });

        // Close delete modal - Đóng modal xóa
        closeDeleteModal.addEventListener('click', function () {
            deleteModal.style.display = 'none';
        });

        // Save product - Lưu sản phẩm
        saveProductBtn.addEventListener('click', function () {
            saveProduct();
        });

        // Cancel button in product modal - Nút hủy trong modal sản phẩm
        cancelBtn.addEventListener('click', function () {
            productModal.style.display = 'none';
        });

        // Confirm delete - Xác nhận xóa
        confirmDeleteBtn.addEventListener('click', function () {
            if (productToDelete) {
                deleteProduct(productToDelete);

                // Show success notification
                showSuccessNotification('Xóa sản phẩm thành công');
            }
            deleteModal.style.display = 'none';
        });

        // Cancel delete - Hủy xóa
        cancelDeleteBtn.addEventListener('click', function () {
            deleteModal.style.display = 'none';
        });

        // Close success notification
        closeSuccessBtn.addEventListener('click', function () {
            hideSuccessNotification();
        });

        // Close modals when clicking outside - Đóng modal khi nhấp bên ngoài
        window.addEventListener('click', function (event) {
            if (event.target === productModal) {
                productModal.style.display = 'none';
            }
            if (event.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });

        // Lọc sản phẩm theo danh mục khi thay đổi select
        const categoryFilterSelect = document.getElementById('categoryFilterSelect');
        if (categoryFilterSelect) {
            categoryFilterSelect.addEventListener('change', function () {
                categoryFilter = this.value;
                currentPage = 1;
                displayProducts();
            });
        }

        // Lọc sản phẩm theo khoảng giá
        const minPriceInput = document.getElementById('minPrice');
        const maxPriceInput = document.getElementById('maxPrice');
        if (minPriceInput && maxPriceInput) {
            minPriceInput.addEventListener('change', function () {
                priceRangeFilter.min = parseInt(this.value) || null;
                displayProducts();
            });
            maxPriceInput.addEventListener('change', function () {
                priceRangeFilter.max = parseInt(this.value) || null;
                displayProducts();
            });
        }

        // Sắp xếp sản phẩm
        const sortSelect = document.getElementById('sortProduct');
        if (sortSelect) {
            sortSelect.addEventListener('change', function () {
                const [field, dir] = this.value.split('-');
                sortField = field;
                sortDirection = dir;
                displayProducts();
            });
        }
    }

    // Display products in table - Hiển thị sản phẩm trong bảng
    function displayProducts() {
        // Get search value - Lấy giá trị tìm kiếm
        const searchValue = searchInput.value.toLowerCase();

        // Filter products - Lọc sản phẩm
        let filteredProducts = products.filter(product => {
            // Search filter - Lọc theo từ khóa tìm kiếm
            const matchesSearch = searchValue === '' ||
                product.name.toLowerCase().includes(searchValue) ||
                product.id.toLowerCase().includes(searchValue);

            // Category filter - Lọc theo danh mục
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

            // Status filter - Lọc theo trạng thái
            const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

            // Price range filter - Lọc theo khoảng giá
            let matchesPrice = true;
            if (priceRangeFilter.min !== null) matchesPrice = product.price >= priceRangeFilter.min;
            if (matchesPrice && priceRangeFilter.max !== null) matchesPrice = product.price <= priceRangeFilter.max;

            return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
        });

        // Sort products - Sắp xếp sản phẩm
        filteredProducts.sort((a, b) => {
            let vA = a[sortField], vB = b[sortField];
            if (sortField === 'name') {
                vA = vA.toLowerCase(); vB = vB.toLowerCase();
            }
            if (sortDirection === 'asc') return vA > vB ? 1 : -1;
            return vA < vB ? 1 : -1;
        });

        // Calculate pagination - Tính toán phân trang
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

        // Clear the table - Xóa bảng
        productTableBody.innerHTML = '';

        // Add products to the table - Thêm sản phẩm vào bảng
        paginatedProducts.forEach(product => {
            const row = document.createElement('tr');

            const statusText = product.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động';
            const statusClass = product.status === 'active' ? 'active' : 'inactive';

            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.quantity}</td>
                <td>${product.discount}%</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <span class="icon-btn delete" data-id="${product.id}" data-name="${product.name}"></span>
                    <span class="icon-btn edit" data-id="${product.id}"></span>
                </td>
            `;

            productTableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons - Thêm sự kiện cho nút sửa và xóa
        document.querySelectorAll('.icon-btn.edit').forEach(btn => {
            btn.addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                editProduct(productId);
            });
        });

        document.querySelectorAll('.icon-btn.delete').forEach(btn => {
            btn.addEventListener('click', function () {
                productToDelete = this.getAttribute('data-id');
                productNameToDelete = this.getAttribute('data-name');

                // Set product name in delete confirmation modal
                productToDeleteSpan.textContent = productNameToDelete;

                deleteModal.style.display = 'block';
            });
        });

        // Update pagination - Cập nhật phân trang
        updatePagination(totalPages);
    }

    // Update pagination controls - Cập nhật điều khiển phân trang
    function updatePagination(totalPages) {
        pagination.innerHTML = '';

        // Previous button - Nút Previous
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&lt;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                displayProducts();
            }
        });
        pagination.appendChild(prevBtn);

        // Page numbers - Số trang
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) {
                pageBtn.className = 'active';
            }
            pageBtn.addEventListener('click', function () {
                currentPage = i;
                displayProducts();
            });
            pagination.appendChild(pageBtn);

            // Show ellipsis if there are many pages - Hiển thị dấu ... nếu có nhiều trang
            if (totalPages > 7 && i === 3 && currentPage > 5) {
                const ellipsis = document.createElement('button');
                ellipsis.textContent = '...';
                ellipsis.disabled = true;
                pagination.appendChild(ellipsis);
                i = totalPages - 3; // Skip to last few pages - Nhảy đến vài trang cuối cùng
            }
        }

        // Next button - Nút Next
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&gt;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', function () {
            if (currentPage < totalPages) {
                currentPage++;
                displayProducts();
            }
        });
        pagination.appendChild(nextBtn);
    }

    // Load category options for form - Tải danh mục cho form
    function loadCategoryOptions() {
        const select = document.getElementById('productCategory');
        if (!select) return;
        // Xóa các option cũ
        select.innerHTML = '';
        // Lấy danh sách danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        if (categories.length === 0) {
            select.innerHTML = '<option value="">Chưa có danh mục</option>';
            return;
        }
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.code;
            option.textContent = cat.name + ' (' + cat.code + ')';
            select.appendChild(option);
        });
    }

    // Render category filter options - Hiển thị bộ lọc danh mục
    function renderCategoryFilterOptions() {
        const select = document.getElementById('categoryFilterSelect');
        if (!select) return;
        // Lưu lại lựa chọn hiện tại
        const currentValue = select.value;
        // Xóa các option cũ (giữ lại option 'Tất cả')
        select.innerHTML = '<option value="all">Tất cả</option>';
        // Lấy danh sách danh mục từ localStorage
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.code;
            option.textContent = cat.name + ' (' + cat.code + ')';
            select.appendChild(option);
        });
        // Khôi phục lựa chọn nếu có
        if ([...select.options].some(opt => opt.value === currentValue)) {
            select.value = currentValue;
        }
    }

    // Open product modal for add/edit - Mở modal sản phẩm để thêm/sửa
    function openProductModal(isEdit = false) {
        resetForm();
        loadCategoryOptions(); // <-- Thêm dòng này
        modalTitle.textContent = isEdit ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm';
        saveProductBtn.textContent = isEdit ? 'Lưu' : 'Thêm';
        productModal.style.display = 'block';
    }

    // Edit product - Sửa sản phẩm
    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        currentProductId = productId;
        openProductModal(true); // Gọi trước để reset và load danh mục
        // Sau đó set lại giá trị cho các trường
        productCode.value = product.id;
        productCode.disabled = false;
        productName.value = product.name;
        productCategory.value = product.category || '';
        productQuantity.value = product.quantity;
        productPrice.value = product.price;
        productDiscount.value = product.discount;
        productImage.value = product.image || '';
        productDescription.value = product.description || '';
        // Set status radio button
        const statusRadios = document.getElementsByName('productStatus');
        for (let radio of statusRadios) {
            radio.checked = (radio.value === product.status);
        }
    }

    // Save product (add or update) - Lưu sản phẩm (thêm hoặc cập nhật)
    function saveProduct() {
        // Hide error messages - Ẩn thông báo lỗi
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });

        // Validate form - Kiểm tra form
        let isValid = true;

        if (!productCode.value.trim()) {
            document.getElementById('codeError').style.display = 'block';
            isValid = false;
        }

        if (!productName.value.trim()) {
            document.getElementById('nameError').style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        // Get form values - Lấy giá trị từ form
        const id = productCode.value.trim();
        const name = productName.value.trim();
        const category = productCategory.value;
        const quantity = parseInt(productQuantity.value);
        const price = parseInt(productPrice.value.replace(/[^\d]/g, ''));
        const discount = parseInt(productDiscount.value) || 0;
        const image = productImage.value.trim();
        const description = productDescription.value.trim();
        const status = document.querySelector('input[name="productStatus"]:checked').value;

        // Kiểm tra tên sản phẩm không được phép trùng
        if (products.some(p => p.name.trim().toLowerCase() === name.toLowerCase() && (!currentProductId || p.id !== currentProductId))) {
            alert('Tên sản phẩm đã tồn tại!');
            return;
        }

        // Kiểm tra số lượng tồn kho là số nguyên dương
        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert('Số lượng tồn kho phải là số nguyên dương!');
            return;
        }

        // Kiểm tra giá sản phẩm phải là số và lớn hơn 0
        if (isNaN(price) || price <= 0) {
            alert('Giá sản phẩm phải là số và lớn hơn 0!');
            return;
        }

        // Kiểm tra định dạng hình ảnh (JPG, PNG, WebP)
        if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(image)) {
            alert('Hình ảnh sản phẩm phải đúng định dạng JPG, PNG hoặc WebP!');
            return;
        }

        if (currentProductId) {
            // Nếu đổi mã thì mới kiểm tra trùng mã
            if (id !== currentProductId && products.some(p => p.id === id)) {
                alert('Mã sản phẩm đã tồn tại!');
                return;
            }
            const index = products.findIndex(p => p.id === currentProductId);
            if (index !== -1) {
                products[index] = {
                    id,
                    name,
                    category,
                    quantity,
                    price,
                    discount,
                    image,
                    description,
                    status
                };
            }
            // Nếu đổi mã, cập nhật lại currentProductId để lần sau sửa tiếp không bị lỗi
            currentProductId = id;
        } else {
            // Thêm mới thì luôn kiểm tra trùng mã
            if (products.some(p => p.id === id)) {
                alert('Mã sản phẩm đã tồn tại!');
                return;
            }

            // Add new product - Thêm sản phẩm mới
            products.push({
                id,
                name,
                category,
                quantity,
                price,
                discount,
                image,
                description,
                status
            });
        }

        // Update localStorage - Cập nhật localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Close modal and refresh display - Đóng modal và làm mới hiển thị
        productModal.style.display = 'none';
        displayProducts();
    }

    // Delete product - Xóa sản phẩm
    function deleteProduct(productId) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }

    // Show success notification - Hiển thị thông báo thành công
    function showSuccessNotification(message) {
        successMessage.textContent = message;
        successNotification.style.display = 'block';
        successNotification.classList.add('fadeIn');

        // Auto hide after 3 seconds
        setTimeout(() => {
            hideSuccessNotification();
        }, 3000);
    }

    // Hide success notification - Ẩn thông báo thành công
    function hideSuccessNotification() {
        successNotification.classList.remove('fadeIn');
        successNotification.classList.add('fadeOut');

        setTimeout(() => {
            successNotification.style.display = 'none';
            successNotification.classList.remove('fadeOut');
        }, 300);
    }

    // Reset form fields and errors - Đặt lại form và thông báo lỗi
    function resetForm() {
        productForm.reset();
        productCode.disabled = false;
        currentProductId = null;

        // Reset error messages - Đặt lại thông báo lỗi
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Format currency for display - Định dạng tiền tệ để hiển thị
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' đ';
    }

    // Price input button handlers - Xử lý nút tăng/giảm giá
    window.increasePrice = function () {
        const currentPrice = parseInt(productPrice.value.replace(/[^\d]/g, '')) || 0;
        productPrice.value = (currentPrice + 100000).toString();
    };

    window.decreasePrice = function () {
        const currentPrice = parseInt(productPrice.value.replace(/[^\d]/g, '')) || 0;
        if (currentPrice >= 100000) {
            productPrice.value = (currentPrice - 100000).toString();
        }
    };
});