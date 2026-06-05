import { useState, useEffect } from "react";

const API = "https://inventory-management-api-kseg.onrender.com";
// ── Icons ─────────────────────────────────────────────────────────
const Icon = ({ name, size = 18 }) => {
  const icons = {
    dashboard: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
    suppliers: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    inventory: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    orders: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    reports: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    ),
    materials: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    plus: (
      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    ),
    trash: (
      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
      </svg>
    ),
    x: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    ),
    chevron: (
      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    ),
    trending: (
      <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
  };
  return icons[name] || null;
};

// ── Modal ─────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="icon-btn" onClick={onClose}><Icon name="x" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────
function StatCard({ label, value, color, icon, trend, onClick }) {
  return (
    <div className="stat-card" style={{ '--accent': color }} onClick={onClick}>
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: color + '15', color }}><Icon name={icon} size={20} /></div>
        <span className="stat-trend"><Icon name="trending" size={12} /> {trend}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-bar"><div className="stat-bar-fill" style={{ background: color }} /></div>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────
function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div className="page-header-left">
        <div className="page-breadcrumb">InvenTrack <Icon name="chevron" size={12} /> {title}</div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      {action && <div className="page-header-right">{action}</div>}
    </div>
  );
}

// ── DASHBOARD ────────────────────────────────────────────────────
function Dashboard({ setPage }) {
  const [stats, setStats] = useState({ suppliers: 0, inventory: 0, orders: 0, materials: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, inv, o, m] = await Promise.all([
          fetch(`${API}/suppliers`).then(r => r.json()),
          fetch(`${API}/inventory`).then(r => r.json()),
          fetch(`${API}/orders`).then(r => r.json()),
          fetch(`${API}/rawmaterials`).then(r => r.json()),
        ]);
        setStats({ suppliers: s.length, inventory: inv.length, orders: o.length, materials: m.length });
        setLoaded(true);
      } catch { setLoaded(true); }
    };
    load();
  }, []);

  const cards = [
    { label: "Total Suppliers", value: stats.suppliers, color: "#3b6ef5", icon: "suppliers", trend: "Active", page: "suppliers" },
    { label: "Inventory Items", value: stats.inventory, color: "#0db37e", icon: "inventory", trend: "Tracked", page: "inventory" },
    { label: "Purchase Orders", value: stats.orders, color: "#f5a623", icon: "orders", trend: "Placed", page: "orders" },
    { label: "Raw Materials", value: stats.materials, color: "#9b59b6", icon: "materials", trend: "Catalogued", page: "materials" },
  ];

  const features = [
    { icon: "inventory", color: "#3b6ef5", title: "Warehouse Control", desc: "Real-time visibility into stock levels, bin/lot management, and multi-location inventory tracking." },
    { icon: "suppliers", color: "#0db37e", title: "Vendor Management", desc: "Streamline procurement, vendor self-service access, and purchase order workflows end-to-end." },
    { icon: "trending", color: "#f5a623", title: "Demand Planning", desc: "Leverage historical data and forecasts to auto-generate purchase and work orders intelligently." },
    { icon: "reports", color: "#9b59b6", title: "Analytics & Reports", desc: "Advanced reporting tools with inventory turnover, back-order, and supplier spending dashboards." },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle="Real-time overview of your inventory management system"
        action={<div className="live-badge"><span className="live-dot" />Live Data</div>}
      />

      <div className={`stats-grid ${loaded ? 'loaded' : ''}`}>
        {cards.map((c, i) => (
          <div key={c.label} style={{ animationDelay: `${i * 80}ms` }} className="stat-card-wrap">
            <StatCard {...c} onClick={() => setPage(c.page)} />
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="welcome-card">
          <div className="welcome-badge">Inventory Management System</div>
          <h2 className="welcome-title">Complete Supply Chain Visibility</h2>
          <p className="welcome-desc">
            InvenTrack delivers an end-to-end procure-to-pay process built on a modern tech stack.
            Manage suppliers, raw materials, storage locations, inventory, and orders with full REST API backend integration.
          </p>
          <div className="tech-stack">
            {["FastAPI", "SQLAlchemy", "SQLite", "Docker", "React", "REST API"].map(t => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </div>

        <div className="features-card">
          <h3 className="features-title">Key Capabilities</h3>
          <div className="features-list">
            {features.map(f => (
              <div key={f.title} className="feature-item">
                <div className="feature-icon" style={{ color: f.color, background: f.color + '15' }}>
                  <Icon name={f.icon} size={16} />
                </div>
                <div>
                  <div className="feature-name">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SUPPLIERS PAGE ────────────────────────────────────────────────
function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phoneno: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/suppliers`);
      setSuppliers(await res.json());
    } catch { setError("Cannot connect to backend. Make sure FastAPI is running on port 8000."); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/suppliers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setShowModal(false); setForm({ name: "", email: "", phoneno: "" }); fetchSuppliers(); }
    } catch { setError("Failed to add supplier."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    try {
      await fetch(`${API}/suppliers/${id}`, { method: "DELETE" });
      fetchSuppliers();
    } catch { setError("Failed to delete."); }
  };

  const filtered = suppliers.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <PageHeader
        title="Suppliers"
        subtitle="Manage your supplier network and vendor relationships"
        action={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="plus" /> Add Supplier
          </button>
        }
      />

      {error && <div className="error-banner">{error}</div>}

      <div className="table-card">
        <div className="table-toolbar">
          <input
            className="search-input"
            placeholder="Search suppliers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="record-count">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? <div className="loading-state"><div className="spinner" />Loading suppliers...</div> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Supplier Name</th><th>Email</th><th>Phone</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="empty-cell">
                  {search ? "No suppliers match your search." : "No suppliers yet. Add your first one!"}
                </td></tr>
              ) : filtered.map(s => (
                <tr key={s.supplierid} className="table-row">
                  <td><span className="id-badge">#{s.supplierid}</span></td>
                  <td className="name-cell">
                    <div className="avatar-cell">
                      <div className="row-avatar">{s.name?.[0]?.toUpperCase()}</div>
                      {s.name}
                    </div>
                  </td>
                  <td className="muted">{s.email}</td>
                  <td className="muted">{s.phoneno}</td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(s.supplierid)}>
                      <Icon name="trash" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title="Add New Supplier" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="modal-form">
            <div className="form-group">
              <label>Supplier Name</label>
              <input required placeholder="e.g. Acme Corp" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required placeholder="contact@supplier.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input required placeholder="10-digit number" value={form.phoneno}
                onChange={e => setForm({ ...form, phoneno: e.target.value })} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add Supplier</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── INVENTORY PAGE ────────────────────────────────────────────────
function InventoryPage() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ itemname: "", quantity: "", storageid: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      // ✅ FIX: fetch /inventory (list), not /inventory/by-city without params
      const res = await fetch(`${API}/inventory`);
      if (!res.ok) throw new Error("Bad response");
      setItems(await res.json());
    } catch { setError("Cannot connect to backend."); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemname: form.itemname,
          quantity: parseInt(form.quantity),
          storageid: parseInt(form.storageid),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ itemname: "", quantity: "", storageid: "" });
        fetchInventory();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to add item.");
      }
    } catch { setError("Failed to add item."); }
  };

  const getStatus = (qty) => {
    if (qty > 30) return { label: "In Stock", cls: "status-green" };
    if (qty > 10) return { label: "Low Stock", cls: "status-amber" };
    return { label: "Critical", cls: "status-red" };
  };

  return (
    <div className="page">
      <PageHeader
        title="Inventory"
        subtitle="Track stock levels across all warehouse and storage locations"
        action={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Icon name="plus" /> Add Item
          </button>
        }
      />

      {error && <div className="error-banner">{error}</div>}

      <div className="table-card">
        <div className="table-toolbar">
          <span className="toolbar-label">All Inventory Items</span>
          <span className="record-count">{items.length} item{items.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? <div className="loading-state"><div className="spinner" />Loading inventory...</div> : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Item Name</th><th>Quantity</th><th>Storage</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={5} className="empty-cell">No inventory items yet.</td></tr>
              ) : items.map(item => {
                const st = getStatus(item.quantity);
                return (
                  <tr key={item.inventoryid} className="table-row">
                    <td><span className="id-badge">#{item.inventoryid}</span></td>
                    <td className="name-cell">{item.itemname}</td>
                    <td>
                      <div className="qty-cell">
                        <div className="qty-bar-wrap">
                          <div className="qty-bar" style={{
                            width: `${Math.min(item.quantity, 100)}%`,
                            background: st.cls === 'status-green' ? '#0db37e' : st.cls === 'status-amber' ? '#f5a623' : '#e53e3e'
                          }} />
                        </div>
                        <span className="qty-num">{item.quantity} units</span>
                      </div>
                    </td>
                    <td className="muted">Storage #{item.storageid}</td>
                    <td><span className={`status-badge ${st.cls}`}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title="Add Inventory Item" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="modal-form">
            <div className="form-group">
              <label>Item Name</label>
              <input required placeholder="e.g. Steel Rods" value={form.itemname}
                onChange={e => setForm({ ...form, itemname: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" required placeholder="e.g. 100" value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Storage ID</label>
                <input type="number" required placeholder="e.g. 1" value={form.storageid}
                  onChange={e => setForm({ ...form, storageid: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add Item</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── ORDERS PAGE ───────────────────────────────────────────────────
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // ✅ FIX: form fields match backend schema (suppliersid, orderdate, totalprice)
  const [form, setForm] = useState({ suppliersid: "", orderdate: "", totalprice: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/orders`);
      if (!res.ok) throw new Error("Bad response");
      setOrders(await res.json());
    } catch { setError("Cannot connect to backend."); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ FIX: send suppliersid, orderdate, totalprice — matches backend OrderCreate schema
        body: JSON.stringify({
          suppliersid: parseInt(form.suppliersid),
          orderdate: form.orderdate,
          totalprice: parseFloat(form.totalprice),
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setForm({ suppliersid: "", orderdate: "", totalprice: "" });
        fetchOrders();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to add order.");
      }
    } catch { setError("Failed to add order."); }
  };

  // ✅ FIX: use totalprice (backend field name)
  const totalSpend = orders.reduce((s, o) => s + (o.totalprice || 0), 0);

  return (
    <div className="page">
      <PageHeader
        title="Orders"
        subtitle="Purchase orders and procurement history"
        action={
          <div className="header-actions">
            <div className="spend-badge">Total Spend: ₹{totalSpend.toLocaleString()}</div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Icon name="plus" /> New Order
            </button>
          </div>
        }
      />

      {error && <div className="error-banner">{error}</div>}

      <div className="table-card">
        <div className="table-toolbar">
          <span className="toolbar-label">All Purchase Orders</span>
          <span className="record-count">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? <div className="loading-state"><div className="spinner" />Loading orders...</div> : (
          <table className="data-table">
            <thead>
              {/* ✅ FIX: columns match backend Order model */}
              <tr>
                <th>Order ID</th><th>Supplier</th><th>Order Date</th><th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={4} className="empty-cell">No orders placed yet.</td></tr>
              ) : orders.map(o => (
                <tr key={o.orderid} className="table-row">
                  <td><span className="id-badge">#{o.orderid}</span></td>
                  {/* ✅ FIX: suppliersid (not supplierid) */}
                  <td className="name-cell">Supplier #{o.suppliersid}</td>
                  <td className="muted">{o.orderdate}</td>
                  {/* ✅ FIX: totalprice (not totalcost) */}
                  <td><span className="cost-cell">₹{o.totalprice?.toLocaleString()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title="Place New Order" onClose={() => setShowModal(false)}>
          <form onSubmit={handleAdd} className="modal-form">
            <div className="form-group">
              <label>Supplier ID</label>
              <input type="number" required placeholder="e.g. 1" value={form.suppliersid}
                onChange={e => setForm({ ...form, suppliersid: e.target.value })} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Order Date</label>
                {/* ✅ FIX: date input instead of rawmaterialid/quantity */}
                <input type="date" required value={form.orderdate}
                  onChange={e => setForm({ ...form, orderdate: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Total Price (₹)</label>
                <input type="number" required placeholder="e.g. 15000" value={form.totalprice}
                  onChange={e => setForm({ ...form, totalprice: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Place Order</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

// ── REPORTS PAGE ──────────────────────────────────────────────────
function ReportsPage() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API}/reports/supplier-spending`);
        if (!res.ok) throw new Error("Bad response");
        setReport(await res.json());
      } catch { setError("Cannot connect to backend."); }
      finally { setLoading(false); }
    };
    fetchReport();
  }, []);

  // ✅ FIX: backend returns "totalspent" (not "total_spent") and "name" (not "supplier_name")
  const total = report.reduce((s, r) => s + (r.totalspent || 0), 0);
  const max = Math.max(...report.map(r => r.totalspent || 0), 1);

  return (
    <div className="page">
      <PageHeader
        title="Reports"
        subtitle="Supplier spending analytics and procurement insights"
        action={<div className="spend-badge">Grand Total: ₹{total.toLocaleString()}</div>}
      />

      {error && <div className="error-banner">{error}</div>}

      {loading ? <div className="loading-state"><div className="spinner" />Loading report...</div> : (
        <div className="reports-grid">
          {report.length === 0 ? (
            <div className="empty-reports">No report data yet. Add orders first.</div>
          ) : report.map((r, i) => {
            const pct = ((r.totalspent || 0) / max) * 100;
            return (
              <div key={i} className="report-card">
                <div className="report-card-header">
                  <div>
                    {/* ✅ FIX: backend returns "name" not "supplier_name" */}
                    <div className="report-supplier">{r.name || `Supplier #${r.supplierid}`}</div>
                    <div className="report-orders">Supplier #{r.supplierid}</div>
                  </div>
                  {/* ✅ FIX: backend returns "totalspent" not "total_spent" */}
                  <div className="report-amount">₹{(r.totalspent || 0).toLocaleString()}</div>
                </div>
                <div className="report-bar-track">
                  <div className="report-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="report-pct">{pct.toFixed(1)}% of total spend</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "suppliers", label: "Suppliers", icon: "suppliers" },
    { id: "inventory", label: "Inventory", icon: "inventory" },
    { id: "orders", label: "Orders", icon: "orders" },
    { id: "reports", label: "Reports", icon: "reports" },
  ];

  const pages = {
    dashboard: <Dashboard setPage={setPage} />,
    suppliers: <SuppliersPage />,
    inventory: <InventoryPage />,
    orders: <OrdersPage />,
    reports: <ReportsPage />,
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-mark">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-name">InvenTrack</span>
            <span className="logo-sub">Management System</span>
          </div>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {nav.map(n => (
            <button
              key={n.id}
              className={`nav-item ${page === n.id ? 'active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon"><Icon name={n.icon} /></span>
              <span className="nav-label">{n.label}</span>
              {page === n.id && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">TE</div>
          <div className="user-info">
            <div className="user-name">Tarun Eswar</div>
            <div className="user-role">Software Engineer</div>
          </div>
          <div className="user-status" />
        </div>
      </aside>

      <div className="content-area">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-page">{nav.find(n => n.id === page)?.label}</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-dot" />
            <span className="topbar-status">All systems operational</span>
          </div>
        </header>
        <main className="main-content">
          {pages[page] || pages.dashboard}
        </main>
      </div>
    </div>
  );
}