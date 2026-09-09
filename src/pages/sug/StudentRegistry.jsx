// src/pages/sug/StudentRegistry.jsx
import React, { useState, useEffect } from "react";
import sugService from "../../services/sugService";
import Alert from "../../components/common/Alert";
import Loader from "../../components/common/Loader";
import Modal from "../../components/common/Modal";
import StatCard from "../../components/cards/StatCard";

const StudentRegistry = () => {
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    registeredUsers: 0,
    registrationRate: "0%",
    byStatus: { active: 0, graduated: 0, suspended: 0 },
  });
  const [pagination, setPagination] = useState({ total: 0, pages: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    faculty: "",
    department: "",
    level: "",
    status: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const params = { page: currentPage, limit: 20, ...filters };
      const response = await sugService.getStudentRegistry(params);

      /**
       * response (because of api interceptor) is the JSON body already.
       * Backend might return either:
       *  A) { success, data: [students], pagination }
       *  B) { success, data: { students, pagination } }
       */
      const body = response || {};
      const data = body.data ?? body;

      const list =
        Array.isArray(data) ? data : data.students || data.records || [];

      const pageInfo =
        body.pagination || data.pagination || { total: 0, pages: 0, limit: 20 };

      setStudents(list);
      setPagination(pageInfo);
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to load students",
      });
      setStudents([]);
      setPagination({ total: 0, pages: 0, limit: 20 });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await sugService.getRegistryStats();
      const body = response || {};
      const stats = body.data ?? body;

      // Support multiple backend shapes
      const totalStudents = stats.totalStudents ?? stats.total ?? 0;
      const registeredUsers = stats.registeredUsers ?? 0;
      const registrationRate = stats.registrationRate ?? "0%";

      // byStatus could be object or array of {_id, count}
      let byStatus = stats.byStatus;
      if (Array.isArray(byStatus)) {
        byStatus = byStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {});
      }
      if (!byStatus) byStatus = { active: 0, graduated: 0, suspended: 0 };

      setStatistics({
        totalStudents,
        registeredUsers,
        registrationRate,
        byStatus,
      });
    } catch (error) {
      // optional: show alert
      // setAlert({ type: "error", message: error.message || "Failed to load statistics" });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await sugService.bulkUploadStudents(file);
      const body = response || {};
      const result = body.data ?? body;

      // If backend returns upserted/modified
      const created = result.upserted ?? result.upsertedCount ?? result.created ?? 0;
      const updated = result.modified ?? result.modifiedCount ?? result.updated ?? 0;
      const matched = result.matched ?? result.matchedCount ?? 0;

      setAlert({
        type: "success",
        message: `Upload successful. Created: ${created}, Updated: ${updated}, Matched: ${matched}`,
      });

      await fetchStudents();
      await fetchStatistics();
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Upload failed",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await sugService.downloadRegistryTemplate(); // AxiosResponse (blob)
      const blob = response.data;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "student_registry_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Template download failed" });
    }
  };

  const exportRegistry = async () => {
    try {
      const response = await sugService.exportRegistry(filters); // AxiosResponse (blob)
      const blob = response.data;

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `student_registry_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setAlert({ type: "success", message: "Registry exported successfully" });
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Export failed" });
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      await sugService.addStudentToRegistry({
        matricNumber: formData.get("matricNumber"),
        fullname: formData.get("fullname"),
        department: formData.get("department"),
        faculty: formData.get("faculty"),
        level: formData.get("level"),
        sessionYear: formData.get("sessionYear"),
      });

      setAlert({ type: "success", message: "Student added successfully" });
      setShowAddForm(false);
      await fetchStudents();
      await fetchStatistics();
      e.target.reset();
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Failed to add student" });
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const id = selectedStudent?._id || selectedStudent?.id;

      await sugService.updateStudentRecord(id, {
        fullname: formData.get("fullname"),
        department: formData.get("department"),
        faculty: formData.get("faculty"),
        level: formData.get("level"),
        sessionYear: formData.get("sessionYear"),
        status: formData.get("status"),
      });

      setAlert({ type: "success", message: "Student updated successfully" });
      setShowEditModal(false);
      setSelectedStudent(null);
      await fetchStudents();
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Update failed" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student from the registry?")) return;

    try {
      await sugService.deleteStudentRecord(id);
      setAlert({ type: "success", message: "Student deleted" });
      await fetchStudents();
      await fetchStatistics();
    } catch (error) {
      setAlert({ type: "error", message: error.message || "Delete failed" });
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
            Download Template
          </button>
          <button
            onClick={exportRegistry}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
          >
            Export Registry
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
        <StatCard title="Total Students" value={statistics.totalStudents || 0} color="indigo" />
        <StatCard title="Registered Users" value={statistics.registeredUsers || 0} color="green" />
        <StatCard title="Registration Rate" value={statistics.registrationRate || "0%"} color="blue" />
        <StatCard title="Active Students" value={statistics.byStatus?.active || 0} color="purple" />
      </div>

      {/* Bulk Upload */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Bulk Upload Students</h3>
        <label className="flex-1">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition">
            {uploading ? "Uploading and processing..." : "Click to upload Excel/CSV file"}
          </div>
        </label>
      </div>

      {/* Add Student Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Add Single Student</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-500 hover:text-gray-700">
              ✕
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
                {[100,200,300,400,500,600].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Year</label>
              <input
                name="sessionYear"
                defaultValue={`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
                className="w-full px-3 py-2 border rounded-md"
              />
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
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Faculty"
            value={filters.faculty}
            onChange={(e) => handleFilterChange("faculty", e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="text"
            placeholder="Department"
            value={filters.department}
            onChange={(e) => handleFilterChange("department", e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange("level", e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All Levels</option>
            {[100,200,300,400,500,600].map(l => <option key={l} value={l}>{l} Level</option>)}
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
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
                  <tr key={student._id || student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium">{student.matricNumber}</td>
                    <td className="px-6 py-4 text-sm">{student.fullname || student.fullName}</td>
                    <td className="px-6 py-4 text-sm">{student.department}</td>
                    <td className="px-6 py-4 text-sm">{student.faculty}</td>
                    <td className="px-6 py-4 text-sm">{student.level}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          student.status === "active"
                            ? "bg-green-100 text-green-800"
                            : student.status === "graduated"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
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
                        onClick={() => handleDelete(student._id || student.id)}
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
              Showing {((currentPage - 1) * (pagination.limit || 20)) + 1} to{" "}
              {Math.min(currentPage * (pagination.limit || 20), pagination.total || 0)} of{" "}
              {pagination.total || 0} students
            </p>

            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-1">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
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
        <Modal
          title="Edit Student Record"
          onClose={() => {
            setShowEditModal(false);
            setSelectedStudent(null);
          }}
        >
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
              <input
                name="fullname"
                defaultValue={selectedStudent.fullname || selectedStudent.fullName}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input
                name="department"
                defaultValue={selectedStudent.department}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty *</label>
              <input
                name="faculty"
                defaultValue={selectedStudent.faculty}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
              <select
                name="level"
                defaultValue={selectedStudent.level}
                required
                className="w-full px-3 py-2 border rounded-md"
              >
                {[100,200,300,400,500,600].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Year</label>
              <input
                name="sessionYear"
                defaultValue={selectedStudent.sessionYear}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                defaultValue={selectedStudent.status}
                className="w-full px-3 py-2 border rounded-md"
              >
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