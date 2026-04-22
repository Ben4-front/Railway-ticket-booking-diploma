const seatsWordFormatter = (number) => {
   let word;
   switch (`0${number}`.slice(-1)) {
      case '1':
         word = 'место';
         break;
      case '2':
      case '3':
      case '4':
         word = 'места';
         break;
      default:
         word = 'мест';
   }

   return word;
};

export default seatsWordFormatter;
