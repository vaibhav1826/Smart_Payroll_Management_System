import React, { useState, useEffect, useCallback } from 'react'
import Logo from '../components/Logo'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  department: '',
  designation: '',
  salary: '',
  joiningDate: '',
  status: 'active',
}

export default function Dashboard({ setPage, user }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formError, setFormError] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      if (statusFilter) params.set('status', statusFilter)
      const resp = await fetch(`/api/employees?${params.toString()}`, { credentials: 'include' })
      const data = await resp.json()
      if (data.ok) setEmployees(data.employees)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setFormError(null)
  }

  const openAddForm = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setShowForm(true)
  }

  const openEditForm = (emp) => {
    setEditingId(emp._id)
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || '',
      designation: emp.designation || '',
      salary: emp.salary || '',
      joiningDate: emp.joiningDate ? emp.joiningDate.split('T')[0] : '',
      status: emp.status || 'active',
    })
    setFormError(null)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setFormError('Name and email are required.')
      return
    }
    setFormLoading(true)
    setFormError(null)
    try {
      const url = editingId ? `/api/employees/${editingId}` : '/api/employees'
      const method = editingId ? 'PUT' : 'POST'
      const body = {
        ...form,
        salary: form.salary ? Number(form.salary) : 0,
      }
      const resp = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await resp.json()
      if (data.ok) {
        closeForm()
        fetchEmployees()
      } else {
        setFormError(data.message || 'Something went wrong.')
      }
    } catch {
      setFormError('Unable to reach server.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      const resp = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await resp.json()
      if (data.ok) {
        setDeleteConfirm(null)
        fetchEmployees()
      }
    } catch {
      /* silent */
    }
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatSalary = (s) => {
    if (!s && s !== 0) return '—'
    return `₹${Number(s).toLocaleString('en-IN')}`
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <Logo width={48} height={48} />
        <div className="dashboard-header-text">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-welcome">
            Welcome back{user?.name ? `, ${user.name}` : user?.email ? ` (${user.email})` : ''}.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <section className="dashboard-toolbar">
        <div className="dashboard-toolbar-left">
          <input
            className="dashboard-search"
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="dashboard-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="button" className="dashboard-add-btn" onClick={openAddForm}>
          + Add Employee
        </button>
      </section>

      {/* Employee Table */}
      <section className="dashboard-table-wrap">
        {loading ? (
          <div className="dashboard-loading">
            <div className="dashboard-spinner" />
            <p>Loading employees…</p>
          </div>
        ) : employees.length === 0 ? (
          <div className="dashboard-empty">
            <p>No employees found.</p>
            <button type="button" className="dashboard-add-btn" onClick={openAddForm}>
              + Add your first employee
            </button>
          </div>
        ) : (
          <div className="dashboard-table-scroll">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Salary</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, i) => (
                  <tr key={emp._id} className={emp.status === 'inactive' ? 'row-inactive' : ''}>
                    <td>{i + 1}</td>
                    <td className="td-name">{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.phone || '—'}</td>
                    <td>{emp.department || '—'}</td>
                    <td>{emp.designation || '—'}</td>
                    <td className="td-salary">{formatSalary(emp.salary)}</td>
                    <td>{formatDate(emp.joiningDate)}</td>
                    <td>
                      <span className={`status-badge status-${emp.status}`}>{emp.status}</span>
                    </td>
                    <td className="td-actions">
                      <button
                        type="button"
                        className="action-btn action-edit"
                        title="Edit"
                        onClick={() => openEditForm(emp)}
                      >
                        ✏️
                      </button>
                      {deleteConfirm === emp._id ? (
                        <>
                          <button
                            type="button"
                            className="action-btn action-confirm"
                            title="Confirm delete"
                            onClick={() => handleDelete(emp._id)}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            className="action-btn action-cancel"
                            title="Cancel"
                            onClick={() => setDeleteConfirm(null)}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="action-btn action-delete"
                          title="Delete"
                          onClick={() => setDeleteConfirm(emp._id)}
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="dashboard-count">
          Total: <strong>{employees.length}</strong> employee{employees.length !== 1 ? 's' : ''}
        </div>
      </section>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="dashboard-modal-overlay" onClick={closeForm}>
          <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dashboard-modal-header">
              <h2>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button type="button" className="dashboard-modal-close" onClick={closeForm}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="dashboard-form">
              {formError && (
                <p className="dashboard-form-error" role="alert">
                  {formError}
                </p>
              )}
              <div className="dashboard-form-grid">
                <div className="dashboard-form-group">
                  <label htmlFor="emp-name">Name *</label>
                  <input
                    id="emp-name"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-email">Email *</label>
                  <input
                    id="emp-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="work@email.com"
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-phone">Phone</label>
                  <input
                    id="emp-phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-department">Department</label>
                  <input
                    id="emp-department"
                    name="department"
                    value={form.department}
                    onChange={handleFormChange}
                    placeholder="e.g. Construction"
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-designation">Designation</label>
                  <input
                    id="emp-designation"
                    name="designation"
                    value={form.designation}
                    onChange={handleFormChange}
                    placeholder="e.g. Site Engineer"
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-salary">Monthly Salary (₹)</label>
                  <input
                    id="emp-salary"
                    name="salary"
                    type="number"
                    min="0"
                    value={form.salary}
                    onChange={handleFormChange}
                    placeholder="e.g. 25000"
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-joining">Joining Date</label>
                  <input
                    id="emp-joining"
                    name="joiningDate"
                    type="date"
                    value={form.joiningDate}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="emp-status">Status</label>
                  <select
                    id="emp-status"
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="dashboard-form-actions">
                <button type="button" className="dashboard-form-cancel" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="dashboard-form-submit" disabled={formLoading}>
                  {formLoading ? 'Saving…' : editingId ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
