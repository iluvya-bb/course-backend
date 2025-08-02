import React, { useEffect, useState, useMemo } from 'react';
import subscriptionService from '../services/subscriptionService';
import courseService from '../services/courseService';

const SubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      const data = await subscriptionService.getSubscriptions();
      setSubscriptions(data);
    };
    const fetchCourses = async () => {
      const data = await courseService.getCourses();
      setCourses(data);
    };
    fetchSubscriptions();
    fetchCourses();
  }, []);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions
      .filter(sub => courseFilter === 'all' || sub.course.id === parseInt(courseFilter))
      .filter(sub => 
        sub.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [subscriptions, searchTerm, courseFilter]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Subscriptions</h1>

      <div className="flex justify-between items-center mb-6">
        <input 
          type="text"
          placeholder="Search by user name or email..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="ml-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
        >
          <option value="all">All Courses</option>
          {courses.map(course => (
            <option key={course._id} value={course._id}>{course.title}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSubscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="py-4 px-6 whitespace-nowrap">{subscription.user.name} ({subscription.user.email})</td>
                <td className="py-4 px-6 whitespace-nowrap">{subscription.course.title}</td>
                <td className="py-4 px-6 whitespace-nowrap">{new Date(subscription.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionPage;
