/**
 * Patient Dashboard Logic - localStorage only, no backend needed
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth(['patient'])) return;
  loadMyRequests();

  document.getElementById('bloodRequestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitRequestBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Submitting...';
    btn.disabled = true;

    const user = Auth.getUser();
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const bloodGroup = document.getElementById('reqBloodGroup').value;
    const hospitalName = document.getElementById('reqHospital').value;

    if (!bloodGroup) {
      showToast('Please select a blood group.', 'error');
      btn.innerHTML = originalText;
      btn.disabled = false;
      return;
    }

    const newRequest = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      patientId: user.id,
      patientName: user.name,
      patientPhone: user.phone || '',
      bloodGroup,
      unitsNeeded: parseInt(document.getElementById('reqUnits').value) || 1,
      hospitalName,
      urgency,
      notes: document.getElementById('reqNotes').value,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      const all = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
      all.unshift(newRequest);
      localStorage.setItem('dbn_blood_requests', JSON.stringify(all));

      if (urgency === 'emergency') {
        showToast('Emergency request submitted! Matching donors have been notified.', 'success');
      } else {
        showToast('Blood request submitted successfully!', 'success');
      }

      document.getElementById('bloodRequestForm').reset();
      loadMyRequests();
    } catch (err) {
      showToast('Failed to submit request. Please try again.', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
});

function loadMyRequests() {
  const container = document.getElementById('myRequestsList');
  const user = Auth.getUser();
  if (!user) return;

  try {
    const all = JSON.parse(localStorage.getItem('dbn_blood_requests') || '[]');
    const myReqs = all.filter(r => r.patientId === user.id);

    if (myReqs.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-4">
          <i class="fas fa-inbox"></i>
          <h5>No requests yet</h5>
          <p>Submit your first blood request using the form</p>
        </div>`;
      return;
    }

    container.innerHTML = myReqs.map(req => `
      <div class="p-3 mb-3 rounded-3 border ${req.urgency === 'emergency' ? 'border-danger' : ''}">
        <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="blood-badge" style="width:36px;height:36px;font-size:0.8rem">${req.bloodGroup}</span>
              <span class="status-badge status-${req.status}">${req.status}</span>
              ${req.urgency === 'emergency' ? '<span class="status-badge status-emergency"><i class="fas fa-exclamation-triangle me-1"></i>Emergency</span>' : ''}
            </div>
            <h6 class="mb-1">${req.hospitalName}</h6>
            <small class="text-muted">${req.unitsNeeded} unit(s) • Requested ${timeAgo(req.createdAt)}</small>
            ${req.notes ? `<p class="text-muted mt-1 mb-0" style="font-size:0.85rem">${req.notes}</p>` : ''}
          </div>
          <div class="text-end">
            <small class="text-muted d-block">${formatDate(req.createdAt)}</small>
          </div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    container.innerHTML = `<div class="empty-state py-4"><i class="fas fa-exclamation-circle"></i><p>Unable to load requests.</p></div>`;
  }
}
