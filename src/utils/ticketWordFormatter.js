const ticketWordFormatter = (number) => {
   let word;
   switch (`0${number}`.slice(-1)) {
      case '1':
         word = 'билет';
         break;
      case '2':
      case '3':
      case '4':
         word = 'билета';
         break;
      default:
         word = 'билетов';
   }

   return word;
};

export default ticketWordFormatter;
