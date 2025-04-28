// Hiển thị/ẩn modal thêm mới danh mục
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

// Logic thêm mới danh mục
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
        // Lấy trạng thái từ radio
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
        const newCategory = { code, name, status };
        categories.push(newCategory);
        localStorage.setItem('categories', JSON.stringify(categories));
        modal.style.display = 'none';
        form.reset();
        renderCategoryTable();
    };
}
function setError(field, message) {
    const input = document.getElementById(field);
    if (input) input.classList.add('error');
    let group = input.closest('.form-group');
    if (group) {
        let err = document.createElement('div');
        err.className = 'error-message';
        err.innerText = message;
        // Xóa error-message cũ nếu có
        let oldErr = group.querySelector('.error-message');
        if (oldErr) oldErr.remove();
        group.appendChild(err);
    }
}
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
// Hiển thị danh mục lên bảng
function renderCategoryTable() {
    let categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const tbody = document.querySelector('table tbody');
    if (!tbody) return;
    tbody.innerHTML = categories.map(c => `
    <tr>
        <td>${c.code}</td>
        <td>${c.name}</td>
        <td><span class="status ${c.status === 'active' ? 'active' : 'inactive'}">● ${c.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}</span></td>
        <td>
            <span class="icon-btn delete"></span>
            <span class="icon-btn edit"></span>
        </td>
    </tr>
    `).join('');
    bindEditButtons();
}
// Hiển thị lại sự kiện cho icon-btn.edit sau khi render lại bảng
function bindEditButtons() {
    document.querySelectorAll('.icon-btn.edit').forEach(function (btn) {
        btn.onclick = function () {
            const row = btn.closest('tr');
            const code = row.children[0].textContent.trim();
            const name = row.children[1].textContent.trim();
            const statusText = row.children[2].textContent.trim();
            document.getElementById('modalUpdateCategory').style.display = 'block';
            document.getElementById('updateCategoryCode').value = code;
            document.getElementById('updateCategoryName').value = name;
            if (statusText.includes('Đang hoạt động')) {
                document.querySelector('input[name="updateCategoryStatus"][value="active"]').checked = true;
            } else {
                document.querySelector('input[name="updateCategoryStatus"][value="inactive"]').checked = true;
            }
        };
    });
}
// Khởi tạo bảng khi load trang
window.addEventListener('DOMContentLoaded', renderCategoryTable);
document.addEventListener('DOMContentLoaded', function () {
    // Initialize products if not exists
    if (!localStorage.getItem('products')) {
        // Initial sample data
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

    // DOM elements
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

    // Variables
    let currentPage = 1;
    const itemsPerPage = 5;
    let currentProducts = [];
    let editingProductId = null;
    let productToDelete = null;
    let statusFilter = 'all';

    // Initialize the page
    loadProducts();

    // Event listeners
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
        // Simulate logout
        window.location.href = '../../index.html';
    });

    // Functions
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
        // Calculate pagination
        const totalPages = Math.ceil(products.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

        // Clear current table
        productTableBody.innerHTML = '';

        // Display products
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

            // Add event listeners for edit and delete buttons
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

        // Update pagination
        updatePagination(totalPages);
    }

    function updatePagination(totalPages) {
        paginationContainer.innerHTML = '';

        // Previous button
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

        // Page buttons
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

        // If there are more pages, show ellipsis
        if (endPage < totalPages) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            const ellipsisLink = document.createElement('a');
            ellipsisLink.className = 'page-link';
            ellipsisLink.href = '#';
            ellipsisLink.innerHTML = '...';
            ellipsisLi.appendChild(ellipsisLink);
            paginationContainer.appendChild(ellipsisLi);

            // Last page
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

        // Next button
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
        // Get form values
        const productCode = document.getElementById('productCode').value;
        const productName = document.getElementById('productName').value;
        const productPrice = parseInt(document.getElementById('productPrice').value);
        const productQuantity = parseInt(document.getElementById('productQuantity').value);
        const productDiscount = parseInt(document.getElementById('productDiscount').value);
        const productStatus = document.getElementById('productStatus').value;
        const productDescription = document.getElementById('productDescription').value;

        // Validate form
        if (!productCode || !productName || isNaN(productPrice) || isNaN(productQuantity)) {
            alert('Vui lòng nhập đầy đủ thông tin sản phẩm');
            return;
        }

        // Get all products
        const allProducts = JSON.parse(localStorage.getItem('products')) || [];

        // If editing
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
            // If adding new, check if ID already exists
            if (allProducts.some(p => p.id === productCode)) {
                alert('Mã sản phẩm đã tồn tại');
                return;
            }

            // Add new product
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

        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(allProducts));

        // Hide modal and reload products
        productModal.hide();
        loadProducts();
    }

    function deleteProduct(productId) {
        let allProducts = JSON.parse(localStorage.getItem('products')) || [];
        allProducts = allProducts.filter(product => product.id !== productId);
        localStorage.setItem('products', JSON.stringify(allProducts));
        loadProducts();
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
    }
});