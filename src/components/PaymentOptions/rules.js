const rules = {
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
   email: [
      {
         required: true,
         message: 'Введите корректный email',
         type: 'email',
      },
   ],
   phone: [
      {
         required: true,
         message: 'Введите номер в формате 912345678',
         type: 'number',
         min: 9111111111,
         max: 9999999999,
      },
   ],
   paymentMethod: [
      {
         required: true,
         message: 'выберете одну из опций',
      },
   ],
};

export default rules;
