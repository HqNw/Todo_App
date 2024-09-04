"use client";
import { useEffect, useState } from "react";

export default function Home() {
	const [todos, setTodos] = useState([]);
	const [selectedTodoId, setSelectedTodoId] = useState(null);
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [newTodoDescription, setNewTodoDescription] = useState("");
	const [isAddingTodo, setIsAddingTodo] = useState(false);

	useEffect(() => {
		fetchTodos();
	}, []);

	const fetchTodos = async () => {
		try {
			const response = await fetch("/api/todos");
			const data = await response.json();
			setTodos(data);
		} catch (error) {
			console.error("Failed to fetch todos:", error);
		}
	};

	const handleTodoSelect = (todo) => {
		setSelectedTodoId(todo.id);
		setIsAddingTodo(false);
	};

	const handleAddTodo = async () => {
		console.log("New ToDo: ", newTodoTitle, newTodoDescription);

		if (!newTodoTitle || !newTodoDescription) {
			console.error("Title or description is missing");
			return;
		}

		try {
			const response = await fetch("/api/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: newTodoTitle, description: newTodoDescription }),
			});
			if (response.ok) {
				fetchTodos();
				setNewTodoTitle("");
				setNewTodoDescription(""); 
				setIsAddingTodo(false); 
			}
		} catch (error) {
			console.error("Failed to add todo:", error);
		}
	};

	const handleDeleteCompletedTodos = async () => {
		try {
			const response = await fetch('/api/todos/delete-completed', {
				method: 'DELETE',
			});
			if (response.ok) {
				fetchTodos();
				setSelectedTodoId(null);
			} else {
				console.error("Failed to delete completed todos");
			}
		} catch (error) {
			console.error("Failed to delete completed todos:", error);
		}
	};

	const handleToggleCompleted = async (todo) => {
		try {
			const updatedCompleted = !todo.completed;
			const response = await fetch(`/api/todos/${todo.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ title: todo.title, description: todo.description, completed: updatedCompleted }),
			});
			if (response.ok) {
				fetchTodos();
			}
		} catch (error) {
			console.error("Failed to update todo:", error);
		}
	};

	const toggleAddTodoForm = () => {
		setIsAddingTodo(!isAddingTodo);
	};

	const selectedTodo = todos.find((todo) => todo.id === selectedTodoId);

	return (
		<div className="dark bg-gradient-to-br from-slate-900 to-black h-screen">
			<script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.js"></script>

			<button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden bg-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
				<span className="sr-only">Open sidebar</span>
				<svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
					<path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
				</svg>
			</button>

			<div className="flex">
				<aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
					<div className="h-full px-3 py-4 overflow-y-auto">
						<ul className="mt-4">
							{todos.map((todo) => (
								<li key={todo.id} className="items-center mb-2">
									<div className="flex grid-cols-2 border-gray-200 rounded dark:border-gray-700">

										<div className="col-span-1 py-2 px-0">
											<span className="inline-flex items-center justify-center w-6 h-6 me-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
												onClick={() => handleToggleCompleted(todo)}
											>
												<svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
													<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={todo.completed ? "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" : "M1 5.917 5.724 10.5 15 1.5"} />
												</svg>
												<span className="sr-only">Icon description</span>
											</span>
										</div>

										<button
											type="button"
											onClick={() => handleTodoSelect(todo)}
											className={todo.completed? "flex-auto py-2.5 px-5 me-2 mb-0 text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 rounded-lg dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" : "flex-auto py-2.5 px-5 me-2 mb-0 mt-0 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 "}
										>
											{todo.completed ? <s> {todo.title} </s> : todo.title}
										</button>

									</div>
								</li>
							))}
						</ul>

						<div className="grid grid-cols-2 gap-4">
							<button onClick={toggleAddTodoForm} className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-sans rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
								{isAddingTodo ? "Cancel" : "Add Todo"}
							</button>

							<button onClick={handleDeleteCompletedTodos} className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-normal rounded-lg text-xs px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
								{"Delete Completed"}
							</button>
						</div>
						{isAddingTodo && (
							<div className="mt-4">
								<div className="mb-6">
									<label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Todo Title</label>
									<input type="text"
										placeholder="New Todo Title"
										value={newTodoTitle}
										onChange={(e) => setNewTodoTitle(e.target.value)}
										className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
										required
										/>
								</div>
								<div className="mb-6">
									<label htmlFor="large-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Todo Description</label>
									<textarea type="text"
										placeholder="New Todo Description"
										value={newTodoDescription}
										onChange={(e) => setNewTodoDescription(e.target.value)}
										className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
										required
										/>
								</div>

								<button onClick={handleAddTodo} className="w-full mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-2 rounded">
									Save Todo
								</button>
							</div>
						)}

					</div>
				</aside>

				<div className="flex-1 p-4 sm:ml-64">
					<div className="grid grid-cols-1 gap-4">
						<div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
							{selectedTodo ? (
								<div>
									<h3 className="text-xl font-bold">{selectedTodo.title}</h3>

									<div className="inline-flex items-center justify-center w-full">
										<hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />

									</div>

									<p className="mt-2">{selectedTodo.description}</p>
								</div>
							) : (
								<p>Select a todo to view its details.</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}