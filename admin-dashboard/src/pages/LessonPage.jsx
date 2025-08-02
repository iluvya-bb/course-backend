import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { PlusCircle, Edit, Trash2, BookOpen } from 'lucide-react';
import lessonService from '../services/lessonService';

const LessonPage = () => {
  const { courseId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({ title: '', wysiwygContent: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLessons = async () => {
      const data = await lessonService.getLessons(courseId);
      setLessons(data);
    };
    fetchLessons();
  }, [courseId]);

  const filteredLessons = useMemo(() => {
    return lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [lessons, searchTerm]);

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    const newLessonData = await lessonService.createLesson(courseId, newLesson);
    setLessons([...lessons, newLessonData]);
    setShowForm(false);
    setNewLesson({ title: '', wysiwygContent: '' });
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    const updatedLessonData = await lessonService.updateLesson(editingLesson._id, editingLesson);
    setLessons(lessons.map(lesson => lesson._id === editingLesson._id ? updatedLessonData : lesson));
    setEditingLesson(null);
  };

  const handleDeleteLesson = async (id) => {
    await lessonService.deleteLesson(id);
    setLessons(lessons.filter((lesson) => lesson._id !== id));
  };

  const handleEditClick = (lesson) => {
    setEditingLesson({ ...lesson });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingLesson(null);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Lessons</h1>
        <button onClick={() => { setShowForm(true); setEditingLesson(null); }} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Create Lesson
        </button>
      </div>

      {(showForm || editingLesson) && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-primary">{editingLesson ? 'Edit Lesson' : 'Create Lesson'}</h2>
          <form onSubmit={editingLesson ? handleUpdateLesson : handleCreateLesson}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={editingLesson ? editingLesson.title : newLesson.title}
                onChange={(e) => editingLesson ? setEditingLesson({ ...editingLesson, title: e.target.value }) : setNewLesson({ ...newLesson, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Content</label>
              <SunEditor 
                setContents={editingLesson ? editingLesson.wysiwygContent : newLesson.wysiwygContent}
                onChange={(content) => editingLesson ? setEditingLesson({ ...editingLesson, wysiwygContent: content }) : setNewLesson({ ...newLesson, wysiwygContent: content })}
              />
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
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLessons.map((lesson) => (
              <tr key={lesson._id}>
                <td className="py-4 px-6 whitespace-nowrap">{lesson.title}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleEditClick(lesson)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={20} /></button>
                  <button onClick={() => handleDeleteLesson(lesson._id)} className="text-red-600 hover:text-red-900 mr-4"><Trash2 size={20} /></button>
                  <Link to={`/lessons/${lesson._id}/exercises`} className="text-green-600 hover:text-green-900"><BookOpen size={20} /></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonPage;
