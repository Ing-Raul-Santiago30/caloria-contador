import { useState, ChangeEvent, FormEvent, Dispatch, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Generador de IDs únicos
import { categories } from "../data/categories"; // Importa las categorías de actividades
import type { Activity } from "../types"; // Importa el tipo Activity
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"; // Importa tipos para manejar el estado

type FormProps = {
  dispatch: Dispatch<ActivityActions>, // Función para enviar acciones al reducer
  state: ActivityState // Estado global de las actividades
};

// Estado inicial para una nueva actividad
const initialState: Activity = {
  id: uuidv4(), // Genera un ID único
  category: 1, // Categoría por defecto (ejemplo: Comida)
  name: '', // Nombre de la actividad
  calories: 0 // Cantidad de calorías
};

export default function Form({ dispatch, state }: FormProps) {
  const [activity, setActivity] = useState<Activity>(initialState); // Estado local de la actividad

  useEffect(() => {
    // Si hay una actividad activa seleccionada, se actualiza el estado con sus datos
    if (state.activeId) {
      const selectedActivity = state.activities.find(
        (stateActivity) => stateActivity.id === state.activeId
      );
      if (selectedActivity) setActivity(selectedActivity);
    }
  }, [state.activeId]); // Se ejecuta cuando cambia el ID de la actividad activa

  // Maneja los cambios en los campos del formulario
  const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    const isNumberField = ['category', 'calories'].includes(e.target.id); // Verifica si el campo es numérico

    setActivity({
      ...activity,
      [e.target.id]: isNumberField ? +e.target.value : e.target.value // Convierte a número si es necesario
    });
  };

  // Valida que la actividad tenga nombre y calorías mayores a 0
  const isValidActivity = () => {
    const { name, calories } = activity;
    return name.trim() !== '' && calories > 0;
  };

  // Maneja el envío del formulario
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que la página se recargue

    dispatch({ type: 'save-activity', payload: { newActivity: activity } }); // Guarda la actividad
    
    // Restablece el formulario con un nuevo ID
    setActivity({
      ...initialState,
      id: uuidv4()
    });
  };

  return (
    <form 
      className="space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={handleSubmit}
    >
      {/* Campo para seleccionar categoría */}
      <div className="grid grid-cols-1 gap-3">
          <label htmlFor="category" className="font-bold">Categoría:</label>
          <select
            className="border border-slate-300 p-2 rounded-lg w-full bg-white"
            id="category"
            value={activity.category}
            onChange={handleChange}
          >
            {/* Itera sobre la lista de categorías y crea una opción por cada una */}
            {categories.map(category => (
              <option key={category.id} value={category.id}> {/* Asigna el ID de la categoría como valor */}
                {category.name} {/* Muestra el nombre de la categoría en el select */}
              </option>
            ))}
          </select>
      </div>

      {/* Campo para ingresar el nombre de la actividad */}
      <div className="grid grid-cols-1 gap-3">
          <label htmlFor="name" className="font-bold">Actividad:</label>
          <input
            id="name"
            type="text"
            className="border border-slate-300 p-2 rounded-lg"
            placeholder="Ej. Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
            value={activity.name}
            onChange={handleChange}
          />
      </div>

      {/* Campo para ingresar la cantidad de calorías */}
      <div className="grid grid-cols-1 gap-3">
          <label htmlFor="calories" className="font-bold">Calorías:</label>
          <input
            id="calories"
            type="number"
            className="border border-slate-300 p-2 rounded-lg"
            placeholder="Calorías. ej. 300 o 500"
            value={activity.calories}
            onChange={handleChange}
          />
      </div>

      {/* Botón de envío con deshabilitación si la actividad no es válida */}
      <input
        type="submit"
        className="bg-gray-800 hover:bg-gray-900 w-full p-2 font-bold uppercase text-white cursor-pointer disabled:opacity-10"
        value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'}
        disabled={!isValidActivity()}
      />
    </form>
  );
}
