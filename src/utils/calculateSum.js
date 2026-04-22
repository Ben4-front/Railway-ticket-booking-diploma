const calculateSum = (obj, coefficient) =>
   obj
      .map((el) =>
         el.seats
            .filter((seat) => seat.priceCoefficient === coefficient)
            .map((item) => item.price * item.priceCoefficient)
            .reduce((curNumber, item) => curNumber + item, 0)
      )
      .reduce((curNumber, item) => curNumber + item, 0);

export default calculateSum;
