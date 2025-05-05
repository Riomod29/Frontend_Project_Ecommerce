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
                category: 'dienthoai',
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
                category: 'dienthoai',
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
                category: 'dienthoai',
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
                category: 'dienthoai',
                status: 'inactive',
                image: 'https://example.com/iphone14promax.jpg',
                description: 'Apple iPhone 14 Pro Max'
            },
            {
                id: 'SP005',
                name: 'Oppo X3',
                price: 2000000,
                quantity: 10,
                discount: 5,
                category: 'dienthoai',
                status: 'inactive',
                image: 'https://example.com/oppox3.jpg',
                description: 'Oppo X3 smartphone'
            },
            {
                id: 'SP006',
                name: 'Iphone 16',
                price: 20000000,
                quantity: 20,
                discount: 3,
                category: 'dienthoai',
                status: 'inactive',
                image: 'https://example.com/iphone16.jpg',
                description: 'Apple iPhone 16'
            },
            {
                id: 'SP007',
                name: 'Iphone 7 Plus',
                price: 4000000,
                quantity: 10,
                discount: 4,
                category: 'dienthoai',
                status: 'active',
                image: 'https://example.com/iphone7plus.jpg',
                description: 'Apple iPhone 7 Plus'
            },
            {
                id: 'SP008',
                name: 'Samsung S20 Ultra',
                price: 30000000,
                quantity: 15,
                discount: 2,
                category: 'dienthoai',
                status: 'inactive',
                image: 'https://example.com/samsungs20ultra.jpg',
                description: 'Samsung S20 Ultra'
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

    // Success notification elements
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
    let currentProductId = null;
    let productToDelete = null;
    let productNameToDelete = null;

    // Initialize the page - Khởi tạo trang
    displayProducts();
    setupEventListeners();

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

        // Category filter - Lọc theo danh mục
        document.querySelectorAll('#categoryDropdown a').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                categoryFilter = this.getAttribute('data-category');
                categoryFilterBtn.textContent = this.textContent + ' ';
                categoryFilterBtn.innerHTML += '<i class="fa fa-chevron-down"></i>';
                currentPage = 1;
                displayProducts();
            });
        });

        // Status filter - Lọc theo trạng thái
        document.querySelectorAll('#statusDropdown a').forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                statusFilter = this.getAttribute('data-status');
                statusFilterBtn.textContent = this.textContent + ' ';
                statusFilterBtn.innerHTML += '<i class="fa fa-chevron-down"></i>';
                currentPage = 1;
                displayProducts();
            });
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
    }

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

            return matchesSearch && matchesCategory && matchesStatus;
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
                    <button class="action-btn delete-product" data-id="${product.id}" data-name="${product.name}">
                        <i class="fas fa-trash delete-icon"></i>
                    </button>
                    <button class="action-btn edit-product" data-id="${product.id}">
                        <i class="fas fa-edit edit-icon"></i>
                    </button>
                </td>
            `;

            productTableBody.appendChild(row);
        });

        // Add event listeners to edit and delete buttons - Thêm sự kiện cho nút sửa và xóa
        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', function () {
                const productId = this.getAttribute('data-id');
                editProduct(productId);
            });
        });

        document.querySelectorAll('.delete-product').forEach(btn => {
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

    function openProductModal(isEdit = false) {
        resetForm();
        modalTitle.textContent = isEdit ? 'Cập nhật sản phẩm' : 'Thêm mới sản phẩm';
        saveProductBtn.textContent = isEdit ? 'Lưu' : 'Thêm';
        productModal.style.display = 'block';
    }

    function editProduct(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        currentProductId = productId;

        // Fill form with product data - Điền thông tin sản phẩm vào form
        productCode.value = product.id;
        productCode.disabled = true; // Disable editing product code - Vô hiệu hóa chỉnh sửa mã sản phẩm
        productName.value = product.name;
        productCategory.value = product.category || 'dienthoai';
        productQuantity.value = product.quantity;
        productPrice.value = product.price;
        productDiscount.value = product.discount;
        productImage.value = product.image || '';
        productDescription.value = product.description || '';

        // Set status radio button - Thiết lập trạng thái radio button
        const statusRadios = document.getElementsByName('productStatus');
        for (let radio of statusRadios) {
            if (radio.value === product.status) {
                radio.checked = true;
                break;
            }
        }

        openProductModal(true);
    }

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

        if (currentProductId) {
            // Update existing product - Cập nhật sản phẩm hiện có
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
        } else {
            // Check if product ID already exists - Kiểm tra ID sản phẩm đã tồn tại
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

    function deleteProduct(productId) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }

    // Function to show success notification
    function showSuccessNotification(message) {
        successMessage.textContent = message;
        successNotification.style.display = 'block';
        successNotification.classList.add('fadeIn');

        // Auto hide after 3 seconds
        setTimeout(() => {
            hideSuccessNotification();
        }, 3000);
    }

    // Function to hide success notification
    function hideSuccessNotification() {
        successNotification.classList.remove('fadeIn');
        successNotification.classList.add('fadeOut');

        setTimeout(() => {
            successNotification.style.display = 'none';
            successNotification.classList.remove('fadeOut');
        }, 300);
    }

    function resetForm() {
        productForm.reset();
        productCode.disabled = false;
        currentProductId = null;

        // Reset error messages - Đặt lại thông báo lỗi
        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' đ';
    }

    // Functions for price input buttons - Các hàm cho nút nhập giá
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