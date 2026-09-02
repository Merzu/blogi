// auth.js - Autentimine, rollid ja lehtede kaitse

(function() {
    const currentUser = JSON.parse(localStorage.getItem('rahamagi_user'));
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // 1. Kui pole sisse logitud ja ei asuta login.html lehel -> Suuna logima
    if (!currentUser && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return;
    }

    // 2. Kaitse Eesmärkide lehte (eesmargid.html) - Lubatud ainult Admin ja Eri-Külaline
    if (currentPage === 'eesmargid.html' && !['admin', 'specialguest'].includes(currentUser?.role)) {
        alert('Luba puudub! See leht on nähtav ainult Admin ja Eri-Külaline kasutajatele.');
        window.location.href = 'index.html';
        return;
    }

    // 3. Ehita navigeerimismenüü automaatselt
    document.addEventListener('DOMContentLoaded', () => {
        const navUl = document.getElementById('main-nav-links');
        if (!navUl || !currentUser) return;

        let navHtml = `
            <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Avaleht</a></li>
            <li><a href="blog.html" class="${currentPage === 'blog.html' ? 'active' : ''}">Blogi</a></li>
            <li><a href="portfell.html" class="${currentPage === 'portfell.html' ? 'active' : ''}">Portfell</a></li>
            <li><a href="kalkulaator.html" class="${currentPage === 'kalkulaator.html' ? 'active' : ''}">Kalkulaator</a></li>
        `;

        // Lisa Adminile ja Eri-Külalisele eesmärkide leht
        if (['admin', 'specialguest'].includes(currentUser.role)) {
            navHtml += `<li><a href="eesmargid.html" class="${currentPage === 'eesmargid.html' ? 'active' : ''}" style="color: var(--accent-gold); font-weight: bold;">🎯 10 Eesmärki</a></li>`;
        }

        // Tuvasta rolli silt
        let roleLabel = '👤 Külaline';
        if (currentUser.role === 'admin') roleLabel = '👑 Admin';
        if (currentUser.role === 'specialguest') roleLabel = '⭐ Eri-Külaline';

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
