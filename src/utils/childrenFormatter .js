const childrenFormatter = (number) => {
   let word;
   switch (number) {
      case 1:
         word = 'ребенок';
         break;
      case 2:
      case 3:
      case 4:
         word = 'ребенка';
         break;
      default:
         word = 'детей';
   }

   return word;
};

export default childrenFormatter;
