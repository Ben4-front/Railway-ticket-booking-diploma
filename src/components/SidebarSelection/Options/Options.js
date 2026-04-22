import React from 'react';
import PropTypes from 'prop-types';

import OptionItem from './OptionItem/OptionItem';

import options from '../../../data/options/options';

function Options({ onChangeOption }) {
   return (
      <div>
         {options.map((item) => (
            <OptionItem
               key={item.id}
               title={item.title}
               img={item.img}
               name={item.name}
               onChangeOption={onChangeOption}
            />
         ))}
      </div>
   );
}

Options.propTypes = {
   onChangeOption: PropTypes.func.isRequired,
};

export default Options;
