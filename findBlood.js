/**
 * Find Blood - Search & Filter Logic
 * Uses localStorage - no backend needed
 */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const bg = params.get('bg');
  if (bg) {
    document.getElementById('searchBloodGroup').value = bg;
    searchDonors();
  }

  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    searchDonors();
  });
});

function searchDonors() {
  const bloodGroup = document.getElementById('searchBloodGroup').value;
  const available = document.getElementById('searchAvailable').value;
  const container = document.getElementById('searchResults');

  container.innerHTML = '<div class="loading-spinner"><div class="spinner-blood"></div></div>';

  try {
    const allUsers = JSON.parse(localStorage.getItem('dbn_users') || '[]');
    let donors = allUsers.filter(u => u.role === 'donor');

    if (bloodGroup) donors = donors.filter(d => d.bloodGroup === bloodGroup);
    if (available === 'true') donors = donors.filter(d => d.isAvailable !== false);
    if (available === 'false') donors = donors.filter(d => d.isAvailable === false);

    if (donors.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-5">
          <i class="fas fa-user-slash"></i>
          <h5>No donors found</h5>
          <p>Try adjusting your search criteria or <a href="./register.html">register as a donor</a></p>
        </div>`;
      return;
    }

    container.innerHTML = `
      <p class="text-muted mb-3"><strong>${donors.length}</strong> donor(s) found</p>
      <div class="row g-3">
        ${donors.map(donor => `
          <div class="col-lg-6">
            <div class="donor-card">
              <div class="blood-badge" style="flex-shrink:0">${donor.bloodGroup || '?'}</div>
              <div class="donor-info flex-grow-1">
                <h6>${donor.name}</h6>
                <p><i class="fas fa-map-marker-alt me-1 text-danger"></i>${donor.address || 'Location not provided'}</p>
                <p><i class="fas fa-phone me-1 text-muted"></i>${donor.phone}</p>
                <div class="d-flex gap-2 mt-2">
                  ${donor.isAvailable !== false ?
                    '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Available</span>' :
                    '<span class="badge bg-secondary">Unavailable</span>'}
                </div>
              </div>
              <a href="tel:${donor.phone}" class="btn btn-sm btn-outline-danger rounded-pill">
                <i class="fas fa-phone"></i>
              </a>
            </div>
          </div>
        `).join('')}
      </div>`;
  } catch (e) {
    container.innerHTML = `
      <div class="empty-state py-5">
        <i class="fas fa-exclamation-circle"></i>
        <h5>Error searching donors</h5>
        <p>Please try again</p>
      </div>`;
  }
}
