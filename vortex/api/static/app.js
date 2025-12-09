const API_BASE = "";

// Navigation
function switchView(viewName) {
    document.querySelectorAll('.content-view').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`view-${viewName}`).style.display = 'block';
    // Find nav item (simple loop matching text content logic usually, typically would add IDs to nav items)
    // Quick fix: re-query or just assume order.
    // Better: let's just show view.
    if(viewName === 'history') {
        loadHistory();
    }
}

// Submit Scan
async function submitScan(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const options = {
        cloud: formData.get('cloud') === 'on',
        iot: formData.get('iot') === 'on',
        graphql: formData.get('graphql') === 'on',
        auto_exploit: formData.get('auto_exploit') === 'on'
    };
    
    const payload = {
        target: formData.get('target'),
        scan_type: "full",
        options: options
    };
    
    try {
        const btn = event.target.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Starting...';
        btn.disabled = true;
        
        const res = await fetch(`${API_BASE}/scans`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        if(res.ok) {
            alert('Scan launched successfully!');
            switchView('history');
        } else {
            alert('Error launching scan');
        }
        
        btn.innerHTML = originalText;
        btn.disabled = false;
        event.target.reset();
        
    } catch(e) {
        console.error(e);
        alert('Network error');
    }
}

// Load History
async function loadHistory() {
    try {
        const res = await fetch(`${API_BASE}/scans?limit=50`);
        const scans = await res.json();
        
        const tbody = document.getElementById('history-table-body');
        tbody.innerHTML = '';
        
        scans.reverse().forEach(scan => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${scan.id}</td>
                <td style="font-weight: bold; color: white;">${scan.target}</td>
                <td><span class="type-badge">${scan.scan_type}</span></td>
                <td>${new Date(scan.created_at).toLocaleString()}</td>
                <td><span class="status-badge ${scan.status}">${scan.status.toUpperCase()}</span></td>
                <td>
                    ${scan.status === 'completed' ? 
                      `<button onclick="viewResults(${scan.id})" class="btn-sm">View Report</button>` : 
                      '<span style="opacity:0.5">...</span>'}
                </td>
            `;
            tbody.appendChild(tr);
        });
        
    } catch(e) {
        console.error("Failed to load history", e);
    }
}

// Modal Logic
async function viewResults(id) {
    const modal = document.getElementById('resultsModal');
    const viewer = document.getElementById('jsonViewer');
    
    viewer.textContent = "Loading...";
    modal.style.display = 'block';
    
    try {
        const res = await fetch(`${API_BASE}/scans/${id}`);
        const data = await res.json();
        viewer.textContent = JSON.stringify(data.results, null, 2);
    } catch(e) {
        viewer.textContent = "Error loading results.";
    }
}

function closeModal() {
    document.getElementById('resultsModal').style.display = 'none';
}

// Poll for active scans every 5 seconds if on update
setInterval(() => {
    // Optional: Refresh history if open and running scans exist
    // For simplicity, we skip auto-refresh for now to not be annoying
}, 5000);

// Init
window.onclick = function(event) {
    if (event.target == document.getElementById('resultsModal')) {
        closeModal();
    }
}
