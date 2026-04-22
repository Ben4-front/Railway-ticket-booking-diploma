const coachesWordFormatter = (number) => {
   let word;
   switch (`0${number}`.slice(-1)) {
      case '0':
         word = 'вагонов';
         break;
      case '1':
         word = 'вагоне';
         break;
      default:
         word = 'вагонах';
   }

   return word;
};

export default coachesWordFormatter;
