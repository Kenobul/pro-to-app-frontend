"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState, FormEvent, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProtectedRoute from "../components/ProtectedRoutes"; // Assuming this component exists and works
import { BACKEND_URL } from "@/constants/constant";
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
      clipRule="evenodd"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
      clipRule="evenodd"
    />
  </svg>
);

// Added Edit Icon
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

interface User {
  name: string;
  email: string;
  picture: string;
}

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string; // from PostgreSQL
}

export default function Dashboard() {
  const router = useRouter();
  const params = useSearchParams();
  const queryToken = params.get("token");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]); // This will store ALL todos
  const [loading, setLoading] = useState(true); // Initial data loading
  const [logoutLoading, setLogoutLoading] = useState(false); // New state for logout loading
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null); // State for tracking which todo is being edited
  const [editingTodoTitle, setEditingTodoTitle] = useState(""); // State for the title being edited

  // Filters
  const [filterType, setFilterType] = useState<
    "today" | "pending" | "completed" | "all"
  >("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(""); // YYYY-MM-DD
  const [filterTime, setFilterTime] = useState(""); // HH:MM

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const authToken = queryToken || savedToken;

    if (!authToken) {
      router.push("/"); // Redirect to landing if no token found
      return;
    }

    setToken(authToken);
    localStorage.setItem("token", authToken); // Save or update token

    const fetchDashboardData = async () => {
      try {
        // Fetch user profile
        const userRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!userRes.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await userRes.json();
        setUser(userData);

        // Fetch todos
        const todosRes = await fetch(`${BACKEND_URL}/api/todos`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!todosRes.ok) {
          throw new Error("Failed to fetch todos");
        }
        const todosData = await todosRes.json();
        setTodos(todosData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        localStorage.removeItem("token"); // Clear invalid token
        router.push("/"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [queryToken, router]);

  // Add new todo
  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newTodo }),
      });

      if (!res.ok) {
        throw new Error("Failed to add todo");
      }

      const data = await res.json();
      setTodos([data, ...todos]); // Add new todo to the beginning
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
      // Optionally show a user-friendly error message
    }
  };

  // Start Editing Todo
  const handleEditClick = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTodoTitle(todo.title);
  };

  // Save Edited Todo
  const handleSaveEdit = async (e: FormEvent, id: number) => {
    e.preventDefault();
    if (!editingTodoTitle.trim() || !token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
        method: "PUT", // Or PATCH, depending on your API
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editingTodoTitle }),
      });

      if (!res.ok) {
        throw new Error("Failed to update todo");
      }

      const updatedTodo = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updatedTodo : t)));
      setEditingTodoId(null); // Exit edit mode
      setEditingTodoTitle(""); // Clear editing state
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Mark complete
  const handleToggleComplete = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/todos/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to toggle todo status");
      }

      const updated = await res.json();
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/todos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Logout - Now with loading state and redirect to landing
  const handleLogout = () => {
    setLogoutLoading(true); // Start loading
    // Simulate API call or processing time
    setTimeout(() => {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setTodos([]);
      setLogoutLoading(false); // End loading
      router.push("/"); // Redirect to the landing page, where the OAuth flow starts
    }, 1000); // 1-second delay for demonstration
  };

  // Filtered Todos logic - central and improved with search and date/time
  const getFilteredTodos = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return todos.filter((todo) => {
      const todoDate = new Date(todo.created_at);
      todoDate.setHours(0, 0, 0, 0); // Normalize todo date for comparison

      const isToday = todoDate.toDateString() === today.toDateString();
      const isCompleted = todo.completed;

      // Filter by type
      let typeMatch = false;
      switch (filterType) {
        case "today":
          typeMatch = isToday && !isCompleted;
          break;
        case "pending":
          typeMatch = !isCompleted;
          break;
        case "completed":
          typeMatch = isCompleted;
          break;
        case "all":
        default:
          typeMatch = true;
          break;
      }

      // Filter by search term
      const searchTermMatch = todo.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter by specific date
      let dateMatch = true;
      if (filterDate) {
        const filterDateObj = new Date(filterDate);
        filterDateObj.setHours(0, 0, 0, 0);
        dateMatch = todoDate.toDateString() === filterDateObj.toDateString();
      }

      // Filter by specific time
      let timeMatch = true;
      if (filterTime) {
        const todoTime = new Date(todo.created_at).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        timeMatch = todoTime === filterTime;
      }

      return typeMatch && searchTermMatch && dateMatch && timeMatch;
    });
  }, [todos, filterType, searchTerm, filterDate, filterTime]);

  const currentFilteredTodos = getFilteredTodos;

  // Real-time counts for sidebar
  const totalTasksCount = todos.length;
  const pendingTasksCount = todos.filter((todo) => !todo.completed).length;
  const completedTasksCount = todos.filter((todo) => todo.completed).length;
  const todayTasksCount = todos.filter((todo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todoDate = new Date(todo.created_at);
    todoDate.setHours(0, 0, 0, 0);
    return todoDate.toDateString() === today.toDateString() && !todo.completed;
  }).length;

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white text-xl">Loading dashboard...</p>
      </div>
    );

  return (
    <ProtectedRoute>
  <div className="flex min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
    {/* Mobile Sidebar Toggle Button */}
    <button
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    {/* Sidebar */}
    <aside
      className={`fixed inset-y-0 left-0 w-64 bg-gray-800 p-6 flex flex-col items-center shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 z-40 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        className="lg:hidden absolute top-4 right-4 p-2 rounded-md text-gray-400 hover:text-white"
        onClick={() => setIsSidebarOpen(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {user && (
        <div className="flex flex-col items-center mb-8 mt-8 lg:mt-0">
          <img
            src={user.picture}
            alt="User Profile"
            className="w-24 h-24 rounded-full border-4 border-green-500 mb-4 object-cover"
          />
          <h1 className="text-xl font-semibold text-white mb-1">
            {user.name}
          </h1>
          <p className="text-sm text-gray-400 mb-4">{user.email}</p>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full px-5 cursor-pointer py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}

      <nav className="w-full">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {
                setFilterType("today");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center ${
                filterType === "today"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span>Today</span>
              <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {todayTasksCount}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setFilterType("pending");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center ${
                filterType === "pending"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span>Pending</span>
              <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {pendingTasksCount}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setFilterType("completed");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center ${
                filterType === "completed"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span>Completed</span>
              <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {completedTasksCount}
              </span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setFilterType("all");
                setIsSidebarOpen(false);
              }}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 flex justify-between items-center ${
                filterType === "all"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <span>All Tasks</span>
              <span className="bg-gray-700 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {totalTasksCount}
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    {/* Main Content */}
    <main className="flex-1 flex flex-col p-4 md:p-8 pt-16 lg:pt-8 overflow-auto">
      {/* Header */}
      <header className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Your Tasks
        </h2>
        <p className="text-gray-400 text-base md:text-lg">
          Stay organized and manage your daily tasks efficiently.
        </p>
      </header>

      {/* Add Todo Section */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-6 mb-8">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
          Add a New Task
        </h3>
        <form
          onSubmit={handleAddTodo}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="e.g., Buy groceries, Finish report..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 shadow-md text-base mt-2 sm:mt-0"
          >
            <PlusIcon /> Add Task
          </button>
        </form>
      </div>

      {/* Task List Section */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-4 md:p-6 flex-1">
        <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
          {filterType === "today" && "Today's Tasks"}
          {filterType === "pending" && "Pending Tasks"}
          {filterType === "completed" && "Completed Tasks"}
          {filterType === "all" && "All Tasks"}
        </h3>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
            title="Filter by Date"
          />
          <input
            type="time"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
            title="Filter by Time"
          />
        </div>

        {currentFilteredTodos.length === 0 ? (
          <p className="text-gray-500 text-center py-10 text-base md:text-lg">
            {searchTerm
              ? "No tasks found matching your search."
              : filterType === "today"
              ? "No tasks for today. Enjoy your day!"
              : filterType === "pending"
              ? "No pending tasks. You're all caught up!"
              : filterType === "completed"
              ? "No completed tasks yet. Get to work!"
              : "No tasks found. Time to add one!"}
          </p>
        ) : (
          <ul className="space-y-4">
            {currentFilteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-200 ${
                  todo.completed
                    ? "bg-gray-700 border border-gray-600 opacity-70"
                    : "bg-gray-700 border border-gray-600 hover:border-green-500"
                }`}
              >
                {editingTodoId === todo.id ? (
                  <form
                    onSubmit={(e) => handleSaveEdit(e, todo.id)}
                    className="flex flex-col sm:flex-row flex-1 gap-2 w-full"
                  >
                    <input
                      type="text"
                      value={editingTodoTitle}
                      onChange={(e) => setEditingTodoTitle(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-gray-600 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center gap-1"
                      >
                        <CheckIcon /> Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTodoId(null)}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {/* Task content */}
                    <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo.id)}
                        className="flex-shrink-0 form-checkbox h-5 w-5 text-green-500 rounded border-gray-500 focus:ring-green-500 transition-colors duration-200 cursor-pointer mt-1"
                      />
                      <div className="ml-3 flex-1 min-w-0">
                        <p
                          className={`font-medium text-base sm:text-lg ${
                            todo.completed
                              ? "line-through text-gray-500"
                              : "text-white"
                          } truncate`}
                        >
                          {todo.title}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1 whitespace-nowrap sm:whitespace-normal">
                          <CalendarIcon />
                          {new Date(todo.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}{" "}
                          at{" "}
                          {new Date(todo.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                      <button
                        onClick={() => handleEditClick(todo)}
                        className="w-full sm:w-auto flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center justify-center gap-2"
                      >
                        <EditIcon />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => handleToggleComplete(todo.id)}
                        className={`w-full sm:w-auto flex-1 sm:flex-none px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
                          todo.completed
                            ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {todo.completed ? (
                          <>
                            <span className="sm:hidden">↺</span>
                            <span className="hidden sm:inline">Undo</span>
                          </>
                        ) : (
                          <>
                            <CheckIcon />
                            <span className="hidden sm:inline">Done</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="w-full sm:w-auto flex-1 sm:flex-none px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm flex items-center justify-center gap-2"
                      >
                        <TrashIcon />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  </div>
</ProtectedRoute>

  );
}