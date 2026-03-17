/**
 * Admin Dashboard Logic - localStorage only, no backend needed
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth(['admin'])) return;
  loadAdminStats();
  loadAdminDonors();
  loadAdminRequests();
  loadAdminHospitals();
});

function getAllUsersFromStorage() {
  try { return JSON.parse(localStorage.getItem('dbn_users') || '[]'); } catch { return []; }
}
function getAllRequestsFromStorage() {
  try { return JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]'); } catch { return []; }
}

function loadAdminStats() {
  const users = getAllUsersFromStorage();
  const requests = getAllRequestsFromStorage();

  const donors = users.filter(u => u.role === 'donor');
  const hospitals = users.filter(u => u.role === 'hospital');

  const aDonors = document.getElementById('aDonors');
  const aHospitals = document.getElementById('aHospitals');
  const aRequests = document.getElementById('aRequests');
  const aFulfilled = document.getElementById('aFulfilled');

  if (aDonors) aDonors.textContent = donors.length;
  if (aHospitals) aHospitals.textContent = hospitals.length;
  if (aRequests) aRequests.textContent = requests.length;
  if (aFulfilled) aFulfilled.textContent = requests.filter(r => r.status === 'fulfilled' || r.status === 'approved').length;

  // Blood group chart
  const chart = document.getElementById('bloodGroupChart');
  if (!chart) return;
  const groups = {};
  donors.forEach(d => { if (d.bloodGroup) groups[d.bloodGroup] = (groups[d.bloodGroup] || 0) + 1; });
  const entries = Object.entries(groups).sort((a,b) => b[1] - a[1]);
  const maxCount = Math.max(...entries.map(([,c])=>c), 1);
  chart.innerHTML = entries.length > 0 ? entries.map(([bg, count]) => `
    <div class="text-center" style="min-width:60px">
      <div style="height:100px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:8px">
        <div style="width:40px;height:${Math.max(10,(count/maxCount)*100)}px;background:linear-gradient(135deg,#D32F2F,#B71C1C);border-radius:6px 6px 0 0"></div>
      </div>
      <span class="blood-badge" style="width:40px;height:40px;font-size:0.75rem">${bg}</span>
      <div class="mt-1"><strong style="font-size:0.85rem">${count}</strong></div>
    </div>
  `).join('') : '<p class="text-muted">No donors registered yet</p>';
}

function loadAdminDonors() {
  const container = document.getElementById('adminDonorsList');
  if (!container) return;
  const donors = getAllUsersFromStorage().filter(u => u.role === 'donor');

  if (donors.length === 0) {
    container.innerHTML = '<div class="empty-state py-4"><i class="fas fa-users"></i><h5>No donors registered</h5></div>';
    return;
  }
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-custom">
        <thead><tr><th>Name</th><th>Blood Group</th><th>Phone</th><th>Email</th><th>Available</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          ${donors.map(d => `
            <tr>
              <td><strong>${d.name}</strong></td>
              <td><span class="blood-badge" style="width:32px;height:32px;font-size:0.7rem">${d.bloodGroup || '?'}</span></td>
              <td>${d.phone}</td>
              <td><small>${d.email}</small></td>
              <td>${d.isAvailable !== false ? '<span class="text-success"><i class="fas fa-check-circle"></i> Yes</span>' : '<span class="text-muted">No</span>'}</td>
              <td><small>${formatDate(d.createdAt)}</small></td>
              <td><button class="btn btn-sm btn-outline-danger rounded-pill px-2" onclick="deleteUser('${d.id}')"><i class="fas fa-trash"></i></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function loadAdminRequests() {
  const container = document.getElementById('adminRequestsList');
  if (!container) return;
  const requests = getAllRequestsFromStorage();

  if (requests.length === 0) {
    container.innerHTML = '<div class="empty-state py-4"><i class="fas fa-inbox"></i><h5>No requests found</h5></div>';
    return;
  }
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-custom">
        <thead><tr><th>Patient</th><th>Blood Group</th><th>Units</th><th>Hospital</th><th>Urgency</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          ${requests.map(r => `
            <tr>
              <td>${r.patientName || 'N/A'}</td>
              <td><span class="blood-badge" style="width:32px;height:32px;font-size:0.7rem">${r.bloodGroup}</span></td>
              <td>${r.unitsNeeded}</td>
              <td><small>${r.hospitalName}</small></td>
              <td><span class="status-badge status-${r.urgency === 'emergency' ? 'emergency' : 'pending'}">${r.urgency}</span></td>
              <td><span class="status-badge status-${r.status}">${r.status}</span></td>
              <td><small>${formatDate(r.createdAt)}</small></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function loadAdminHospitals() {
  const container = document.getElementById('adminHospitalsList');
  if (!container) return;
  const hospitals = getAllUsersFromStorage().filter(u => u.role === 'hospital');

  if (hospitals.length === 0) {
    container.innerHTML = '<div class="empty-state py-4"><i class="fas fa-hospital"></i><h5>No hospitals registered</h5></div>';
    return;
  }
  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-custom">
        <thead><tr><th>Hospital Name</th><th>Contact</th><th>Email</th><th>Address</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          ${hospitals.map(h => `
            <tr>
              <td><strong>${h.hospitalName || h.name}</strong></td>
              <td>${h.phone}</td>
              <td><small>${h.email}</small></td>
              <td><small>${h.hospitalAddress || 'N/A'}</small></td>
              <td><small>${formatDate(h.createdAt)}</small></td>
              <td><button class="btn btn-sm btn-outline-danger rounded-pill px-2" onclick="deleteUser('${h.id}')"><i class="fas fa-trash"></i></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  const all = getAllUsersFromStorage().filter(u => u.id !== userId);
  localStorage.setItem('dbn_users', JSON.stringify(all));
  showToast('User deleted successfully', 'success');
  loadAdminStats();
  loadAdminDonors();
  loadAdminHospitals();
}
