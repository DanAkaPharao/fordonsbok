/**
 * translations.js — Fordonsbok i18n
 *
 * Supported locales:
 *   sv    – Svenska (default)
 *   en-GB – English (United Kingdom)
 *
 * CURRENCY NOTE:
 *   Currency symbols are NOT hardcoded here.
 *   Labels that involve money use the {currency} placeholder.
 *   Replace it at render time using the active currency from currencies.js:
 *
 *     import { t } from './translations.js';
 *     import { getCurrency } from './currencies.js';
 *     const label = t('addService.labelCost').replace('{currency}', getCurrency().symbol);
 *
 * Usage:
 *   import { t, setLocale, getLocale } from './translations.js';
 *   setLocale('en-GB');
 *   t('app.title')                  // → "Vehicle Logbook"
 *   t('vehicles.servicePosts', 3)   // → "3 service records"
 */

const translations = {

    // ─── Svenska ──────────────────────────────────────────────────────────────
    sv: {
        app: {
            title:    'Fordonsbok',
            subtitle: 'Digital Servicehistorik',
        },

        auth: {
            tabLogin:           'Inloggning',
            tabRegister:        'Skapa konto',
            labelEmail:         'Email',
            labelPassword:      'Lösenord',
            labelPasswordMin:   'Lösenord (minst 6 tecken)',
            labelConfirmPwd:    'Bekräfta lösenord',
            placeholderEmail:   'din@email.se',
            forgotPassword:     'Glömt lösenord?',
            loginBtn:           'Logga in',
            loggingIn:          'Loggar in...',
            registerBtn:        'Skapa konto',
            creatingAccount:    'Skapar konto...',
        },

        authErrors: {
            loginFailed:       'Inloggningen misslyckades. Kontrollera email och lösenord.',
            userNotFound:      'Ingen användare hittades med denna email.',
            wrongPassword:     'Felaktigt lösenord.',
            invalidEmail:      'Ogiltig email-adress.',
            invalidCredential: 'Felaktig email eller lösenord.',
            passwordMismatch:  'Lösenorden matchar inte.',
            accountCreateFail: 'Kunde inte skapa konto. Försök igen.',
            emailInUse:        'Det finns redan ett konto med denna email.',
            weakPassword:      'Lösenordet är för svagt. Använd minst 6 tecken.',
        },

        forgotPwd: {
            enterEmailFirst: 'Ange din e-postadress först.',
            confirmSend:     (email) => `Skicka lösenordsåterställning till ${email}?`,
            successAlert:    (email) =>
                `✅ Kolla din inkorg!\n\nEtt mail med återställningslänk har skickats till ${email}.\n\nOBS: Länken är giltig i 1 timme och kan bara användas EN gång.`,
            sendFailed:      'Kunde inte skicka återställningsmail.',
        },

        header: {
            loggedInAs:    'Inloggad som:',
            logoutBtn:     'Logga ut',
            confirmLogout: 'Är du säker på att du vill logga ut?',
        },

        controls: {
            addVehicle: '+ Lägg till fordon',
            exportData: 'Exportera data',
            buyCoffee:  '☕ Köp en kaffe',
        },

        vehicles: {
            loading:      'Laddar fordon',
            emptyHeading: 'Inga fordon tillagda',
            emptyHint:    'Klicka på "Lägg till fordon" för att komma igång',
            loadError:    'Kunde inte ladda fordon. Försök igen.',
            soldBadge:    'SÅLD',
            soldLabel:    '(såld)',
            editBtn:      '✏️ Ändra',
            sellBtn:      '🤝 Sälj',
            labelMake:    'Märke:',
            labelModel:   'Modell:',
            labelYear:    'År:',
            labelColor:   'Färg:',
            labelSold:    'Såld:',
            servicePosts: (n) => `${n} serviceposter`,
        },

        addVehicle: {
            modalTitle:          'Nytt Fordon',
            labelRegNumber:      'Registreringsnummer *',
            labelMake:           'Märke *',
            placeholderMake:     'Välj märke',
            labelModel:          'Modell *',
            placeholderModel:    'Välj först ett märke',
            placeholderModelSel: 'Välj modell',
            labelCustomModel:    'Ange modell *',
            placeholderCustom:   'Skriv modellnamn',
            labelYear:           'Årsmodell',
            labelColor:          'Färg',
            placeholderColor:    'Svart',
            labelNotes:          'Anteckningar',
            placeholderNotes:    'Övrig information om fordonet...',
            labelPhoto:          'Foto av fordonet',
            choosePhoto:         '📷 Välj bild',
            submitBtn:           'Spara fordon',
            saving:              'Sparar...',
            uploadingPhoto:      'Laddar upp foto...',
            photoUploadFail:     'Kunde inte ladda upp foto. Fordonet sparas utan foto.',
            addFail:             'Kunde inte lägga till fordon. Försök igen.',
            mustBeLoggedIn:      'Du måste vara inloggad för att lägga till fordon.',
            other:               'Annat',
        },

        editVehicle: {
            modalTitle:      'Redigera Fordon',
            currentPhoto:    'Nuvarande foto:',
            changePhoto:     '📷 Välj ny bild',
            submitBtn:       'Uppdatera fordon',
            updating:        'Uppdaterar...',
            photoUploadFail: 'Kunde inte ladda upp foto: {msg}. Övriga ändringar sparas.',
            updateFail:      'Kunde inte uppdatera fordon. Försök igen.',
        },

        deleteVehicle: {
            confirm:    'Är du säker på att du vill ta bort detta fordon och all dess servicehistorik?',
            deleteFail: 'Kunde inte ta bort fordon. Försök igen.',
        },

        vehicleDetails: {
            closeBtn:         '✕ Stäng servicebok',
            backBtn:          '← Tillbaka',
            labelMake:        'Märke:',
            labelModel:       'Modell:',
            labelYear:        'År:',
            labelColor:       'Färg:',
            labelNotes:       'Anteckningar:',
            addServiceBtn:    '+ Lägg till service',
            shareBtn:         '🔗 Dela servicebok',
            exportPDFBtn:     '📄 Exportera PDF',
            sellBtn:          '🤝 Sälj / Överlåt',
            shareLabel:       '🔗 Delningslänk (giltig 30 dagar):',
            copyLinkBtn:      'Kopiera',
            shareNote:        'Mottagaren kan se serviceboken utan att logga in. Länken låser inte boken.',
            serviceHistTitle: 'Servicehistorik',
        },

        serviceList: {
            empty:          'Ingen servicehistorik ännu',
            locked:         '🔒 låst',
            diy:            '🔧 DIY',
            labelDate:      'Datum:',
            labelPerformed: 'Utfört av:',
            labelMileage:   'Mätarställning:',
            labelCost:      'Kostnad:',
            labelWorkshop:  'Verkstad:',
            selfWork:       'Själv (eget arbete)',
            workshopWork:   'Verkstad',
            ownWork:        'Eget arbete',
            viewReceipt:    '🧾 Visa kvitto',
            created:        'Skapad:',
            modified:       'Ändrad:',
            notModified:    'Ej ändrad',
            unknown:        'Okänt',
        },

        addService: {
            modalTitle:          'Ny Service',
            labelDate:           'Datum *',
            labelType:           'Typ av service *',
            placeholderType:     'Välj typ',
            labelMileage:        'Mätarställning (km)',
            placeholderMileage:  '15000',
            labelPerformedBy:    'Utfört av *',
            placeholderPerf:     'Välj',
            selfOption:          'Själv (eget arbete)',
            workshopOption:      'Verkstad',
            labelWorkshop:       'Verkstad',
            placeholderWorkshop: 'Bilverkstan AB',
            labelCost:           'Kostnad ({currency})',
            placeholderCost:     '2500',
            labelNotes:          'Anteckningar',
            placeholderNotes:    'Beskrivning av utförd service...',
            labelReceipt:        'Ladda upp kvitto (bild/PDF)',
            chooseReceipt:       '🧾 Välj kvitto',
            submitBtn:           'Spara service',
            saving:              'Sparar...',
            uploadingReceipt:    'Laddar upp kvitto...',
            receiptUploadFail:   'Kunde inte ladda upp kvitto. Service sparas utan kvitto.',
            addFail:             'Kunde inte lägga till service. Försök igen.',
            mustBeLoggedIn:      'Du måste vara inloggad.',
        },

        editService: {
            modalTitle:          'Redigera Service',
            labelDate:           'Datum *',
            labelType:           'Typ av service *',
            placeholderType:     'Välj typ',
            labelMileage:        'Mätarställning (km)',
            placeholderMileage:  '15000',
            labelPerformedBy:    'Utfört av *',
            placeholderPerf:     'Välj',
            selfOption:          'Själv (eget arbete)',
            workshopOption:      'Verkstad',
            labelWorkshop:       'Verkstad',
            labelCost:           'Kostnad ({currency})',
            placeholderCost:     '2500',
            labelNotes:          'Anteckningar',
            placeholderNotes:    'Beskrivning av utförd service...',
            labelNewReceipt:     'Ladda upp nytt kvitto (ersätter befintligt)',
            chooseNewReceipt:    '🧾 Välj nytt kvitto',
            updateBtn:           'Uppdatera service',
            updateFail:          'Kunde inte uppdatera service. Försök igen.',
        },

        deleteService: {
            confirm:    'Är du säker på att du vill ta bort denna servicepost?',
            deleteFail: 'Kunde inte ta bort service. Försök igen.',
        },

        receiptModal: {
            title: '🧾 Kvitto',
        },

        sell: {
            modalTitle:      '🤝 Sälj / Överlåt fordon',
            warningTitle:    '⚠️ OBS! Detta kan inte ångras!',
            warningBody:     'All befintlig servicehistorik låses permanent. Ny ägare kan inte ändra eller ta bort historiken - bara lägga till nya poster.',
            labelNewOwner:   'Ny ägares e-postadress',
            placeholderEmail:'nyagare@email.se (lämna tomt om okänd)',
            ownerHint:       'Lämna tomt om du sålt bilen men köparen inte använder Fordonsbok.',
            labelDate:       'Överlåtelsedatum *',
            labelPrice:      'Försäljningspris ({currency})',
            placeholderPrice:'250000',
            labelNote:       'Meddelande till ny ägare',
            placeholderNote: 'T.ex. servicar nyligen utförda, kända fel...',
            confirmBtn:      '🤝 Bekräfta överlåtelse',
            searching:       'Söker ny ägare...',
            transferring:    'Överlåter...',
            fillDate:        'Fyll i överlåtelsedatum.',
            noUserFound:     (email) =>
                `❌ Ingen användare hittades med e-posten: ${email}\n\nLämna fältet tomt om köparen inte har konto.`,
            confirmToUser:   (email) =>
                `Bekräfta överlåtelse till ${email}?\n\nBilen flyttas till deras konto.`,
            confirmNoUser:
                `Bekräfta överlåtelse utan registrerad köpare?\n\nBilen arkiveras som "SÅLD" i ditt konto.`,
            lockWarning:
                `\n\nAll befintlig servicehistorik låses permanent.\n\nDetta kan INTE ångras!`,
            successToUser:   (email) => `✅ Bilen är överlåten till ${email}!`,
            successArchived: '✅ Bilen är markerad som SÅLD och arkiverad!',
            transferFail:    'Kunde inte överlåta bilen. Försök igen.',
            transferType:    '🤝 Överlåtelse',
            // currencySymbol injected at call site from currencies.js
            transferNote:    (email, price, currencySymbol, note) =>
                `Bil ${email ? 'överlåten till ' + email : 'såld (köpare ej registrerad)'}` +
                `${price ? '. Pris: ' + parseInt(price).toLocaleString('sv-SE') + '\u00a0' + currencySymbol : ''}` +
                `${note ? '. ' + note : ''}`,
        },

        share: {
            copied:      '✅ Länk kopierad!',
            copyFailed:  '❌ Kunde inte kopiera länken.',
            shareFail:   'Kunde inte dela fordonet.',
            shareView:   '👁️ Skrivskyddad vy - delad servicebok',
            registerCta: 'Vill du spara din egen servicebok?',
            registerLink:'Registrera dig gratis →',
        },

        serviceTypes: {
            regular:     'Ordinarie service',
            major:       'Stora servicen',
            oilChange:   'Oljebyte',
            oilTop:      'Oljepåfyllning',
            brakes:      'Bromsar',
            brakeFluid:  'Bromsvätsketoppning',
            tyres:       'Däck',
            tyreSwap:    'Däckbyte (sommar/vinter)',
            battery:     'Batteribyte',
            bulbs:       'Glödlampor',
            airFilter:   'Luftfilter',
            cabinFilter: 'Kupéfilter',
            washerFluid: 'Spolarvätska',
            coolant:     'Kylvätska',
            wipers:      'Torkarblad',
            repair:      'Reparation',
            inspection:  'Besiktning',
            wash:        'Tvätt/vård',
            other:       'Övrigt',
        },

        pdf: {
            docTitle:       (reg) => `Servicebok - ${reg}`,
            heading:        (reg) => `🚗 Servicebok - ${reg}`,
            labelMake:      'Märke:',
            labelYear:      'Årsmodell:',
            labelColor:     'Färg:',
            labelNotes:     'Anteckningar:',
            labelLocked:    '🔒 Låst vid överlåtelse:',
            historyHeading: (n) => `Servicehistorik (${n} poster)`,
            ownWork:        'Eget arbete',
            viewReceipt:    '🧾 Visa kvitto',
            footer:         (date, email) => `Exporterad från Fordonsbok · ${date} · ${email}`,
        },

        swish: {
            thanks:      'Tack för stödet!',
            swishACoffee:'Swisha en kaffe',
            swishNumber: 'Swish-nummer',
            copyNumber:  '📋 Kopiera nummer',
            copied:      '✓ Kopierat!',
            openApp:     'Öppna Swish-appen →',
            close:       'Stäng',
        },

        canvas: {
            kmh: 'km/h',
            odo: 'ODO  km',
        },

        settings: {
            title:         'Inställningar',
            languageLabel: 'Språk',
            currencyLabel: 'Valuta',
        },
    },


    // ─── English (GB) ─────────────────────────────────────────────────────────
    'en-GB': {
        app: {
            title:    'Vehicle Logbook',
            subtitle: 'Digital Service History',
        },

        auth: {
            tabLogin:           'Log In',
            tabRegister:        'Create Account',
            labelEmail:         'Email',
            labelPassword:      'Password',
            labelPasswordMin:   'Password (at least 6 characters)',
            labelConfirmPwd:    'Confirm Password',
            placeholderEmail:   'your@email.co.uk',
            forgotPassword:     'Forgot password?',
            loginBtn:           'Log In',
            loggingIn:          'Logging in…',
            registerBtn:        'Create Account',
            creatingAccount:    'Creating account…',
        },

        authErrors: {
            loginFailed:       'Login failed. Please check your email and password.',
            userNotFound:      'No account found with this email address.',
            wrongPassword:     'Incorrect password.',
            invalidEmail:      'Invalid email address.',
            invalidCredential: 'Incorrect email or password.',
            passwordMismatch:  'Passwords do not match.',
            accountCreateFail: 'Could not create account. Please try again.',
            emailInUse:        'An account with this email already exists.',
            weakPassword:      'Password is too weak. Use at least 6 characters.',
        },

        forgotPwd: {
            enterEmailFirst: 'Please enter your email address first.',
            confirmSend:     (email) => `Send password reset to ${email}?`,
            successAlert:    (email) =>
                `✅ Check your inbox!\n\nA reset link has been sent to ${email}.\n\nNote: The link is valid for 1 hour and can only be used ONCE.`,
            sendFailed:      'Could not send reset email.',
        },

        header: {
            loggedInAs:    'Logged in as:',
            logoutBtn:     'Log Out',
            confirmLogout: 'Are you sure you want to log out?',
        },

        controls: {
            addVehicle: '+ Add Vehicle',
            exportData: 'Export Data',
            buyCoffee:  '☕ Buy a Coffee',
        },

        vehicles: {
            loading:      'Loading vehicles',
            emptyHeading: 'No vehicles added',
            emptyHint:    'Click "Add Vehicle" to get started',
            loadError:    'Could not load vehicles. Please try again.',
            soldBadge:    'SOLD',
            soldLabel:    '(sold)',
            editBtn:      '✏️ Edit',
            sellBtn:      '🤝 Sell',
            labelMake:    'Make:',
            labelModel:   'Model:',
            labelYear:    'Year:',
            labelColor:   'Colour:',
            labelSold:    'Sold:',
            servicePosts: (n) => `${n} service record${n !== 1 ? 's' : ''}`,
        },

        addVehicle: {
            modalTitle:          'New Vehicle',
            labelRegNumber:      'Registration Number *',
            labelMake:           'Make *',
            placeholderMake:     'Select make',
            labelModel:          'Model *',
            placeholderModel:    'Select a make first',
            placeholderModelSel: 'Select model',
            labelCustomModel:    'Enter model *',
            placeholderCustom:   'Type model name',
            labelYear:           'Year',
            labelColor:          'Colour',
            placeholderColor:    'Black',
            labelNotes:          'Notes',
            placeholderNotes:    'Other information about the vehicle…',
            labelPhoto:          'Vehicle photo (optional)',
            choosePhoto:         '📷 Choose photo',
            submitBtn:           'Save Vehicle',
            saving:              'Saving…',
            uploadingPhoto:      'Uploading photo…',
            photoUploadFail:     'Could not upload photo. Vehicle will be saved without a photo.',
            addFail:             'Could not add vehicle. Please try again.',
            mustBeLoggedIn:      'You must be logged in to add a vehicle.',
            other:               'Other',
        },

        editVehicle: {
            modalTitle:      'Edit Vehicle',
            currentPhoto:    'Current photo:',
            changePhoto:     '📷 Choose new photo',
            submitBtn:       'Update Vehicle',
            updating:        'Updating…',
            photoUploadFail: 'Could not upload photo: {msg}. Other changes will be saved.',
            updateFail:      'Could not update vehicle. Please try again.',
        },

        deleteVehicle: {
            confirm:    'Are you sure you want to delete this vehicle and all its service history?',
            deleteFail: 'Could not delete vehicle. Please try again.',
        },

        vehicleDetails: {
            closeBtn:         '✕ Close service logbook',
            backBtn:          '← Back',
            labelMake:        'Make:',
            labelModel:       'Model:',
            labelYear:        'Year:',
            labelColor:       'Colour:',
            labelNotes:       'Notes:',
            addServiceBtn:    '+ Add Service',
            shareBtn:         '🔗 Share Logbook',
            exportPDFBtn:     '📄 Export PDF',
            sellBtn:          '🤝 Sell / Transfer',
            shareLabel:       '🔗 Share link (valid 30 days):',
            copyLinkBtn:      'Copy',
            shareNote:        'The recipient can view the logbook without logging in. The link does not lock the logbook.',
            serviceHistTitle: 'Service History',
        },

        serviceList: {
            empty:          'No service history yet',
            locked:         '🔒 locked',
            diy:            '🔧 DIY',
            labelDate:      'Date:',
            labelPerformed: 'Performed by:',
            labelMileage:   'Mileage:',
            labelCost:      'Cost:',
            labelWorkshop:  'Garage:',
            selfWork:       'Self (own work)',
            workshopWork:   'Garage',
            ownWork:        'Own work',
            viewReceipt:    '🧾 View Receipt',
            created:        'Created:',
            modified:       'Modified:',
            notModified:    'Not modified',
            unknown:        'Unknown',
        },

        addService: {
            modalTitle:          'New Service',
            labelDate:           'Date *',
            labelType:           'Service type *',
            placeholderType:     'Select type',
            labelMileage:        'Mileage (km)',
            placeholderMileage:  '15000',
            labelPerformedBy:    'Performed by *',
            placeholderPerf:     'Select',
            selfOption:          'Self (own work)',
            workshopOption:      'Garage',
            labelWorkshop:       'Garage',
            placeholderWorkshop: 'City Garage Ltd',
            labelCost:           'Cost ({currency})',
            placeholderCost:     '500',
            labelNotes:          'Notes',
            placeholderNotes:    'Description of work carried out…',
            labelReceipt:        'Upload receipt (image/PDF)',
            chooseReceipt:       '🧾 Choose receipt',
            submitBtn:           'Save Service',
            saving:              'Saving…',
            uploadingReceipt:    'Uploading receipt…',
            receiptUploadFail:   'Could not upload receipt. Service will be saved without a receipt.',
            addFail:             'Could not add service record. Please try again.',
            mustBeLoggedIn:      'You must be logged in.',
        },

        editService: {
            modalTitle:          'Edit Service',
            labelDate:           'Date *',
            labelType:           'Service type *',
            placeholderType:     'Select type',
            labelMileage:        'Mileage (km)',
            placeholderMileage:  '15000',
            labelPerformedBy:    'Performed by *',
            placeholderPerf:     'Select',
            selfOption:          'Self (own work)',
            workshopOption:      'Garage',
            labelWorkshop:       'Garage',
            labelCost:           'Cost ({currency})',
            placeholderCost:     '500',
            labelNotes:          'Notes',
            placeholderNotes:    'Description of work carried out…',
            labelNewReceipt:     'Upload new receipt (replaces existing)',
            chooseNewReceipt:    '🧾 Choose new receipt',
            updateBtn:           'Update Service',
            updateFail:          'Could not update service record. Please try again.',
        },

        deleteService: {
            confirm:    'Are you sure you want to delete this service record?',
            deleteFail: 'Could not delete service record. Please try again.',
        },

        receiptModal: {
            title: '🧾 Receipt',
        },

        sell: {
            modalTitle:      '🤝 Sell / Transfer Vehicle',
            warningTitle:    '⚠️ WARNING! This cannot be undone!',
            warningBody:     'All existing service history will be permanently locked. The new owner cannot edit or delete the history — only add new records.',
            labelNewOwner:   "New owner's email address",
            placeholderEmail:'newowner@email.co.uk (leave blank if unknown)',
            ownerHint:       'Leave blank if you have sold the vehicle but the buyer does not use Vehicle Logbook.',
            labelDate:       'Transfer date *',
            labelPrice:      'Sale price ({currency})',
            placeholderPrice:'25000',
            labelNote:       'Message to new owner',
            placeholderNote: 'E.g. recent services, known issues…',
            confirmBtn:      '🤝 Confirm Transfer',
            searching:       'Looking up new owner…',
            transferring:    'Transferring…',
            fillDate:        'Please fill in the transfer date.',
            noUserFound:     (email) =>
                `❌ No account found with the email: ${email}\n\nLeave the field empty if the buyer does not have an account.`,
            confirmToUser:   (email) =>
                `Confirm transfer to ${email}?\n\nThe vehicle will be moved to their account.`,
            confirmNoUser:
                `Confirm transfer without a registered buyer?\n\nThe vehicle will be archived as "SOLD" in your account.`,
            lockWarning:
                `\n\nAll existing service history will be permanently locked.\n\nThis CANNOT be undone!`,
            successToUser:   (email) => `✅ Vehicle transferred to ${email}!`,
            successArchived: '✅ Vehicle marked as SOLD and archived!',
            transferFail:    'Could not transfer vehicle. Please try again.',
            transferType:    '🤝 Transfer',
            // currencySymbol injected at call site from currencies.js
            transferNote:    (email, price, currencySymbol, note) =>
                `Vehicle ${email ? 'transferred to ' + email : 'sold (buyer not registered)'}` +
                `${price ? '. Price: ' + parseInt(price).toLocaleString('en-GB') + '\u00a0' + currencySymbol : ''}` +
                `${note ? '. ' + note : ''}`,
        },

        share: {
            copied:      '✅ Link copied!',
            copyFailed:  '❌ Could not copy the link.',
            shareFail:   'Could not share vehicle.',
            shareView:   '👁️ Read-only view — shared logbook',
            registerCta: 'Want to keep your own service logbook?',
            registerLink:'Sign up for free →',
        },

        serviceTypes: {
            regular:     'Standard Service',
            major:       'Major Service',
            oilChange:   'Oil Change',
            oilTop:      'Oil Top-up',
            brakes:      'Brakes',
            brakeFluid:  'Brake Fluid Top-up',
            tyres:       'Tyres',
            tyreSwap:    'Tyre Change (summer/winter)',
            battery:     'Battery Replacement',
            bulbs:       'Light Bulbs',
            airFilter:   'Air Filter',
            cabinFilter: 'Cabin Filter',
            washerFluid: 'Washer Fluid',
            coolant:     'Coolant',
            wipers:      'Wiper Blades',
            repair:      'Repair',
            inspection:  'MOT / Inspection',
            wash:        'Wash / Detailing',
            other:       'Other',
        },

        pdf: {
            docTitle:       (reg) => `Service Logbook - ${reg}`,
            heading:        (reg) => `🚗 Service Logbook - ${reg}`,
            labelMake:      'Make:',
            labelYear:      'Year:',
            labelColor:     'Colour:',
            labelNotes:     'Notes:',
            labelLocked:    '🔒 Locked at transfer:',
            historyHeading: (n) => `Service History (${n} record${n !== 1 ? 's' : ''})`,
            ownWork:        'Own work',
            viewReceipt:    '🧾 View receipt',
            footer:         (date, email) => `Exported from Vehicle Logbook · ${date} · ${email}`,
        },

        swish: {
            thanks:      'Thanks for your support!',
            swishACoffee:'Buy a coffee',
            swishNumber: 'Swish number',
            copyNumber:  '📋 Copy number',
            copied:      '✓ Copied!',
            openApp:     'Open Swish app →',
            close:       'Close',
        },

        canvas: {
            kmh: 'km/h',
            odo: 'ODO  km',
        },

        settings: {
            title:         'Settings',
            languageLabel: 'Language',
            currencyLabel: 'Currency',
        },
    },
};

// ─── Active locale ────────────────────────────────────────────────────────────
let _locale = 'sv';

export function setLocale(locale) {
    if (!translations[locale]) {
        console.warn(`[i18n] Unknown locale "${locale}". Keeping "${_locale}".`);
        return;
    }
    _locale = locale;
}

export function getLocale() { return _locale; }

/**
 * Resolve a dot-separated translation key.
 * Function values are called with the extra args you pass.
 *
 *   t('addService.labelCost')        → "Kostnad ({currency})"
 *   t('vehicles.servicePosts', 3)    → "3 serviceposter"
 *
 * Falls back to Swedish if the key is missing in the active locale.
 */
export function t(key, ...args) {
    const parts = key.split('.');
    const resolve = (obj) =>
        parts.reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
    let value = resolve(translations[_locale]) ?? resolve(translations['sv']);
    if (value === undefined) {
        console.warn(`[i18n] Missing translation key: "${key}"`);
        return key;
    }
    return typeof value === 'function' ? value(...args) : value;
}

/** Return an entire namespace object (useful for destructuring). */
export function ns(namespace) {
    return translations[_locale]?.[namespace] ?? translations['sv'][namespace] ?? {};
}

export default { t, ns, setLocale, getLocale };
