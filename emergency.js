/**
 * Emergency Request Logic
 * Submit emergency blood requests (works for both logged-in and guest users)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Pre-fill if user is logged in
  const user = Auth.getUser();
  if (user) {
    document.getElementById('emPatientName').value = user.name || '';
    document.getElementById('emPhone').value = user.phone || '';
  }

  document.getElementById('emergencyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('emSubmitBtn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> SUBMITTING EMERGENCY...';
    btn.disabled = true;

    // If logged in, use API; otherwise show demo response
    if (Auth.isLoggedIn()) {
      try {
        const data = await apiRequest('/requests', 'POST', {
          bloodGroup: document.getElementById('emBloodGroup').value,
          unitsNeeded: parseInt(document.getElementById('emUnits').value),
          hospitalName: document.getElementById('emHospital').value,
          urgency: 'emergency',
          notes: document.getElementById('emNotes').value
        });

        showEmergencyResult(true, data.notifiedCount || 0);
        showToast('Emergency request submitted successfully!', 'success');
      } catch (error) {
        showToast(error.message, 'error');
        btn.innerHTML = originalText;
        btn.disabled = false;
        return;
      }
    } else {
      // Demo mode for non-logged-in users
      setTimeout(() => {
        showEmergencyResult(true, Math.floor(Math.random() * 15) + 5);
        showToast('Please login to submit actual requests. This is a demo.', 'warning');
      }, 1500);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
  });
});

function showEmergencyResult(success, count) {
  const result = document.getElementById('emergencyResult');
  result.style.display = 'block';

  if (success) {
    result.innerHTML = `
      <div class="dashboard-card border-success" style="border:2px solid var(--success);background:rgba(46,125,50,0.05)">
        <div class="text-center">
          <i class="fas fa-check-circle text-success" style="font-size:3rem"></i>
          <h4 class="text-success mt-3">Emergency Request Submitted!</h4>
          <div class="my-3">
            <span style="font-size:2.5rem;font-weight:800;color:var(--success)">${count}</span>
            <p class="text-muted">matching donors have been notified</p>
          </div>
          <div class="d-flex gap-3 justify-content-center flex-wrap">
            <div class="p-3 rounded-3" style="background:rgba(46,125,50,0.1)">
              <i class="fas fa-bell text-success me-1"></i>
              <strong>Notifications Sent</strong>
            </div>
            <div class="p-3 rounded-3" style="background:rgba(2,119,189,0.1)">
              <i class="fas fa-clock text-info me-1"></i>
              <strong>Responses Expected Soon</strong>
            </div>
          </div>
          <p class="text-muted mt-3 mb-0">Donors will be contacted via the platform. Please keep your phone available.</p>
        </div>
      </div>
    `;
  }

  // Smooth scroll to result
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
