// ==========================================
// 1. IMPORTS & CONFIG
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    getDoc,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const GEMINI_API_KEY = ""; // REMOVED FOR SECURITY - Handled by Backend

// ... (Firebase Config stays same) ...

// ... (UI Event Listeners) ...
// Modal Close Logic
const closeResultBtn = document.getElementById('closeResultBtn');
const closeResultOverlay = document.getElementById('closeResultOverlay');

if (closeResultBtn && resultModal) {
    closeResultBtn.addEventListener('click', () => {
        resultModal.classList.add('hidden');
    });
}

if (closeResultOverlay && resultModal) {
    closeResultOverlay.addEventListener('click', () => {
        resultModal.classList.add('hidden');
    });
}

// --- ANALYZE BUTTON LOGIC (SECURE BACKEND) ---
if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
        const query = userInput.value.trim();
        if (!query) return alert("Please enter a legal query.");

        // UI Loading State
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner"></span> Analyzing...';
        submitBtn.disabled = true;

        // Clear previous results
        if (aiOutput) aiOutput.innerHTML = '';
        if (resultModal) resultModal.classList.add('hidden');

        try {
            // Fetch from our own backend (Relative URL)
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: query })
            });

            const data = await res.json();

            if (!res.ok) {
                // Pass specific server error details to the catch block
                throw new Error(data.details || data.error || `Server Error (${res.status})`);
            }

            // Success Handling
            if (resultModal) resultModal.classList.remove('hidden');
            if (aiOutput) {
                const formattedText = data.response
                    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
                    .replace(/\n\*/g, '<br>&bull; ') // Bullets
                    .replace(/\n/g, '<br>'); // Newlines

                aiOutput.innerHTML = `
                        <div class="result-card">
                            <h3 class="text-xl font-bold text-primary mb-3">Legal Insight</h3>
                            <div class="prose prose-sm text-gray-700 leading-relaxed max-w-none">
                                ${formattedText}
                            </div>
                            <div class="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 italic">
                                Disclaimer: This is AI-generated information for educational purposes only. It is not professional legal advice.
                            </div>
                        </div>
                    `;
            }

            // Optional: Save to history if user logged in
            if (auth.currentUser) {
                saveToDatabase(query, data.response, auth.currentUser.uid).catch(e => console.error("History Save Error:", e));
            }

        } catch (error) {
            console.error("Analysis Error:", error);

            let msg = "Analysis Failed: " + error.message;
            if (error.message.includes("API Key")) {
                msg += "\n\n(Hint: Check your .env file for GEMINI_API_KEY)";
            } else if (error.message.includes("Failed to fetch")) {
                msg += "\n\n(Hint: Is the server running? Run 'node server.js')";
            }
            alert(msg);
        } finally {
            // Reset UI
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ... (Rest of UI logic) ...

// ==========================================
// 3. HELPER FUNCTIONS
// ==========================================

// Call Backend API (Included in button logic now, purely helper if needed elsewhere)
async function callBackendAPI(prompt) {
    // Deprecated: logic moved inside button handler for better UI control
    return null;
}

// Simple formatter for markdown-like text
function formatAIResponse(text) {
    // Convert **bold** to <b>, * to <li>, etc. simple heuristics
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\n\*/g, '<br>&bull; ')
        .replace(/\n/g, '<br>');
    return formatted;
}

// Create/Update User in DB
async function createUserProfile(user) {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName || "User",
                email: user.email || user.phoneNumber,
                joinedAt: new Date()
            });
        }
    } catch (e) {
        console.error("DB Error", e);
    }
}

// Save Search to History (NEW)
async function saveToDatabase(query, response, userId) {
    try {
        await addDoc(collection(db, "users", userId, "history"), {
            user_query: query,
            ai_response: response,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Save Error:", e);
    }
}