import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Film } from 'lucide-react';
import courseService from '../services/courseService';

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ title: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await courseService.getCourses();
      setCourses(data);
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const newCourseData = await courseService.createCourse(newCourse);
    setCourses([...courses, newCourseData]);
    setShowForm(false);
    setNewCourse({ title: '', description: '' });
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const updatedCourseData = await courseService.updateCourse(editingCourse._id, editingCourse);
    setCourses(courses.map(course => course._id === editingCourse._id ? updatedCourseData : course));
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (id) => {
    await courseService.deleteCourse(id);
    setCourses(courses.filter((course) => course._id !== id));
  };

  const handleEditClick = (course) => {
    setEditingCourse({ ...course });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCourse(null);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Courses</h1>
        <button onClick={() => { setShowForm(true); setEditingCourse(null); }} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Create Course
        </button>
      </div>

      {(showForm || editingCourse) && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-primary">{editingCourse ? 'Edit Course' : 'Create Course'}</h2>
          <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editingCourse ? editingCourse.title : newCourse.title}
                onChange={(e) => editingCourse ? setEditingCourse({ ...editingCourse, title: e.target.value }) : setNewCourse({ ...newCourse, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={editingCourse ? editingCourse.description : newCourse.description}
                onChange={(e) => editingCourse ? setEditingCourse({ ...editingCourse, description: e.target.value }) : setNewCourse({ ...newCourse, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={closeForm} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mr-2 hover:bg-gray-400 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-colors">Save</button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <input 
          type="text"
          placeholder="Search by title..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course._id}>
                <td className="py-4 px-6 whitespace-nowrap">{course.title}</td>
                <td className="py-4 px-6 whitespace-nowrap">{course.description}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleEditClick(course)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={20} /></button>
                  <button onClick={() => handleDeleteCourse(course._id)} className="text-red-600 hover:text-red-900 mr-4"><Trash2 size={20} /></button>
                  <Link to={`/courses/${course._id}/lessons`} className="text-green-600 hover:text-green-900"><Film size={20} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursePage;
