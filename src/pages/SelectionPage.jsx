import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getRoutes, setFilter, setSort, setOffset } from '../store/slices/routesSlice';
import SearchForm from '../components/SearchForm/SearchForm';
import ProgressBar from '../components/Common/ProgressBar';
import SideFilters from '../components/SideFilters/SideFilters';
import RoutesList from '../components/RoutesList/RoutesList';
import Pagination from '../components/Pagination/Pagination';
import classNames from 'classnames';

export default function SelectionPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Получаем все необходимые данные из Redux-стора
    const { 
        routes, 
        total_count, 
        status, 
        error, 
        sort, 
        limit, 
        offset, 
        filters 
    } = useSelector(state => state.routes);

    /**
     * Эта функция является ядром компонента.
     * Она собирает все параметры (из URL и из состояния Redux),
     * обновляет URL для соответствия текущему состоянию и
     * диспатчит thunk для запроса маршрутов с сервера.
     * Обернута в useCallback для стабильности и предотвращения лишних перерисовок.
     */
    const fetchMatchingRoutes = useCallback(() => {
        // Берем базовые параметры (города, даты) из URL, куда нас перенаправила форма поиска
        const initialParams = Object.fromEntries(new URLSearchParams(location.search));

        // Собираем полный объект параметров, объединяя базовые параметры с текущими фильтрами, сортировкой и пагинацией из Redux
        const params = {
            ...initialParams,
            ...filters,
            sort,
            limit,
            offset,
        };

        // Удаляем пустые значения, чтобы не засорять URL
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([, value]) => value !== null && value !== '' && value !== false)
        );

        // Обновляем URL в браузере, чтобы он всегда отражал текущий запрос
        const query = new URLSearchParams(filteredParams).toString();
        navigate(`${location.pathname}?${query}`, { replace: true });
        
        // Отправляем запрос на сервер
        dispatch(getRoutes(filteredParams));
    }, [dispatch, navigate, location.pathname, location.search, filters, sort, limit, offset]);
    
    // Этот useEffect запускает запрос данных при любом изменении фильтров, сортировки или пагинации.
    useEffect(() => {
        fetchMatchingRoutes();
    }, [fetchMatchingRoutes]);

    // Обработчик для изменения фильтров, который будет передан в SideFilters
    const handleFilterChange = (name, value) => {
        dispatch(setFilter({ name, value }));
    };

    // Обработчик для смены сортировки
    const handleSortChange = (newSort) => {
        dispatch(setSort(newSort));
    };

    return (
        <div className="selection-page">
            <header className="selection-page__header">
                <SearchForm variant="horizontal" />
            </header>
            
            <ProgressBar step={1} />
            
            <div className="container selection-page__content">
                <aside className="selection-page__sidebar">
                    <SideFilters 
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </aside>
                
                <main className="selection-page__main">
                    <div className="selection-page__sort-options">
                        <span>сортировать по:</span>
                        <button 
                            className={classNames({ 'active': sort === 'date' })} 
                            onClick={() => handleSortChange('date')}>времени</button>
                        <button 
                            className={classNames({ 'active': sort === 'price' })} 
                            onClick={() => handleSortChange('price')}>стоимости</button>
                        <button 
                            className={classNames({ 'active': sort === 'duration' })} 
                            onClick={() => handleSortChange('duration')}>длительности</button>
                    </div>

                    <div className="selection-page__results">
                        {status === 'loading' && <div className="loading-indicator">Идет поиск...</div>}
                        {status === 'failed' && <div className="error-message">Ошибка при загрузке данных: {error}</div>}
                        {status === 'succeeded' && (
                            <>
                                <RoutesList routes={routes} />
                                <Pagination 
                                    total={total_count} 
                                    limit={limit} 
                                    currentOffset={offset} 
                                />
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}