import { useState, useEffect } from 'react';
import api from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [docForm, setDocForm] = useState({ doctorName: '', specialization: '', email: '' });
  const [patForm, setPatForm] = useState({ patientName: '', age: '', disease: '' });

  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [editingPatientId, setEditingPatientId] = useState(null);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [docRes, patRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/patients')
      ]);
      setDoctors(docRes.data);
      setPatients(patRes.data);
    } catch (error) {
      handleLogout();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', authForm);
      const jwt = res.data.token;
      localStorage.setItem('jwt', jwt);
      setToken(jwt);
    } catch (error) {
      alert('Authentication failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
  };

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDoctorId) {
        await api.put(`/doctors/${editingDoctorId}`, docForm);
        setEditingDoctorId(null);
      } else {
        await api.post('/doctors', docForm);
      }
      setDocForm({ doctorName: '', specialization: '', email: '' });
      fetchData();
    } catch (error) {
      alert('Failed to save doctor.');
    }
  };

  const startEditDoctor = (doc) => {
    setEditingDoctorId(doc.id);
    setDocForm({ doctorName: doc.doctorName, specialization: doc.specialization, email: doc.email });
  };

  const cancelEditDoctor = () => {
    setEditingDoctorId(null);
    setDocForm({ doctorName: '', specialization: '', email: '' });
  };

  const handleDeleteDoctor = async (id) => {
    try {
      await api.delete(`/doctors/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete doctor.');
    }
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...patForm, age: parseInt(patForm.age) };
      if (editingPatientId) {
        await api.put(`/patients/${editingPatientId}`, payload);
        setEditingPatientId(null);
      } else {
        await api.post('/patients', payload);
      }
      setPatForm({ patientName: '', age: '', disease: '' });
      fetchData();
    } catch (error) {
      alert('Failed to save patient.');
    }
  };

  const startEditPatient = (pat) => {
    setEditingPatientId(pat.id);
    setPatForm({ patientName: pat.patientName, age: pat.age, disease: pat.disease });
  };

  const cancelEditPatient = () => {
    setEditingPatientId(null);
    setPatForm({ patientName: '', age: '', disease: '' });
  };

  const handleDeletePatient = async (id) => {
    try {
      await api.delete(`/patients/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete patient.');
    }
  };

  if (!token) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="card bg-panel login-card p-5">
          <div className="card-body p-0">
            <h3 className="text-center mb-5 header-title">System Access</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>USERNAME</label>
                <input type="text" className="form-control custom-input" required 
                  value={authForm.username} 
                  onChange={e => setAuthForm({...authForm, username: e.target.value})} />
              </div>
              <div className="mb-5">
                <label className="form-label text-muted fw-semibold" style={{ fontSize: '0.85rem' }}>PASSWORD</label>
                <input type="password" className="form-control custom-input" required 
                  value={authForm.password} 
                  onChange={e => setAuthForm({...authForm, password: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary-custom w-100">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 px-xl-5">
      <header className="d-flex justify-content-between align-items-center app-header">
        <h2 className="m-0 header-title">Medical Control Panel</h2>
        <button onClick={handleLogout} className="btn btn-outline-custom">Logout</button>
      </header>

      <div className="row g-5">
        <div className="col-xl-6">
          <div className="card bg-panel h-100">
            <div className="card-body p-5">
              <h4 className="mb-4 section-title">Doctor Directory</h4>
              <form onSubmit={handleDoctorSubmit} className="row g-3 mb-4">
                <div className="col-sm-3">
                  <input type="text" className="form-control custom-input" placeholder="Name" required 
                    value={docForm.doctorName} onChange={e => setDocForm({...docForm, doctorName: e.target.value})} />
                </div>
                <div className="col-sm-3">
                  <input type="text" className="form-control custom-input" placeholder="Specialization" required 
                    value={docForm.specialization} onChange={e => setDocForm({...docForm, specialization: e.target.value})} />
                </div>
                <div className="col-sm-3">
                  <input type="email" className="form-control custom-input" placeholder="Email" required 
                    value={docForm.email} onChange={e => setDocForm({...docForm, email: e.target.value})} />
                </div>
                <div className="col-sm-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary-custom flex-grow-1 px-0">
                    {editingDoctorId ? 'Update' : '+ Add'}
                  </button>
                  {editingDoctorId && (
                    <button type="button" onClick={cancelEditDoctor} className="btn action-btn btn-outline-secondary">X</button>
                  )}
                </div>
              </form>
              <div className="table-responsive">
                <table className="table table-hover table-custom">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Specialization</th><th>Email</th><th className="text-end">Actions</th></tr>
                  </thead>
                  <tbody>
                    {doctors.map(doc => (
                      <tr key={doc.id}>
                        <td className="fw-semibold text-muted">{doc.id}</td>
                        <td className="fw-medium">{doc.doctorName}</td>
                        <td>{doc.specialization}</td>
                        <td>{doc.email}</td>
                        <td className="text-end text-nowrap">
                          <button onClick={() => startEditDoctor(doc)} className="btn action-btn btn-outline-info me-2">Edit</button>
                          <button onClick={() => handleDeleteDoctor(doc.id)} className="btn action-btn btn-outline-danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-6">
          <div className="card bg-panel h-100">
            <div className="card-body p-5">
              <h4 className="mb-4 section-title">Patient Registry</h4>
              <form onSubmit={handlePatientSubmit} className="row g-3 mb-4">
                <div className="col-sm-3">
                  <input type="text" className="form-control custom-input" placeholder="Name" required 
                    value={patForm.patientName} onChange={e => setPatForm({...patForm, patientName: e.target.value})} />
                </div>
                <div className="col-sm-2">
                  <input type="number" className="form-control custom-input" placeholder="Age" required 
                    value={patForm.age} onChange={e => setPatForm({...patForm, age: e.target.value})} />
                </div>
                <div className="col-sm-4">
                  <input type="text" className="form-control custom-input" placeholder="Disease" required 
                    value={patForm.disease} onChange={e => setPatForm({...patForm, disease: e.target.value})} />
                </div>
                <div className="col-sm-3 d-flex gap-2">
                  <button type="submit" className="btn btn-primary-custom flex-grow-1 px-0">
                    {editingPatientId ? 'Update' : '+ Add'}
                  </button>
                  {editingPatientId && (
                    <button type="button" onClick={cancelEditPatient} className="btn action-btn btn-outline-secondary">X</button>
                  )}
                </div>
              </form>
              <div className="table-responsive">
                <table className="table table-hover table-custom">
                  <thead>
                    <tr><th>ID</th><th>Name</th><th>Age</th><th>Disease</th><th className="text-end">Actions</th></tr>
                  </thead>
                  <tbody>
                    {patients.map(pat => (
                      <tr key={pat.id}>
                        <td className="fw-semibold text-muted">{pat.id}</td>
                        <td className="fw-medium">{pat.patientName}</td>
                        <td>{pat.age} Yrs</td>
                        <td>{pat.disease}</td>
                        <td className="text-end text-nowrap">
                          <button onClick={() => startEditPatient(pat)} className="btn action-btn btn-outline-info me-2">Edit</button>
                          <button onClick={() => handleDeletePatient(pat.id)} className="btn action-btn btn-outline-danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;