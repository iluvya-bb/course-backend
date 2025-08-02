import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import exerciseService from '../services/exerciseService';

const ExercisePage = () => {
  const { lessonId } = useParams();
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [newExercise, setNewExercise] = useState({ question: '', answer: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await exerciseService.getExercises(lessonId);
      setExercises(data);
    };
    fetchExercises();
  }, [lessonId]);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => 
      exercise.question.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exercises, searchTerm]);

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    const newExerciseData = await exerciseService.createExercise(lessonId, newExercise);
    setExercises([...exercises, newExerciseData]);
    setShowForm(false);
    setNewExercise({ question: '', answer: '' });
  };

  const handleUpdateExercise = async (e) => {
    e.preventDefault();
    const updatedExerciseData = await exerciseService.updateExercise(editingExercise.id, editingExercise);
    setExercises(exercises.map(ex => ex.id === editingExercise.id ? updatedExerciseData : ex));
    setEditingExercise(null);
  };

  const handleDeleteExercise = async (id) => {
    await exerciseService.deleteExercise(id);
    setExercises(exercises.filter((ex) => ex.id !== id));
  };

  const handleEditClick = (exercise) => {
    setEditingExercise({ ...exercise });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExercise(null);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Exercises</h1>
        <button onClick={() => { setShowForm(true); setEditingExercise(null); }} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Create Exercise
        </button>
      </div>

      {(showForm || editingExercise) && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-primary">{editingExercise ? 'Edit Exercise' : 'Create Exercise'}</h2>
          <form onSubmit={editingExercise ? handleUpdateExercise : handleCreateExercise}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Question</label>
              <textarea
                value={editingExercise ? editingExercise.question : newExercise.question}
                onChange={(e) => editingExercise ? setEditingExercise({ ...editingExercise, question: e.target.value }) : setNewExercise({ ...newExercise, question: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Answer</label>
              <textarea
                value={editingExercise ? editingExercise.answer : newExercise.answer}
                onChange={(e) => editingExercise ? setEditingExercise({ ...editingExercise, answer: e.target.value }) : setNewExercise({ ...newExercise, answer: e.target.value })}
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
          placeholder="Search by question..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredExercises.map((exercise) => (
              <tr key={exercise.id}>
                <td className="py-4 px-6 whitespace-nowrap">{exercise.question}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleEditClick(exercise)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={20} /></button>
                  <button onClick={() => handleDeleteExercise(exercise.id)} className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExercisePage;
