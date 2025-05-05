// Show/Hide add category modal - Hiển thị/ẩn modal thêm mới danh mục
const btnOpen = document.getElementById('btnOpenAddCategory');
const btnClose = document.getElementById('btnCloseAddCategory');
const modal = document.getElementById('modalAddCategory');
if (btnOpen && btnClose && modal) {
    btnOpen.onclick = () => modal.style.display = 'block';
    btnClose.onclick = () => modal.style.display = 'none';
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
}

// Logic for adding new category - Logic thêm mới danh mục
const form = document.getElementById('formAddCategory');
const btnCancel = document.getElementById('btnCancelAddCategory');
if (btnCancel && modal) {
    btnCancel.onclick = () => {
        modal.style.display = 'none';
        form.reset();
        clearFormError();
    };
}
if (form) {
    form.onsubmit = function (e) {
        e.preventDefault();
        clearFormError();
        const code = form.categoryCode.value.trim();
        const name = form.categoryName.value.trim();
        // Get status from radio button - Lấy trạng thái từ radio
        const status = form.querySelector('input[name="categoryStatus"]:checked')?.value || 'active';
        let valid = true;
        if (!code) {
            setError('categoryCode', 'Mã danh mục không được để trống');
            valid = false;
        }
        if (!name) {
            setError('categoryName', 'Tên danh mục không được để trống');
            valid = false;
        }
        if (!valid) return;
        let categories = JSON.parse(localStorage.getItem('categories') || '[]');
        if (categories.some(c => c.code === code)) {
            setError('categoryCode', 'Mã danh mục đã tồn tại');
            return;
        }

        // Kiểm tra tên danh mục trùng
        if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            setError('categoryName', 'Tên danh mục đã tồn tại');
            return;
        }

        const newCategory = { code, name, status };
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));

        // Hiển thị thông báo thêm mới thành công
        showNotification('Thêm mới danh mục thành công!');

        modal.style.display = 'none';
        form.reset();
        renderCategoryTable();
    };
}
// Set error message for input field - Hiển thị thông báo lỗi cho trường nhập liệu
function setError(field, message) {
    const input = document.getElementById(field);
    if (input) input.classList.add('error');
    let group = input.closest('.form-group');
    if (group) {
        let err = document.createElement('div');
        err.className = 'error-message';
        err.innerText = message;
        // Remove existing error message if any - Xóa error-message cũ nếu có
        let oldErr = group.querySelector('.error-message');
        if (oldErr) oldErr.remove();
        group.appendChild(err);
    }
}

// Show notification - Hiển thị thông báo
function showNotification(message, type = 'success') {
    // Create notification element - Tạo phần tử thông báo
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="${type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add to document - Thêm vào tài liệu
    document.body.appendChild(notification);

    // Show notification - Hiển thị thông báo
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto hide after 3 seconds - Tự động ẩn sau 3 giây
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Clear all form errors - Xóa tất cả lỗi của form
function clearFormError() {
    ['categoryCode', 'categoryName'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.classList.remove('error');
        let group = input.closest('.form-group');
        if (group) {
            let err = group.querySelector('.error-message');
            if (err) err.remove();
        }
    });
}

// Variables for pagination state - Biến để lưu trạng thái phân trang
let currentPage = 1;
const itemsPerPage = 5;
let filteredCategories = [];

// Variables for sorting - Biến cho tính năng sắp xếp
let sortField = 'code'; // Field to sort by (code or name)
let sortDirection = 'asc'; // Sort direction (asc or desc)

// Handle category filtering - Xử lý lọc danh mục
function filterCategories() {
    let categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const searchInput = document.querySelector('.toolbar input[type="text"]');
    const statusSelect = document.querySelector('.toolbar select');

    if (searchInput && statusSelect) {
        const searchTerm = searchInput.value.toLowerCase();
        const statusFilter = statusSelect.value;

        filteredCategories = categories.filter(category => {
            // Filter by search keyword - Lọc theo từ khóa tìm kiếm
            const matchesSearch = !searchTerm ||
                category.name.toLowerCase().includes(searchTerm) ||
                category.code.toLowerCase().includes(searchTerm);

            // Filter by status - Lọc theo trạng thái
            let matchesStatus = true;
            if (statusFilter === 'Đang hoạt động') {
                matchesStatus = category.status === 'active';
            } else if (statusFilter === 'Ngừng hoạt động') {
                matchesStatus = category.status === 'inactive';
            }

            return matchesSearch && matchesStatus;
        });

        // Sort categories - Sắp xếp danh mục
        sortCategories();
        renderPaginatedCategories();
    }
}

// Sort categories function - Hàm sắp xếp danh mục
function sortCategories() {
    filteredCategories.sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];

        // Handle string comparison - Xử lý so sánh chuỗi
        if (typeof valueA === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
        }

        if (sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
}

// Display categories by page - Hiển thị danh mục theo trang
function renderPaginatedCategories() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

    const tbody = document.querySelector('table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (paginatedCategories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Không có dữ liệu</td></tr>';
    } else {
        paginatedCategories.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${c.code}</td>
                <td>${c.name}</td>
                <td><span class="status ${c.status === 'active' ? 'active' : 'inactive'}">● ${c.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></td>
                <td>
                    <span class="icon-btn delete" data-id="${c.code}"></span>
                    <span class="icon-btn edit" data-id="${c.code}"></span>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    updatePagination();
    bindEditButtons();
    bindDeleteButtons();
}

// Update pagination display - Cập nhật hiển thị phân trang
function updatePagination() {
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    pagination.innerHTML = '';

    // Previous button - Nút Previous
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&lt;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPaginatedCategories();
        }
    });
    pagination.appendChild(prevButton);

    // Display pages - Hiển thị các trang
    const maxVisiblePages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add page 1 - Thêm trang 1
    if (startPage > 1) {
        addPageButton(1);

        // Add ellipsis if needed - Thêm dấu ... nếu cần
        if (startPage > 2) {
            const ellipsis = document.createElement('button');
            ellipsis.textContent = '...';
            ellipsis.disabled = true;
            pagination.appendChild(ellipsis);
        }
    }

    // Add middle pages - Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    // Add last page - Thêm trang cuối
    if (endPage < totalPages) {
        // Add ellipsis if needed - Thêm dấu ... nếu cần
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('button');
            ellipsis.textContent = '...';
            ellipsis.disabled = true;
            pagination.appendChild(ellipsis);
        }

        addPageButton(totalPages);
    }

    // Next button - Nút Next
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&gt;';
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPaginatedCategories();
        }
    });
    pagination.appendChild(nextButton);

    // Function to create button for each page - Hàm tạo nút cho từng trang
    function addPageButton(pageNumber) {
        const button = document.createElement('button');
        button.textContent = pageNumber;
        if (pageNumber === currentPage) {
            button.className = 'active';
        }
        button.addEventListener('click', () => {
            currentPage = pageNumber;
            renderPaginatedCategories();
        });
        pagination.appendChild(button);
    }
}

// Add event for deleting category - Thêm sự kiện xóa danh mục
function bindDeleteButtons() {
    document.querySelectorAll('.icon-btn.delete').forEach(btn => {
        btn.onclick = function () {
            const categoryCode = this.getAttribute('data-id');

            // Check if category has products - Kiểm tra xem danh mục có sản phẩm không
            const products = JSON.parse(localStorage.getItem('products') || '[]');

            // Find products in this category - Tìm các sản phẩm thuộc danh mục này
            const productsInCategory = products.filter(p => p.category === categoryCode);

            // If at least 1 product exists, don't allow deletion - Nếu có ít nhất 1 sản phẩm thuộc danh mục, không cho phép xóa
            if (productsInCategory.length > 0) {
                alert(`Không thể xóa danh mục này vì đã có ${productsInCategory.length} sản phẩm thuộc danh mục!`);
                return;
            }

            // If no products, proceed with deletion - Nếu không có sản phẩm nào, tiếp tục xóa danh mục
            if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
                let categories = JSON.parse(localStorage.getItem('categories') || '[]');
                categories = categories.filter(c => c.code !== categoryCode);
                localStorage.setItem('categories', JSON.stringify(categories));
                filterCategories();
            }
        };
    });
}

// Display categories in table - Hiển thị danh mục lên bảng
function renderCategoryTable() {
    // Initialize sample data if not exists - Khởi tạo dữ liệu mẫu nếu chưa có
    if (!localStorage.getItem('categories')) {
        const sampleCategories = [
            { code: 'DM001', name: 'Điện thoại', status: 'active' },
            { code: 'DM002', name: 'Laptop', status: 'active' },
            { code: 'DM003', name: 'Máy tính bảng', status: 'active' },
            { code: 'DM004', name: 'Phụ kiện', status: 'active' },
            { code: 'DM005', name: 'Đồng hồ', status: 'inactive' },
            { code: 'DM006', name: 'Quần áo', status: 'active' },
            { code: 'DM007', name: 'Giày dép', status: 'inactive' },
            { code: 'DM008', name: 'Túi xách', status: 'active' },
            { code: 'DM009', name: 'Mỹ phẩm', status: 'inactive' },
            { code: 'DM010', name: 'Thực phẩm', status: 'active' },
            { code: 'DM011', name: 'Đồ gia dụng', status: 'active' },
            { code: 'DM012', name: 'Sách', status: 'inactive' }
        ];
        localStorage.setItem('categories', JSON.stringify(sampleCategories));
    }

    filterCategories();
}

// Handle status filter change - Bắt sự kiện khi thay đổi lọc trạng thái
const statusSelect = document.querySelector('.toolbar select');
if (statusSelect) {
    statusSelect.addEventListener('change', filterCategories);
}

// Handle search input - Bắt sự kiện tìm kiếm
const searchInput = document.querySelector('.toolbar input[type="text"]');
if (searchInput) {
    searchInput.addEventListener('input', filterCategories);
}

// Attach sort handlers - Gắn xử lý sự kiện sắp xếp
document.addEventListener('DOMContentLoaded', function () {
    const sortHeaders = document.querySelectorAll('th .sort');

    sortHeaders.forEach((header, index) => {
        header.addEventListener('click', function () {
            // Set sort field based on column index - Thiết lập trường sắp xếp dựa trên chỉ số cột
            if (index === 0) {
                sortField = 'code';
            } else if (index === 1) {
                sortField = 'name';
            }

            // Toggle sort direction - Chuyển đổi hướng sắp xếp
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

            // Update sort icon - Cập nhật biểu tượng sắp xếp
            sortHeaders.forEach(h => h.classList.remove('asc', 'desc'));
            this.classList.add(sortDirection);

            // Refresh display - Làm mới hiển thị
            filterCategories();
        });
    });
});

// Rebind edit buttons after table render - Hiển thị lại sự kiện cho icon-btn.edit sau khi render lại bảng
function bindEditButtons() {
    document.querySelectorAll('.icon-btn.edit').forEach(function (btn) {
        btn.onclick = function () {
            const categoryCode = this.getAttribute('data-id');
            let categories = JSON.parse(localStorage.getItem('categories') || '[]');
            const category = categories.find(c => c.code === categoryCode);

            if (category) {
                const modalUpdate = document.getElementById('modalUpdateCategory');
                document.getElementById('updateCategoryCode').value = category.code;
                document.getElementById('updateCategoryName').value = category.name;

                if (category.status === 'active') {
                    document.querySelector('input[name="updateCategoryStatus"][value="active"]').checked = true;
                } else {
                    document.querySelector('input[name="updateCategoryStatus"][value="inactive"]').checked = true;
                }

                modalUpdate.style.display = 'block';

                // Handle closing modal - Xử lý đóng modal
                document.getElementById('btnCloseUpdateCategory').onclick = () => {
                    modalUpdate.style.display = 'none';
                };

                // Handle cancel update - Xử lý hủy cập nhật
                document.getElementById('btnCancelUpdateCategory').onclick = () => {
                    modalUpdate.style.display = 'none';
                };

                // Handle update form submission - Xử lý form cập nhật
                const updateForm = document.getElementById('formUpdateCategory');
                updateForm.onsubmit = function (e) {
                    e.preventDefault();

                    const updatedName = document.getElementById('updateCategoryName').value.trim();
                    const updatedStatus = document.querySelector('input[name="updateCategoryStatus"]:checked')?.value || 'active';

                    if (!updatedName) {
                        alert('Tên danh mục không được để trống');
                        return;
                    }

                    // Kiểm tra tên danh mục trùng với các danh mục khác
                    const isDuplicateName = categories.some(c => c.code !== categoryCode && c.name.toLowerCase() === updatedName.toLowerCase());
                    if (isDuplicateName) {
                        alert('Tên danh mục đã tồn tại');
                        return;
                    }

                    // Update category - Cập nhật danh mục
                    const categoryIndex = categories.findIndex(c => c.code === categoryCode);
                    if (categoryIndex !== -1) {
                        categories[categoryIndex].name = updatedName;
                        categories[categoryIndex].status = updatedStatus;
                        localStorage.setItem('categories', JSON.stringify(categories));

                        // Hiển thị thông báo cập nhật thành công
                        showNotification('Cập nhật danh mục thành công!');

                        modalUpdate.style.display = 'none';
                        filterCategories();
                    }
                };
            }
        };
    });
}

// Initialize table on page load - Khởi tạo bảng khi load trang
window.addEventListener('DOMContentLoaded', renderCategoryTable);

// Rest of JS code (for products) - Phần còn lại của mã JS (cho sản phẩm)
document.addEventListener('DOMContentLoaded', function () {
    // Initialize products if not exists - Khởi tạo sản phẩm nếu chưa có
    if (!localStorage.getItem('products')) {
        // Initial sample data - Dữ liệu mẫu ban đầu
        const initialProducts = [
            {
                id: 'SP001',
                name: 'Iphone 12 Pro',
                price: 12000000,
                quantity: 10,
                discount: 0,
                status: 'active',
                description: 'Apple iPhone 12 Pro'
            },
            {
                id: 'SP002',
                name: 'Samsung Galaxy X20',
                price: 21000000,
                quantity: 100,
                discount: 5,
                status: 'inactive',
                description: 'Samsung Galaxy X20'
            },
            {
                id: 'SP003',
                name: 'Phone 8 Plus',
                price: 5000000,
                quantity: 10,
                discount: 0,
                status: 'active',
                description: 'Phone 8 Plus'
            },
            {
                id: 'SP004',
                name: 'Iphone 14 Pro max',
                price: 25000000,
                quantity: 20,
                discount: 2,
                status: 'inactive',
                description: 'Apple iPhone 14 Pro Max'
            },
            {
                id: 'SP005',
                name: 'Oppo X3',
                price: 2000000,
                quantity: 10,
                discount: 5,
                status: 'inactive',
                description: 'Oppo X3 smartphone'
            },
            {
                id: 'SP006',
                name: 'Iphone 16',
                price: 20000000,
                quantity: 20,
                discount: 3,
                status: 'inactive',
                description: 'Apple iPhone 16'
            },
            {
                id: 'SP007',
                name: 'Iphone 7 Plus',
                price: 4000000,
                quantity: 10,
                discount: 4,
                status: 'active',
                description: 'Apple iPhone 7 Plus'
            },
            {
                id: 'SP008',
                name: 'Samsung S20 Ultra',
                price: 30000000,
                quantity: 15,
                discount: 2,
                status: 'inactive',
                description: 'Samsung S20 Ultra'
            }
        ];
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    // DOM elements - Các phần tử DOM
    const productTableBody = document.getElementById('productTableBody');
    const paginationContainer = document.getElementById('pagination');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const filterStatusDropdown = document.getElementById('filterStatus');
    const addProductBtn = document.querySelector('.add-product-btn');
    const productModal = new bootstrap.Modal(document.getElementById('productModal'));
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));
    const saveProductBtn = document.getElementById('saveProductBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    const logoutBtn = document.getElementById('logout-btn');

    // Variables - Các biến
    let currentPage = 1;
    const itemsPerPage = 5;
    let currentProducts = [];
    let editingProductId = null;
    let productToDelete = null;
    let statusFilter = 'all';

    // Initialize the page - Khởi tạo trang
    loadProducts();

    // Event listeners - Các sự kiện lắng nghe
    searchBtn.addEventListener('click', function () {
        filterProducts();
    });

    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            filterProducts();
        }
    });

    document.querySelectorAll('.dropdown-menu[aria-labelledby="filterStatus"] .dropdown-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            statusFilter = this.getAttribute('data-status');
            filterStatusDropdown.textContent = this.textContent;
            filterProducts();
        });
    });

    addProductBtn.addEventListener('click', function () {
        resetProductForm();
        document.getElementById('productModalLabel').textContent = 'Thêm mới sản phẩm';
        productModal.show();
    });

    saveProductBtn.addEventListener('click', function () {
        saveProduct();
    });

    confirmDeleteBtn.addEventListener('click', function () {
        if (productToDelete) {
            deleteProduct(productToDelete);
        }
        deleteModal.hide();
    });

    logoutBtn.addEventListener('click', function () {
        logoutModal.show();
    });

    confirmLogoutBtn.addEventListener('click', function () {
        // Simulate logout - Mô phỏng đăng xuất
        window.location.href = '../../index.html';
    });

    // Functions - Các hàm
    function loadProducts() {
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];
        currentProducts = allProducts;
        filterProducts();
    }

    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        let filtered = currentProducts;

        if (searchTerm) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.id.toLowerCase().includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(product => product.status === statusFilter);
        }

        displayProducts(filtered);
    }

    function displayProducts(products) {
        // Calculate pagination - Tính toán phân trang
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

        // Clear current table - Xóa bảng hiện tại
        productTableBody.innerHTML = '';

        // Display products - Hiển thị sản phẩm
        if (paginatedProducts.length === 0) {
            productTableBody.innerHTML = '<tr><td colspan="7" class="text-center">Không có sản phẩm nào</td></tr>';
        } else {
            paginatedProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${formatCurrency(product.price)}</td>
                    <td>${product.quantity}</td>
                    <td>${product.discount}%</td>
                    <td>
                        <span class="status ${product.status === 'active' ? 'active' : 'inactive'}">
                            ${product.status === 'active' ? '● Đang hoạt động' : '● Ngừng hoạt động'}
                        </span>
                    </td>
                    <td class="action-btns">
                        <button class="btn-delete" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                        <button class="btn-edit" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    </td>
                `;
                productTableBody.appendChild(row);
            });

            // Add event listeners for edit and delete buttons - Thêm sự kiện cho nút chỉnh sửa và xóa
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', function () {
                    const productId = this.getAttribute('data-id');
                    openEditProductModal(productId);
                });
            });

            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', function () {
                    productToDelete = this.getAttribute('data-id');
                    deleteModal.show();
                });
            });
        }

        // Update pagination - Cập nhật phân trang
        updatePagination(totalPages);
    }

    function updatePagination(totalPages) {
        paginationContainer.innerHTML = '';

        // Previous button - Nút Previous
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        const prevLink = document.createElement('a');
        prevLink.className = 'page-link';
        prevLink.href = '#';
        prevLink.innerHTML = '&lt;';
        prevLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                filterProducts();
            }
        });
        prevLi.appendChild(prevLink);
        paginationContainer.appendChild(prevLi);

        // Page buttons - Nút trang
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', function (e) {
                e.preventDefault();
                currentPage = i;
                filterProducts();
            });
            pageLi.appendChild(pageLink);
            paginationContainer.appendChild(pageLi);
        }

        // If there are more pages, show ellipsis - Nếu có nhiều trang hơn, hiển thị dấu ...
        if (endPage < totalPages) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            const ellipsisLink = document.createElement('a');
            ellipsisLink.className = 'page-link';
            ellipsisLink.href = '#';
            ellipsisLink.innerHTML = '...';
            ellipsisLi.appendChild(ellipsisLink);
            paginationContainer.appendChild(ellipsisLi);

            // Last page - Trang cuối
            const lastLi = document.createElement('li');
            lastLi.className = 'page-item';
            const lastLink = document.createElement('a');
            lastLink.className = 'page-link';
            lastLink.href = '#';
            lastLink.textContent = totalPages;
            lastLink.addEventListener('click', function (e) {
                e.preventDefault();
                currentPage = totalPages;
                filterProducts();
            });
            lastLi.appendChild(lastLink);
            paginationContainer.appendChild(lastLi);
        }

        // Next button - Nút Next
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        const nextLink = document.createElement('a');
        nextLink.className = 'page-link';
        nextLink.href = '#';
        nextLink.innerHTML = '&gt;';
        nextLink.addEventListener('click', function (e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                filterProducts();
            }
        });
        nextLi.appendChild(nextLink);
        paginationContainer.appendChild(nextLi);
    }

    function openEditProductModal(productId) {
        const product = currentProducts.find(p => p.id === productId);
        if (product) {
            editingProductId = productId;
            document.getElementById('productModalLabel').textContent = 'Chỉnh sửa sản phẩm';
            document.getElementById('productCode').value = product.id;
            document.getElementById('productCode').disabled = true;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productQuantity').value = product.quantity;
            document.getElementById('productDiscount').value = product.discount;
            document.getElementById('productStatus').value = product.status;
            document.getElementById('productDescription').value = product.description || '';
            productModal.show();
        }
    }

    function resetProductForm() {
        editingProductId = null;
        document.getElementById('productCode').disabled = false;
        document.getElementById('productForm').reset();
    }

    function saveProduct() {
        // Get form values - Lấy giá trị từ form
        const productCode = document.getElementById('productCode').value;
        const productName = document.getElementById('productName').value;
        const productPrice = parseInt(document.getElementById('productPrice').value);
        const productQuantity = parseInt(document.getElementById('productQuantity').value);
        const productDiscount = parseInt(document.getElementById('productDiscount').value);
        const productStatus = document.getElementById('productStatus').value;
        const productDescription = document.getElementById('productDescription').value;

        // Validate form - Kiểm tra form
        if (!productCode || !productName || isNaN(productPrice) || isNaN(productQuantity)) {
            alert('Vui lòng nhập đầy đủ thông tin sản phẩm');
            return;
        }

        // Get all products - Lấy tất cả sản phẩm
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];

        // If editing - Nếu đang chỉnh sửa
        if (editingProductId) {
            const index = allProducts.findIndex(p => p.id === editingProductId);
            if (index !== -1) {
                allProducts[index] = {
                    id: productCode,
                    name: productName,
                    price: productPrice,
                    quantity: productQuantity,
                    discount: productDiscount,
                    status: productStatus,
                    description: productDescription
                };
            }
        } else {
            // If adding new, check if ID already exists - Nếu thêm mới, kiểm tra mã sản phẩm đã tồn tại
            if (allProducts.some(p => p.id === productCode)) {
                alert('Mã sản phẩm đã tồn tại');
                return;
            }

            // Add new product - Thêm sản phẩm mới
            allProducts.push({
                id: productCode,
                name: productName,
                price: productPrice,
                quantity: productQuantity,
                discount: productDiscount,
                status: productStatus,
                description: productDescription
            });
        }

        // Save to localStorage - Lưu vào localStorage
        localStorage.setItem('products', JSON.stringify(allProducts));

        // Hide modal and reload products - Ẩn modal và tải lại sản phẩm
        productModal.hide();
        loadProducts();
    }

    function deleteProduct(productId) {
        let allProducts = JSON.parse(localStorage.getItem('products')) || [];
        allProducts = allProducts.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(allProducts));
        loadProducts();
    }

    // Format currency function - Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
    }
});