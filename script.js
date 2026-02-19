// ============================================================
// Firebase Config — ersätt med dina egna värden om nödvändigt
// ============================================================
const firebaseConfig = {
    apiKey: "AIzaSyExample",
    authDomain: "fordonsbok.firebaseapp.com",
    projectId: "fordonsbok",
    storageBucket: "fordonsbok.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Initiera Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ============================================================
// Canvas bakgrundsanimation (odometer-stil)
// ============================================================
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now() / 1000;
    const cols = Math.ceil(canvas.width / 60) + 1;
    const rows = Math.ceil(canvas.height / 60) + 1;

    ctx.font = '12px Space Mono, monospace';
    ctx.fillStyle = 'rgba(255, 77, 0, 0.04)';

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const val = Math.floor((Math.sin(i * 0.5 + time) + Math.cos(j * 0.5 + time)) * 50000) % 10;
            ctx.fillText(Math.abs(val), i * 60, j * 60);
        }
    }
    animationId = requestAnimationFrame(drawBackground);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawBackground();

// ============================================================
// Auth — Login / Register / Glömt lösenord
// ============================================================
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.querySelector(`.auth-tab[onclick="switchAuthTab('${tab}')"]`).classList.add('active');
    document.getElementById(tab === 'login' ? 'loginForm' : 'registerForm').classList.add('active');
    hideAuthError();
}

function showAuthError(msg) {
    const el = document.getElementById('authError');
    el.textContent = msg;
    el.style.display = 'block';
}

function hideAuthError() {
    document.getElementById('authError').style.display = 'none';
}

async function handleLogin(e) {
    e.preventDefault();
    hideAuthError();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        showAuthError(translateFirebaseError(err.code));
    }
}

async function handleRegister(e) {
    e.preventDefault();
    hideAuthError();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    if (password !== confirm) { showAuthError('Lösenorden matchar inte.'); return; }
    if (password.length < 6) { showAuthError('Lösenordet måste vara minst 6 tecken.'); return; }
    try {
        await auth.createUserWithEmailAndPassword(email, password);
    } catch (err) {
        showAuthError(translateFirebaseError(err.code));
    }
}

async function handleForgotPassword() {
    const email = document.getElementById('loginEmail').value;
    if (!email) { showAuthError('Ange din e-postadress ovan för att återställa lösenordet.'); return; }
    try {
        await auth.sendPasswordResetEmail(email);
        showAuthError('✓ Återställningslänk skickad! Kolla din e-post.');
        document.getElementById('authError').style.background = 'rgba(0,255,136,0.15)';
        document.getElementById('authError').style.borderColor = 'rgba(0,255,136,0.4)';
        document.getElementById('authError').style.color = '#00FF88';
    } catch (err) {
        showAuthError(translateFirebaseError(err.code));
    }
}

function translateFirebaseError(code) {
    const errors = {
        'auth/user-not-found': 'Ingen användare med denna e-postadress.',
        'auth/wrong-password': 'Felaktigt lösenord.',
        'auth/email-already-in-use': 'E-postadressen används redan.',
        'auth/invalid-email': 'Ogiltig e-postadress.',
        'auth/too-many-requests': 'För många försök. Vänta en stund och försök igen.',
        'auth/network-request-failed': 'Nätverksfel. Kontrollera din anslutning.',
    };
    return errors[code] || 'Ett fel uppstod. Försök igen.';
}

async function handleLogout() {
    await auth.signOut();
}

// ============================================================
// Auth state observer
// ============================================================
auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        loadVehicles();
    } else {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appScreen').style.display = 'none';
        document.getElementById('vehiclesList').innerHTML = '<div class="loading">Laddar fordon</div>';
    }
});

// ============================================================
// Fordon — CRUD
// ============================================================
let currentVehicleId = null;

async function loadVehicles() {
    const user = auth.currentUser;
    if (!user) return;
    const list = document.getElementById('vehiclesList');
    list.innerHTML = '<div class="loading">Laddar fordon</div>';

    try {
        const snap = await db.collection('users').doc(user.uid).collection('vehicles').orderBy('createdAt', 'desc').get();
        if (snap.empty) {
            list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚗</div><p>Inga fordon ännu.<br>Lägg till ditt första fordon!</p></div>`;
            return;
        }
        list.innerHTML = '';
        snap.forEach(doc => renderVehicleCard(doc.id, doc.data(), list));
    } catch (err) {
        list.innerHTML = `<div class="error-message">Kunde inte ladda fordon: ${err.message}</div>`;
    }
}

function renderVehicleCard(id, data, container) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.innerHTML = `
        <div class="vehicle-header">
            <div class="vehicle-reg">${data.reg || ''}</div>
            <button class="delete-btn" onclick="deleteVehicle(event, '${id}')">✕ Ta bort</button>
        </div>
        ${data.photoUrl ? `<img src="${data.photoUrl}" class="vehicle-photo" alt="Fordonsfoto">` : '<div class="no-photo">🚗</div>'}
        <div class="vehicle-info">
            <p><strong>Märke:</strong> ${data.brand || '—'}</p>
            <p><strong>Modell:</strong> ${data.model || '—'}</p>
            <p><strong>År:</strong> ${data.year || '—'}</p>
            <p><strong>Miltal:</strong> ${data.mileage ? data.mileage + ' km' : '—'}</p>
        </div>
        <span class="service-count">📋 ${data.serviceCount || 0} servicepost(er)</span>
    `;
    card.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) return;
        openVehicleModal(id, data);
    });
    container.appendChild(card);
}

function openAddVehicleModal() {
    document.getElementById('vehicleModalTitle').textContent = 'Nytt Fordon';
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehiclePhotoPreview').style.display = 'none';
    currentVehicleId = null;
    document.getElementById('vehicleModal').classList.add('active');
}

function closeVehicleModal() {
    document.getElementById('vehicleModal').classList.remove('active');
}

async function handleVehicleSubmit(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const data = {
        reg: document.getElementById('vehicleReg').value.toUpperCase(),
        brand: document.getElementById('vehicleBrand').value,
        model: document.getElementById('vehicleModel').value,
        year: document.getElementById('vehicleYear').value,
        mileage: document.getElementById('vehicleMileage').value,
        notes: document.getElementById('vehicleNotes').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Foto
    const photoFile = document.getElementById('vehiclePhoto').files[0];
    if (photoFile) {
        data.photoUrl = await uploadPhoto(photoFile, user.uid);
    }

    const ref = db.collection('users').doc(user.uid).collection('vehicles');
    if (currentVehicleId) {
        await ref.doc(currentVehicleId).update(data);
    } else {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        data.serviceCount = 0;
        await ref.add(data);
    }

    closeVehicleModal();
    loadVehicles();
}

async function deleteVehicle(e, id) {
    e.stopPropagation();
    if (!confirm('Ta bort fordonet och all servicehistorik?')) return;
    const user = auth.currentUser;
    await db.collection('users').doc(user.uid).collection('vehicles').doc(id).delete();
    loadVehicles();
}

// ============================================================
// Servicehistorik
// ============================================================
async function openVehicleModal(vehicleId, vehicleData) {
    currentVehicleId = vehicleId;
    document.getElementById('serviceModalTitle').textContent = `${vehicleData.reg} — Servicehistorik`;
    document.getElementById('serviceModal').classList.add('active');
    loadServiceHistory(vehicleId);
}

function closeServiceModal() {
    document.getElementById('serviceModal').classList.remove('active');
    currentVehicleId = null;
}

async function loadServiceHistory(vehicleId) {
    const user = auth.currentUser;
    const list = document.getElementById('serviceList');
    list.innerHTML = '<div class="loading">Laddar historik</div>';

    try {
        const snap = await db.collection('users').doc(user.uid)
            .collection('vehicles').doc(vehicleId)
            .collection('services').orderBy('date', 'desc').get();

        if (snap.empty) {
            list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔧</div><p>Ingen servicehistorik ännu.</p></div>`;
            return;
        }
        list.innerHTML = '';
        snap.forEach(doc => {
            const d = doc.data();
            const item = document.createElement('div');
            item.className = 'service-item';
            item.innerHTML = `
                <h4>${d.title || 'Service'}</h4>
                <div class="service-meta">
                    <span><strong>Datum:</strong> ${d.date || '—'}</span>
                    <span><strong>Miltal:</strong> ${d.mileage ? d.mileage + ' km' : '—'}</span>
                    <span><strong>Verkstad:</strong> ${d.workshop || '—'}</span>
                    <span><strong>Kostnad:</strong> ${d.cost ? d.cost + ' kr' : '—'}</span>
                </div>
                ${d.notes ? `<div class="service-notes">${d.notes}</div>` : ''}
                <button class="delete-btn" style="margin-top:10px" onclick="deleteService('${doc.id}')">✕ Ta bort</button>
            `;
            list.appendChild(item);
        });
    } catch (err) {
        list.innerHTML = `<div class="error-message">Fel: ${err.message}</div>`;
    }
}

function openAddServiceModal() {
    if (!currentVehicleId) return;
    document.getElementById('serviceForm').reset();
    document.getElementById('addServiceModal').classList.add('active');
}

function closeAddServiceModal() {
    document.getElementById('addServiceModal').classList.remove('active');
}

async function handleServiceSubmit(e) {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !currentVehicleId) return;

    const data = {
        title: document.getElementById('serviceTitle').value,
        date: document.getElementById('serviceDate').value,
        mileage: document.getElementById('serviceMileage').value,
        workshop: document.getElementById('serviceWorkshop').value,
        cost: document.getElementById('serviceCost').value,
        notes: document.getElementById('serviceNotes').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const vehicleRef = db.collection('users').doc(user.uid).collection('vehicles').doc(currentVehicleId);
    await vehicleRef.collection('services').add(data);
    await vehicleRef.update({ serviceCount: firebase.firestore.FieldValue.increment(1) });

    closeAddServiceModal();
    loadServiceHistory(currentVehicleId);
}

async function deleteService(serviceId) {
    if (!confirm('Ta bort denna servicepost?')) return;
    const user = auth.currentUser;
    const vehicleRef = db.collection('users').doc(user.uid).collection('vehicles').doc(currentVehicleId);
    await vehicleRef.collection('services').doc(serviceId).delete();
    await vehicleRef.update({ serviceCount: firebase.firestore.FieldValue.increment(-1) });
    loadServiceHistory(currentVehicleId);
}

// ============================================================
// Foto-uppladdning (base64 i Firestore)
// ============================================================
function uploadPhoto(file, uid) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function previewPhoto(input) {
    const preview = document.getElementById('vehiclePhotoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ============================================================
// Exportera data
// ============================================================
async function exportData() {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await db.collection('users').doc(user.uid).collection('vehicles').get();
    let csv = 'Reg,Märke,Modell,År,Miltal\n';
    snap.forEach(doc => {
        const d = doc.data();
        csv += `${d.reg},${d.brand},${d.model},${d.year},${d.mileage}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fordonsbok.csv';
    a.click();
    URL.revokeObjectURL(url);
}

// ============================================================
// Swish modal
// ============================================================
function openSwishModal() {
    document.getElementById('swishModal').classList.add('active');
}

function closeSwishModal() {
    document.getElementById('swishModal').classList.remove('active');
}
