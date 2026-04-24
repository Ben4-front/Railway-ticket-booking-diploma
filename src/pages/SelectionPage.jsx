// src/pages/SelectionPage.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getRoutes } from '../store/slices/routesSlice'; // Убедитесь, что импорт правильный

// Импортируем компоненты, которые вы создали
import ProgressBar from '../components/Common/ProgressBar';
// import SideFilters from '../components/SideFilters/SideFilters';
import RoutesList from '../components/RoutesList/RoutesList';
// import Pagination from '../components/Pagination/Pagination';

export default function SelectionPage() {
    const dispatch = useDispatch();
    const location = useLocation(); // Хук для доступа к текущему URL

    // Получаем состояние из Redux
    const { routes, total_count, status, error, limit, offset } = useSelector(state => state.routes);

    // Это главный useEffect. Он срабатывает, когда компонент монтируется
    // или когда меняется location.search (т.е. параметры в URL)
    useEffect(() => {
        // 1. Создаем объект из параметров URL (например, ?from_city_id=...&to_city_id=...)
        const params = Object.fromEntries(new URLSearchParams(location.search));
        
        console.log('SelectionPage: Dispatching getRoutes with params:', params); // Для отладки
        
        // 2. Диспатчим thunk getRoutes с этими параметрами
        dispatch(getRoutes(params));

    }, [location.search, dispatch]); // Зависимость от URL и dispatch

    return (
        <div className="selection-page">
            {/* Здесь будет форма поиска для изменения маршрута */}
            <ProgressBar step={1} />
            
            <div className="container selection-page__content">
                <aside className="selection-page__sidebar">
                    {/* <SideFilters /> */}
                    <p>Фильтры (в разработке)</p>
                </aside>
                
                <main className="selection-page__main">
                    {/* Здесь будут опции сортировки */}
                    
                    <div className="selection-page__results">
                        {status === 'loading' && <div className="loading-indicator">Идет поиск...</div>}
                        
                        {status === 'failed' && (
                            <div className="error-message">
                                <h3>Ошибка при загрузке данных</h3>
                                <p>{error}</p>
                            </div>
                        )}

                        {status === 'succeeded' && (
                            <>
                                <RoutesList routes={routes} />
                                {/* <Pagination total={total_count} limit={limit} offset={offset} /> */}
                                <p>Пагинация (в разработке)</p>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}