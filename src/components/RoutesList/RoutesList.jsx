import React from 'react';
import RouteItem from './RouteItem';
import './RoutesList.css'; // Создайте этот файл

export default function RoutesList({ routes = [] }) {
    if (routes.length === 0) {
        return <div className="routes-list--empty">По вашему запросу ничего не найдено.</div>;
    }

    return (
        <div className="routes-list">
            {routes.map(route => (
                <RouteItem key={route.departure._id} route={route} />
            ))}
        </div>
    );
}