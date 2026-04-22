const rules = {
   passengerType: [
      {
         required: true,
         message: 'Выберите тип пассажира',
      },
   ],
   lastName: [
      {
         required: true,
         message: 'Введите фамилию: 4 - 20 символов',
         min: 4,
         max: 20,
      },
   ],
   firstName: [
      {
         required: true,
         message: 'Введите имя: 2 - 20 символов',
         min: 2,
         max: 20,
      },
   ],
   fathersName: [
      {
         required: true,
         message: 'Введите отчество: 5 - 20 символов',
         min: 5,
         max: 20,
      },
   ],
   gender: [
      {
         required: true,
         message: 'Выберите пол',
      },
   ],
   dateOfBirth: [
      {
         required: true,
         message: 'Выберите дату рождения',
         type: 'date',
      },
   ],
   docType: [
      {
         required: true,
         message: 'Выберите тип проездного документа',
      },
   ],
   docSerialNumber: [
      {
         required: true,
         message: 'Введите 4 символа',
         type: 'number',
         min: 1111,
         max: 9999,
      },
   ],
   docNumberPass: [
      {
         required: true,
         message: 'Введите 6 символов',
         type: 'number',
         min: 111111,
         max: 999999,
      },
   ],
   docNumberSertif: [
      {
         required: true,
         message: 'Поле обязательно для заполнения',
      },
      {
         pattern: /^[IVXLC]{1,4}-[А-Я]{2}-\d{6}$/,
         message: 'Введите данные документа. Пример: VIII-ЫП-123456',
      },
   ],
   seatDep: [
      {
         required: true,
         message: 'Выберите место',
      },
   ],
   seatArr: [
      {
         required: true,
         message: 'Выберите место',
      },
   ],
};

export default rules;
