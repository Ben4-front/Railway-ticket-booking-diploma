import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { setPassengersData } from '../store/slices/passengersSlice';
import ProgressBar from '../components/Common/ProgressBar';

// Компонент формы для одного пассажира
const PassengerForm = ({ index, control, register, remove }) => {
  return (
    <div className="passenger-card">
      <div className="passenger-card__header">
        <h3>Пассажир #{index + 1}</h3>
        {index > 0 && <button type="button" onClick={() => remove(index)}>Удалить</button>}
      </div>
      <div className="passenger-card__body">
        <Controller
          name={`passengers.${index}.isAdult`}
          control={control}
          render={({ field }) => (
            <select {...field}>
              <option value={true}>Взрослый</option>
              <option value={false}>Детский</option>
            </select>
          )}
        />
        <input {...register(`passengers.${index}.lastName`, { required: 'Укажите фамилию' })} placeholder="Фамилия" />
        <input {...register(`passengers.${index}.firstName`, { required: 'Укажите имя' })} placeholder="Имя" />
        <input {...register(`passengers.${index}.patronymic`)} placeholder="Отчество" />
        <input type="date" {...register(`passengers.${index}.birthday`, { required: 'Укажите дату рождения' })} />
        <input {...register(`passengers.${index}.documentNumber`, { required: 'Укажите номер документа' })} placeholder="Номер документа" />
      </div>
    </div>
  );
};


export default function PassengersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { passengers: initialPassengers } = useSelector(state => state.passengers);
    const selectedSeats = useSelector(state => state.seats.selectedSeats);
    const totalSeats = selectedSeats.departure.length + (selectedSeats.arrival?.length || 0);

    const { register, control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            passengers: initialPassengers
        }
    });
    
    const { fields, append, remove } = useFieldArray({ control, name: "passengers" });

    // Синхронизируем количество форм с количеством выбранных билетов
    useEffect(() => {
        const diff = totalSeats - fields.length;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) {
                append({ isAdult: true, firstName: '', lastName: '' /* ...прочие поля */ });
            }
        } else if (diff < 0) {
            for (let i = 0; i < -diff; i++) {
                remove(fields.length - 1 - i);
            }
        }
    }, [totalSeats, fields, append, remove]);
    
    // Проверка, что пользователь не попал на страницу без выбора мест
    useEffect(() => {
        if (totalSeats === 0) {
            navigate('/selection');
        }
    }, [totalSeats, navigate]);

    const onSubmit = (data) => {
        dispatch(setPassengersData(data.passengers));
        navigate('/payment');
    };

    return (
        <div className="passengers-page">
            <ProgressBar step={2} />
            <form onSubmit={handleSubmit(onSubmit)} className="container">
                {fields.map((field, index) => (
                    <PassengerForm key={field.id} {...{ control, register, index, remove }} />
                ))}
                {errors.passengers && <p className="error-message">Пожалуйста, заполните все обязательные поля.</p>}
                <button type="submit" className="button--next">Далее</button>
            </form>
        </div>
    );
}