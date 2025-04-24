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
    // Đóng modal cập nhật khi nhấn nút đóng hoặc Hủy
    document.getElementById('btnCloseUpdateCategory').onclick = function () {
        document.getElementById('modalUpdateCategory').style.display = 'none';
    };
    document.getElementById('btnCancelUpdateCategory').onclick = function () {
        document.getElementById('modalUpdateCategory').style.display = 'none';
    };
});
// Xử lý cập nhật danh mục
const formUpdate = document.getElementById('formUpdateCategory');
if (formUpdate) {
    formUpdate.onsubmit = function (e) {
        e.preventDefault();
        const code = formUpdate.updateCategoryCode.value.trim();
        const name = formUpdate.updateCategoryName.value.trim();
        const status = formUpdate.querySelector('input[name="updateCategoryStatus"]:checked')?.value || 'active';
        if (!code || !name) {
            alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
            return false;
        }
        let categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const idx = categories.findIndex(c => c.code === code);
        if (idx !== -1) {
            categories[idx].name = name;
            categories[idx].status = status;
            localStorage.setItem('categories', JSON.stringify(categories));
            renderCategoryTable();
            document.getElementById('modalUpdateCategory').style.display = 'none';
            alert('Cập nhật danh mục thành công!');
        } else {
            alert('Không tìm thấy danh mục để cập nhật!');
        }
        return false;
    };
}