// ===== DATA LAYER (localStorage) =====
const STORAGE_KEY = 'blogify_st5_episodes';

function loadEpisodes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveEpisodes(episodes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes));
}

// ===== RENDER =====
function renderEpisodes() {
  const episodes = loadEpisodes();
  const grid = document.getElementById('episodesGrid');
  const empty = document.getElementById('emptyState');
  grid.innerHTML = '';

  if (episodes.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  // Sort by episode number
  episodes.sort((a, b) => a.epNumber - b.epNumber);

  episodes.forEach((ep, idx) => {
    const card = document.createElement('div');
    card.className = 'glass-card blog-card';
    card.onclick = () => openDetail(idx);

    const investClass = ep.gotInvestment === 'Yes' ? 'yes' : 'no';
    const investLabel = ep.gotInvestment === 'Yes' ? '✅ Got Investment' : '❌ No Deal';

    card.innerHTML = `
      <span class="ep-number">EP ${ep.epNumber}</span>
      <div class="card-icon">🦈</div>
      <h3>${ep.companyName}</h3>
      <span class="ep-investment ${investClass}">${investLabel}</span>
      <p class="card-desc">${ep.companyInfo ? ep.companyInfo.substring(0, 100) + (ep.companyInfo.length > 100 ? '…' : '') : 'No description provided.'}</p>
      <p class="ep-meta">👤 ${ep.pitcherName || '—'}</p>
    `;
    grid.appendChild(card);
  });
}

// ===== DETAIL MODAL =====
function openDetail(idx) {
  const episodes = loadEpisodes();
  episodes.sort((a, b) => a.epNumber - b.epNumber);
  const ep = episodes[idx];
  if (!ep) return;

  const investClass = ep.gotInvestment === 'Yes' ? 'yes' : 'no';
  const investLabel = ep.gotInvestment === 'Yes' ? '✅ Yes — Got Investment' : '❌ No Deal';

  document.getElementById('modalContent').innerHTML = `
    <div class="detail-header">
      <p class="detail-ep">Shark Tank S5 · Episode ${ep.epNumber}</p>
      <h2>${ep.companyName}</h2>
      <span class="ep-investment ${investClass}">${investLabel}</span>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <label>Pitcher</label>
        <p>${ep.pitcherName || '—'}</p>
      </div>
      <div class="detail-item">
        <label>Sharks</label>
        <p>${ep.sharksName || '—'}</p>
      </div>
    </div>

    <div class="detail-full">
      <label>Company Info</label>
      <p>${ep.companyInfo || '—'}</p>
    </div>

    <div class="detail-full">
      <label>Other Info / Deal Details</label>
      <p>${ep.otherInfo || '—'}</p>
    </div>

    <div class="detail-actions">
      <button class="edit-btn" onclick="editEpisode(${idx})">✏️ Edit</button>
      <button class="delete-btn" onclick="deleteEpisode(${idx})">🗑 Delete</button>
    </div>
  `;

  document.getElementById('detailModal').classList.add('active');
}

function closeDetail() {
  document.getElementById('detailModal').classList.remove('active');
}

function closeDetailModal(e) {
  if (e.target === document.getElementById('detailModal')) closeDetail();
}

// ===== ADD MODAL =====
function openModal() {
  document.getElementById('formTitle').textContent = 'Add New Episode';
  document.getElementById('episodeForm').reset();
  document.getElementById('editIndex').value = -1;
  document.getElementById('addModal').classList.add('active');
}

function closeAdd() {
  document.getElementById('addModal').classList.remove('active');
}

function closeAddModal(e) {
  if (e.target === document.getElementById('addModal')) closeAdd();
}

// ===== SAVE =====
function saveEpisode(e) {
  e.preventDefault();

  const editIdx = parseInt(document.getElementById('editIndex').value);
  const episodes = loadEpisodes();

  const ep = {
    epNumber:      parseInt(document.getElementById('epNumber').value),
    pitcherName:   document.getElementById('pitcherName').value.trim(),
    sharksName:    document.getElementById('sharksName').value.trim(),
    companyName:   document.getElementById('companyName').value.trim(),
    companyInfo:   document.getElementById('companyInfo').value.trim(),
    gotInvestment: document.getElementById('gotInvestment').value,
    otherInfo:     document.getElementById('otherInfo').value.trim(),
  };

  if (editIdx >= 0) {
    // Find real index after sort
    const sorted = [...episodes].sort((a, b) => a.epNumber - b.epNumber);
    const realIdx = episodes.indexOf(sorted[editIdx]);
    episodes[realIdx] = ep;
  } else {
    episodes.push(ep);
  }

  saveEpisodes(episodes);
  closeAdd();
  renderEpisodes();
}

// ===== EDIT =====
function editEpisode(idx) {
  const episodes = loadEpisodes();
  episodes.sort((a, b) => a.epNumber - b.epNumber);
  const ep = episodes[idx];

  document.getElementById('formTitle').textContent = 'Edit Episode';
  document.getElementById('editIndex').value = idx;
  document.getElementById('epNumber').value = ep.epNumber;
  document.getElementById('pitcherName').value = ep.pitcherName;
  document.getElementById('sharksName').value = ep.sharksName;
  document.getElementById('companyName').value = ep.companyName;
  document.getElementById('companyInfo').value = ep.companyInfo;
  document.getElementById('gotInvestment').value = ep.gotInvestment;
  document.getElementById('otherInfo').value = ep.otherInfo;

  closeDetail();
  document.getElementById('addModal').classList.add('active');
}

// ===== DELETE =====
function deleteEpisode(idx) {
  if (!confirm('Delete this episode?')) return;
  const episodes = loadEpisodes();
  episodes.sort((a, b) => a.epNumber - b.epNumber);
  const sorted = [...episodes].sort((a, b) => a.epNumber - b.epNumber);
  const realIdx = episodes.indexOf(sorted[idx]);
  episodes.splice(realIdx, 1);
  saveEpisodes(episodes);
  closeDetail();
  renderEpisodes();
}

// ===== INIT =====
renderEpisodes();
