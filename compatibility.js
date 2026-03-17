/**
 * Blood Compatibility Checker & Donation Eligibility Calculator
 */

// Blood compatibility matrix: donor -> can give to
const canDonateTo = {
  'A+': ['A+', 'AB+'],
  'A-': ['A+', 'A-', 'AB+', 'AB-'],
  'B+': ['B+', 'AB+'],
  'B-': ['B+', 'B-', 'AB+', 'AB-'],
  'AB+': ['AB+'],
  'AB-': ['AB+', 'AB-'],
  'O+': ['A+', 'B+', 'AB+', 'O+'],
  'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

document.addEventListener('DOMContentLoaded', () => {
  renderCompatibilityTable();
});

function renderCompatibilityTable() {
  const tbody = document.getElementById('compatibilityTable');

  tbody.innerHTML = bloodGroups.map(donor => `
    <tr>
      <td style="font-weight:700;background:var(--gray-100)">
        <span class="blood-badge" style="width:34px;height:34px;font-size:0.7rem">${donor}</span>
      </td>
      ${bloodGroups.map(recipient => {
    const isCompatible = canDonateTo[donor].includes(recipient);
    return `<td class="${isCompatible ? 'compatible' : 'incompatible'}">${isCompatible ? '✓' : '✗'}</td>`;
  }).join('')}
    </tr>
  `).join('');
}

function checkCompatibility() {
  const donor = document.getElementById('donorType').value;
  const recipient = document.getElementById('recipientType').value;
  const result = document.getElementById('compatResult');

  if (!donor || !recipient) {
    result.innerHTML = '';
    return;
  }

  const isCompatible = canDonateTo[donor].includes(recipient);

  result.innerHTML = `
    <div class="eligibility-result ${isCompatible ? 'eligible' : 'not-eligible'} mt-3">
      <i class="fas ${isCompatible ? 'fa-check-circle' : 'fa-times-circle'}" style="font-size:2rem"></i>
      <h5 class="mt-2 mb-1">${isCompatible ? 'Compatible!' : 'Not Compatible'}</h5>
      <p class="mb-0" style="font-size:0.95rem">
        ${isCompatible ?
      `<strong>${donor}</strong> blood CAN be donated to <strong>${recipient}</strong> recipient.` :
      `<strong>${donor}</strong> blood CANNOT be donated to <strong>${recipient}</strong> recipient.`}
      </p>
    </div>
  `;
}

function checkEligibility() {
  const age = parseInt(document.getElementById('eligAge').value);
  const weight = parseFloat(document.getElementById('eligWeight').value);
  const lastDonation = document.getElementById('eligLastDonation').value;
  const healthy = document.getElementById('eligHealthy').checked;
  const result = document.getElementById('eligibilityResult');

  const issues = [];

  if (!age || isNaN(age)) { result.innerHTML = '<p class="text-danger mt-2">Please enter your age</p>'; return; }
  if (age < 18) issues.push('You must be at least 18 years old');
  if (age > 65) issues.push('Maximum age for donation is typically 65 years');
  if (!weight || weight < 50) issues.push('You must weigh at least 50 kg (110 lbs)');
  if (!healthy) issues.push('You must be in good general health');

  if (lastDonation) {
    const lastDate = new Date(lastDonation);
    const daysSince = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
    if (daysSince < 56) {
      issues.push(`You must wait at least 56 days between donations (${56 - daysSince} days remaining)`);
    }
  }

  const eligible = issues.length === 0;

  result.innerHTML = `
    <div class="eligibility-result ${eligible ? 'eligible' : 'not-eligible'}">
      <i class="fas ${eligible ? 'fa-check-circle' : 'fa-exclamation-triangle'}" style="font-size:2rem"></i>
      <h5 class="mt-2 mb-1">${eligible ? 'You are Eligible!' : 'Not Eligible Currently'}</h5>
      ${eligible ?
      '<p class="mb-0">You meet all the basic criteria for blood donation. 🎉</p>' :
      `<ul class="text-start mt-2 mb-0" style="font-size:0.9rem">${issues.map(i => `<li>${i}</li>`).join('')}</ul>`
    }
    </div>
  `;
}
