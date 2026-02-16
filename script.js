let currentUserRole = 'admin'; // Default
let currentStudentId = null;

// ========== Mobile Sidebar Toggle ==========

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebarOnMobile() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }
}

// ========== Navigation Logic ==========

function toggleView(viewName) {
    const landingView = document.getElementById('landing-view');
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');

    landingView.classList.add('hidden');
    loginView.classList.add('hidden');
    dashboardView.classList.add('hidden');

    if (viewName === 'landing') landingView.classList.remove('hidden');
    if (viewName === 'login') loginView.classList.remove('hidden');
    if (viewName === 'dashboard') dashboardView.classList.remove('hidden');
}

function selectRole(role) {
    currentUserRole = role;
    document.querySelectorAll('.role-btn').forEach(btn => btn.classList.remove('active'));
    const buttons = document.querySelectorAll('.role-btn');
    if (role === 'admin') buttons[0].classList.add('active');
    else buttons[1].classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    let isValid = false;

    if (currentUserRole === 'admin' && usernameInput === 'admin' && passwordInput === 'admin123') {
        isValid = true;
        currentStudentId = null;
    } else if (currentUserRole === 'student') {
        const student = studentsData.find(s => s.id === usernameInput);
        if (student && passwordInput === 'student123') {
            isValid = true;
            currentStudentId = student.id;
        }
    }

    if (isValid) {
        errorMsg.classList.add('hidden');
        updateDashboardForRole(currentUserRole);
        toggleView('dashboard');
    } else {
        errorMsg.classList.remove('hidden');
    }
}

function updateDashboardForRole(role) {
    const navOverview = document.getElementById('nav-overview');
    const navStudents = document.getElementById('nav-students');
    const navHostel = document.getElementById('nav-hostel');
    const navPayment = document.getElementById('nav-payment');
    const navOuting = document.getElementById('nav-outing');
    const userNameDisplay = document.getElementById('user-name');
    const userAvatar = document.getElementById('user-avatar');

    if (role === 'admin') {
        userNameDisplay.textContent = 'Warden';
        userAvatar.textContent = 'WD';
        navOverview.classList.remove('hidden');
        navStudents.classList.remove('hidden');
        navHostel.innerHTML = '<i class="fa-solid fa-bed"></i> Hostel';
        navPayment.classList.add('hidden');
        navOuting.classList.remove('hidden');
        switchTab('overview');
    } else {
        const student = getStudentDetails(currentStudentId);
        userNameDisplay.textContent = student ? student.name : 'Student';
        userAvatar.textContent = 'ST';
        navOverview.classList.add('hidden');
        navStudents.classList.add('hidden');
        navHostel.innerHTML = '<i class="fa-solid fa-bed"></i> My Room';
        navPayment.classList.remove('hidden');
        navOuting.classList.remove('hidden');
        switchTab('hostel');
    }
}

function switchTab(tabName) {
    closeSidebarOnMobile();
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.add('hidden'));

    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) selectedTab.classList.remove('hidden');

    const menuItems = document.querySelectorAll('.sidebar-menu li');
    menuItems.forEach(item => item.classList.remove('active'));
    const navItem = document.getElementById(`nav-${tabName}`);
    if (navItem) navItem.classList.add('active');

    // Trigger data population
    if (tabName === 'hostel') {
        if (currentUserRole === 'admin') loadHostelRooms();
        else loadStudentRoomDetails();
    }
    if (tabName === 'mess') loadMessMenu();
    if (tabName === 'outing') loadOuting();
    if (tabName === 'complaints') loadComplaints();
    if (tabName === 'students' && currentUserRole === 'admin') loadStudentDetailsList();
}

// ========== Mock Data ==========

const studentsData = [
    { id: '101', name: 'John Doe', room: '101', dept: 'CSE', year: '3rd', rollNo: 'CSE21001', phone: '9876543210' },
    { id: '102', name: 'Jane Smith', room: '102', dept: 'ECE', year: '2nd', rollNo: 'ECE22045', phone: '8765432109' },
    { id: '103', name: 'Mike Ross', room: '101', dept: 'CSE', year: '3rd', rollNo: 'CSE21002', phone: '7654321098' },
    { id: '104', name: 'Rachel Green', room: '104', dept: 'BBA', year: '1st', rollNo: 'BBA23012', phone: '6543210987' }
];

const roomsData = {
    '101': ['101', '103'],
    '102': ['102'],
    '103': [],
    '104': ['104'],
};

// Mess Menu - Matching the provided image exactly
const messMenu = {
    'Saturday': {
        breakfast: 'Mix Dal/ Alu Matar\nPlain Rice /Pickle',
        lunch: 'Egg Curry /Mix Dal\nTadka/ Plain Rice /\nPapad',
        dinner: 'Chana Dal Tadka /\nBegun Masala / Or Alu\nBharta\nPlain Rice / Pickle'
    },
    'Sunday': {
        breakfast: 'Masoor Dal Fry/\nChana Kaddu\nMasala/ Plain\nRice/Green Salad',
        lunch: 'Beef Masala/ Mix\nDal Tadka/ M.Veg./\nPlain Rice/Pickle',
        dinner: 'Mix Dal Fry / Alu\nBhurji/\nPlain Rice / Green\nSalad'
    },
    'Monday': {
        breakfast: 'Dal Tadka/ Alu Badi\nPlain Rice / Green\nSalad',
        lunch: 'Fish Curry /Mix Dal\nTadka / Plain Rice',
        dinner: 'Mix Anda Bhurjee / Mix\nDal Tadka/ Plain Rice/\nPickle /Sweets'
    },
    'Tuesday': {
        breakfast: 'Mix Dal Tadka /\nGabiful Masala/\nPlain Rice / Green\nSalad',
        lunch: 'Chinken Curry / Dal\nFry/ Mix Veg./ Plain\nRice/ Pickle',
        dinner: 'Mix Dal Tadka / Mix\nVeg. / Plain Rice /\nPapad'
    },
    'Wednesday': {
        breakfast: 'Masoor Dal Tadka /\nBeans Chana\nMasala / Plain Rice/\nPickle',
        lunch: 'Fish Curry / Mix Dal/\nPlain Rice / Mix Veg.',
        dinner: 'Chana Dal Fry / Alu\nGabi Matar Masala /\nPlain Rice / Pickle'
    },
    'Thursday': {
        breakfast: 'Alu Soyabin\nMasala/ Dal Tadka/\nPlain Rice/ Pickle',
        lunch: 'Chicken Tanduree\nMasala/ Chana Dal\nTadka/ Plain Rice /\nPickle',
        dinner: 'Mix Dal Tadka / Anda\nBhurjee / Plain Rice /\nGreen Salad'
    },
    'Friday': {
        breakfast: 'Moong Masoor\nTadka / Mix Veg /\nPlain Rice/ Pickle',
        lunch: 'Fish Curry/ Mix Dal\nFry/Plain Rice',
        dinner: 'Mix Dal Tadka / Gobi\nChana Masala / Plain\nRice / Green Salad /\nPickle'
    }
};

const messWorkers = [
    { name: 'Ramesh', role: 'Head Cook', shift: 'Morning' },
    { name: 'Suresh', role: 'Helper', shift: 'Evening' },
    { name: 'Ganesh', role: 'Cleaner', shift: 'Full Day' }
];

let outingLogs = [
    { studentId: '101', date: '2023-10-25', status: 'In', outTime: '17:00', inTime: '19:30' },
    { studentId: '102', date: '2023-10-26', status: 'Out', outTime: '16:00', inTime: '-' }
];

let complaintsData = [
    { id: 1, title: 'Fan not working in Room 104', status: 'Pending', studentId: '104' },
    { id: 2, title: 'Water leakage in 2nd floor bathroom', status: 'Resolved', studentId: '102' },
    { id: 3, title: 'Internet slow in common area', status: 'In Progress', studentId: '101' }
];

// ========== Helper Functions ==========

function getStudentDetails(id) {
    return studentsData.find(s => s.id === id);
}

function getRoommates(roomNo, studentId) {
    const occupantIds = roomsData[roomNo] || [];
    return occupantIds.filter(id => id !== studentId).map(id => getStudentDetails(id).name);
}

// ========== Hostel Tab ==========

function loadHostelRooms() {
    const grid = document.querySelector('.rooms-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 101; i <= 120; i++) {
        const roomNo = i.toString();
        const occupants = roomsData[roomNo] || [];
        const isOccupied = occupants.length > 0;

        const room = document.createElement('div');
        room.className = `room-box ${isOccupied ? 'occupied' : 'available'}`;
        room.onclick = () => showRoomDetailsModal(roomNo);
        room.innerHTML = `
            <h4>${i}</h4>
            <span style="font-size: 0.8rem">${occupants.length} Occupants</span>
        `;
        grid.appendChild(room);
    }
}

function loadStudentRoomDetails() {
    const container = document.getElementById('hostel-tab');
    if (!currentStudentId) return;

    const student = getStudentDetails(currentStudentId);
    if (!student) return;

    const roommates = getRoommates(student.room, currentStudentId);

    container.innerHTML = `
        <h2>My Room Details</h2>
        <div class="room-detail-card">
            <h3 style="font-size: 2rem; color: var(--accent); margin-bottom: 1rem;">Room ${student.room}</h3>
            <p><strong>Department:</strong> ${student.dept}</p>
            <p><strong>Year:</strong> ${student.year}</p>
            
            <div class="room-mate-list">
                <h4>Roommates:</h4>
                <ul>
                    ${roommates.length ? roommates.map(name => `<li><i class="fa-solid fa-user"></i> ${name}</li>`).join('') : '<li>No roommates</li>'}
                </ul>
            </div>

            <button class="btn btn-outline mt-4" onclick="requestRoomChange()">
                <i class="fa-solid fa-arrow-right-arrow-left"></i> Request Room Change
            </button>
        </div>
    `;
}

function requestRoomChange() {
    const reason = prompt("Enter reason for room change request:");
    if (reason) {
        alert("Request sent to Warden successfully!");
    }
}

// ========== Room Details Modal (Admin) ==========

function showRoomDetailsModal(roomNo) {
    if (currentUserRole !== 'admin') return;

    const modal = document.getElementById('room-modal');
    const title = document.getElementById('modal-room-no');
    const tbody = document.getElementById('modal-room-occupants');

    const occupantIds = roomsData[roomNo] || [];
    title.innerHTML = `Room ${roomNo} Details <span style="font-size: 1rem; color: var(--accent); margin-left: 1rem;">(${occupantIds.length} Students)</span>`;
    tbody.innerHTML = '';

    if (occupantIds.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Room is Empty</td></tr>';
    } else {
        occupantIds.forEach(id => {
            const s = getStudentDetails(id);
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.name}</td>
                <td>${s.dept}</td>
                <td>${s.year}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    modal.classList.remove('hidden');
}

function closeRoomModal() {
    document.getElementById('room-modal').classList.add('hidden');
}

// ========== Mess Menu ==========

function loadMessMenu() {
    const content = document.getElementById('mess-tab');

    content.innerHTML = `
        <h2>Mess Menu</h2>
        <div class="mess-controls" style="margin-bottom: 1rem;">
             <button class="btn btn-primary" onclick="renderMenu('today')">Today</button>
             <button class="btn btn-outline" onclick="renderMenu('weekly')">Weekly</button>
        </div>
        <div id="menu-display" class="mess-layout">
            <!-- Dynamic Content -->
        </div>
    `;
    renderMenu('today');

    // Show mess workers section for admin
    if (currentUserRole === 'admin') {
        const workerSection = document.getElementById('mess-workers-section');
        if (workerSection) {
            workerSection.classList.remove('hidden');
            loadMessWorkers();
        }
    } else {
        const workerSection = document.getElementById('mess-workers-section');
        if (workerSection) workerSection.classList.add('hidden');
    }
}

function renderMenu(view) {
    const container = document.getElementById('menu-display');
    const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    if (view === 'today') {
        const menu = messMenu[todayDay] || messMenu['Monday'];
        container.innerHTML = `
            <div class="menu-card glass" style="width: 100%; max-width: 600px;">
                <h3>${todayDay}'s Menu</h3>
                <ul class="sidebar-menu" style="margin-top: 1rem;">
                    <li><strong>Breakfast:</strong> ${menu.breakfast.replace(/\n/g, ', ')}</li>
                    <li><strong>Lunch:</strong> ${menu.lunch.replace(/\n/g, ', ')}</li>
                    <li><strong>Dinner:</strong> ${menu.dinner.replace(/\n/g, ', ')}</li>
                </ul>
            </div>
        `;
    } else {
        // Weekly Table - matching image layout exactly
        let rows = '';
        const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

        days.forEach(day => {
            const m = messMenu[day];
            rows += `
                <tr>
                    <td><strong>${day.toUpperCase()}</strong></td>
                    <td style="white-space: pre-line; text-transform: uppercase;">${m.breakfast}</td>
                    <td style="white-space: pre-line; text-transform: uppercase;">${m.lunch}</td>
                    <td style="white-space: pre-line; text-transform: uppercase;">${m.dinner}</td>
                </tr>
            `;
        });

        container.innerHTML = `
            <div class="table-container glass">
                <table class="data-table" style="font-size: 0.85rem;">
                    <thead>
                        <tr>
                            <th style="text-transform: uppercase;">Day</th>
                            <th style="text-transform: uppercase;">Breakfast</th>
                            <th style="text-transform: uppercase;">Lunch</th>
                            <th style="text-transform: uppercase;">Dinner</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }
}

// ========== Student Details (Admin) ==========

function loadStudentDetailsList() {
    const tbody = document.getElementById('all-students-list');
    tbody.innerHTML = '';

    studentsData.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${s.id}</td>
            <td>${s.name}</td>
            <td>${s.room}</td>
            <td>${s.dept}</td>
            <td>${s.year}</td>
            <td>${s.phone}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== Mess Workers (Admin) ==========

function loadMessWorkers() {
    const tbody = document.getElementById('mess-workers-list');
    tbody.innerHTML = '';

    messWorkers.forEach(w => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${w.name}</td>
            <td>${w.role}</td>
            <td>${w.shift}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== Payment ==========

function openPaymentModal(type) {
    const method = prompt(`Select Payment Method for ${type}:\n1. UPI\n2. QR Code\n3. Bank Transfer`);
    if (method) {
        alert("Payment Successful! Receipt sent to email.");
    }
}

// ========== Outing Management ==========

function loadOuting() {
    if (currentUserRole === 'admin') {
        document.getElementById('student-outing-view').classList.add('hidden');
        document.getElementById('admin-outing-view').classList.remove('hidden');

        const tbody = document.getElementById('all-outing-list');
        tbody.innerHTML = '';

        const logs = studentsData.map(s => {
            const activeLog = outingLogs.find(l => l.studentId === s.id && l.status === 'Out');
            return {
                ...s,
                status: activeLog ? 'Out' : 'In',
                outTime: activeLog ? activeLog.outTime : '-',
                inTime: activeLog ? '-' : 'Last In: 19:30'
            };
        });

        logs.forEach(l => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${l.name}</td>
                <td>${l.room}</td>
                <td><span class="status-badge ${l.status.toLowerCase()}">${l.status}</span></td>
                <td>${l.outTime}</td>
                <td>${l.inTime}</td>
            `;
            tbody.appendChild(tr);
        });

    } else {
        document.getElementById('admin-outing-view').classList.add('hidden');
        document.getElementById('student-outing-view').classList.remove('hidden');

        const activeLog = outingLogs.find(l => l.studentId === currentStudentId && l.status === 'Out');
        const statusEl = document.getElementById('outing-status');
        const btnGo = document.getElementById('btn-go-out');
        const btnReturn = document.getElementById('btn-return');

        if (activeLog) {
            statusEl.textContent = "Out of Hostel";
            statusEl.style.color = "#ef4444";
            btnGo.disabled = true;
            btnReturn.disabled = false;
            btnReturn.classList.remove('btn-outline');
            btnReturn.classList.add('btn-primary');
        } else {
            statusEl.textContent = "In Hostel";
            statusEl.style.color = "#22c55e";
            btnGo.disabled = false;
            btnReturn.disabled = true;
            btnReturn.classList.add('btn-outline');
            btnReturn.classList.remove('btn-primary');
        }

        const myList = document.getElementById('student-outing-list');
        myList.innerHTML = '';
        const myLogs = outingLogs.filter(l => l.studentId === currentStudentId);
        myLogs.forEach(l => {
            const div = document.createElement('div');
            div.className = 'complaint-item';
            div.innerHTML = `
                <span>${l.date}</span>
                <span>${l.outTime} - ${l.inTime}</span>
                <span class="status-badge ${l.status === 'Out' ? 'out' : 'in'}">${l.status}</span>
            `;
            myList.appendChild(div);
        });
    }
}

function handleOutingAction(action) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toISOString().split('T')[0];

    if (action === 'out') {
        const reason = prompt("Enter reason for outing:");
        if (!reason) return;

        outingLogs.push({
            studentId: currentStudentId,
            date: date,
            status: 'Out',
            outTime: time,
            inTime: '-'
        });
    } else {
        const logIndex = outingLogs.findIndex(l => l.studentId === currentStudentId && l.status === 'Out');
        if (logIndex !== -1) {
            outingLogs[logIndex].status = 'In';
            outingLogs[logIndex].inTime = time;
        }
    }
    loadOuting();
}

// ========== Complaints ==========

function loadComplaints() {
    const list = document.getElementById('complaints-list');
    list.innerHTML = '';

    complaintsData.forEach(c => {
        const div = document.createElement('div');
        div.className = 'complaint-item';

        let actions = '';
        if (currentUserRole === 'admin') {
            if (c.status === 'Pending') {
                actions = `
                    <div class="mt-2">
                        <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="updateComplaintStatus(${c.id}, 'In Progress')">Accept</button>
                        <button class="btn btn-outline" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; border-color: #ef4444; color: #ef4444;" onclick="updateComplaintStatus(${c.id}, 'Rejected')">Reject</button>
                    </div>
                `;
            } else if (c.status === 'In Progress') {
                actions = `
                    <div class="mt-2">
                        <button class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; background-color: #22c55e;" onclick="updateComplaintStatus(${c.id}, 'Resolved')">Mark Completed</button>
                    </div>
                `;
            }
        }

        div.innerHTML = `
            <div>
                <strong>${c.title}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                     Student ID: ${c.studentId || 'Unknown'}
                </div>
                ${actions}
            </div>
            <span class="status-badge ${c.status.toLowerCase().replace(' ', '-')}">${c.status}</span>
        `;
        list.appendChild(div);
    });
}

function addComplaintMock() {
    const title = prompt("Enter complaint details:");
    if (title) {
        complaintsData.unshift({ id: Date.now(), title, status: 'Pending', studentId: currentStudentId || 'Unknown' });
        loadComplaints();
    }
}

function updateComplaintStatus(id, newStatus) {
    const complaint = complaintsData.find(c => c.id === id);
    if (complaint) {
        complaint.status = newStatus;
        loadComplaints();
    }
}

// ========== Initialize ==========

document.addEventListener('DOMContentLoaded', () => {
    console.log("UnityHostel App Loaded");
});
