/**
 * Donor Dashboard Logic - localStorage only, no backend needed
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth(['donor'])) return;
  loadDonorDashboard();
  loadNearbyRequests();
});

function loadDonorDashboard() {
  const user = Auth.getUser();
  if (!user) return;

  document.getElementById('userName').textContent = user.name || 'Donor';
  document.getElementById('userEmail').textContent = user.email || '';
  document.getElementById('userBloodGroup').textContent = user.bloodGroup || '?';

  const donations = getDonorDonations(user.id);
  document.getElementById('totalDonations').textContent = donations.length;

  if (user.lastDonationDate) {
    document.getElementById('lastDonation').textContent = formatDate(user.lastDonationDate);
    const nextDate = new Date(new Date(user.lastDonationDate).getTime() + 56 * 24 * 60 * 60 * 1000);
    document.getElementById('nextEligible').textContent = formatDate(nextDate);
  } else {
    document.getElementById('lastDonation').textContent = 'N/A';
    document.getElementById('nextEligible').textContent = 'Ready Now';
  }

  updateAvailabilityUI(user.isAvailable !== false);
  renderDonationHistory(donations);
}

function getDonorDonations(userId) {
  try {
    const all = JSON.parse(localStorage.getItem('dbn_donations') || '[]');
    return all.filter(d => d.donorId === userId);
  } catch { return []; }
}

function updateAvailabilityUI(available) {
  const btn = document.getElementById('availabilityBtn');
  const text = document.getElementById('availabilityText');
  if (available) {
    btn.className = 'btn btn-success btn-sm rounded-pill';
    text.textContent = 'Available for Donation';
  } else {
    btn.className = 'btn btn-outline-secondary btn-sm rounded-pill';
    text.textContent = 'Not Available';
  }
}

function toggleAvailability() {
  const user = Auth.getUser();
  if (!user) return;
  const newStatus = user.isAvailable === false ? true : false;
  user.isAvailable = newStatus;

  // Update in users list
  const all = JSON.parse(localStorage.getItem('dbn_users') || '[]');
  const idx = all.findIndex(u => u.id === user.id);
  if (idx !== -1) { all[idx].isAvailable = newStatus; localStorage.setItem('dbn_users', JSON.stringify(all)); }

  Auth.setAuth(Auth.getToken(), user);
  updateAvailabilityUI(newStatus);
  showToast(newStatus ? 'You are now available for donation!' : 'You are now marked as unavailable.', 'success');
}

function loadNearbyRequests() {
  const container = document.getElementById('emergencyRequestsList');
  const user = Auth.getUser();
  if (!user) return;

  try {
    const all = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
    const matching = all.filter(r => r.bloodGroup === user.bloodGroup && r.status === 'pending');

    document.getElementById('nearbyRequests').textContent = matching.length;

    if (matching.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-4">
          <i class="fas fa-check-circle" style="color:var(--success)"></i>
          <h5>No emergency requests</h5>
          <p>All clear! We'll notify you when someone needs your blood type.</p>
        </div>`;
      return;
    }

    container.innerHTML = matching.map(req => `
      <div class="p-3 mb-2 rounded-3 ${req.urgency === 'emergency' ? 'emergency-alert' : 'border'}">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              ${req.urgency === 'emergency' ?
                '<span class="badge bg-white text-danger"><i class="fas fa-exclamation-triangle me-1"></i>EMERGENCY</span>' :
                '<span class="status-badge status-pending">Normal</span>'}
              <span class="blood-badge" style="width:36px;height:36px;font-size:0.8rem">${req.bloodGroup}</span>
            </div>
            <h6 class="${req.urgency === 'emergency' ? 'text-white' : ''} mb-1">${req.hospitalName}</h6>
            <small class="${req.urgency === 'emergency' ? 'text-white-50' : 'text-muted'}">
              ${req.unitsNeeded} unit(s) needed • ${timeAgo(req.createdAt)}
            </small>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-sm ${req.urgency === 'emergency' ? 'btn-light' : 'btn-danger'} rounded-pill px-3"
                    onclick="respondToRequest('${req.id}', 'accepted')">
              <i class="fas fa-check me-1"></i> Accept
            </button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div class="empty-state py-4"><i class="fas fa-info-circle"></i><p>Unable to load requests.</p></div>`;
  }
}

function respondToRequest(requestId, response) {
  const all = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
  const idx = all.findIndex(r => r.id === requestId);
  if (idx !== -1) {
    all[idx].status = 'fulfilled';
    localStorage.setItem('dbn_blood_requests', JSON.stringify(all));
  }
  showToast('You have accepted the donation request!', 'success');
  loadNearbyRequests();
}

function renderDonationHistory(donations) {
  const container = document.getElementById('donationHistory');
  if (!donations || donations.length === 0) return;

  container.innerHTML = `
    <div class="table-responsive">
      <table class="table table-custom">
        <thead><tr><th>Date</th><th>Hospital</th><th>Units</th></tr></thead>
        <tbody>
          ${donations.map(d => `
            <tr>
              <td>${formatDate(d.date)}</td>
              <td>${d.hospital || 'N/A'}</td>
              <td>${d.units || 1}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}
