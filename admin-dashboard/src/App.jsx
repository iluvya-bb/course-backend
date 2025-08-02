import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./components/MainLayout";
import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import ParameterPage from "./pages/ParameterPage";
import ExercisePage from "./pages/ExercisePage";
import SubscriptionPage from "./pages/SubscriptionPage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<PrivateRoute />}>
					<Route path="/" element={<MainLayout />}>
						<Route path="/dashboard" element={<DashboardPage />} />
						<Route path="/courses" element={<CoursePage />} />
						<Route path="/courses/:courseId/lessons" element={<LessonPage />} />
						<Route
							path="/lessons/:lessonId/exercises"
							element={<ExercisePage />}
						/>
						<Route path="/parameters" element={<ParameterPage />} />
						<Route path="/subscriptions" element={<SubscriptionPage />} />
					</Route>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
