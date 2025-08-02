import React, { useEffect, useState, useMemo } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import parameterService from '../services/parameterService';

const ParameterPage = () => {
  const [parameters, setParameters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingParameter, setEditingParameter] = useState(null);
  const [newParameter, setNewParameter] = useState({ key: '', value: '', tag: '', privacy: 'all' });
  const [searchTerm, setSearchTerm] = useState('');
  const [privacyFilter, setPrivacyFilter] = useState('all');

  useEffect(() => {
    const fetchParameters = async () => {
      const data = await parameterService.getParameters();
      setParameters(data);
    };
    fetchParameters();
  }, []);

  const filteredParameters = useMemo(() => {
    return parameters
      .filter(p => privacyFilter === 'all' || p.privacy === privacyFilter)
      .filter(p => p.key.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [parameters, searchTerm, privacyFilter]);

  const handleCreateParameter = async (e) => {
    e.preventDefault();
    const newParameterData = await parameterService.createParameter(newParameter);
    setParameters([...parameters, newParameterData]);
    setShowForm(false);
    setNewParameter({ key: '', value: '', tag: '', privacy: 'all' });
  };

  const handleUpdateParameter = async (e) => {
    e.preventDefault();
    const updatedParameterData = await parameterService.updateParameter(editingParameter.key, editingParameter);
    setParameters(parameters.map(p => p.key === editingParameter.key ? updatedParameterData : p));
    setEditingParameter(null);
  };

  const handleDeleteParameter = async (key) => {
    await parameterService.deleteParameter(key);
    setParameters(parameters.filter((p) => p.key !== key));
  };

  const handleEditClick = (parameter) => {
    setEditingParameter({ ...parameter });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingParameter(null);
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Parameters</h1>
        <button onClick={() => { setShowForm(true); setEditingParameter(null); }} className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary transition-colors">
          <PlusCircle size={20} className="mr-2" />
          Create Parameter
        </button>
      </div>

      {(showForm || editingParameter) && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-primary">{editingParameter ? 'Edit Parameter' : 'Create Parameter'}</h2>
          <form onSubmit={editingParameter ? handleUpdateParameter : handleCreateParameter}>
            {/* Form fields */}
          </form>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <input 
          type="text"
          placeholder="Search by key..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="ml-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={privacyFilter}
          onChange={(e) => setPrivacyFilter(e.target.value)}
        >
          <option value="all">All Privacy</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Privacy</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredParameters.map((parameter) => (
              <tr key={parameter.key}>
                <td className="py-4 px-6 whitespace-nowrap">{parameter.key}</td>
                <td className="py-4 px-6 whitespace-nowrap">{parameter.value}</td>
                <td className="py-4 px-6 whitespace-nowrap">{parameter.tag}</td>
                <td className="py-4 px-6 whitespace-nowrap">{parameter.privacy}</td>
                <td className="py-4 px-6 whitespace-nowrap">
                  <button onClick={() => handleEditClick(parameter)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={20} /></button>
                  <button onClick={() => handleDeleteParameter(parameter.key)} className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParameterPage;
