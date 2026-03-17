/**
 * Hospital Dashboard Logic - localStorage only, no backend needed
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth(['hospital'])) return;
  loadHospitalDashboard();
  loadHospitalRequests();

  document.getElementById('inventoryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = Auth.getUser();
    if (!user) return;

    const bloodUnits = {
      'A+': parseInt(document.getElementById('inv_Apos').value) || 0,
      'A-': parseInt(document.getElementById('inv_Aneg').value) || 0,
      'B+': parseInt(document.getElementById('inv_Bpos').value) || 0,
      'B-': parseInt(document.getElementById('inv_Bneg').value) || 0,
      'AB+': parseInt(document.getElementById('inv_ABpos').value) || 0,
      'AB-': parseInt(document.getElementById('inv_ABneg').value) || 0,
      'O+': parseInt(document.getElementById('inv_Opos').value) || 0,
      'O-': parseInt(document.getElementById('inv_Oneg').value) || 0
    };

    // Save inventory to localStorage
    user.availableBloodUnits = bloodUnits;
    const all = JSON.parse(localStorage.getItem('dbn_users') || '[]');
    const idx = all.findIndex(u => u.id === user.id);
    if (idx !== -1) { all[idx].availableBloodUnits = bloodUnits; localStorage.setItem('dbn_users', JSON.stringify(all)); }
    Auth.setAuth(Auth.getToken(), user);

    showToast('Blood inventory updated!', 'success');
  });
});

function loadHospitalDashboard() {
  const user = Auth.getUser();
  if (!user) return;

  const allReqs = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
  const hospitalName = user.hospitalName || '';
  const myReqs = allReqs.filter(r => r.hospitalName.toLowerCase() === hospitalName.toLowerCase());

  document.getElementById('hTotalReq').textContent = myReqs.length;
  document.getElementById('hPendingReq').textContent = myReqs.filter(r => r.status === 'pending').length;
  document.getElementById('hApprovedReq').textContent = myReqs.filter(r => r.status === 'approved').length;
  document.getElementById('hEmergencyReq').textContent = myReqs.filter(r => r.urgency === 'emergency' && r.status === 'pending').length;

  // Load inventory values
  const units = user.availableBloodUnits || {};
  const idMap = { 'A+': 'inv_Apos', 'A-': 'inv_Aneg', 'B+': 'inv_Bpos', 'B-': 'inv_Bneg',
                  'AB+': 'inv_ABpos', 'AB-': 'inv_ABneg', 'O+': 'inv_Opos', 'O-': 'inv_Oneg' };
  Object.entries(idMap).forEach(([group, id]) => {
    const el = document.getElementById(id);
    if (el) el.value = units[group] || 0;
  });
}

function loadHospitalRequests() {
  const container = document.getElementById('hospitalRequestsList');
  const user = Auth.getUser();
  if (!user) return;

  try {
    const filterEl = document.getElementById('requestFilter');
    const statusFilter = filterEl ? filterEl.value : '';
    const allReqs = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
    const hospitalName = user.hospitalName || '';
    let requests = allReqs.filter(r => r.hospitalName.toLowerCase() === hospitalName.toLowerCase());
    if (statusFilter) requests = requests.filter(r => r.status === statusFilter);

    if (requests.length === 0) {
      container.innerHTML = `<div class="empty-state py-4"><i class="fas fa-inbox"></i><h5>No requests found</h5></div>`;
      return;
    }

    container.innerHTML = `
      <div class="table-responsive">
        <table class="table table-custom">
          <thead>
            <tr><th>Patient</th><th>Blood Group</th><th>Units</th><th>Urgency</th><th>Status</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            ${requests.map(req => `
              <tr>
                <td><strong>${req.patientName || 'N/A'}</strong><br><small class="text-muted">${req.patientPhone || ''}</small></td>
                <td><span class="blood-badge" style="width:36px;height:36px;font-size:0.75rem">${req.bloodGroup}</span></td>
                <td>${req.unitsNeeded}</td>
                <td><span class="status-badge status-${req.urgency === 'emergency' ? 'emergency' : 'pending'}">${req.urgency}</span></td>
                <td><span class="status-badge status-${req.status}">${req.status}</span></td>
                <td><small>${formatDate(req.createdAt)}</small></td>
                <td>
                  ${req.status === 'pending' ? `
                    <div class="d-flex gap-1">
                      <button class="btn btn-sm btn-success rounded-pill px-2" onclick="updateRequestStatus('${req.id}','approved')">
                        <i class="fas fa-check"></i>
                      </button>
                      <button class="btn btn-sm btn-danger rounded-pill px-2" onclick="updateRequestStatus('${req.id}','rejected')">
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  ` : '<span class="text-muted">—</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  } catch (e) {
    container.innerHTML = `<div class="empty-state py-4"><i class="fas fa-exclamation-circle"></i><p>Unable to load requests</p></div>`;
  }
}

function updateRequestStatus(requestId, status) {
  const allReqs = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
  const idx = allReqs.findIndex(r => r.id === requestId);
  if (idx !== -1) {
    allReqs[idx].status = status;
    localStorage.setItem('dbn_blood_requests', JSON.stringify(allReqs));
  }
  showToast(`Request ${status}!`, 'success');
  loadHospitalDashboard();
  loadHospitalRequests();
}
