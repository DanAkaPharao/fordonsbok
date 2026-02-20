import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';
import { t, getLocale, setLocale } from './translations.js';
import { getCurrencySymbol, getCurrencyCode, formatAmount } from './currencies.js';
import { mountSelector } from './LanguageCurrencySelector.js';
import { VEHICLE_TYPES, MAKES_BY_TYPE, MODELS_BY_MAKE, getTypeIcon, getTypeLabel } from './vehicleData.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWNyirIPfJU2nUbS5kL8fpmKyYguv6wz8",
    authDomain: "servicebook-af5ea.firebaseapp.com",
    projectId: "servicebook-af5ea",
    storageBucket: "servicebook-af5ea.firebasestorage.app",
    messagingSenderId: "887971730703",
    appId: "1:887971730703:web:a562f94f8dcbaa8ffc1a7a",
    measurementId: "G-EFB3J17B6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Make available globally
window.auth = auth;
window.db = db;
window.storage = storage;
window.firebaseModules = {
    collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, setDoc,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
    ref, uploadBytes, getDownloadURL, deleteObject
};

// ─── i18n: uppdatera alla data-i18n element + re-rendera ─────────────────────
// Debounce so multiple simultaneous localeChanged events (two widgets) only fire once
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        let val = t(key);
        if (val && val.includes('{currency}')) {
            val = val.replace('{currency}', getCurrencySymbol());
        }
        if (el.textContent !== val) el.textContent = val;
    });
    document.documentElement.lang = getLocale();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-i18n-selector]').forEach(el => mountSelector(el));
    queueMicrotask(() => applyTranslations());
});

document.addEventListener('localeChanged', () => {
    requestAnimationFrame(() => {
        applyTranslations();
        if (vehicles.length > 0) renderVehicles();
        // Bygg om fordonstyp-väljare med nytt språk
        const addSelector  = document.getElementById('vehicleTypeSelector');
        const editSelector = document.getElementById('editVehicleTypeSelector');
        if (addSelector) {
            const activeBtn = addSelector.querySelector('.vehicle-type-btn.active');
            buildVehicleTypeSelector('vehicleTypeSelector', activeBtn?.dataset.type || 'car');
        }
        if (editSelector) {
            const activeBtn = editSelector.querySelector('.vehicle-type-btn.active');
            buildVehicleTypeSelector('editVehicleTypeSelector', activeBtn?.dataset.type || 'car');
        }
        if (currentVehicleId && document.getElementById('vehicleDetailsModal').classList.contains('active')) {
            const vehicle = vehicles.find(v => v.id === currentVehicleId);
            if (vehicle) openVehicleDetails(vehicle.id);
        }
    });
});

document.addEventListener('currencyChanged', () => {
    requestAnimationFrame(() => {
        applyTranslations();
        if (vehicles.length > 0) renderVehicles();
        if (currentVehicleId && document.getElementById('vehicleDetailsModal').classList.contains('active')) {
            const vehicle = vehicles.find(v => v.id === currentVehicleId);
            if (vehicle) renderServiceList(vehicle);
        }
    });
});

// Auth state observer
onAuthStateChanged(auth, async (user) => {
    const isShare = await checkShareToken();
    if (isShare) return;

    if (user) {
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        window.currentUser = user;
        loadVehicles();
    } else {
        document.getElementById('authScreen').style.display = 'flex';
        document.getElementById('appScreen').style.display = 'none';
        window.currentUser = null;
        // Återställ inloggningsknappen om den fastnat i "Loggar in..."-läge
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = t('auth.loginBtn');
        }
    }
});

// ─── State ────────────────────────────────────────────────────────────────────
let vehicles = [];
let currentVehicleId = null;

// ─── Vehicle data now lives in vehicleData.js ─────────────────────────────────
// VEHICLE_TYPES, MAKES_BY_TYPE, MODELS_BY_MAKE, getTypeIcon, getTypeLabel
// are imported at the top of this file.

// ─── Auth functions ───────────────────────────────────────────────────────────
function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    if (tab === 'login') {
        document.querySelector('.auth-tab:first-child').classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelector('.auth-tab:last-child').classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
    hideAuthError();
}

function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideAuthError() {
    document.getElementById('authError').style.display = 'none';
}

async function forgotPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    if (!email) {
        alert(t('forgotPwd.enterEmailFirst'));
        document.getElementById('loginEmail').focus();
        return;
    }
    if (!confirm(t('forgotPwd.confirmSend', email))) return;
    try {
        await sendPasswordResetEmail(auth, email);
        alert(t('forgotPwd.successAlert', email));
    } catch (error) {
        let message = t('forgotPwd.sendFailed');
        if (error.code === 'auth/user-not-found') message = t('authErrors.userNotFound');
        else if (error.code === 'auth/invalid-email') message = t('authErrors.invalidEmail');
        alert(message);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    hideAuthError();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.textContent = t('auth.loggingIn');
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        let message = t('authErrors.loginFailed');
        if (error.code === 'auth/user-not-found') message = t('authErrors.userNotFound');
        else if (error.code === 'auth/wrong-password') message = t('authErrors.wrongPassword');
        else if (error.code === 'auth/invalid-email') message = t('authErrors.invalidEmail');
        else if (error.code === 'auth/invalid-credential') message = t('authErrors.invalidCredential');
        showAuthError(message);
        btn.disabled = false;
        btn.textContent = t('auth.loginBtn');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    hideAuthError();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const btn = document.getElementById('registerBtn');
    if (password !== passwordConfirm) { showAuthError(t('authErrors.passwordMismatch')); return; }
    btn.disabled = true;
    btn.textContent = t('auth.creatingAccount');
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
            uid: cred.user.uid,
            email: email,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        let message = t('authErrors.accountCreateFail');
        if (error.code === 'auth/email-already-in-use') message = t('authErrors.emailInUse');
        else if (error.code === 'auth/invalid-email') message = t('authErrors.invalidEmail');
        else if (error.code === 'auth/weak-password') message = t('authErrors.weakPassword');
        showAuthError(message);
        btn.disabled = false;
        btn.textContent = t('auth.registerBtn');
    }
}

async function handleLogout() {
    if (confirm(t('header.confirmLogout'))) {
        await signOut(auth);
    }
}

// ─── Fordonstyp-väljare ───────────────────────────────────────────────────────
function buildVehicleTypeSelector(containerId, selectedType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = VEHICLE_TYPES.map(vt => {
        const label = t(`vehicleTypes.${vt.id}`) || vt.label;
        return `
        <button type="button"
            class="vehicle-type-btn ${selectedType === vt.id ? 'active' : ''}"
            data-type="${vt.id}"
            title="${label}">
            <span class="vt-icon">${vt.icon}</span>
            <span class="vt-label">${label}</span>
        </button>
    `}).join('');
    container.querySelectorAll('.vehicle-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.vehicle-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const prefix = containerId.startsWith('edit') ? 'edit' : '';
            const hiddenInput = document.getElementById(prefix ? 'editVehicleType' : 'vehicleType');
            if (hiddenInput) hiddenInput.value = btn.dataset.type;
            if (prefix) {
                populateMakeSearch('editMakeSearch', btn.dataset.type);
            } else {
                populateMakeSearch('makeSearch', btn.dataset.type);
            }
        });
    });
}

// ─── Sökbar märkesdropdown ────────────────────────────────────────────────────
function populateMakeSearch(inputId, vehicleTypeId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const makes = MAKES_BY_TYPE[vehicleTypeId] || MAKES_BY_TYPE['car'];
    input.dataset.makes = JSON.stringify(makes);
    input.value = '';
    // Rensa modell
    const isEdit = inputId.startsWith('edit');
    clearModelSearch(isEdit ? 'editModelSearch' : 'modelSearch');
    // Rensa custom fält
    if (!isEdit) {
        document.getElementById('customMakeGroup').style.display = 'none';
        document.getElementById('customModelGroup').style.display = 'none';
        document.getElementById('customMake').value = '';
        document.getElementById('customModel').value = '';
    } else {
        document.getElementById('editCustomMakeGroup').style.display = 'none';
        document.getElementById('editCustomModelGroup').style.display = 'none';
        document.getElementById('editCustomMake').value = '';
        document.getElementById('editCustomModel').value = '';
    }
    showMakeDropdown(inputId, makes);
}

function clearModelSearch(inputId) {
    const input = document.getElementById(inputId);
    if (input) { input.value = ''; input.dataset.models = '[]'; }
    const dropdown = document.getElementById(inputId + 'Dropdown');
    if (dropdown) dropdown.innerHTML = '';
}

function showMakeDropdown(inputId, makes) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(inputId + 'Dropdown');
    if (!input || !dropdown) return;
    const query = input.value.toLowerCase();
    const filtered = makes.filter(m => m.toLowerCase().includes(query));
    if (filtered.length === 0 && query.length === 0) { dropdown.style.display = 'none'; return; }
    dropdown.innerHTML = filtered.map(m =>
        `<div class="search-option" data-value="${m}">${m}</div>`
    ).join('');
    dropdown.style.display = filtered.length > 0 ? 'block' : 'none';

    dropdown.querySelectorAll('.search-option').forEach(opt => {
        opt.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectMake(inputId, opt.dataset.value);
        });
    });
}

function selectMake(inputId, makeValue) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(inputId + 'Dropdown');
    if (!input || !dropdown) return;
    const isEdit = inputId.startsWith('edit');

    if (makeValue === 'Annat') {
        input.value = '';
        const customGroup = document.getElementById(isEdit ? 'editCustomMakeGroup' : 'customMakeGroup');
        if (customGroup) customGroup.style.display = 'block';
    } else {
        input.value = makeValue;
        const customGroup = document.getElementById(isEdit ? 'editCustomMakeGroup' : 'customMakeGroup');
        if (customGroup) customGroup.style.display = 'none';
        // Ladda modeller för detta märke
        const models = MODELS_BY_MAKE[makeValue] || ['Annat'];
        const modelInputId = isEdit ? 'editModelSearch' : 'modelSearch';
        const modelInput = document.getElementById(modelInputId);
        if (modelInput) {
            modelInput.dataset.models = JSON.stringify(models);
            modelInput.value = '';
            modelInput.disabled = false;
            modelInput.placeholder = 'Sök modell...';
        }
    }
    dropdown.style.display = 'none';
}

function showModelDropdown(inputId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(inputId + 'Dropdown');
    if (!input || !dropdown) return;
    const models = JSON.parse(input.dataset.models || '[]');
    const query = input.value.toLowerCase();
    const filtered = models.filter(m => m.toLowerCase().includes(query));
    if (filtered.length === 0) { dropdown.style.display = 'none'; return; }
    dropdown.innerHTML = filtered.map(m =>
        `<div class="search-option" data-value="${m}">${m}</div>`
    ).join('');
    dropdown.style.display = 'block';

    dropdown.querySelectorAll('.search-option').forEach(opt => {
        opt.addEventListener('mousedown', (e) => {
            e.preventDefault();
            selectModel(inputId, opt.dataset.value);
        });
    });
}

function selectModel(inputId, modelValue) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(inputId + 'Dropdown');
    if (!input || !dropdown) return;
    const isEdit = inputId.startsWith('edit');

    if (modelValue === 'Annat') {
        input.value = '';
        const customGroup = document.getElementById(isEdit ? 'editCustomModelGroup' : 'customModelGroup');
        if (customGroup) customGroup.style.display = 'block';
    } else {
        input.value = modelValue;
        const customGroup = document.getElementById(isEdit ? 'editCustomModelGroup' : 'customModelGroup');
        if (customGroup) customGroup.style.display = 'none';
    }
    dropdown.style.display = 'none';
}

// Stäng dropdowns vid klick utanför
document.addEventListener('click', (e) => {
    ['makeSearchDropdown','modelSearchDropdown','editMakeSearchDropdown','editModelSearchDropdown'].forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown && !e.target.closest(`#${id}`) && !e.target.closest(`#${id.replace('Dropdown','')}`) ) {
            dropdown.style.display = 'none';
        }
    });
});

// ─── Hjälpfunktioner för att läsa märke/modell från formulär ────────────────
function getMakeValue(prefix) {
    const isEdit      = (prefix === 'edit');
    const makeInputId = isEdit ? 'editMakeSearch'      : 'makeSearch';
    const customGrpId = isEdit ? 'editCustomMakeGroup' : 'customMakeGroup';
    const customFldId = isEdit ? 'editCustomMake'      : 'customMake';
    const customGroup = document.getElementById(customGrpId);
    if (customGroup && customGroup.style.display === 'block') {
        const f = document.getElementById(customFldId);
        return f ? f.value.trim() : '';
    }
    const inp = document.getElementById(makeInputId);
    return inp ? inp.value.trim() : '';
}

function getModelValue(prefix) {
    const isEdit       = (prefix === 'edit');
    const modelInputId = isEdit ? 'editModelSearch'      : 'modelSearch';
    const customGrpId  = isEdit ? 'editCustomModelGroup' : 'customModelGroup';
    const customFldId  = isEdit ? 'editCustomModel'      : 'customModel';
    const customGroup  = document.getElementById(customGrpId);
    if (customGroup && customGroup.style.display === 'block') {
        const f = document.getElementById(customFldId);
        return f ? f.value.trim() : '';
    }
    const inp = document.getElementById(modelInputId);
    return inp ? inp.value.trim() : '';
}

// Gamla funktioner behålls för bakåtkompatibilitet men delegerar till nya
function updateModelOptions() { /* Hanteras nu via sökbara fält */ }
function updateEditModelOptions() { /* Hanteras nu via sökbara fält */ }

// ─── Photo preview listeners ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Initialisera fordonstyp-väljare
    buildVehicleTypeSelector('vehicleTypeSelector', 'car');
    populateMakeSearch('makeSearch', 'car');
    buildVehicleTypeSelector('editVehicleTypeSelector', 'car');

    // Lyssnare för sökbara fält
    const makeSearch = document.getElementById('makeSearch');
    if (makeSearch) {
        makeSearch.addEventListener('focus', () => {
            const makes = JSON.parse(makeSearch.dataset.makes || '[]');
            showMakeDropdown('makeSearch', makes);
        });
        makeSearch.addEventListener('input', () => {
            const makes = JSON.parse(makeSearch.dataset.makes || '[]');
            showMakeDropdown('makeSearch', makes);
        });
    }
    const modelSearch = document.getElementById('modelSearch');
    if (modelSearch) {
        modelSearch.addEventListener('focus', () => showModelDropdown('modelSearch'));
        modelSearch.addEventListener('input', () => showModelDropdown('modelSearch'));
    }
    const editMakeSearch = document.getElementById('editMakeSearch');
    if (editMakeSearch) {
        editMakeSearch.addEventListener('focus', () => {
            const makes = JSON.parse(editMakeSearch.dataset.makes || '[]');
            showMakeDropdown('editMakeSearch', makes);
        });
        editMakeSearch.addEventListener('input', () => {
            const makes = JSON.parse(editMakeSearch.dataset.makes || '[]');
            showMakeDropdown('editMakeSearch', makes);
        });
    }
    const editModelSearch = document.getElementById('editModelSearch');
    if (editModelSearch) {
        editModelSearch.addEventListener('focus', () => showModelDropdown('editModelSearch'));
        editModelSearch.addEventListener('input', () => showModelDropdown('editModelSearch'));
    }

    const photoInput = document.getElementById('vehiclePhoto');
    if (photoInput) {
        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('previewImage').src = e.target.result;
                    document.getElementById('photoPreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    const receiptInput = document.getElementById('serviceReceipt');
    if (receiptInput) {
        receiptInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('receiptPreviewImage').src = e.target.result;
                    document.getElementById('receiptPreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    const editReceiptInput = document.getElementById('editServiceReceipt');
    if (editReceiptInput) {
        editReceiptInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('editReceiptPreviewImage').src = e.target.result;
                    document.getElementById('editReceiptPreview').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// ─── Edit vehicle modal ───────────────────────────────────────────────────────
function openEditVehicleModal(id) {
    const vehicle = vehicles.find(v => v.id === id);
    if (!vehicle) return;
    document.getElementById('editVehicleId').value = id;
    document.getElementById('editRegNumber').value = vehicle.regNumber;

    // Fordonstyp
    const vType = vehicle.vehicleType || 'car';
    document.getElementById('editVehicleType').value = vType;
    buildVehicleTypeSelector('editVehicleTypeSelector', vType);

    // Märke
    const makes = MAKES_BY_TYPE[vType] || MAKES_BY_TYPE['car'];
    const makeInput = document.getElementById('editMakeSearch');
    if (makeInput) {
        makeInput.dataset.makes = JSON.stringify(makes);
        if (makes.includes(vehicle.make)) {
            makeInput.value = vehicle.make;
            document.getElementById('editCustomMakeGroup').style.display = 'none';
        } else {
            makeInput.value = '';
            document.getElementById('editCustomMakeGroup').style.display = 'block';
            document.getElementById('editCustomMake').value = vehicle.make;
        }
    }

    // Modell
    const models = MODELS_BY_MAKE[vehicle.make] || ['Annat'];
    const modelInput = document.getElementById('editModelSearch');
    if (modelInput) {
        modelInput.dataset.models = JSON.stringify(models);
        modelInput.disabled = false;
        if (models.includes(vehicle.model)) {
            modelInput.value = vehicle.model;
            document.getElementById('editCustomModelGroup').style.display = 'none';
        } else {
            modelInput.value = '';
            document.getElementById('editCustomModelGroup').style.display = 'block';
            document.getElementById('editCustomModel').value = vehicle.model;
        }
    }

    document.getElementById('editYear').value  = vehicle.year  || '';
    document.getElementById('editColor').value = vehicle.color || '';
    document.getElementById('editNotes').value = vehicle.notes || '';
    const currentPhotoDiv = document.getElementById('editCurrentPhoto');
    if (vehicle.photoURL) {
        currentPhotoDiv.innerHTML = `
            <p style="color: var(--text-secondary); margin-bottom: 8px; font-size: 0.85rem;">Nuvarande foto:</p>
            <img src="${vehicle.photoURL}" style="max-width: 100%; max-height: 200px; border: 2px solid var(--border);" />
        `;
    } else {
        currentPhotoDiv.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">Inget foto uppladdad</p>';
    }
    document.getElementById('editPhotoPreview').style.display = 'none';
    openModal('editVehicleModal');
}

async function updateVehicle(event) {
    event.preventDefault();
    if (!window.currentUser) { alert('Du måste vara inloggad.'); return; }
    const btn = document.getElementById('updateVehicleBtn');
    btn.disabled = true;
    btn.textContent = 'Uppdaterar...';
    const vehicleId = document.getElementById('editVehicleId').value;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const vehicleType = document.getElementById('editVehicleType').value || vehicle.vehicleType || 'car';
    const makeValue   = getMakeValue('edit');
    const modelValue  = getModelValue('edit');
    if (!makeValue) { alert('Ange ett märke.'); btn.disabled = false; btn.textContent = 'Uppdatera fordon'; return; }
    if (!modelValue) { alert('Ange en modell.'); btn.disabled = false; btn.textContent = 'Uppdatera fordon'; return; }
    let photoURL = vehicle.photoURL || null;
    const photoFile = document.getElementById('editVehiclePhoto').files[0];
    if (photoFile) {
        try {
            btn.textContent = 'Laddar upp foto...';
            if (!window.storage) throw new Error('Firebase Storage is not initialized');
            if (vehicle.photoURL) {
                try {
                    const urlParts = vehicle.photoURL.split('/o/')[1];
                    if (urlParts) {
                        const filePath = decodeURIComponent(urlParts.split('?')[0]);
                        const oldPhotoRef = ref(storage, filePath);
                        await deleteObject(oldPhotoRef);
                    }
                } catch (e) { console.log('Could not delete old photo:', e); }
            }
            const storageRef = ref(storage, `vehicles/${window.currentUser.uid}/${Date.now()}_${photoFile.name}`);
            const snapshot = await uploadBytes(storageRef, photoFile);
            photoURL = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert(`Kunde inte ladda upp foto: ${error.message}. Övriga ändringar sparas.`);
        }
    }
    const updatedData = {
        regNumber:   document.getElementById('editRegNumber').value.toUpperCase(),
        vehicleType: vehicleType,
        make:        makeValue,
        model:       modelValue,
        year:        document.getElementById('editYear').value,
        color:       document.getElementById('editColor').value,
        notes:       document.getElementById('editNotes').value,
        photoURL:    photoURL,
        services:    vehicle.services
    };
    try {
        await updateDoc(doc(db, 'vehicles', vehicleId), updatedData);
        await loadVehicles();
        closeModal('editVehicleModal');
        document.getElementById('editVehicleForm').reset();
    } catch (error) {
        console.error('Error updating vehicle:', error);
        alert('Kunde inte uppdatera fordon. Försök igen.');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Uppdatera fordon';
    }
}

// ─── Workshop field toggle ────────────────────────────────────────────────────
function toggleWorkshopField() {
    const performedBy = document.getElementById('performedBy').value;
    const workshopGroup = document.getElementById('workshopGroup');
    const workshopInput = document.getElementById('workshop');
    if (performedBy === 'workshop') {
        workshopGroup.style.display = 'block';
        workshopInput.required = false;
    } else {
        workshopGroup.style.display = 'none';
        workshopInput.required = false;
        workshopInput.value = '';
    }
}

function toggleEditWorkshopField() {
    const performedBy = document.getElementById('editPerformedBy').value;
    document.getElementById('editWorkshopGroup').style.display = performedBy === 'workshop' ? 'block' : 'none';
}

// ─── Load vehicles ────────────────────────────────────────────────────────────
async function loadVehicles() {
    if (!window.currentUser) return;
    try {
        const q = query(collection(db, 'vehicles'), where('userId', '==', window.currentUser.uid));
        const querySnapshot = await getDocs(q);
        vehicles = [];
        querySnapshot.forEach((d) => { vehicles.push({ id: d.id, ...d.data() }); });
        renderVehicles();
    } catch (error) {
        console.error('Error loading vehicles:', error);
        document.getElementById('vehiclesContainer').innerHTML = `<div class="empty-state"><p>${t('vehicles.loadError')}</p></div>`;
    }
}

// ─── Render vehicles grid ─────────────────────────────────────────────────────
function renderVehicles() {
    const container = document.getElementById('vehiclesContainer');
    if (vehicles.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🚗</div><h3>${t('vehicles.emptyHeading')}</h3><p>${t('vehicles.emptyHint')}</p></div>`;
        return;
    }
    container.innerHTML = vehicles.map((vehicle, index) => {
        const typeIcon = getTypeIcon(vehicle.vehicleType || 'car');
        return `
        <div class="vehicle-card" onclick="openVehicleDetails('${vehicle.id}')" style="animation-delay: ${index * 0.1}s; ${vehicle.sold ? 'opacity: 0.6; filter: grayscale(60%);' : ''}">
            ${vehicle.sold ? `<div style="position: absolute; top: 10px; right: 10px; background: rgba(255,0,0,0.9); color: white; padding: 5px 12px; font-weight: bold; font-size: 0.75rem; transform: rotate(15deg); z-index: 10;">${t('vehicles.soldBadge')}</div>` : ''}
            ${vehicle.photoURL
                ? `<img src="${vehicle.photoURL}" alt="${vehicle.regNumber}" class="vehicle-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="${vehicle.sold ? 'filter: grayscale(80%);' : ''}">
                   <div class="no-photo" style="display: none;">${typeIcon}</div>`
                : `<div class="no-photo">${typeIcon}</div>`
            }
            <div class="vehicle-type-badge">${typeIcon} ${getTypeLabel(vehicle.vehicleType || 'car')}</div>
            <div class="vehicle-reg" style="margin-bottom: 12px;">${vehicle.regNumber}${vehicle.sold ? ` <span style="color: #ff4444; font-size: 0.7rem;">${t('vehicles.soldLabel')}</span>` : ''}</div>
            ${!vehicle.sold ? `
            <div style="display: flex; gap: 6px; margin-bottom: 15px; flex-wrap: wrap;">
                <button class="delete-btn" style="background: rgba(255, 165, 0, 0.2); border-color: rgba(255, 165, 0, 0.4); color: #ffa500; font-size: 0.75rem; padding: 8px 12px;" onclick="event.stopPropagation(); openEditVehicleModal('${vehicle.id}')">${t('vehicles.editBtn')}</button>
                <button class="delete-btn" style="background: rgba(255,50,50,0.2); border-color: rgba(255,50,50,0.4); color: #ff6464; font-size: 0.75rem; padding: 8px 12px;" onclick="event.stopPropagation(); openSellVehicleModal('${vehicle.id}')">${t('vehicles.sellBtn')}</button>
            </div>
            ` : `
            <div style="display: flex; gap: 6px; margin-bottom: 15px;">
                <button class="delete-btn" style="font-size: 0.75rem; padding: 8px 12px;" onclick="event.stopPropagation(); deleteVehicle('${vehicle.id}')">🗑️</button>
            </div>
            `}
            <div class="vehicle-info">
                <p><strong>${t('vehicles.labelMake')}</strong>${vehicle.make}</p>
                <p><strong>${t('vehicles.labelModel')}</strong>${vehicle.model}</p>
                ${vehicle.year ? `<p><strong>${t('vehicles.labelYear')}</strong>${vehicle.year}</p>` : ''}
                ${vehicle.color ? `<p><strong>${t('vehicles.labelColor')}</strong>${vehicle.color}</p>` : ''}
                ${vehicle.sold ? `<p style="color: #ff4444;"><strong>${t('vehicles.labelSold')}</strong> ${new Date(vehicle.transferDate).toLocaleDateString(getLocale())}</p>` : ''}
            </div>
            <span class="service-count">${t('vehicles.servicePosts', vehicle.services?.length || 0)} ${vehicle.locked ? '🔒' : ''}</span>
        </div>
    `}).join('');
}

// ─── Add vehicle ──────────────────────────────────────────────────────────────
async function addVehicle(event) {
    event.preventDefault();
    if (!window.currentUser) { alert(t('addVehicle.mustBeLoggedIn')); return; }
    const btn = document.getElementById('addVehicleBtn');
    btn.disabled = true;
    btn.textContent = t('addVehicle.saving');

    const vehicleType = document.getElementById('vehicleType').value || 'car';
    const makeValue   = getMakeValue('');
    const modelValue  = getModelValue('');

    if (!makeValue) { alert('Ange ett märke.'); btn.disabled = false; btn.textContent = t('addVehicle.submitBtn'); return; }
    if (!modelValue) { alert('Ange en modell.'); btn.disabled = false; btn.textContent = t('addVehicle.submitBtn'); return; }

    let photoURL = null;
    const photoFile = document.getElementById('vehiclePhoto').files[0];
    if (photoFile) {
        try {
            btn.textContent = t('addVehicle.uploadingPhoto');
            const storageRef = ref(storage, `vehicles/${window.currentUser.uid}/${Date.now()}_${photoFile.name}`);
            const snapshot = await uploadBytes(storageRef, photoFile);
            photoURL = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert(t('addVehicle.photoUploadFail'));
        }
    }
    const vehicle = {
        userId:      window.currentUser.uid,
        regNumber:   document.getElementById('regNumber').value.toUpperCase(),
        vehicleType: vehicleType,
        make:        makeValue,
        model:       modelValue,
        year:        document.getElementById('year').value,
        color:       document.getElementById('color').value,
        notes:       document.getElementById('notes').value,
        photoURL:    photoURL,
        services:    [],
        createdAt:   new Date().toISOString()
    };
    try {
        await addDoc(collection(db, 'vehicles'), vehicle);
        await loadVehicles();
        closeModal('addVehicleModal');
        document.getElementById('addVehicleForm').reset();
        document.getElementById('customMakeGroup').style.display = 'none';
        document.getElementById('customModelGroup').style.display = 'none';
        document.getElementById('photoPreview').style.display = 'none';
    } catch (error) {
        console.error('Error adding vehicle:', error);
        alert(t('addVehicle.addFail'));
    } finally {
        btn.disabled = false;
        btn.textContent = t('addVehicle.submitBtn');
    }
}

// ─── Delete vehicle ───────────────────────────────────────────────────────────
async function deleteVehicle(id) {
    if (!confirm(t('deleteVehicle.confirm'))) return;
    try {
        await deleteDoc(doc(db, 'vehicles', id));
        await loadVehicles();
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert(t('deleteVehicle.deleteFail'));
    }
}

// ─── Vehicle details ──────────────────────────────────────────────────────────
function openVehicleDetails(id) {
    currentVehicleId = id;
    const vehicle = vehicles.find(v => v.id === id);
    document.getElementById('detailsVehicleTitle').textContent = vehicle.regNumber;
    document.getElementById('vehicleDetailsContent').innerHTML = `
        ${vehicle.photoURL
            ? `<img src="${vehicle.photoURL}" alt="${vehicle.regNumber}" class="vehicle-photo-full" style="margin-bottom: 20px;">`
            : `<div class="no-photo" style="margin-bottom: 20px;">${getTypeIcon(vehicle.vehicleType || 'car')}</div>`
        }
        <div class="vehicle-info">
            ${vehicle.vehicleType ? `<p><strong>Fordonstyp</strong>${getTypeIcon(vehicle.vehicleType)} ${getTypeLabel(vehicle.vehicleType)}</p>` : ''}
            <p><strong>${t('vehicleDetails.labelMake')}</strong>${vehicle.make}</p>
            <p><strong>${t('vehicleDetails.labelModel')}</strong>${vehicle.model}</p>
            ${vehicle.year ? `<p><strong>${t('vehicleDetails.labelYear')}</strong>${vehicle.year}</p>` : ''}
            ${vehicle.color ? `<p><strong>${t('vehicleDetails.labelColor')}</strong>${vehicle.color}</p>` : ''}
            ${vehicle.notes ? `<p style="margin-top: 15px;"><strong>${t('vehicleDetails.labelNotes')}</strong><br>${vehicle.notes}</p>` : ''}
        </div>
    `;
    renderServiceList(vehicle);

    // Visa rätt knappar beroende på om fordonet är sålt/låst
    const btnContainer = document.getElementById('vehicleActionButtons');
    if (vehicle.sold || vehicle.locked) {
        // Sålt fordon — dela + PDF, ej redigera/sälja
        btnContainer.innerHTML = `
            <button class="secondary" onclick="shareVehicle()" style="background: rgba(0,150,255,0.2); border-color: rgba(0,150,255,0.5); color: #4db8ff;">
                <span data-i18n="vehicleDetails.shareBtn">🔗 Dela servicebok</span>
            </button>
            <button class="secondary" onclick="exportPDF()" style="background: rgba(0,200,100,0.2); border-color: rgba(0,200,100,0.5); color: #00c864;">
                <span data-i18n="vehicleDetails.exportPDFBtn">📄 Exportera PDF</span>
            </button>
            <p style="color: #888; font-size: 0.8rem; width: 100%; margin-top: 5px;">🔒 Fordonet är överlåtet — servicehistorik är låst</p>
        `;
    } else {
        // Aktivt fordon — alla knappar
        btnContainer.innerHTML = `
            <button onclick="openAddServiceModal()"><span data-i18n="vehicleDetails.addServiceBtn">+ Lägg till service</span></button>
            <button class="secondary" onclick="shareVehicle()" style="background: rgba(0,150,255,0.2); border-color: rgba(0,150,255,0.5); color: #4db8ff;">
                <span data-i18n="vehicleDetails.shareBtn">🔗 Dela servicebok</span>
            </button>
            <button class="secondary" onclick="exportPDF()" style="background: rgba(0,200,100,0.2); border-color: rgba(0,200,100,0.5); color: #00c864;">
                <span data-i18n="vehicleDetails.exportPDFBtn">📄 Exportera PDF</span>
            </button>
            <button class="secondary" onclick="openSellVehicleModal('${vehicle.id}')" style="background: rgba(255,50,50,0.2); border-color: rgba(255,50,50,0.5); color: #ff6464;">
                <span data-i18n="vehicleDetails.sellBtn">🤝 Sälj / Överlåt</span>
            </button>
        `;
    }

    openModal('vehicleDetailsModal');
}

// ─── Render service list ──────────────────────────────────────────────────────
async function renderServiceList(vehicle) {
    const container = document.getElementById('serviceListContainer');
    if (!vehicle.services || vehicle.services.length === 0) {
        container.innerHTML = `<div class="empty-state"><p>${t('serviceList.empty')}</p></div>`;
        return;
    }
    // Fix missing IDs on legacy entries
    const missingIds = vehicle.services.filter(s => !s.id);
    if (missingIds.length > 0) {
        vehicle.services = vehicle.services.map((s, i) => ({
            ...s,
            id: s.id || `legacy_${i}_${s.date}_${s.type}`.replace(/[^a-zA-Z0-9_]/g, '_')
        }));
        try {
            await updateDoc(doc(db, 'vehicles', vehicle.id), { services: vehicle.services });
        } catch (e) { console.log('Could not save IDs:', e); }
    }
    const sortedServices = [...vehicle.services].sort((a, b) => new Date(b.date) - new Date(a.date));
    container.innerHTML = sortedServices.map((service, index) => `
        <div class="service-item" style="animation-delay: ${index * 0.1}s; border-left-color: ${service.performedBy === 'self' ? 'var(--success)' : 'var(--primary)'}">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px; flex-wrap: wrap; gap: 6px;">
                <h4 style="margin-bottom: 0;">${service.type} ${service.performedBy === 'self' ? `<span style="color: var(--success)">${t('serviceList.diy')}</span>` : ''}</h4>
                <div style="display: flex; gap: 6px; flex-shrink: 0;">
                    ${service.locked ? `<span style="color: #888; font-size: 0.8rem; padding: 5px;">${t('serviceList.locked')}</span>` : `
                    <button onclick="openEditServiceModal('${vehicle.id}', '${service.id}')" style="padding: 5px 10px; font-size: 0.7rem; background: rgba(255,165,0,0.2); border: 1px solid rgba(255,165,0,0.4); color: #ffa500; clip-path: none; width: auto;">✏️</button>
                    <button onclick="deleteService('${vehicle.id}', '${service.id}')" style="padding: 5px 10px; font-size: 0.7rem; background: rgba(255,0,0,0.2); border: 1px solid rgba(255,0,0,0.4); color: #ff6b6b; clip-path: none; width: auto;">🗑️</button>
                    `}
                </div>
            </div>
            <div class="service-meta">
                <span><strong>${t('serviceList.labelDate')}</strong> ${new Date(service.date).toLocaleDateString(getLocale())}</span>
                ${service.performedBy ? `<span style="color: ${service.performedBy === 'self' ? 'var(--success)' : 'var(--text-secondary)'}"><strong>${t('serviceList.labelPerformed')}</strong> ${service.performedBy === 'self' ? t('serviceList.selfWork') : t('serviceList.workshopWork')}</span>` : ''}
                ${service.mileage ? `<span><strong>${t('serviceList.labelMileage')}</strong> ${service.mileage.toLocaleString(getLocale())} km</span>` : ''}
                ${service.cost ? `<span><strong>${t('serviceList.labelCost')}</strong> ${formatAmount(service.cost, service.currency)}</span>` : ''}
                ${service.workshop ? `<span><strong>${t('serviceList.labelWorkshop')}</strong> ${service.workshop}</span>` : ''}
            </div>
            ${service.notes ? `<div class="service-notes">${service.notes}</div>` : ''}
            ${service.receiptURL ? `
                <div style="margin-top: 10px;">
                    <button onclick="event.stopPropagation(); viewReceipt('${service.receiptURL}')" style="padding: 8px 16px; background: rgba(255,215,0,0.2); border: 1px solid rgba(255,215,0,0.4); color: var(--accent-yellow); font-size: 0.85rem; cursor: pointer; clip-path: none; width: auto;">
                        ${t('serviceList.viewReceipt')}
                    </button>
                </div>` : ''}
            <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border); font-size: 0.72rem; color: var(--text-secondary); display: flex; flex-direction: column; gap: 4px;">
                <span>📅 ${t('serviceList.created')} ${service.createdAt ? new Date(service.createdAt).toLocaleString(getLocale()) : t('serviceList.unknown')}</span>
                <span>✏️ ${t('serviceList.modified')} ${service.updatedAt ? new Date(service.updatedAt).toLocaleString(getLocale()) : t('serviceList.notModified')}</span>
            </div>
        </div>
    `).join('');
}

// ─── Add service ──────────────────────────────────────────────────────────────
async function addService(event) {
    event.preventDefault();
    if (!window.currentUser) { alert(t('addService.mustBeLoggedIn')); return; }
    const btn = document.getElementById('addServiceBtn');
    btn.disabled = true;
    btn.textContent = t('addService.saving');
    const performedBy = document.getElementById('performedBy').value;
    const _serviceDate = document.getElementById('serviceDate').value;
    if (_serviceDate) {
        const yearPart = _serviceDate.split('-')[0];
        if (yearPart.length !== 4) {
            alert('Ogiltigt datum — kontrollera årtalet (4 siffror).');
            btn.disabled = false;
            btn.textContent = t('addService.submitBtn');
            return;
        }
    }
    let receiptURL = null;
    const receiptFile = document.getElementById('serviceReceipt').files[0];
    if (receiptFile) {
        try {
            btn.textContent = t('addService.uploadingReceipt');
            const storageRef = ref(storage, `receipts/${window.currentUser.uid}/${Date.now()}_${receiptFile.name}`);
            const snapshot = await uploadBytes(storageRef, receiptFile);
            receiptURL = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading receipt:', error);
            alert(t('addService.receiptUploadFail'));
        }
    }
    const service = {
        id: Date.now().toString(),
        date: document.getElementById('serviceDate').value,
        type: document.getElementById('serviceType').value,
        mileage: parseInt(document.getElementById('mileage').value) || null,
        cost: parseInt(document.getElementById('cost').value) || null,
        currency: getCurrencyCode(),
        performedBy: performedBy,
        workshop: performedBy === 'workshop' ? document.getElementById('workshop').value : null,
        notes: document.getElementById('serviceNotes').value,
        receiptURL: receiptURL,
        createdAt: new Date().toISOString(),
        updatedAt: null
    };
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    if (!vehicle.services) vehicle.services = [];
    vehicle.services.push(service);
    try {
        await updateDoc(doc(db, 'vehicles', currentVehicleId), { services: vehicle.services });
        await loadVehicles();
        const updatedVehicle = vehicles.find(v => v.id === currentVehicleId);
        renderServiceList(updatedVehicle);
        closeModal('addServiceModal');
        document.getElementById('addServiceForm').reset();
        document.getElementById('receiptPreview').style.display = 'none';
        document.getElementById('workshopGroup').style.display = 'none';
    } catch (error) {
        console.error('Error adding service:', error);
        alert(t('addService.addFail'));
    } finally {
        btn.disabled = false;
        btn.textContent = t('addService.submitBtn');
    }
}

// ─── Edit service ─────────────────────────────────────────────────────────────
function openEditServiceModal(vehicleId, serviceId) {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    const service = vehicle?.services?.find(s => s.id === serviceId);
    if (!service) return;
    currentVehicleId = vehicleId;
    document.getElementById('editServiceId').value = serviceId;
    document.getElementById('editServiceDate').value = service.date;
    document.getElementById('editServiceType').value = service.type;
    document.getElementById('editServiceMileage').value = service.mileage || '';
    document.getElementById('editPerformedBy').value = service.performedBy || '';
    document.getElementById('editServiceCost').value = service.cost || '';
    document.getElementById('editServiceNotes').value = service.notes || '';
    document.getElementById('editWorkshop').value = service.workshop || '';
    document.getElementById('editWorkshopGroup').style.display = service.performedBy === 'workshop' ? 'block' : 'none';
    const currentReceiptDiv = document.getElementById('editCurrentReceipt');
    if (service.receiptURL) {
        currentReceiptDiv.innerHTML = `<a href="${service.receiptURL}" target="_blank" style="color: var(--accent-yellow); font-size: 0.85rem;">🧾 Nuvarande kvitto (klicka för att se)</a>`;
    } else {
        currentReceiptDiv.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">Inget kvitto uppladdad</p>';
    }
    // Reset file input and preview so previous selection doesn't linger
    document.getElementById('editServiceReceipt').value = '';
    document.getElementById('editServiceReceiptName').textContent = '';
    document.getElementById('editReceiptPreview').style.display = 'none';
    document.getElementById('editReceiptPreviewImage').src = '';
    openModal('editServiceModal');
}

async function updateService(event) {
    if (event) event.preventDefault();
    if (!window.currentUser) return;

    // Manual validation
    const _date = document.getElementById('editServiceDate').value;
    const _type = document.getElementById('editServiceType').value;
    const _performedBy = document.getElementById('editPerformedBy').value;
    if (!_date || !_type || !_performedBy) {
        alert(t('editService.updateFail'));
        return;
    }
    const _yearPart = _date.split('-')[0];
    if (_yearPart.length !== 4) {
        alert('Ogiltigt datum — kontrollera årtalet (4 siffror).');
        return;
    }

    const btn = document.getElementById('updateServiceBtn');
    btn.disabled = true;
    btn.textContent = t('addService.saving');
    const serviceId = document.getElementById('editServiceId').value;
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    const serviceIndex = vehicle.services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) return;
    const existingService = vehicle.services[serviceIndex];
    let receiptURL = existingService.receiptURL || null;
    const receiptFile = document.getElementById('editServiceReceipt').files[0];
    if (receiptFile) {
        try {
            btn.textContent = t('addService.uploadingReceipt');
            const storageRef = ref(storage, `receipts/${window.currentUser.uid}/${Date.now()}_${receiptFile.name}`);
            const snapshot = await uploadBytes(storageRef, receiptFile);
            receiptURL = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error('Error uploading receipt:', error);
            alert(t('addService.receiptUploadFail'));
        }
    }
    const performedBy = document.getElementById('editPerformedBy').value;
    vehicle.services[serviceIndex] = {
        ...existingService,
        date: document.getElementById('editServiceDate').value,
        type: document.getElementById('editServiceType').value,
        mileage: parseInt(document.getElementById('editServiceMileage').value) || null,
        cost: parseInt(document.getElementById('editServiceCost').value) || null,
        currency: getCurrencyCode(),
        performedBy: performedBy,
        workshop: performedBy === 'workshop' ? document.getElementById('editWorkshop').value : null,
        notes: document.getElementById('editServiceNotes').value,
        receiptURL: receiptURL,
        updatedAt: new Date().toISOString()
    };
    try {
        await updateDoc(doc(db, 'vehicles', currentVehicleId), { services: vehicle.services });
        await loadVehicles();
        const updatedVehicle = vehicles.find(v => v.id === currentVehicleId);
        renderServiceList(updatedVehicle);
        closeModal('editServiceModal');
    } catch (error) {
        console.error('Error updating service:', error);
        alert(t('editService.updateFail'));
    } finally {
        btn.disabled = false;
        btn.textContent = t('editService.updateBtn');
    }
}

async function deleteService(vehicleId, serviceId) {
    if (!confirm(t('deleteService.confirm'))) return;
    const vehicle = vehicles.find(v => v.id === vehicleId);
    vehicle.services = vehicle.services.filter(s => s.id !== serviceId);
    try {
        await updateDoc(doc(db, 'vehicles', vehicleId), { services: vehicle.services });
        await loadVehicles();
        const updatedVehicle = vehicles.find(v => v.id === vehicleId);
        renderServiceList(updatedVehicle);
    } catch (error) {
        console.error('Error deleting service:', error);
        alert(t('deleteService.deleteFail'));
    }
}

// ─── Share vehicle ────────────────────────────────────────────────────────────
async function shareVehicle() {
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    if (!vehicle) return;
    let shareToken = vehicle.shareToken;
    if (!shareToken) {
        shareToken = Math.random().toString(36).substr(2, 12) + Date.now().toString(36);
        const shareExpiry = new Date();
        shareExpiry.setDate(shareExpiry.getDate() + 30);
        await updateDoc(doc(db, 'vehicles', currentVehicleId), {
            shareToken,
            shareExpiry: shareExpiry.toISOString()
        });
        vehicle.shareToken = shareToken;
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareToken}`;
    document.getElementById('shareUrl').value = shareUrl;
    document.getElementById('shareResult').style.display = 'block';
}

function copyShareLink() {
    const input = document.getElementById('shareUrl');
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
        alert(t('share.copied'));
    }).catch(() => {
        document.execCommand('copy');
        alert(t('share.copied'));
    });
}

async function checkShareToken() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('share');
    if (!token) return false;
    try {
        document.getElementById('shareViewScreen').style.display = 'block';
        document.getElementById('authScreen').style.display = 'none';
        document.getElementById('appScreen').style.display = 'none';
        document.getElementById('shareViewContent').innerHTML = '<p style="text-align:center; color: var(--text-secondary);">Laddar servicebok...</p>';
        const q = query(collection(db, 'vehicles'), where('shareToken', '==', token));
        const snap = await getDocs(q);
        if (snap.empty) {
            document.getElementById('shareViewContent').innerHTML = '<p style="text-align:center; color: #ff6464;">❌ Länken är ogiltig eller har gått ut.</p>';
            return true;
        }
        const vData = { id: snap.docs[0].id, ...snap.docs[0].data() };
        if (vData.shareExpiry && new Date(vData.shareExpiry) < new Date()) {
            document.getElementById('shareViewContent').innerHTML = '<p style="text-align:center; color: #ff6464;">❌ Denna länk har gått ut (giltig 30 dagar).</p>';
            return true;
        }
        renderShareView(vData);
        return true;
    } catch (e) {
        console.error('Share token error:', e);
        return false;
    }
}

function renderShareView(vehicle) {
    const services = (vehicle.services || []).sort((a,b) => new Date(b.date) - new Date(a.date));
    const isLocked = vehicle.locked;
    document.getElementById('shareViewContent').innerHTML = `
        <div style="background: var(--bg-card); border: 2px solid var(--primary); padding: 25px; margin-bottom: 20px; clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px);">
            ${vehicle.photoURL ? `<img src="${vehicle.photoURL}" style="width:100%; max-height:250px; object-fit:cover; margin-bottom:15px;">` : ''}
            <h2 style="color: var(--primary); font-family: 'Archivo Black';">${vehicle.regNumber}</h2>
            <p><strong>Märke:</strong> ${vehicle.make} ${vehicle.model}</p>
            <p><strong>År:</strong> ${vehicle.year || '-'}</p>
            <p><strong>Färg:</strong> ${vehicle.color || '-'}</p>
            ${vehicle.notes ? `<p><strong>Anteckningar:</strong> ${vehicle.notes}</p>` : ''}
            ${isLocked ? `<p style="color: #ff6464; margin-top:10px;">🔒 Servicehistorik låst vid överlåtelse ${new Date(vehicle.lockedAt).toLocaleDateString('sv-SE')}</p>` : ''}
        </div>
        <h3 style="color: var(--accent-yellow); margin-bottom: 15px;">Servicehistorik (${services.length} poster)</h3>
        ${services.length === 0 ? '<p style="color: var(--text-secondary);">Ingen servicehistorik</p>' :
            services.map(s => `
                <div style="background: var(--bg-card); border-left: 3px solid ${s.performedBy === 'self' ? 'var(--success)' : 'var(--primary)'}; padding: 15px; margin-bottom: 10px;">
                    <strong style="color: var(--accent-yellow);">${s.type}</strong> ${s.performedBy === 'self' ? '<span style="color:var(--success)">🔧 DIY</span>' : ''}
                    ${s.locked ? '<span style="color:#888; font-size:0.75rem; margin-left:8px;">🔒 låst</span>' : ''}
                    <div style="font-size:0.85rem; margin-top:8px; color: var(--text-secondary);">
                        <span>📅 ${new Date(s.date).toLocaleDateString('sv-SE')}</span>
                        ${s.mileage ? `<span style="margin-left:15px;">🔢 ${s.mileage.toLocaleString('sv-SE')} km</span>` : ''}
                        ${s.cost ? `<span style="margin-left:15px;">💰 ${s.cost.toLocaleString('sv-SE')} kr</span>` : ''}
                    </div>
                    ${s.workshop ? `<div style="font-size:0.82rem; color:var(--text-secondary);">🏢 ${s.workshop}</div>` : ''}
                    ${s.notes ? `<div style="font-size:0.82rem; font-style:italic; margin-top:6px;">${s.notes}</div>` : ''}
                    ${s.receiptURL ? `<div style="margin-top:8px;"><a href="${s.receiptURL}" target="_blank" style="color:var(--accent-yellow); font-size:0.85rem; text-decoration:none;">🧾 Visa kvitto</a></div>` : ''}
                </div>
            `).join('')
        }
    `;
}

// ─── Sell / Transfer ──────────────────────────────────────────────────────────
function openSellVehicleModal(id) {
    if (id) currentVehicleId = id;
    document.getElementById('sellVehicleModal').dataset.vehicleId = currentVehicleId;
    document.getElementById('transferDate').valueAsDate = new Date();
    openModal('sellVehicleModal');
}

async function sellVehicle() {
    const email = document.getElementById('newOwnerEmail').value.trim();
    const transferDate = document.getElementById('transferDate').value;
    const price = document.getElementById('transferPrice').value;
    const note = document.getElementById('transferNote').value;
    if (!transferDate) { alert(t('sell.fillDate')); return; }
    const btn = document.getElementById('confirmSellBtn');
    btn.disabled = true;
    try {
        let newOwnerUid = null;
        let confirmMsg = '';
        if (email) {
            btn.textContent = t('sell.searching');
            const q = query(collection(db, 'users'), where('email', '==', email));
            const snap = await getDocs(q);
            if (snap.empty) {
                alert(t('sell.noUserFound', email));
                btn.disabled = false;
                btn.textContent = t('sell.confirmBtn');
                return;
            }
            newOwnerUid = snap.docs[0].data().uid;
            confirmMsg = t('sell.confirmToUser', email);
        } else {
            confirmMsg = t('sell.confirmNoUser');
        }
        if (!confirm(`${confirmMsg}${t('sell.lockWarning')}`)) {
            btn.disabled = false;
            btn.textContent = t('sell.confirmBtn');
            return;
        }
        btn.textContent = t('sell.transferring');
        const vehicleId = currentVehicleId || document.getElementById('sellVehicleModal').dataset.vehicleId;
        const vehicle = vehicles.find(v => v.id === vehicleId);
        if (!vehicle) {
            console.error('sellVehicle: vehicle not found. vehicleId=', vehicleId, 'vehicles=', vehicles.map(v => v.id));
            alert('Kunde inte hitta fordonet. Stäng dialogen och försök igen.');
            btn.disabled = false;
            btn.textContent = t('sell.confirmBtn');
            return;
        }
        currentVehicleId = vehicleId;
        const lockedServices = (vehicle.services || []).map(s => ({ ...s, locked: true }));
        lockedServices.push({
            id: `transfer_${Date.now()}`,
            type: t('sell.transferType'),
            date: transferDate,
            notes: t('sell.transferNote', newOwnerUid ? email : null, price, getCurrencySymbol(), note),
            performedBy: 'transfer',
            locked: true,
            createdAt: new Date().toISOString()
        });
        // Snapshot fordonsdata INNAN säljarens dokument uppdateras
        const vehicleSnapshot = {
            regNumber:   vehicle.regNumber,
            vehicleType: vehicle.vehicleType || 'car',
            make:        vehicle.make,
            model:       vehicle.model,
            year:        vehicle.year || '',
            color:       vehicle.color || '',
            notes:       vehicle.notes || '',
            photoURL:    vehicle.photoURL || null,
        };

        const updateData = {
            previousOwner: window.currentUser.uid,
            previousOwnerEmail: window.currentUser.email,
            transferDate: transferDate,
            transferPrice: price || null,
            locked: true,
            lockedAt: new Date().toISOString(),
            services: lockedServices,
            shareToken: null,
            sold: true
        };

        // Uppdatera säljarens dokument — bilen stannar kvar, markeras som såld och låst
        await updateDoc(doc(db, 'vehicles', currentVehicleId), updateData);

        // Om köparen är en Fordonsbok-användare — skapa ett NYTT dokument för dem
        if (newOwnerUid) {
            const buyerVehicle = {
                userId:              newOwnerUid,
                regNumber:           vehicleSnapshot.regNumber,
                vehicleType:         vehicleSnapshot.vehicleType,
                make:                vehicleSnapshot.make,
                model:               vehicleSnapshot.model,
                year:                vehicleSnapshot.year,
                color:               vehicleSnapshot.color,
                notes:               vehicleSnapshot.notes,
                photoURL:            vehicleSnapshot.photoURL,
                services:            lockedServices,
                previousOwner:       window.currentUser.uid,
                previousOwnerEmail:  window.currentUser.email,
                transferDate:        transferDate,
                transferPrice:       price || null,
                locked:              false,
                sold:                false,
                createdAt:           new Date().toISOString()
            };
            await addDoc(collection(db, 'vehicles'), buyerVehicle);
        }
        alert(newOwnerUid ? t('sell.successToUser', email) : t('sell.successArchived'));
        closeModal('sellVehicleModal');
        closeModal('vehicleDetailsModal');
        await loadVehicles();
    } catch (e) {
        console.error('Sell error:', e);
        alert(t('sell.transferFail'));
    } finally {
        btn.disabled = false;
        btn.textContent = t('sell.confirmBtn');
    }
}

// ─── PDF Export ───────────────────────────────────────────────────────────────
function exportPDF() {
    const vehicle = vehicles.find(v => v.id === currentVehicleId);
    if (!vehicle) return;
    const services = (vehicle.services || []).sort((a,b) => new Date(b.date) - new Date(a.date));
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Servicebok - ${vehicle.regNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; color: #222; }
                h1 { color: #FF4D00; border-bottom: 3px solid #FF4D00; padding-bottom: 10px; }
                h2 { color: #333; margin-top: 30px; }
                .vehicle-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-left: 4px solid #FF4D00; }
                .vehicle-info p { margin: 4px 0; }
                .service-item { border: 1px solid #ddd; padding: 12px; margin-bottom: 10px; border-left: 4px solid #FF4D00; }
                .service-item.locked { border-left-color: #999; background: #fafafa; }
                .service-item h3 { margin: 0 0 8px 0; color: #FF4D00; font-size: 1rem; }
                .service-meta { font-size: 0.85rem; color: #666; }
                .service-meta span { margin-right: 15px; }
                .locked-badge { font-size: 0.75rem; color: #999; }
                .transfer { background: #fff3f3; border-left-color: #ff0000; }
                .footer { margin-top: 40px; font-size: 0.8rem; color: #999; border-top: 1px solid #ddd; padding-top: 15px; text-align: center; }
            </style>
        </head>
        <body>
            <h1>🚗 ${t('pdf.heading', vehicle.regNumber)}</h1>
            <div class="vehicle-info">
                <p><strong>${t('pdf.labelMake')}</strong> ${vehicle.make} ${vehicle.model}</p>
                <p><strong>${t('pdf.labelYear')}</strong> ${vehicle.year || '-'}</p>
                <p><strong>${t('pdf.labelColor')}</strong> ${vehicle.color || '-'}</p>
                ${vehicle.notes ? `<p><strong>${t('pdf.labelNotes')}</strong> ${vehicle.notes}</p>` : ''}
                ${vehicle.locked ? `<p><strong>${t('pdf.labelLocked')}</strong> ${new Date(vehicle.lockedAt).toLocaleDateString(getLocale())}</p>` : ''}
            </div>
            <h2>${t('pdf.historyHeading', services.length)}</h2>
            ${services.map(s => `
                <div class="service-item ${s.locked ? 'locked' : ''} ${s.performedBy === 'transfer' ? 'transfer' : ''}">
                    <h3>${s.type} ${s.performedBy === 'self' ? '🔧' : ''} ${s.locked ? `<span class="locked-badge">${t('serviceList.locked')}</span>` : ''}</h3>
                    <div class="service-meta">
                        <span>📅 ${new Date(s.date).toLocaleDateString(getLocale())}</span>
                        ${s.mileage ? `<span>🔢 ${s.mileage.toLocaleString(getLocale())} km</span>` : ''}
                        ${s.cost ? `<span>💰 ${formatAmount(s.cost)}</span>` : ''}
                        ${s.performedBy === 'self' ? `<span>${t('serviceList.ownWork')}</span>` : s.workshop ? `<span>🏢 ${s.workshop}</span>` : ''}
                    </div>
                    ${s.notes ? `<p style="margin:8px 0 0; font-size:0.9rem; font-style:italic;">${s.notes}</p>` : ''}
                    ${s.receiptURL ? `<p style="margin:8px 0 0;"><a href="${s.receiptURL}" target="_blank" style="color:#FF4D00; text-decoration:none;">${t('serviceList.viewReceipt')}</a></p>` : ''}
                    <p style="font-size:0.75rem; color:#aaa; margin:6px 0 0;">Skapad: ${s.createdAt ? new Date(s.createdAt).toLocaleDateString('sv-SE') : '-'}${s.updatedAt ? ' · Ändrad: ' + new Date(s.updatedAt).toLocaleDateString('sv-SE') : ''}</p>
                </div>
            `).join('')}
            <div class="footer">
                ${t('pdf.footer', new Date().toLocaleString(getLocale()), window.currentUser?.email || '')}
            </div>
        </body>
        </html>
    `;
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.print();
}

// ─── Modal helpers ────────────────────────────────────────────────────────────
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    modal.onclick = function(e) { if (e.target === modal) closeModal(modalId); };
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function openAddVehicleModal() { openModal('addVehicleModal'); }
function openAddServiceModal() { openModal('addServiceModal'); }

// ─── Export data (JSON) ───────────────────────────────────────────────────────
function exportData() {
    const dataStr = JSON.stringify(vehicles, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fordonsbok-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// ─── Receipt viewer ───────────────────────────────────────────────────────────
function viewReceipt(url) {
    const isPDF = url.toLowerCase().includes('.pdf');
    if (isPDF) {
        document.getElementById('receiptImage').style.display = 'none';
        document.getElementById('receiptPDF').style.display = 'block';
        document.getElementById('receiptPDF').src = url;
    } else {
        document.getElementById('receiptImage').style.display = 'block';
        document.getElementById('receiptPDF').style.display = 'none';
        document.getElementById('receiptImage').src = url;
    }
    openModal('receiptModal');
}

// ─── Swish ────────────────────────────────────────────────────────────────────
function openSwish() {
    const swishNumber = '0707221801';
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
        const mobileModal = document.createElement('div');
        mobileModal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.92);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';
        mobileModal.innerHTML = `
            <div style="background:#1A1A1A;border:2px solid #FF4D00;padding:35px 30px;text-align:center;max-width:360px;width:100%;clip-path:polygon(15px 0,100% 0,100% calc(100% - 15px),calc(100% - 15px) 100%,0 100%,0 15px);">
                <div style="font-size:2.5rem;margin-bottom:10px;">☕</div>
                <h2 style="color:#FF4D00;font-family:'Archivo Black',sans-serif;font-size:1.6rem;margin:0 0 8px 0;text-transform:uppercase;">Tack för stödet!</h2>
                <p style="color:#A0A0A0;font-size:0.85rem;margin:0 0 25px 0;letter-spacing:0.1em;text-transform:uppercase;">Swisha en kaffe</p>
                <div style="background:#252525;border:1px solid #333;padding:15px;margin-bottom:20px;">
                    <p style="color:#A0A0A0;font-size:0.75rem;margin:0 0 6px 0;text-transform:uppercase;letter-spacing:0.1em;">Swish-nummer</p>
                    <p style="color:#FFD700;font-size:1.8rem;font-weight:bold;margin:0;letter-spacing:0.05em;">${swishNumber}</p>
                </div>
                <button id="swishCopyBtn" onclick="navigator.clipboard.writeText('${swishNumber}').then(()=>{document.getElementById('swishCopyBtn').textContent='✓ Kopierat!'}).catch(()=>{}); setTimeout(()=>{const b=document.getElementById('swishCopyBtn'); if(b) b.textContent='📋 Kopiera nummer';},2000);"
                    style="width:100%;padding:14px;background:rgba(255,77,0,0.15);border:2px solid rgba(255,77,0,0.5);color:#FF4D00;font-family:Space Mono,monospace;font-size:0.9rem;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px;clip-path:none;">
                    📋 Kopiera nummer
                </button>
                <button onclick="window.location.href='swish://'"
                    style="width:100%;padding:14px;background:#FF4D00;border:none;color:white;font-family:Space Mono,monospace;font-size:0.9rem;font-weight:700;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:20px;clip-path:none;">
                    Öppna Swish-appen →
                </button>
                <button onclick="document.body.querySelector('.swish-mobile-modal').remove()"
                    style="background:none;border:none;color:#A0A0A0;font-family:Space Mono,monospace;font-size:0.8rem;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;padding:5px;clip-path:none;width:auto;">
                    Stäng
                </button>
            </div>
        `;
        mobileModal.classList.add('swish-mobile-modal');
        document.body.appendChild(mobileModal);
        mobileModal.onclick = (e) => { if (e.target === mobileModal) mobileModal.remove(); };
    } else {
        const qrModal = document.createElement('div');
        qrModal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:10000;display:flex;align-items:center;justify-content:center;';
        qrModal.innerHTML = `
            <div style="background:white;padding:30px;border-radius:10px;text-align:center;max-width:400px;">
                <h2 style="color:#FF4D00;margin:0 0 20px 0;">☕ Tack för stödet!</h2>
                <img src="swish-QR-large.png" style="max-width:100%;height:auto;border-radius:10px;margin-bottom:20px;" alt="Swish QR">
                <p style="color:#333;font-size:1.1rem;font-weight:bold;">${swishNumber}</p>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-top:10px;padding:12px 40px;background:#FF4D00;color:white;border:none;border-radius:5px;cursor:pointer;font-size:1rem;font-weight:bold;">Stäng</button>
            </div>
        `;
        document.body.appendChild(qrModal);
        qrModal.onclick = (e) => { if(e.target === qrModal) qrModal.remove(); };
    }
}

// ─── Keyboard / escape ────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ['addVehicleModal','vehicleDetailsModal','addServiceModal','editVehicleModal','editServiceModal','sellVehicleModal','receiptModal'].forEach(closeModal);
    }
});

// ─── Expose globals ───────────────────────────────────────────────────────────
window.switchAuthTab = switchAuthTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.forgotPassword = forgotPassword;
window.updateModelOptions = updateModelOptions;
window.updateEditModelOptions = updateEditModelOptions;
window.toggleWorkshopField = toggleWorkshopField;
window.toggleEditWorkshopField = toggleEditWorkshopField;
window.addVehicle = addVehicle;
window.deleteVehicle = deleteVehicle;
window.openVehicleDetails = openVehicleDetails;
window.openEditVehicleModal = openEditVehicleModal;
window.updateVehicle = updateVehicle;
window.addService = addService;
window.openEditServiceModal = openEditServiceModal;
window.updateService = updateService;
window.deleteService = deleteService;
window.shareVehicle = shareVehicle;
window.copyShareLink = copyShareLink;
window.openSellVehicleModal = openSellVehicleModal;
window.sellVehicle = sellVehicle;
window.exportPDF = exportPDF;
window.exportData = exportData;
window.viewReceipt = viewReceipt;
window.openSwish = openSwish;
window.openModal = openModal;
window.closeModal = closeModal;
window.openAddVehicleModal = openAddVehicleModal;
window.openAddServiceModal = openAddServiceModal;
window.currentVehicleId = currentVehicleId;
