import React from 'react';

import Review from './Reviews/Review';

import reviews from '../../data/reviews/reviews';
import styles from './Reviews.module.scss';

// в этом компоненте предполагается слайдер?

function Reviews() {
   return (
      <div className={styles.reviews} id="reviews">
         <span className={styles.reviews__title}>отзывы</span>
         <div className={styles.reviews__cards}>
            {reviews.map((review) => (
               <Review
                  key={review.id}
                  img={review.img}
                  name={review.name}
                  head={review.head}
                  text={review.text}
               />
            ))}
         </div>
      </div>
   );
}

export default Reviews;
