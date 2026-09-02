// auth.js - Autentimine ja lehtede kaitse

(function() {
    // Lae salvestatud kasutaja info
    const currentUser = JSON.parse(localStorage.getItem('rahamagi_user'));
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Kui pole sisse logitud ja ei asuta login.html lehel -> Suuna Logima
    if (!currentUser && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    // 2. Kaitse Admin lehte (eesmargid.html)
    if (currentPage === 'eesmargid.html' && currentUser?.role !== 'admin') {
        alert('Luba puudub! See leht on nähtav ainult Admin kasutajale.');
        window.location.href = 'index.html';
        return;
    }

    // 3. Ehita navigeerimismenüü automaatselt kui leht on laetud
    document.addEventListener('DOMContentLoaded', () => {
        const navUl = document.getElementById('main-nav-links');
        if (!navUl || !currentUser) return;

        let navHtml = `
            <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Avaleht</a></li>
            <li><a href="blog.html" class="${currentPage === 'blog.html' ? 'active' : ''}">Blogi</a></li>
            <li><a href="portfell.html" class="${currentPage === 'portfell.html' ? 'active' : ''}">Portfell</a></li>
            <li><a href="kalkulaator.html" class="${currentPage === 'kalkulaator.html' ? 'active' : ''}">Kalkulaator</a></li>
        `;

        // Lisa Adminile salajane eesmärkide leht
        if (currentUser.role === 'admin') {
            navHtml += `<li><a href="eesmargid.html" class="${currentPage === 'eesmargid.html' ? 'active' : ''}" style="color: var(--accent-gold); font-weight: bold;">🎯 10 Eesmärki</a></li>`;
        }

        // Roll märk & Väljalogimise nupp
        const roleLabel = currentUser.role === 'admin' ? '👑 Admin' : '👤 Külaline';
        navHtml += `
            <li style="display: flex; align-items: center; gap: 10px; margin-left: 10px;">
                <span style="font-size: 0.8rem; padding: 4px 10px; background: rgba(255,255,255,0.08); border-radius: 20px; color: #94a3b8; border: 1px solid var(--border-color);">${roleLabel}</span>
                <button onclick="logout()" class="btn-logout">Väljalogimine</button>
            </li>
        `;

        navUl.innerHTML = navHtml;
    });
})();

// Väljalogimise funktsioon
function logout() {
    localStorage.removeItem('rahamagi_user');
    window.location.href = 'login.html';
}
