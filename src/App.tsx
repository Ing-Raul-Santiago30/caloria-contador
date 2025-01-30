// Importamos hooks de React y los componentes necesarios
import { useReducer, useEffect, useMemo } from 'react'
import Form from "./components/Form" // Componente para el formulario
import { activityReducer, initialState } from './reducers/activity-reducer' // Reducer y estado inicial
import ActivityList from './components/ActivityList' // Componente para la lista de actividades
import CalorieTracker from './components/CalorieTracker' // Componente para mostrar el total de calorías

function App() {

    // useReducer gestiona el estado global del componente, utilizando un reducer para manejar las acciones
    const [state, dispatch] = useReducer(activityReducer, initialState)

    // useEffect se ejecuta cada vez que cambian las actividades, actualizando los datos en localStorage
    useEffect(() => {
        localStorage.setItem('activities', JSON.stringify(state.activities))
    }, [state.activities]) // Dependencia: solo se ejecuta si las actividades cambian

    // Función para verificar si se puede reiniciar la app. 
    // useMemo memoriza el resultado de la lógica para evitar cálculos innecesarios.
    const canRestartApp = () => useMemo(() => state.activities.length, [state.activities])

    return (
        <>
            {/* Header con el título y un botón para reiniciar la app */}
            <header className="bg-blue-800 py-3">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-center text-lg font-bold text-white uppercase">
                        Contador de Calorías
                    </h1>

                    {/* Botón para reiniciar el estado de la app */}
                    <button
                        className='bg-gray-800 hover:bg-gray-900 p-2 font-bold uppercase text-white cursor-pointer rounded-lg text-sm disabled:opacity-10'
                        disabled={!canRestartApp()} // Deshabilitado si no hay actividades
                        onClick={() => dispatch({type: 'restart-app'})} // Llama a la acción 'restart-app' del reducer
                    >
                        Reiniciar App
                    </button>
                </div>
            </header>

            {/* Sección del formulario para agregar actividades */}
            <section className="bg-blue-600 py-20 px-5">
                <div className="max-w-4xl mx-auto">
                    <Form 
                        dispatch={dispatch} // Pasamos el dispatch al formulario para manejar las acciones
                        state={state} // Pasamos el estado actual al formulario
                    />
                </div>
            </section>

            {/* Sección para mostrar el total de calorías consumidas */}
            <section className='bg-gray-800 py-10'>
                <div className='max-w-4xl mx-auto'> 
                    <CalorieTracker 
                        activities={state.activities} // Pasamos las actividades como props
                    />
                </div>
            </section>

            {/* Sección para listar las actividades */}
            <section className="p-10 mx-auto max-w-4xl">
                <ActivityList 
                    activities={state.activities} // Pasamos las actividades al componente
                    dispatch={dispatch} // Pasamos el dispatch para manejar acciones en la lista
                />
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white fixed bottom-0 left-0 w-full py-4 mt-10">
                <div className="max-w-4xl mx-auto text-center">
                    <p>&copy; 2025 Contador de Calorías. @Ing Raul Santgiago | Todos los derechos reservados.</p>
                </div>
            </footer>
        </>
    )
}

export default App
