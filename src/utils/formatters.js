import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

export const formatTime = (timestamp) => dayjs.unix(timestamp).format('HH:mm');
export const formatDate = (dateString) => dayjs(dateString).format('DD.MM.YYYY');
export const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} : ${minutes.toString().padStart(2, '0')}`;
}

export const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
}

export const getCoachTypeName = (type) => {
    const names = {
        'first': 'Люкс',
        'second': 'Купе',
        'third': 'Плацкарт',
        'fourth': 'Сидячий'
    };
    return names[type] || 'Неизвестный тип';
};