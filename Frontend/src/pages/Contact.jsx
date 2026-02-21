import React, { useState } from 'react'
import axios from 'axios'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const resp = await axios.post('http://localhost:4000/api/contact', form)
      if (resp.data && resp.data.ok) setStatus('Sent!')
      else setStatus('Error')
    } catch (err) {
      console.error(err)
      setStatus('Error')
    }
  }

  return (
    <section>
      <h2>Contact</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div>
          <label>Name</label>
          <br />
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email</label>
          <br />
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Message</label>
          <br />
          <textarea name="message" value={form.message} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Send</button>
        </div>
      </form>
      {status && <p>{status}</p>}
    </section>
  )
}
