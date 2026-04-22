const formatter = (value) => {
   const hours = Math.floor(value / 60);
   const minutes = value % 60;
   return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}`;
};

const datetimeToTime = (value) => {
   const date = new Date(value * 1000);

   const hrs = date.getHours();
   const mins = date.getMinutes();

   return `${`0${hrs}`.slice(-2)}:${`0${mins}`.slice(-2)}`;
};

const datetimeToDate = (value) => {
   const date = new Date(value * 1000);

   const year = date.getFullYear();
   const month = date.getMonth();
   const day = date.getDate();

   return `${`0${day}`.slice(-2)}.${`0${month}`.slice(-2)}.${year}`;
};

const secsToTime = (value) => {
   const hrs = Math.floor(value / (60 * 60));
   const mins = Math.floor((value - hrs * (60 * 60)) / 60);

   return `${`${hrs}`}:${`0${mins}`.slice(-2)}`;
};

const secsToTimeWithText = (value) => {
   const hrs = Math.floor(value / (60 * 60));
   const mins = Math.floor((value - hrs * (60 * 60)) / 60);
   let hrsText;
   let minsText;

   switch (`0${hrs}`.slice(-1)) {
      case '1':
         hrsText = 'час';
         break;
      case '2':
      case '3':
      case '4':
         hrsText = 'часа';
         break;
      default:
         hrsText = 'часов';
   }

   switch (`0${mins}`.slice(-1)) {
      case '1':
         minsText = 'минута';
         break;
      case '2':
      case '3':
      case '4':
         minsText = 'минуты';
         break;
      default:
         minsText = 'минут';
   }

   return { hrs: `${hrs} ${hrsText}`, mins: `${mins} ${minsText}` };
};

export {
   formatter,
   datetimeToTime,
   datetimeToDate,
   secsToTime,
   secsToTimeWithText,
};
