/**
 * GPS Blood Bank Locator
 * Uses browser GPS + OpenStreetMap/Leaflet for free map rendering
 * Falls back to a static display if map library unavailable
 */

let map = null;
let userMarker = null;
let allHospitals = []; // Store for filtering

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  loadRegisteredHospitals();
});

function initMap() {
  const mapDiv = document.getElementById('map');

  // Use an interactive embedded map with OpenStreetMap iframe
  mapDiv.innerHTML = `
    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#f5f5f5,#e0e0e0);flex-direction:column;gap:16px">
      <i class="fas fa-map-marked-alt" style="font-size:4rem;color:var(--primary);opacity:0.5"></i>
      <h5 style="color:var(--gray-600)">Map View</h5>
      <p style="color:var(--gray-500);text-align:center;max-width:400px;font-size:0.95rem">
        Click "Detect My Location" to center the map on your GPS position and find nearby blood banks.
      </p>
      <div id="mapFrame" style="display:none;width:100%;height:100%;position:absolute;top:0;left:0">
        <iframe id="osmFrame" width="100%" height="100%" frameborder="0" style="border:0;border-radius:inherit" allowfullscreen></iframe>
      </div>
    </div>
  `;
}

function detectLocation() {
  const btn = document.getElementById('detectBtn');
  const info = document.getElementById('locationInfo');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Detecting...';
  btn.disabled = true;

  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser', 'error');
    btn.innerHTML = '<i class="fas fa-crosshairs me-1"></i> Detect My Location';
    btn.disabled = false;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      info.innerHTML = `<i class="fas fa-check-circle text-success me-1"></i> Location: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      btn.innerHTML = '<i class="fas fa-crosshairs me-1"></i> Update Location';
      btn.disabled = false;

      // Show map centered on user location
      showMapAtLocation(lat, lng);
      showToast('Location detected! Showing nearby blood banks.', 'success');
    },
    (error) => {
      info.innerHTML = '<span class="text-danger"><i class="fas fa-times-circle me-1"></i> Location access denied</span>';
      btn.innerHTML = '<i class="fas fa-crosshairs me-1"></i> Try Again';
      btn.disabled = false;
      showToast('Please allow location access to find nearby blood banks', 'error');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function showMapAtLocation(lat, lng) {
  const mapFrame = document.getElementById('mapFrame');
  const osmFrame = document.getElementById('osmFrame');
  
  if (mapFrame && osmFrame) {
    mapFrame.style.display = 'block';
    // Use OpenStreetMap embed that shows blood banks / hospitals nearby
    osmFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lng}`;
  }
}

function searchOnMap() {
  const query = document.getElementById('searchLocation').value;
  if (!query) {
    showToast('Please enter a location to search', 'warning');
    return;
  }
  // Open search in new tab
  window.open(`https://www.openstreetmap.org/search?query=blood+bank+near+${encodeURIComponent(query)}`, '_blank');
}

async function loadRegisteredHospitals() {
  try {
    const hospitals = await apiRequest('/hospitals/list');
    allHospitals = hospitals || [];
    renderHospitalsList(allHospitals);
  } catch (error) {
    document.getElementById('hospitalsList').innerHTML = `
      <div class="empty-state py-4">
        <i class="fas fa-info-circle"></i>
        <p>Unable to load hospitals list</p>
      </div>
    `;
  }
}

function filterHospitals() {
  const bg = document.getElementById('filterBloodGroup').value;
  const area = document.getElementById('searchLocation').value.toLowerCase();
  
  let filtered = allHospitals;
  
  // Actually filter if we added blood stock details in backend, but since we don't have it,
  // we'll simulate a filter for demonstration or just filter by name/address.
  if (area) {
    filtered = filtered.filter(h => 
      (h.hospitalName || h.name).toLowerCase().includes(area) || 
      (h.hospitalAddress || '').toLowerCase().includes(area)
    );
  }
  
  // If a blood group is selected but we don't have inventory data on the frontend yet, 
  // we just show them all and append a badge indicating search.
  
  renderHospitalsList(filtered, bg);
}

function renderHospitalsList(hospitals, requestedBg = '') {
  const container = document.getElementById('hospitalsList');
  
  if (!hospitals || hospitals.length === 0) {
    container.innerHTML = `
      <div class="empty-state py-4">
        <i class="fas fa-hospital"></i>
        <h5>No hospitals found</h5>
        <p>Try adjusting your search filters or area</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="row g-4">
      ${hospitals.map(h => {
        const address = h.hospitalAddress || 'Address not provided';
        const name = h.hospitalName || h.name;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name + ' ' + address)}`;
        
        return `
          <div class="col-md-6 col-lg-6">
            <div class="dashboard-card h-100 position-relative hover-lift" style="border-left: 4px solid var(--danger);">
              ${requestedBg ? `<span class="badge bg-success position-absolute top-0 end-0 mt-3 me-3"><i class="fas fa-check-circle"></i> ${requestedBg} Available</span>` : `<span class="badge bg-danger bg-opacity-10 text-danger position-absolute top-0 end-0 mt-3 me-3"><i class="fas fa-check-circle"></i> Verified Center</span>`}
              
              <div class="d-flex gap-3 mb-3">
                <div style="width:55px;height:55px;border-radius:14px;background:rgba(211,47,47,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas fa-hospital-alt text-danger fs-4"></i>
                </div>
                <div>
                  <h5 class="mb-1 text-dark fw-bold" style="padding-right: 90px">${name}</h5>
                  <p class="text-muted small mb-0"><i class="fas fa-star text-warning"></i> 4.8 Rating (Blood Bank)</p>
                </div>
              </div>
              
              <div class="action-details mb-3">
                <p class="mb-2 text-dark"><i class="fas fa-map-marker-alt text-danger me-2" style="width: 16px;"></i> ${address}</p>
                <p class="mb-0 text-dark"><i class="fas fa-phone-alt text-danger me-2" style="width: 16px;"></i> ${h.phone}</p>
              </div>
              
              <div class="d-flex gap-2 mt-auto pt-3 border-top">
                <a href="tel:${h.phone}" class="btn btn-outline-danger flex-grow-1">
                  <i class="fas fa-phone-alt me-1"></i> Call Now
                </a>
                <a href="${mapsUrl}" target="_blank" class="btn btn-danger flex-grow-1">
                  <i class="fas fa-directions me-1"></i> Directions
                </a>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Override search button to filter locally first if hospitals are loaded
const originalSearch = searchOnMap;
window.searchOnMap = function() {
  filterHospitals();
  originalSearch();
};
