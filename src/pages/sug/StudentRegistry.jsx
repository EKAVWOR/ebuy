// src/pages/sug/StudentRegistry.jsx

import React, { useState, useEffect } from 'react';
import sugService from '../../services/sugService';
import api from '../../services/api';
import Alert from '../../components/common/Alert';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import StatCard from '../../components/cards/StatCard';

const StudentRegistry = () => {
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    registeredUsers: 0,
    registrationRate: '0%',
    byStatus: { active: 0, graduated: 0, suspended: 0 }
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    faculty: '',
    department: '',
    level: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit: 20, ...filters };
      const response = await sugService.getStudentRegistry(params);

      console.log('📚 Students response:', response);

      // Safely extract data (handles multiple response shapes)
      const payload = response.data?.data || response.data || {};
      
      setStudents(payload.students || payload.records || []);
      setPagination(payload.pagination || { total: 0, pages: 0, limit: 20 });
      
      if (payload.statistics) {
        setStatistics(prev => ({ ...prev, ...payload.statistics }));
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || error.message || 'Failed to load students' 
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await sugService.getRegistryStats();
      console.log('📊 Statistics response:', response);

      // Safely extract stats (handles multiple response shapes)
      const stats = response.data?.data || response.data || {};
      
      setStatistics({
        totalStudents: stats.totalStudents || 0,
        registeredUsers: stats.registeredUsers || 0,
        registrationRate: stats.registrationRate || '0%',
        byStatus: stats.byStatus || { active: 0, graduated: 0, suspended: 0 }
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await sugService.bulkUploadStudents(file);
      const result = response.data?.data || response.data || {};
      const { imported = 0, duplicates = 0, failed = 0 } = result;
      
      setAlert({ 
        type: 'success', 
        message: `Uploaded successfully! Imported: ${imported}, Duplicates: ${duplicates}, Failed: ${failed}` 
      });
      fetchStudents();
      fetchStatistics();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Upload failed' 
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await api.get('/sug/student-registry/template', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_registry_template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setAlert({ type: 'error', message: 'Template download failed' });
    }
  };

  const exportRegistry = async () => {
    try {
      const response = await api.get('/sug/student-registry/export', {
        params: filters,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `student_registry_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setAlert({ type: 'success', message: 'Registry exported successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Export failed' });
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await sugService.addStudentToRegistry({
        matricNumber: formData.get('matricNumber'),
        fullname: formData.get('fullname'),
        department: formData.get('department'),
        faculty: formData.get('faculty'),
        level: formData.get('level'),
        sessionYear: formData.get('sessionYear')
      });

      setAlert({ type: 'success', message: 'Student added successfully' });
      setShowAddForm(false);
      fetchStudents();
      fetchStatistics();
      e.target.reset();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to add student' 
      });
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await sugService.updateStudentRecord(selectedStudent._id, {
        fullname: formData.get('fullname'),
        department: formData.get('department'),
        faculty: formData.get('faculty'),
        level: formData.get('level'),
        sessionYear: formData.get('sessionYear'),
        status: formData.get('status')
      });

      setAlert({ type: 'success', message: 'Student updated successfully' });
      setShowEditModal(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Update failed' 
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student from the registry?')) return;

    try {
      await sugService.deleteStudentRecord(id);
      setAlert({ type: 'success', message: 'Student deleted' });
      fetchStudents();
      fetchStatistics();
    } catch (error) {
      setAlert({ 
        type: 'error', 
        message: error.response?.data?.message || 'Delete failed' 
      });
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  if (loading && students.length === 0) return <Loader />;

  return (
    <div className="space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Student Registry Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={downloadTemplate}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
          >
            📥 Download Template
          </button>
          <button
            onClick={exportRegistry}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            📊 Export Registry
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={statistics?.totalStudents || 0}
          color="indigo"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          title="Registered Users"
          value={statistics?.registeredUsers || 0}
          color="green"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Registration Rate"
          value={statistics?.registrationRate || '0%'}
          color="blue"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
        />
        <StatCard
          title="Active Students"
          value={statistics?.byStatus?.active || 0}
          color="purple"
          icon={<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
      </div>

      {/* Bulk Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">📤 Bulk Upload Students</h3>
        <div className="flex items-center space-x-4">
          <label className="flex-1">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition">
              {uploading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-600 mr-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 font-medium">Uploading and processing...</p>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 font-medium">Click to upload Excel/CSV file</p>
                  <p className="text-xs text-gray-500 mt-1">Supported formats: .xlsx, .xls, .csv</p>
                  <p className="text-xs text-gray-500">Download template first if you don't have the correct format</p>
                </>
              )}
            </div>
          </label>
        </div>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Single Student</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form onSubmit={handleAddStudent} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number *</label>
              <input name="matricNumber" required className="w-full px-3 py-2 border rounded-md" placeholder="CS/2020/001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="fullname" required className="w-full px-3 py-2 border rounded-md" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input name="department" required className="w-full px-3 py-2 border rounded-md" placeholder="Computer Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
              <input name="faculty" required className="w-full px-3 py-2 border rounded-md" placeholder="Science" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
              <select name="level" required className="w-full px-3 py-2 border rounded-md">
                <option value="">Select Level</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Year</label>
              <input name="sessionYear" defaultValue={`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="col-span-2 flex space-x-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                Add Student
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 bg-gray-200 rounded hover:bg-gray-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Search matric or name..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Faculty"
            value={filters.faculty}
            onChange={(e) => handleFilterChange('faculty', e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Levels</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
            <option value="500">500 Level</option>
            <option value="600">600 Level</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matric Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Faculty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No students found. Upload student records to get started.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{student.matricNumber}</td>
                    <td className="px-6 py-4 text-sm">{student.fullname}</td>
                    <td className="px-6 py-4 text-sm">{student.department}</td>
                    <td className="px-6 py-4 text-sm">{student.faculty}</td>
                    <td className="px-6 py-4 text-sm">{student.level}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        student.status === 'active' ? 'bg-green-100 text-green-800' :
                        student.status === 'graduated' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowEditModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * (pagination.limit || 20)) + 1} to {Math.min(currentPage * (pagination.limit || 20), pagination.total || 0)} of {pagination.total || 0} students
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-1">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedStudent && (
        <Modal title="Edit Student Record" onClose={() => { setShowEditModal(false); setSelectedStudent(null); }}>
          <form onSubmit={handleUpdateStudent} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matric Number</label>
              <input 
                defaultValue={selectedStudent.matricNumber} 
                disabled 
                className="w-full px-3 py-2 border rounded-md bg-gray-100" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input name="fullname" defaultValue={selectedStudent.fullname} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input name="department" defaultValue={selectedStudent.department} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
              <input name="faculty" defaultValue={selectedStudent.faculty} required className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
              <select name="level" defaultValue={selectedStudent.level} required className="w-full px-3 py-2 border rounded-md">
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
                <option value="400">400</option>
                <option value="500">500</option>
                <option value="600">600</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Year</label>
              <input name="sessionYear" defaultValue={selectedStudent.sessionYear} className="w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={selectedStudent.status} className="w-full px-3 py-2 border rounded-md">
                <option value="active">Active</option>
                <option value="graduated">Graduated</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
              Update Student
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentRegistry;